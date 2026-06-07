"use client";

import { useEffect, useState, useRef } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useChatStore } from "@/store/chat.store";
import { useAuthStore } from "@/store/auth.store";
import { Send, User as UserIcon, Building2, Search, MoreVertical } from "lucide-react";

export default function ChatPage() {
  const { user } = useAuthStore();
  const { conversations, activeConversation, fetchConversations, fetchMessages, sendMessage, setActiveConversation } = useChatStore();
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  useEffect(() => {
    if (activeConversation) {
      fetchMessages(activeConversation.id);
    }
  }, [activeConversation, fetchMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConversation?.messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !activeConversation) return;
    sendMessage(activeConversation.id, message);
    setMessage("");
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="flex h-[calc(100vh-160px)] bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Conversation List */}
          <div className="w-80 border-r border-gray-100 flex flex-col">
            <div className="p-4 border-b border-gray-100 bg-gray-50/50">
              <h2 className="font-bold text-lg mb-4">Messages</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search chats..." 
                  className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setActiveConversation(conv)}
                  className={`w-full p-4 flex items-center hover:bg-gray-50 transition-colors border-l-4 ${
                    activeConversation?.id === conv.id ? "bg-blue-50/50 border-blue-600" : "border-transparent"
                  }`}
                >
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    {conv.type === 'DIRECT' ? <UserIcon className="w-6 h-6 text-gray-400" /> : <Building2 className="w-6 h-6 text-gray-400" />}
                  </div>
                  <div className="text-left overflow-hidden">
                    <p className="font-bold text-gray-800 truncate">{conv.name || conv.participants.find(p => p.userId !== user?.id)?.user.firstName || "Chat"}</p>
                    <p className="text-xs text-gray-500 truncate">{conv.messages?.[conv.messages.length - 1]?.content || "No messages yet"}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Window */}
          <div className="flex-1 flex flex-col bg-white">
            {activeConversation ? (
              <>
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      {activeConversation.type === 'DIRECT' ? <UserIcon className="w-5 h-5 text-blue-600" /> : <Building2 className="w-5 h-5 text-blue-600" />}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">{activeConversation.name || activeConversation.participants.find(p => p.userId !== user?.id)?.user.firstName || "Chat"}</h3>
                      <p className="text-xs text-green-500 font-medium">Online</p>
                    </div>
                  </div>
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {activeConversation.messages?.map((msg, i) => {
                    const isMe = msg.senderId === user?.id;
                    return (
                      <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[70%] flex ${isMe ? "flex-row-reverse" : "flex-row"}`}>
                          {!isMe && (
                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-2 mt-auto">
                              <span className="text-[10px] font-bold">{msg.sender.firstName[0]}</span>
                            </div>
                          )}
                          <div>
                            <div className={`p-4 rounded-2xl shadow-sm text-sm ${
                              isMe ? "bg-blue-600 text-white rounded-br-none" : "bg-gray-100 text-gray-800 rounded-bl-none"
                            }`}>
                              {msg.content}
                            </div>
                            <p className={`text-[10px] mt-1 text-gray-400 font-medium ${isMe ? "text-right" : "text-left"}`}>
                              {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                <div className="p-4 border-t border-gray-100 bg-white">
                  <form onSubmit={handleSendMessage} className="flex space-x-4">
                    <input
                      type="text"
                      className="flex-1 px-6 py-3 border border-gray-200 rounded-full focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 focus:bg-white transition-all text-sm"
                      placeholder="Type a message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                    <button
                      type="submit"
                      className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-95"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-500 bg-gray-50/30">
                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                  <MessageSquare className="w-10 h-10 text-blue-200" />
                </div>
                <h3 className="text-xl font-bold text-gray-700 mb-2">Your Inbox</h3>
                <p>Select a conversation to start messaging</p>
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
