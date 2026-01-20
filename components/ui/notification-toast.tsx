'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Trophy, AlertCircle, CheckCircle } from 'lucide-react';

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'acierto';
  title: string;
  message: string;
  timestamp?: Date;
}

interface NotificationToastProps {
  notifications: Notification[];
  onDismiss: (id: string) => void;
}

export function NotificationToast({ notifications, onDismiss }: NotificationToastProps) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      <AnimatePresence>
        {(notifications ?? []).map((notification) => (
          <NotificationItem
            key={notification?.id ?? ''}
            notification={notification}
            onDismiss={onDismiss}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

function NotificationItem({ 
  notification, 
  onDismiss 
}: { 
  notification: Notification; 
  onDismiss: (id: string) => void;
}) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onDismiss?.(notification?.id ?? ''), 300);
    }, 5000);

    return () => clearTimeout(timer);
  }, [notification?.id, onDismiss]);

  const typeConfig = {
    info: {
      icon: Bell,
      bg: 'from-blue-900/90 to-blue-800/90',
      border: 'border-blue-500/50',
      iconColor: 'text-blue-400',
    },
    success: {
      icon: CheckCircle,
      bg: 'from-green-900/90 to-green-800/90',
      border: 'border-green-500/50',
      iconColor: 'text-green-400',
    },
    warning: {
      icon: AlertCircle,
      bg: 'from-yellow-900/90 to-amber-800/90',
      border: 'border-yellow-500/50',
      iconColor: 'text-yellow-400',
    },
    acierto: {
      icon: Trophy,
      bg: 'from-gold/90 to-amber-600/90',
      border: 'border-gold',
      iconColor: 'text-white',
    },
  };

  const config = typeConfig[notification?.type ?? 'info'] ?? typeConfig.info;
  const Icon = config?.icon ?? Bell;

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.8 }}
      className={`relative p-4 rounded-xl border ${config?.border ?? ''} bg-gradient-to-r ${config?.bg ?? ''} backdrop-blur-lg shadow-lg`}
    >
      <button
        onClick={() => onDismiss?.(notification?.id ?? '')}
        className="absolute top-2 right-2 text-gray-400 hover:text-white transition-colors"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg bg-black/20 ${config?.iconColor ?? ''}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 pr-4">
          <h4 className="font-bold text-white">{notification?.title ?? ''}</h4>
          <p className="text-sm text-gray-300 mt-1">{notification?.message ?? ''}</p>
        </div>
      </div>

      {/* Progress bar */}
      <motion.div
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        transition={{ duration: 5, ease: 'linear' }}
        className="absolute bottom-0 left-0 right-0 h-1 bg-white/30 origin-left rounded-b-xl"
      />
    </motion.div>
  );
}
