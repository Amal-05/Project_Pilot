import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '../store/auth.store';
import { useNotificationStore } from '../store/notification.store';
import { useChatStore } from '../store/chat.store';
import { useTaskStore } from '../store/task.store';
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  Settings, 
  LogOut, 
  Plus, 
  Bell, 
  MessageSquare,
  Search
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, logout } = useAuthStore();
  const { unreadCount, fetchNotifications, addNotification } = useNotificationStore();
  const { fetchConversations, addMessage } = useChatStore();
  const { socket } = useTaskStore();
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    fetchNotifications();
    fetchConversations();
  }, [fetchNotifications, fetchConversations]);

  useEffect(() => {
    if (socket && user) {
      socket.emit('join-user', user.id);
      
      socket.on('notification:received', (notification) => {
        addNotification(notification);
      });

      socket.on('message:received', (message) => {
        addMessage(message.conversationId, message);
      });
    }
  }, [socket, user, addNotification, addMessage]);

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Projects', href: '/projects', icon: Briefcase },
    { name: 'Chat', href: '/chat', icon: MessageSquare },
    { name: 'Team', href: '/team', icon: Users },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-xl font-bold text-blue-600">ProjectPilot</h1>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center px-3 py-2.5 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-200 font-medium group"
            >
              <item.icon className="w-5 h-5 mr-3 group-hover:text-blue-600" />
              {item.name}
            </Link>
          ))}
        </nav>
        
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center p-2 mb-4 bg-blue-50 rounded-lg">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mr-3 shadow-sm">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold truncate">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-gray-500 truncate">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center w-full px-4 py-2 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all duration-200 font-medium"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between h-16 px-8 bg-white border-b border-gray-200 shadow-sm z-10">
          <div className="flex items-center flex-1 max-w-xl">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search projects, tasks, or people..." 
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex items-center space-x-5 ml-4">
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors relative"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                    {unreadCount}
                  </span>
                )}
              </button>
              
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                  <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="font-bold">Notifications</h3>
                    <button className="text-xs text-blue-600 hover:underline">Mark all as read</button>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {/* Notification list would go here */}
                    <div className="p-8 text-center text-gray-500 text-sm">
                      No new notifications
                    </div>
                  </div>
                  <div className="p-3 border-t border-gray-100 text-center bg-gray-50">
                    <button className="text-xs font-semibold text-gray-600 hover:text-blue-600">View all notifications</button>
                  </div>
                </div>
              )}
            </div>
            
            <Link href="/chat" className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
              <MessageSquare className="w-5 h-5" />
            </Link>
            
            <button className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg shadow-blue-200 transition-all active:scale-95">
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-8 bg-gray-50/50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
