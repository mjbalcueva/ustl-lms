"use client";
import { Button } from "@/core/components/ui/button";
import { Card } from "@/core/components/ui/card";
import { Input } from "@/core/components/ui/input";
import { PageContainer, PageContent } from "@/core/components/ui/page";
import { api } from "@/services/trpc/react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { FcVideoCall } from "react-icons/fc";

export default function ChatApp() {
  const router = useParams();
  const chatId = router.id;
  const [message, setMessage] = useState('');

  const { data: chat, isLoading, isError, error } = api.chat.findOne.useQuery({ id: chatId });

  if (isLoading) {
    return <div className="text-center text-xl text-gray-500">Loading...</div>;
  }

  if (isError) {
    return <div className="text-center text-xl text-red-500">Error: {error?.message}</div>;
  }

  if (!chat) {
    return <div className="text-center text-xl text-gray-500">Chat not found</div>;
  }

  return (
  <PageContainer>
      <PageContent>
      <div className="flex flex-col h-screen ">
      {/* Chat Header */}
      <div className="bg-gray-800 text-white p-4 flex justify-between items-center shadow-lg">
        <div>
          <h1 className="text-2xl font-bold">{chat.name}</h1>
          <p className="text-sm mt-1 text-gray-400">{chat.course.title}</p>
        </div>
        {/* Video Call Button */}
        <button
          className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-700 hover:bg-gray-600 focus:ring-2 focus:ring-blue-500"
          onClick={() => console.log('Video call started')}
          aria-label="Start video call"
        >
          <FcVideoCall className="w-6 h-6 text-white bg0" />
        </button>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-900 text-white">
        {chat.messages.length === 0 ? (
          <p className="text-center text-gray-400">No messages yet</p>
        ) : (
          <ul className="space-y-4">
            {chat.messages.map((message) => (
              <li key={message.id} className="flex items-start space-x-3">
                <Card className="w-3/4 p-4 shadow-md bg-gray-800 text-white">
                  <p className="font-semibold text-blue-400">{message?.userId}</p>
                  <p className="text-gray-300">{message.content}</p>
                  <small className="text-gray-500 text-sm">
                    {new Date(message.createdAt).toLocaleString()}
                  </small>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Message Input Section */}
      <div className="bg-gray-800 p-4 shadow-md">
        <form onSubmit={() => {}} className="flex items-center space-x-4">
          <Input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-3 rounded-lg border border-gray-700 bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <Button
            type="submit"
            className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Send
          </Button>
        </form>
      </div>
    </div>
    </PageContent>
  </PageContainer>
  );
}