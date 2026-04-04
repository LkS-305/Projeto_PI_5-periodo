"use client";

import { useEffect } from "react";
import { useNotification } from "@/lib/contexts/NotificationContext";

const variantStyles = {
  success: "border-emerald-300 bg-emerald-50 text-emerald-800",
  error: "border-rose-300 bg-rose-50 text-rose-800",
  info: "border-sky-300 bg-sky-50 text-sky-800",
};

export function NotificationCenter() {
  const { notifications, dismiss } = useNotification();

  useEffect(() => {
    const interval = window.setInterval(() => {
      if (notifications.length > 0) {
        dismiss(notifications[0].id);
      }
    }, 6000);

    return () => window.clearInterval(interval);
  }, [notifications, dismiss]);

  if (!notifications.length) {
    return null;
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`w-80 rounded-3xl border p-4 shadow-xl ${variantStyles[notification.type]}`}
          role="status"
        >
          <div className="flex items-start justify-between gap-4">
            <p className="text-sm leading-6">{notification.message}</p>
            <button
              type="button"
              onClick={() => dismiss(notification.id)}
              className="text-slate-500 transition hover:text-slate-900"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
