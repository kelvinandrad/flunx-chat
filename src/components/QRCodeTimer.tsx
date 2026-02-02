import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

interface QRCodeTimerProps {
  startTime: number;
  durationMs: number;
  onExpire: () => void;
}

export function QRCodeTimer({ startTime, durationMs, onExpire }: QRCodeTimerProps) {
  const [remaining, setRemaining] = useState<number>(() => {
    const elapsed = Date.now() - startTime;
    return Math.max(0, durationMs - elapsed);
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const left = Math.max(0, durationMs - elapsed);
      setRemaining(left);
      if (left === 0) {
        clearInterval(interval);
        onExpire();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, durationMs, onExpire]);

  if (remaining === 0) {
    return (
      <div className="flex items-center justify-center gap-2 text-sm text-amber-600 dark:text-amber-400">
        <Clock className="h-4 w-4" />
        <span>QR Code expirado</span>
      </div>
    );
  }

  const seconds = Math.floor(remaining / 1000);
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return (
    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
      <Clock className="h-4 w-4" />
      <span>
        Expira em {minutes}:{secs.toString().padStart(2, "0")}
      </span>
    </div>
  );
}
