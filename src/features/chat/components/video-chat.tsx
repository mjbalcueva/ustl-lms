// src/app-fe/components/VideoCall.tsx

import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

// Set up the socket connection to the backend signaling server
const socket = io('/api/socket'); // The backend socket URL

const VideoCall = () => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const roomId = 'my-room'; // Static room ID or dynamic room ID based on your needs

  // Set up media and signaling when the component mounts
  useEffect(() => {
    const getUserMedia = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    };
    getUserMedia();

    // Join the signaling room on the server
    socket.emit('joinRoom', roomId);

    // Handle incoming signaling messages
    socket.on('offer', async (offer: RTCSessionDescriptionInit, senderId: string) => {
      if (peerConnectionRef.current) {
        await peerConnectionRef.current.setRemoteDescription(offer);
        const answer = await peerConnectionRef.current.createAnswer();
        await peerConnectionRef.current.setLocalDescription(answer);
        socket.emit('answer', answer, roomId);
      }
    });

    socket.on('answer', async (answer: RTCSessionDescriptionInit) => {
      if (peerConnectionRef.current) {
        await peerConnectionRef.current.setRemoteDescription(answer);
      }
    });

    socket.on('candidate', async (candidate: RTCIceCandidateInit) => {
      if (peerConnectionRef.current) {
        try {
          await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (err) {
          console.error('Error adding ICE candidate:', err);
        }
      }
    });

    return () => {
      socket.off('offer');
      socket.off('answer');
      socket.off('candidate');
    };
  }, []);

  // Function to create an offer and send it to the signaling server
  const createOffer = async () => {
    const peerConnection = new RTCPeerConnection();

    if (localStream) {
      localStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStream);
      });
    }

    peerConnection.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('candidate', event.candidate, roomId);
      }
    };

    await peerConnection.setLocalDescription(await peerConnection.createOffer());
    socket.emit('offer', peerConnection.localDescription, roomId);

    peerConnectionRef.current = peerConnection;
  };

  return (
    <div>
      <div>
        <video ref={localVideoRef} autoPlay muted />
        <video ref={remoteVideoRef} autoPlay />
      </div>
      <button onClick={createOffer}>Start Call</button>
    </div>
  );
};

export default VideoCall;
