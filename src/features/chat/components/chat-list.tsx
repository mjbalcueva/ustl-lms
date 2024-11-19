"use client"
import { useState, useEffect } from "react";
import { api } from '@/services/trpc/react'

export default function ChatList() {
  const [chats, setChats] = useState([]);
  const { data, isLoading, isError, error } = api.chat.getChats.useQuery();

  useEffect(() => {
    if (data) {
      setChats(data);  // Assuming 'data' is an array of chat objects
      console.log(data)
    }
    if (isError && error) {
      console.log(error)
    }
  }, [data, isLoading, isError, error]);

  if (isLoading) {
    return <div>Loading...</div>;  // You can style this for a better UX
  }

  return (
    <div>
      {chats.length === 0 ? (
        <p>No chats available.</p>  // Show when no chats exist
      ) : (
        <ul>
          {chats.map((chat) => (
            <li key={chat._id}>
              {/* Render chat details */}
            <h1>Testing</h1>
              {/* Example of rendering other chat details */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
