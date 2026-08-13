import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useNotifications, OliNotification } from "@/hooks/useNotifications";

function timeAgo(dateString: string): string {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "agora";
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  return new Date(dateString).toLocaleDateString("pt-BR");
}

interface NotificationBellProps {
  /** Classe extra para o botão do sino, para casar com o header claro/escuro de cada tela. */
  triggerClassName?: string;
}

export function NotificationBell({ triggerClassName }: NotificationBellProps) {
  const navigate = useNavigate();
  const { notifications, unreadCount, loading, isAuthenticated, markAsRead, markAllAsRead } =
    useNotifications();

  if (!isAuthenticated) return null;

  const handleClick = (notification: OliNotification) => {
    if (!notification.is_read) markAsRead(notification.id);
    if (notification.link) navigate(notification.link);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "relative p-2 rounded-full transition-colors hover:bg-primary-foreground/10",
            triggerClassName
          )}
          aria-label="Notificações"
        >
          <Bell className="w-6 h-6" />
          {unreadCount > 0 && (
            <span className="absolute top-0.5 right-0.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-destructive text-destructive-foreground text-[10px] font-semibold leading-none">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <span className="font-semibold text-sm">Notificações</span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto py-1 px-2 text-xs text-primary"
              onClick={markAllAsRead}
            >
              Marcar todas como lidas
            </Button>
          )}
        </div>

        <ScrollArea className="max-h-96">
          {loading ? (
            <p className="text-sm text-muted-foreground text-center py-8">Carregando...</p>
          ) : notifications.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Nenhuma notificação por enquanto
            </p>
          ) : (
            <div className="divide-y divide-border">
              {notifications.map((notification) => (
                <button
                  key={notification.id}
                  onClick={() => handleClick(notification)}
                  className={cn(
                    "w-full text-left px-4 py-3 transition-colors hover:bg-muted/60 flex gap-3 items-start",
                    !notification.is_read && "bg-primary/5"
                  )}
                >
                  {!notification.is_read && (
                    <span className="mt-1.5 w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                  )}
                  <div className={cn("flex-1 min-w-0", notification.is_read && "pl-5")}>
                    <p className="text-sm font-medium text-foreground truncate">
                      {notification.title}
                    </p>
                    {notification.body && (
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                        {notification.body}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground/70 mt-1">
                      {timeAgo(notification.created_at)}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
