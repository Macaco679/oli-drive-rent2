import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Message } from "@/lib/chatService";
import { useState, useEffect } from "react";
import { Check, CheckCheck, Clock } from "lucide-react";
import { ChatAudioPlayer } from "./ChatAudioPlayer";
import { resolvePrivateStorageUrl } from "@/lib/storageUrl";

export type MessageStatus = "sending" | "sent" | "delivered" | "read";

interface ChatMessageBubbleProps {
  message: Message;
  isOwn: boolean;
  status?: MessageStatus;
}

export function ChatMessageBubble({ message, isOwn, status = "sent" }: ChatMessageBubbleProps) {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [resolvedImageUrl, setResolvedImageUrl] = useState<string | null>(null);
  const [resolvedAudioUrl, setResolvedAudioUrl] = useState<string | null>(null);
  
  // Check if this is an optimistic message (temp id)
  const isSending = message.id.startsWith("temp-");
  const effectiveStatus = isSending ? "sending" : status;
  
  // Check if message is audio
  const isAudio = (message.metadata as any)?.audioUrl ||
    (message.body?.startsWith("https://") && message.body?.match(/audio\.webm/i));
  const rawAudioUrl = (message.metadata as any)?.audioUrl || message.body;

  // Check if message is an image (type = 'image' or body contains image URL)
  const isImage = !isAudio && (message.type === "image" || 
    (message.metadata as any)?.imageUrl || 
    (message.body?.startsWith("https://") && 
     (message.body?.includes("chat-images") || message.body?.match(/\.(jpg|jpeg|png|gif|webp)$/i))));

  const rawImageUrl = (message.metadata as any)?.imageUrl || message.body;

  // Resolve legacy public URLs / storage paths into signed URLs, since
  // the chat-images bucket is now private.
  useEffect(() => {
    if (!isImage || !rawImageUrl) return;
    let cancelled = false;
    resolvePrivateStorageUrl("chat-images", rawImageUrl).then((url) => {
      if (!cancelled) setResolvedImageUrl(url);
    });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isImage, rawImageUrl]);

  useEffect(() => {
    if (!isAudio || !rawAudioUrl) return;
    let cancelled = false;
    resolvePrivateStorageUrl("chat-images", rawAudioUrl).then((url) => {
      if (!cancelled) setResolvedAudioUrl(url);
    });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAudio, rawAudioUrl]);

  const renderStatusIcon = () => {
    if (!isOwn) return null;
    
    switch (effectiveStatus) {
      case "sending":
        return <Clock className="w-3 h-3 text-primary-foreground/50" />;
      case "sent":
        return <Check className="w-3 h-3 text-primary-foreground/70" />;
      case "delivered":
        return <CheckCheck className="w-3 h-3 text-primary-foreground/70" />;
      case "read":
        return <CheckCheck className="w-3 h-3 text-blue-400" />;
      default:
        return <Check className="w-3 h-3 text-primary-foreground/70" />;
    }
  };

  return (
    <div className={cn("flex", isOwn ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[80%] rounded-2xl text-sm",
          isImage ? "p-1" : "px-3 py-2",
          isOwn
            ? "bg-primary text-primary-foreground rounded-br-sm"
            : "bg-secondary text-secondary-foreground rounded-bl-sm",
          isSending && "opacity-70"
        )}
      >
        {isAudio ? (
          resolvedAudioUrl ? (
            <ChatAudioPlayer src={resolvedAudioUrl} isOwn={isOwn} />
          ) : (
            <div className="flex items-center gap-2 px-2 py-1">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="text-xs text-muted-foreground">Carregando audio...</span>
            </div>
          )
        ) : isImage && !imageError ? (
          <div className="relative">
            {(imageLoading || !resolvedImageUrl) && (
              <div className="absolute inset-0 flex items-center justify-center bg-secondary rounded-xl min-h-[100px] min-w-[150px]">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            {resolvedImageUrl && (
              <img
                src={resolvedImageUrl}
                alt="Imagem enviada"
                className={cn(
                  "max-w-full rounded-xl cursor-pointer hover:opacity-90 transition-opacity",
                  imageLoading && "opacity-0"
                )}
                onLoad={() => setImageLoading(false)}
                onError={() => {
                  setImageLoading(false);
                  setImageError(true);
                }}
                onClick={() => resolvedImageUrl && window.open(resolvedImageUrl, "_blank")}
              />
            )}
          </div>
        ) : imageError ? (
          <p className="text-sm text-muted-foreground px-2 py-1">
            Erro ao carregar imagem
          </p>
        ) : (
          <p className="whitespace-pre-wrap break-words">{message.body}</p>
        )}
        
        <div
          className={cn(
            "flex items-center gap-1 mt-1",
            isImage && "px-2",
            isOwn ? "justify-end" : "justify-start"
          )}
        >
          <span
            className={cn(
              "text-[10px]",
              isOwn ? "text-primary-foreground/70" : "text-muted-foreground"
            )}
          >
            {format(new Date(message.created_at), "HH:mm", { locale: ptBR })}
          </span>
          {renderStatusIcon()}
        </div>
      </div>
    </div>
  );
}
