import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Play, Pause, Mic } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { usePlayingAudio } from "../contexts/PlayingAudioContext";

/** Decodifica waveform base64 (WhatsApp PTT) para array de amplitudes 0–255 */
function decodeWaveform(base64: string): number[] {
  try {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return Array.from(bytes);
  } catch {
    return [];
  }
}

/** Gera barras placeholder quando não há waveform (determinístico) */
function placeholderBars(count: number): number[] {
  const bars: number[] = [];
  for (let i = 0; i < count; i++) {
    bars.push(Math.max(8, 30 + Math.sin(i * 0.4) * 40 + Math.sin(i * 0.12) * 20));
  }
  return bars;
}

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export interface AudioPlayerProps {
  messageId: string;
  mediaUrl: string;
  durationSeconds?: number;
  waveformBase64?: string;
  isFromContact: boolean;
  contactAvatar?: string;
  contactName?: string;
  className?: string;
}

const WAVEFORM_BAR_COUNT = 48;
const WAVEFORM_HEIGHT = 32;

export function AudioPlayer({
  messageId,
  mediaUrl,
  durationSeconds: initialDuration = 0,
  waveformBase64,
  isFromContact,
  contactAvatar,
  contactName,
  className,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(initialDuration);
  const playingAudio = usePlayingAudio();

  const waveformBars = useMemo(() => {
    if (waveformBase64) {
      const decoded = decodeWaveform(waveformBase64);
      if (decoded.length > 0) {
        if (decoded.length <= WAVEFORM_BAR_COUNT) return decoded;
        const step = decoded.length / WAVEFORM_BAR_COUNT;
        const out: number[] = [];
        for (let i = 0; i < WAVEFORM_BAR_COUNT; i++) {
          const idx = Math.floor(i * step);
          out.push(decoded[idx] ?? 0);
        }
        return out;
      }
    }
    return placeholderBars(WAVEFORM_BAR_COUNT);
  }, [waveformBase64]);

  const progress = duration > 0 ? Math.min(1, currentTime / duration) : 0;

  const onTimeUpdate = useCallback(() => {
    const el = audioRef.current;
    if (el) setCurrentTime(el.currentTime);
  }, []);

  const onLoadedMetadata = useCallback(() => {
    const el = audioRef.current;
    if (el && el.duration && Number.isFinite(el.duration)) {
      setDuration(el.duration);
    }
  }, []);

  const onEnded = useCallback(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    playingAudio?.stop(messageId);
  }, [messageId, playingAudio]);

  const togglePlay = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    if (isPlaying) {
      el.pause();
      setIsPlaying(false);
      playingAudio?.stop(messageId);
    } else {
      playingAudio?.setPlaying(messageId, el);
      el.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  }, [isPlaying, messageId, playingAudio]);

  const handleSeek = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const track = trackRef.current;
      const el = audioRef.current;
      if (!track || !el || !Number.isFinite(duration) || duration <= 0) return;
      const rect = track.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const p = Math.max(0, Math.min(1, x / rect.width));
      const time = p * duration;
      el.currentTime = time;
      setCurrentTime(time);
    },
    [duration]
  );

  useEffect(() => {
    const el = audioRef.current;
    if (!el || !playingAudio) return;
    if (playingAudio.playingId !== null && playingAudio.playingId !== messageId && isPlaying) {
      el.pause();
      setIsPlaying(false);
    }
  }, [playingAudio?.playingId, messageId, isPlaying]);

  return (
    <div
      className={cn(
        "flex items-center gap-2 w-full min-w-0 max-w-[85%] sm:max-w-[320px]",
        className
      )}
    >
      <audio
        ref={audioRef}
        src={mediaUrl}
        preload="metadata"
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
        onEnded={onEnded}
        onPause={() => {
          if (playingAudio?.playingId === messageId) {
            setIsPlaying(false);
            playingAudio.stop(messageId);
          }
        }}
        className="hidden"
      />

      <button
        type="button"
        onClick={togglePlay}
        className={cn(
          "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors",
          isFromContact
            ? "bg-primary/15 text-primary hover:bg-primary/25"
            : "bg-primary-foreground/15 text-primary-foreground hover:bg-primary-foreground/25"
        )}
        aria-label={isPlaying ? "Pausar" : "Reproduzir"}
      >
        {isPlaying ? (
          <Pause className="h-5 w-5" />
        ) : (
          <Play className="h-5 w-5 ml-0.5" />
        )}
      </button>

      <div className="flex-1 min-w-0 flex flex-col gap-0.5">
        <div
          ref={trackRef}
          role="slider"
          aria-label="Posição do áudio"
          aria-valuemin={0}
          aria-valuemax={duration}
          aria-valuenow={currentTime}
          tabIndex={0}
          onClick={handleSeek}
          className="relative flex items-center gap-1 h-8 cursor-pointer group"
        >
          <div className="flex-1 flex items-center justify-center gap-0.5 h-full min-w-0 pr-3">
            {waveformBars.map((height, i) => {
              const barProgress = (i + 0.5) / waveformBars.length;
              const isPlayed = barProgress <= progress;
              const h = Math.max(4, (height / 255) * WAVEFORM_HEIGHT);
              return (
                <div
                  key={i}
                  className={cn(
                    "w-1 rounded-full flex-shrink-0 transition-colors",
                    isFromContact
                      ? isPlayed
                        ? "bg-primary"
                        : "bg-muted-foreground/40 group-hover:bg-muted-foreground/60"
                      : isPlayed
                        ? "bg-primary-foreground"
                        : "bg-primary-foreground/40 group-hover:bg-primary-foreground/60"
                  )}
                  style={{ height: `${h}px` }}
                />
              );
            })}
          </div>
          <div
            className={cn(
              "absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 flex-shrink-0 pointer-events-none z-10",
              isFromContact ? "bg-primary border-card" : "bg-primary-foreground border-primary"
            )}
            style={{ left: `calc(${progress * 100}% - 6px)` }}
          />
        </div>
        <div
          className={cn(
            "flex items-center justify-between text-[10px] tabular-nums",
            isFromContact ? "text-muted-foreground" : "text-primary-foreground/80"
          )}
        >
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {isFromContact && (
        <div className="relative flex-shrink-0">
          <Avatar className="h-9 w-9">
            <AvatarImage src={contactAvatar} alt={contactName} />
            <AvatarFallback className="bg-muted text-muted-foreground text-xs">
              {contactName?.slice(0, 2).toUpperCase() ?? "?"}
            </AvatarFallback>
          </Avatar>
          <span
            className={cn(
              "absolute -bottom-0.5 -left-0.5 w-4 h-4 rounded-full flex items-center justify-center",
              "bg-primary text-primary-foreground"
            )}
          >
            <Mic className="h-2.5 w-2.5" />
          </span>
        </div>
      )}
    </div>
  );
}
