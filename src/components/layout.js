import { useState, useEffect } from 'react';
import Navbar from '../components/navbar';
import Sidebar from '../components/sidebar';

export default function Layout({ children }) {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnreadNotifications = async () => {
      try {
        console.log("Fetching notifications...");
        const response = await fetch(`/api/notifications?userId=1&page=1&limit=10`);
  
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
  
        const data = await response.json();
        console.log("Fetched notifications:", data);
        setUnreadCount(data.unreadCount ?? 0);
      } catch (error) {
        console.error('Error fetching unread notifications:', error);
      }
    };
  
    fetchUnreadNotifications();
  }, []);
  

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-grow flex flex-col">
        <Navbar unreadCount={unreadCount} />
        <main className="p-2 md:p-4 flex-grow overflow-y-auto scrollbar-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
