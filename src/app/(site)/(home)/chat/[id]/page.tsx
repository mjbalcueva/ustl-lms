"use client";
import { Button } from "@/core/components/ui/button";
import { Card } from "@/core/components/ui/card";
import { PageContainer, PageContent } from "@/core/components/ui/page";
import { useParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

// Frontend WebRTC and signaling URL from environment variable
const SIGNALING_SERVER_URL = process.env.SOCKET_URL || 'http://localhost:5000';  // Default to localhost if the env variable is not set

export default function ChatApp() {
  const router = useParams();
  const chatId = router.id;
  // const [isCallActive, setIsCallActive] = useState(false);  // Tracks if the call is active
  // const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  // const [participants, setParticipants] = useState<Map<string, string>>(new Map());  // Map to store userId -> userName or id
  // const [isInRoom, setIsInRoom] = useState(false);  // Tracks if the user is already in the room
  // const videoElementRef = useRef<HTMLVideoElement | null>(null);
  // const socketRef = useRef<Socket | null>(null);

  // // Create socket connection once the component is mounted
  // useEffect(() => {
  //   socketRef.current = io(SIGNALING_SERVER_URL);

  //   const socket = socketRef.current;

  //   socket.on('connect', () => {
  //     console.log("Connected to signaling server");
  //     socket.emit('joinRoom', { roomId: chatId });
  //   });

  //   // Listen for events that notify participants about call status
  //   socket.on('call-started', ({roomId, callerId}) => {
  //     console.log(`Call started by ${callerId}`);
  //     setIsCallActive(true);
  //     setParticipants((prev) => new Map(prev).set(callerId, callerId));  // Add caller to participants list (use callerId as both key and value)
  //   });

  //   socket.on('call-ended', (callerId) => {
  //     console.log(`Call ended by ${callerId}`);
  //     setIsCallActive(false);
  //     const updatedParticipants = new Map(participants);
  //     updatedParticipants.delete(callerId);  // Remove caller from participants list
  //     setParticipants(updatedParticipants);
  //   });

  //   // Listen for users joining the room
  //   socket.on('user-joined', (userId) => {
  //     console.log(`User ${userId} joined the room`);
  //     setParticipants((prev) => new Map(prev).set(userId, userId));
  //     setIsInRoom(true);  // Mark the user as in the room
  //   });

  //   // Listen for users leaving the room
  //   socket.on('user-left', (userId) => {
  //     console.log(`User ${userId} left the room`);
  //     setParticipants((prev) => {
  //       const updatedParticipants = new Map(prev);
  //       updatedParticipants.delete(userId);
  //       return updatedParticipants;
  //     });
  //     setIsInRoom(false);  // Mark the user as not in the room
  //   });

  //   // Cleanup on component unmount
  //   return () => {
  //     if (socketRef.current) {
  //       socketRef.current.disconnect();
  //     }
  //     if (localStream) {
  //       localStream.getTracks().forEach(track => track.stop());
  //     }
  //   };
  // }, [chatId]);

  // // Function to handle opening the camera
  // const startVideoCall = async () => {
  //   try {
  //     const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  //     setLocalStream(stream);

  //     if (videoElementRef.current) {
  //       videoElementRef.current.srcObject = stream;
  //     }

  //     console.log("Camera is now active");
  //   } catch (err) {
  //     console.error("Error opening camera:", err);
  //   }
  // };

  // // Function to emit the 'start-call' event when the button is clicked
  // const handleCallClick = () => {
  //   const socket = socketRef.current;

  //   if (!isCallActive) {
  //     // Start the video call by opening the camera
  //     startVideoCall();
  //     setIsCallActive(true);
  //     console.log("Video call started");

  //     // Emit the start-call event to the signaling server
  //     if (socket) {
  //       socket.emit("start-call", { roomId: chatId, callerId: socket.id });
  //       console.log("Emitted start-call event");
  //     }
  //   } else if (isInRoom) {
  //     // End the call (close the stream)
  //     if (localStream) {
  //       localStream.getTracks().forEach(track => track.stop());
  //     }
  //     setIsCallActive(false);
  //     console.log("Call ended");

  //     // Emit the end-call event to notify other participants
  //     if (socket) {
  //       socket.emit("end-call", { roomId: chatId, userId: socket.id });
  //       console.log("Emitted end-call event");
  //     }
  //   } else {
  //     // If not in the room yet, join the call
  //     setIsInRoom(true);
  //     socket.emit('user-joined', socket.id);  // Notify other users this user has joined
  //   }
  // };

  return (
    <PageContainer>
      <PageContent>
       
        <h1>Hello World</h1>
      </PageContent>
    </PageContainer>
  );
}
