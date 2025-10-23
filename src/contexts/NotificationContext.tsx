import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  timestamp: string;
  isRead: boolean;
  category?: 'transaction' | 'loan' | 'debt' | 'insurance' | 'scheme' | 'wallet' | 'profile' | 'system';
  actionId?: string; // Reference to the action that triggered this notification
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  removeNotification: (notificationId: string) => void;
  clearAllNotifications: () => void;
  getUnreadCount: () => number;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Load notifications from localStorage on mount
  useEffect(() => {
    const savedNotifications = localStorage.getItem('notifications');
    if (savedNotifications) {
      try {
        const parsed = JSON.parse(savedNotifications);
        setNotifications(parsed);
      } catch (error) {
        console.error('Error loading notifications:', error);
        setNotifications([]);
      }
    } else {
      // Initialize with some default notifications
      const defaultNotifications: Notification[] = [
        {
          id: '1',
          title: t('notifications.welcome.title'),
          message: t('notifications.welcome.message'),
          type: 'info',
          timestamp: new Date().toISOString(),
          isRead: false,
          category: 'system'
        }
      ];
      setNotifications(defaultNotifications);
      localStorage.setItem('notifications', JSON.stringify(defaultNotifications));
    }
  }, [t]);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      isRead: false
    };

    setNotifications(prev => [newNotification, ...prev]);
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const removeNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== notificationId));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const getUnreadCount = () => {
    return notifications.filter(notification => !notification.isRead).length;
  };

  const value: NotificationContextType = {
    notifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
    getUnreadCount
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// Helper functions for common notification types
export const useNotificationHelpers = () => {
  const { addNotification } = useNotifications();
  const { t } = useTranslation();

  const notifyTransaction = (type: 'deposit' | 'withdraw' | 'transfer' | 'payment', amount: number, details?: string) => {
    const messages = {
      deposit: {
        title: t('notifications.transaction.deposit.title'),
        message: t('notifications.transaction.deposit.message', { amount: `₹${amount.toLocaleString()}` })
      },
      withdraw: {
        title: t('notifications.transaction.withdraw.title'),
        message: t('notifications.transaction.withdraw.message', { amount: `₹${amount.toLocaleString()}` })
      },
      transfer: {
        title: t('notifications.transaction.transfer.title'),
        message: t('notifications.transaction.transfer.message', { amount: `₹${amount.toLocaleString()}` })
      },
      payment: {
        title: t('notifications.transaction.payment.title'),
        message: t('notifications.transaction.payment.message', { amount: `₹${amount.toLocaleString()}` })
      }
    };

    addNotification({
      title: messages[type].title,
      message: details ? `${messages[type].message} - ${details}` : messages[type].message,
      type: 'success',
      category: 'transaction'
    });
  };

  const notifyLoan = (type: 'applied' | 'approved' | 'rejected' | 'emi_paid', amount?: number, details?: string) => {
    const messages = {
      applied: {
        title: t('notifications.loan.applied.title'),
        message: t('notifications.loan.applied.message', { amount: amount ? `₹${amount.toLocaleString()}` : '' })
      },
      approved: {
        title: t('notifications.loan.approved.title'),
        message: t('notifications.loan.approved.message', { amount: amount ? `₹${amount.toLocaleString()}` : '' })
      },
      rejected: {
        title: t('notifications.loan.rejected.title'),
        message: t('notifications.loan.rejected.message')
      },
      emi_paid: {
        title: t('notifications.loan.emiPaid.title'),
        message: t('notifications.loan.emiPaid.message', { amount: amount ? `₹${amount.toLocaleString()}` : '' })
      }
    };

    addNotification({
      title: messages[type].title,
      message: details ? `${messages[type].message} - ${details}` : messages[type].message,
      type: type === 'rejected' ? 'error' : 'success',
      category: 'loan'
    });
  };

  const notifyDebt = (type: 'added' | 'paid' | 'planned', amount?: number, details?: string) => {
    const messages = {
      added: {
        title: t('notifications.debt.added.title'),
        message: t('notifications.debt.added.message', { amount: amount ? `₹${amount.toLocaleString()}` : '' })
      },
      paid: {
        title: t('notifications.debt.paid.title'),
        message: t('notifications.debt.paid.message', { amount: amount ? `₹${amount.toLocaleString()}` : '' })
      },
      planned: {
        title: t('notifications.debt.planned.title'),
        message: t('notifications.debt.planned.message')
      }
    };

    addNotification({
      title: messages[type].title,
      message: details ? `${messages[type].message} - ${details}` : messages[type].message,
      type: 'info',
      category: 'debt'
    });
  };

  const notifyInsurance = (type: 'activated' | 'renewed' | 'expired', policyName?: string) => {
    const messages = {
      activated: {
        title: t('notifications.insurance.activated.title'),
        message: t('notifications.insurance.activated.message', { policy: policyName || '' })
      },
      renewed: {
        title: t('notifications.insurance.renewed.title'),
        message: t('notifications.insurance.renewed.message', { policy: policyName || '' })
      },
      expired: {
        title: t('notifications.insurance.expired.title'),
        message: t('notifications.insurance.expired.message', { policy: policyName || '' })
      }
    };

    addNotification({
      title: messages[type].title,
      message: messages[type].message,
      type: type === 'expired' ? 'warning' : 'success',
      category: 'insurance'
    });
  };

  const notifyScheme = (type: 'applied' | 'approved' | 'rejected', schemeName?: string) => {
    const messages = {
      applied: {
        title: t('notifications.scheme.applied.title'),
        message: t('notifications.scheme.applied.message', { scheme: schemeName || '' })
      },
      approved: {
        title: t('notifications.scheme.approved.title'),
        message: t('notifications.scheme.approved.message', { scheme: schemeName || '' })
      },
      rejected: {
        title: t('notifications.scheme.rejected.title'),
        message: t('notifications.scheme.rejected.message', { scheme: schemeName || '' })
      }
    };

    addNotification({
      title: messages[type].title,
      message: messages[type].message,
      type: type === 'rejected' ? 'error' : 'success',
      category: 'scheme'
    });
  };

  const notifyWallet = (type: 'goal_set' | 'budget_set' | 'balance_low', amount?: number, details?: string) => {
    const messages = {
      goal_set: {
        title: t('notifications.wallet.goalSet.title'),
        message: t('notifications.wallet.goalSet.message', { amount: amount ? `₹${amount.toLocaleString()}` : '' })
      },
      budget_set: {
        title: t('notifications.wallet.budgetSet.title'),
        message: t('notifications.wallet.budgetSet.message')
      },
      balance_low: {
        title: t('notifications.wallet.balanceLow.title'),
        message: t('notifications.wallet.balanceLow.message', { amount: amount ? `₹${amount.toLocaleString()}` : '' })
      }
    };

    addNotification({
      title: messages[type].title,
      message: details ? `${messages[type].message} - ${details}` : messages[type].message,
      type: type === 'balance_low' ? 'warning' : 'info',
      category: 'wallet'
    });
  };

  const notifyProfile = (type: 'updated' | 'completed') => {
    const messages = {
      updated: {
        title: t('notifications.profile.updated.title'),
        message: t('notifications.profile.updated.message')
      },
      completed: {
        title: t('notifications.profile.completed.title'),
        message: t('notifications.profile.completed.message')
      }
    };

    addNotification({
      title: messages[type].title,
      message: messages[type].message,
      type: 'success',
      category: 'profile'
    });
  };

  return {
    notifyTransaction,
    notifyLoan,
    notifyDebt,
    notifyInsurance,
    notifyScheme,
    notifyWallet,
    notifyProfile
  };
};
