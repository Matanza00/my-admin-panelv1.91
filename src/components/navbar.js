import { useState, useEffect } from 'react';
import { HiBell, HiUserCircle } from 'react-icons/hi';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function Navbar() {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isAvatarOpen, setIsAvatarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'authenticated') {
      fetchNotifications();
    }
  }, [status]);

  // Function to fetch notifications
  const fetchNotifications = async () => {
    if (status === 'loading') return;

    try {
      if (!session?.user?.id) {
        setError('User ID not found');
        setLoading(false);
        return;
      }

      setLoading(true);
      const userId = session?.user?.id;
      
      // ✅ Remove previous clear operation to prevent flickering
      const response = await fetch(`/api/notifications?userId=${userId}&page=${page}&limit=10`);

      if (!response.ok) {
        setError('Failed to fetch notifications');
        setLoading(false);
        return;
      }

      const data = await response.json();

      if (data.notifications) {
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount ?? 0);  // ✅ Ensure proper unread count update
        setHasMore(data.hasMore);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setError('An unexpected error occurred while fetching notifications');
      setLoading(false);
    }
  };

  // Auto-refresh notifications every 10 seconds
  useEffect(() => {
    if (isNotifOpen) {
      fetchNotifications();
    }

    const interval = setInterval(() => {
      fetchNotifications();
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, [isNotifOpen]);

  // Mark notification as read when clicked
  const handleNotificationClick = async (notif) => {
    if (!notif.isRead) {
      try {
        const response = await fetch('/api/notifications', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ notificationId: notif.id, userId: session.user.id }), // ✅ Pass userId
        });

        const data = await response.json();

        // ✅ Remove the clicked notification immediately
        setNotifications((prev) => prev.filter((n) => n.id !== notif.id));

        // ✅ Update unread count properly
        setUnreadCount(data.unreadCount ?? 0);
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    }

    if (notif.link) {
      window.location.href = notif.link;
    }
  };

  return (
    <nav className="flex items-center justify-between p-4 bg-gray-900 text-white sticky top-0 z-10">
      {status !== 'authenticated' && (
      <div className="absolute top-full left-0 right-0 bg-red-600 text-white text-center py-2 z-20 shadow-md animate-pulse">
        ⚠️ You are not logged in or your session has expired. Please log in again.
      </div>
    )}
      <div></div>
      <div className="flex items-center space-x-4">
        {/* Notification Icon with Count */}
        <div className="relative">
          <button onClick={() => setIsNotifOpen(!isNotifOpen)} className="focus:outline-none">
            <span className="text-2xl">{<HiBell />}</span>
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        {/* Notifications Dropdown */}
        <Dropdown isOpen={isNotifOpen} setIsOpen={setIsNotifOpen}>
          {loading && <p>Loading notifications...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {notifications.length === 0 && !loading ? (
            <p>No new notifications</p>
          ) : (
            <div className="max-h-64 overflow-y-auto">
              {notifications.map((notif) => (
                <p key={notif.id} className="cursor-pointer hover:underline py-5" onClick={() => handleNotificationClick(notif)}>
                  {notif.template?.templateText ? notif.template.templateText : notif.altText || "No template available"}
                </p>
              ))}
            </div>
          )}
        </Dropdown>
      </div>
    </nav>
  );
}

// Dropdown Component
function Dropdown({ isOpen, setIsOpen, children, onScroll, icon }) {
  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className="focus:outline-none">
        <span className="text-2xl">{icon}</span>
      </button>
      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-64 md:w-96 bg-white text-black rounded shadow-lg p-4 max-h-96 overflow-y-auto"
          onScroll={onScroll}
        >
          {children}
        </div>
      )}
    </div>
  );
}
