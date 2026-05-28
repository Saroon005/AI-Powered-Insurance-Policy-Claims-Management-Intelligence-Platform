import { createContext, useContext, useState, useEffect } from 'react';
import socket from '../services/socketService';
import { useAuth } from './AuthContext';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    // Join rooms based on role
    if (user.role === 'ADMIN' || user.role === 'CLAIMS_MANAGER') {
      socket.emit('joinRoom', 'claims_manager');
    }
    if (user.role === 'CUSTOMER') {
      socket.emit('joinRoom', `customer_${user.email}`);
    }
    if (user.role === 'AGENT') {
      socket.emit('joinRoom', 'agents');
    }

    const addNotification = (data) => {
      setNotifications(prev => [{ ...data, id: Date.now(), read: false }, ...prev].slice(0, 50));
      setUnreadCount(c => c + 1);
    };

    socket.on('claimFiled', addNotification);
    socket.on('claimStatusUpdated', addNotification);
    socket.on('fraudScoreGenerated', addNotification);
    socket.on('policyRenewalDue', addNotification);
    socket.on('premiumPaymentReceived', addNotification);
    socket.on('claimSettled', addNotification);

    return () => {
      socket.off('claimFiled');
      socket.off('claimStatusUpdated');
      socket.off('fraudScoreGenerated');
      socket.off('policyRenewalDue');
      socket.off('premiumPaymentReceived');
      socket.off('claimSettled');
    };
  }, [user]);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAllRead }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
