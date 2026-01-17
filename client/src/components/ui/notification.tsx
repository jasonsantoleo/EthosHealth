import { useEffect } from "react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type NotificationType = "success" | "error" | "warning" | "info";

interface NotificationProps {
  message: string;
  type: NotificationType;
  duration?: number;
  onClose: () => void;
}

const notificationConfig = {
  success: {
    icon: CheckCircle,
    className: "bg-medilinkx-green text-white",
  },
  error: {
    icon: AlertCircle,
    className: "bg-medilinkx-red text-white",
  },
  warning: {
    icon: AlertTriangle,
    className: "bg-medilinkx-orange text-white",
  },
  info: {
    icon: Info,
    className: "bg-medilinkx-blue text-white",
  },
};

export function Notification({ 
  message, 
  type, 
  duration = 5000, 
  onClose 
}: NotificationProps) {
  const config = notificationConfig[type];
  const Icon = config.icon;

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <div 
      className={cn(
        "notification-popup px-6 py-4 rounded-lg shadow-lg max-w-sm",
        config.className
      )}
      data-testid={`notification-${type}`}
    >
      <div className="flex items-center">
        <Icon className="mr-3 h-5 w-5" />
        <span className="flex-1 text-sm font-medium">{message}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="ml-4 text-white hover:text-gray-200 h-auto p-1"
          data-testid="notification-close"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
