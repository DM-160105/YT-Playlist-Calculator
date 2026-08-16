'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface DurationResult {
  speed: number;
  seconds: number;
  timeSavedSeconds: number;
}

export interface PlaylistResult {
  title: string;
  thumbnail: string;
  totalVideos: number;
  totalSeconds: number;
  durationsBySpeed: DurationResult[];
  isSingleVideo?: boolean;
}

interface PlaylistContextType {
  playlistInput: string;
  setPlaylistInput: (input: string) => void;
  result: PlaylistResult | null;
  loading: boolean;
  error: string | null;
  analyzeUrl: (url: string) => Promise<void>;
  clearPlaylist: () => void;
}

const PlaylistContext = createContext<PlaylistContextType | undefined>(undefined);

export function PlaylistProvider({ children }: { children: ReactNode }) {
  const [playlistInput, setPlaylistInput] = useState('');
  const [result, setResult] = useState<PlaylistResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeUrl = async (urlToAnalyze: string) => {
    if (!urlToAnalyze.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/playlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ playlistInput: urlToAnalyze }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch playlist data.');
      }

      setResult(data);
      setPlaylistInput(urlToAnalyze);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch playlist data.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const clearPlaylist = () => {
    setResult(null);
    setPlaylistInput('');
    setError(null);
  };

  return (
    <PlaylistContext.Provider
      value={{
        playlistInput,
        setPlaylistInput,
        result,
        loading,
        error,
        analyzeUrl,
        clearPlaylist,
      }}
    >
      {children}
    </PlaylistContext.Provider>
  );
}

export function usePlaylist() {
  const context = useContext(PlaylistContext);
  if (!context) {
    throw new Error('usePlaylist must be used within a PlaylistProvider');
  }
  return context;
}
