"use client"
import { useState, useEffect } from "react";
import Link from "next/link";
import { api } from '@/services/trpc/react';

interface GroupChat {
  id: string;
  createdAt: Date; 
  updatedAt: Date;
  courseId: string;
  name: string;
  members: string[];
  course: {
    id: string;
    code: string;
    title: string;
    description: string | null;
    imageUrl: string | null;
    token: string | null;
    status: [];
    instructorId: string;
    createdAt: Date;  
    updatedAt: Date;
  };
  messages: [];
  enrollments: [];
  _count: {
    messages: number;
    enrollments: number;
  };
}

export default function ChatList() {
  const [chats, setChats] = useState<GroupChat[]>([]);
  const { data, isLoading, isError, error } = api.chat.getChats.useQuery();

  useEffect(() => {
    if (data) {
      // Format Date fields to string if needed
      const formattedChats = data.map((chat: any) => ({
        ...chat,
        createdAt: chat.createdAt.toISOString(),  // Convert Date to string
        updatedAt: chat.updatedAt.toISOString(),  // Convert Date to string
        course: {
          ...chat.course,
          createdAt: chat.course.createdAt.toISOString(),
          updatedAt: chat.course.updatedAt.toISOString(),
        },
      }));
      setChats(formattedChats);
    }

    if (isError && error) {
      console.error(error);
    }
  }, [data, isLoading, isError, error]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className=" text-white min-h-screen p-6">
      {chats.length === 0 ? (
        <p className="text-center text-gray-400">No chats available.</p>
      ) : (
        <ul className="space-y-4">
          {chats.map((chat: GroupChat) => (
            <li
              key={chat.id}
              className="bg-gray-800 rounded-lg shadow-lg p-4 hover:bg-gray-700 transition duration-200"
            >
              <Link
                href={`/chat/${chat.id}`}
                className="flex flex-col space-y-2"
              >
                <div className="text-lg font-semibold">{chat.name}</div>
                <div className="text-sm text-gray-400">{chat.course.title}</div>
                <div className="text-xs text-gray-500">
                  {chat._count.messages} {chat._count.messages === 1 ? "message" : "messages"}
                </div>
                <div className="text-xs text-gray-500">
                  Last updated: {new Date(chat.updatedAt).toLocaleString()}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
