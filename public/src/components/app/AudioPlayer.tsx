'use client';

import React from 'react';
import { PlayCircle, PauseCircle, Volume2, VolumeX, RotateCcw } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AudioPlayerProps {
  src: string | null;
  title?: string;
  className?: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ src, title, className }) => {
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const [volume, setVolume] = React.useState(1);
  const [isMuted, setIsMuted] = React.useState(false);
  const [isReady, setIsReady] = React.useState(false);

  React.useEffect(() => {
    const audio = audioRef.current;
    if (audio && src) {
      const setAudioData = () => {
        setDuration(audio.duration);
        setCurrentTime(audio.currentTime);
        setIsReady(true);
      };

      const setAudioTime = () => setCurrentTime(audio.currentTime);
      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);
      const handleEnded = () => {
        setIsPlaying(false);
        setCurrentTime(0); // Reset to beginning
      };
      const handleVolumeChange = () => {
        if (audio) {
          setVolume(audio.volume);
          setIsMuted(audio.muted);
        }
      };
      
      audio.addEventListener('loadeddata', setAudioData);
      audio.addEventListener('durationchange', setAudioData); // Catches duration if it changes later
      audio.addEventListener('timeupdate', setAudioTime);
      audio.addEventListener('play', handlePlay);
      audio.addEventListener('pause', handlePause);
      audio.addEventListener('ended', handleEnded);
      audio.addEventListener('volumechange', handleVolumeChange);

      audio.src = src; // Set src when it changes
      audio.load(); // Important to load new src

      // Initial state reset for new src
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
      setIsReady(false);
      
      // Attempt to play if autoplay was intended or handle errors
      // For this component, we don't autoplay by default

      return () => {
        audio.removeEventListener('loadeddata', setAudioData);
        audio.removeEventListener('durationchange', setAudioData);
        audio.removeEventListener('timeupdate', setAudioTime);
        audio.removeEventListener('play', handlePlay);
        audio.removeEventListener('pause', handlePause);
        audio.removeEventListener('ended', handleEnded);
        audio.removeEventListener('volumechange', handleVolumeChange);
      };
    } else if (!src) {
      // Reset when src is null
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
      setIsReady(false);
    }
  }, [src]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (audio && isReady) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play().catch(error => console.error("Error playing audio:", error));
      }
    }
  };

  const handleTimeSliderChange = (value: number[]) => {
    const audio = audioRef.current;
    if (audio && isReady) {
      audio.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = value[0];
      setVolume(value[0]); // This will trigger volumechange event
      audio.muted = value[0] === 0;
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.muted = !audio.muted;
      // volumechange event will update isMuted state
      if (!audio.muted && audio.volume === 0) {
        audio.volume = 0.5; // unmute to a default volume if current is 0
      }
    }
  };
  
  const restartAudio = () => {
    const audio = audioRef.current;
    if (audio && isReady) {
      audio.currentTime = 0;
      setCurrentTime(0);
      if (!isPlaying) {
         audio.play().catch(error => console.error("Error playing audio:", error));
      }
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time) || time === Infinity) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
  if (!src) {
    return (
      <div className={cn("w-full p-4 bg-card rounded-lg shadow-sm border border-border text-muted-foreground text-center", className)}>
        <p>{title || "No audio loaded"}</p>
      </div>
    );
  }

  return (
    <div className={cn("w-full p-4 bg-card rounded-lg shadow-sm border border-border", className)}>
      <audio ref={audioRef} preload="metadata"></audio>
      {title && <p className="text-sm text-card-foreground mb-3 font-medium truncate">{title}</p>}
      <div className="flex items-center gap-3">
        <Button onClick={togglePlayPause} variant="ghost" size="icon" aria-label={isPlaying ? "Pause" : "Play"} disabled={!isReady}>
          {isPlaying ? <PauseCircle className="w-6 h-6 text-accent" /> : <PlayCircle className="w-6 h-6 text-accent" />}
        </Button>
         <Button onClick={restartAudio} variant="ghost" size="icon" aria-label="Restart" disabled={!isReady}>
          <RotateCcw className="w-5 h-5 text-accent" />
        </Button>
        <div className="text-xs text-muted-foreground tabular-nums w-10 text-center shrink-0">
          {formatTime(currentTime)}
        </div>
        <Slider
          value={[currentTime]}
          max={duration || 0}
          step={0.1}
          onValueChange={handleTimeSliderChange}
          className="flex-grow"
          aria-label="Seek"
          disabled={!isReady || duration === 0}
        />
        <div className="text-xs text-muted-foreground tabular-nums w-10 text-center shrink-0">
          {formatTime(duration)}
        </div>
        <Button onClick={toggleMute} variant="ghost" size="icon" aria-label={isMuted ? "Unmute" : "Mute"} disabled={!isReady}>
          {isMuted || volume === 0 ? <VolumeX className="w-5 h-5 text-accent" /> : <Volume2 className="w-5 h-5 text-accent" />}
        </Button>
        <Slider
          value={[isMuted ? 0 : volume]}
          max={1}
          step={0.01}
          onValueChange={handleVolumeChange}
          className="w-20"
          aria-label="Volume"
          disabled={!isReady}
        />
      </div>
       {!isReady && src && (
        <p className="text-xs text-muted-foreground mt-2 text-center">Loading audio...</p>
      )}
    </div>
  );
};

export default AudioPlayer;
