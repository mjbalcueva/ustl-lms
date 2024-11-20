"use client";
import { Button } from "@/core/components/ui/button";
import { Card } from "@/core/components/ui/card";
import { PageContainer, PageContent } from "@/core/components/ui/page";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import Peer from 'peerjs';

// Signaling server URL from environment variable
const SIGNALING_SERVER_URL = process.env.SOCKET_URL || "http://localhost:9000";
const socket = io(SIGNALING_SERVER_URL);

export default function ChatApp() {
  const router = useParams();
  const chatId = router.id;
  const { data: session } = useSession();
  
  const myVideoRef = useRef<HTMLVideoElement>(null);
  const callingVideoRef = useRef<HTMLVideoElement>(null);

  const [peerInstance, setPeerInstance] = useState<Peer | null>(null);
  const [myUniqueId, setMyUniqueId] = useState<string>("");
  const [idToCall, setIdToCall] = useState('');

  const generateRandomString = () => Math.random().toString(36).substring(2);

  const handleCall = () => {
    console.log('handleCall triggered');
    
    if (!idToCall || !peerInstance) {
      console.error('Error: ID to call is empty or peer instance is not available.');
      return;
    }
    
    // Get media stream
    navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    }).then(stream => {
      console.log('Media stream received');
      
      if (peerInstance) {
        const call = peerInstance.call(idToCall, stream);
        console.log('Call initiated to', idToCall);
        
        if (call) {
          call.on('stream', userVideoStream => {
            console.log('Stream received from peer', userVideoStream);
            if (callingVideoRef.current) {
              callingVideoRef.current.srcObject = userVideoStream;
            }
          });
        }
      }
    }).catch(error => {
      console.error('Error getting media stream', error);
    });
  };

  // Initialize PeerJS and handle stream
  useEffect(() => {
    if(myUniqueId) {
      const peer = new Peer(myUniqueId, {
        host: 'localhost',
        port: 9000,
        path: '/myapp', // path for the peer server
      });

      setPeerInstance(peer);

      peer.on('open', (id) => {
        console.log('PeerJS opened with ID:', id);
        socket.emit('join-room', chatId, id); // Send the user to the room via socket
      });

      // Handle incoming call and answer it with the stream
      peer.on('call', (call) => {
        navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        }).then(stream => {
          call.answer(stream);
          call.on('stream', userVideoStream => {
            if (callingVideoRef.current) {
              callingVideoRef.current.srcObject = userVideoStream;
            }
          });
        });

        call.on('error', (err) => {
          console.error('Error during call', err);
        });
      });

      // Stream user media
      navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      }).then(stream => {
        if (myVideoRef.current) {
          myVideoRef.current.srcObject = stream;
        }
      });

      return () => {
        peer.destroy();
      };
    }
  }, [myUniqueId]);

  useEffect(() => {
    setMyUniqueId(generateRandomString());
  }, []);

  // Listen for when another user connects to the room
  useEffect(() => {
    socket.on('user-connected', (userId) => {
      console.log("User connected:", userId);
    });

    return () => {
      socket.off('user-connected');
    };
  }, []);

  return (
    <div className="flex flex-col justify-center items-center p-12">
      <p>Your ID: {myUniqueId}</p>
      <video className="w-72" playsInline ref={myVideoRef} autoPlay />
      <input
        className="text-black"
        placeholder="ID to call"
        value={idToCall}
        onChange={(e) => setIdToCall(e.target.value)}
      />
      <button onClick={handleCall}>Call</button>
      <video className="w-72" playsInline ref={callingVideoRef} autoPlay />
    </div>
  );
}
