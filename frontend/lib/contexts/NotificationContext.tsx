"use client";

import React, { createContext, useContext, useMemo, useState } from "react";

interface Notification {
  id: string;
  type: "success" | "error" | "info";
  message: string;
}

interface NotificationContextValue {
  notifications: Notification[];
  notify: (message: string, type?: Notification["type"]) => void;
  dismiss: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(
  undefined,
);

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const notify = (message: string, type: Notification["type"] = "info") => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setNotifications((current) => [...current, { id, message, type }]);
    window.setTimeout(
      () =>
        setNotifications((current) =>
          current.filter((notification) => notification.id !== id),
        ),
      5000,
    );
  };

  const dismiss = (id: string) => {
    setNotifications((current) =>
      current.filter((notification) => notification.id !== id),
    );
  };

  const value = useMemo(
    () => ({ notifications, notify, dismiss }),
    [notifications],
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within NotificationProvider");
  }
  return context;
}
