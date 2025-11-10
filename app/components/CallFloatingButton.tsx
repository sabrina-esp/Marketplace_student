"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Room, createLocalTracks, RoomEvent } from 'livekit-client';

type Props = {
  userId?: string; // optional prop to send to the backend when creating a room/token
};

export default function CallFloatingButton({ userId = '123' }: Props) {
  const [joined, setJoined] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [muted, setMuted] = useState(false);
  const roomRef = useRef<Room | null>(null);
  const localTracksRef = useRef<any[]>([]);
  const audioElsRef = useRef<HTMLAudioElement[]>([]);

  async function joinCall() {
    if (connecting || joined) return;
    setConnecting(true);

    try {
      // 1) Request token + room from backend (direct to local dev server)
      // Change this URL if your local LiveKit API runs on a different port or host.
  const backendBase = process.env.NEXT_PUBLIC_CALL_API_URL || 'http://localhost:5000';
      // If parent didn't provide a real userId, try to fetch current user from the backend
      let userIdToUse = userId;
      if (!userIdToUse || userIdToUse === 'guest' || userIdToUse === '123') {
        try {
          const meRes = await fetch('/api/auth/is');
          if (meRes.ok) {
            const me = await meRes.json();
            userIdToUse = me.id ?? me._id ?? userIdToUse;
          }
        } catch (e) {
          // ignore and fall back to provided userId
        }
      }

      console.log('Starting call for user:', userIdToUse)

      const res = await fetch(`${backendBase}/start_call`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userIdToUse }),
      });
      const data = await res.json();
      // handle different backend response shapes
      let token = data.token ?? data.join_token ?? data.joinToken ?? null;
      let wsUrl = data.wsUrl ?? data.ws_url ?? data.wsEndpoint ?? data.ws_endpoint ?? data.url ?? null;
      const roomName =  data.name ?? data.roomName ?? data.room_name ?? data.sid ?? 'unknown-room';

      // If server returned a join token under a different key, use it
      if (!token && data.join_token) token = data.join_token;

      // If wsUrl is not provided, force a default to the local LiveKit server at port 5000
      if (!wsUrl) {
        const proto = window.location.protocol === 'https:' ? 'wss' : 'ws';
        const livekitHost = (process.env.NEXT_PUBLIC_LIVEKIT_WS_HOST || 'localhost:5000').replace(/^wss?:\/\//, '');
        wsUrl = `${proto}://${livekitHost}`;
        console.warn('Using local LiveKit wsUrl because server did not return one:', wsUrl);
      }

      if (!token) {
        console.warn('No join token found in server response. Server response:', data);
      }

      // 2) Connect to LiveKit room
      const room = new Room({ adaptiveStream: true, dynacast: true });
      roomRef.current = room;
      await room.connect(wsUrl, token, { autoSubscribe: true });
      console.log('Connected to room:', roomName);

      // 3) Handle participants & subscribed tracks
      room.on(RoomEvent.ParticipantConnected, (p) => console.log('Participant connected:', p.identity));

      room.on(RoomEvent.TrackSubscribed, (track: any, _pub: any, participant: any) => {
        if (track && track.kind === 'audio') {
          // create an audio element and attach the incoming track
          const audioEl = document.createElement('audio');
          audioEl.autoplay = true;
          try {
            // Some track objects expose mediaStreamTrack
            const msTrack = track.mediaStreamTrack ?? track.track ?? null;
            if (msTrack) {
              audioEl.srcObject = new MediaStream([msTrack]);
            }
          } catch (err) {
            console.warn('Could not attach track to audio element', err);
          }
          document.body.appendChild(audioEl);
          audioElsRef.current.push(audioEl);
        }
      });

      // 4) Publish local mic (robustly)
      const localTracks = await createLocalTracks({ audio: true, video: false });
      localTracksRef.current = localTracks;
      if (localTracks.length > 0) {
        // publish tracks one-by-one using the stable API
        for (const t of localTracks) {
          try {
            // @ts-ignore - livekit-client types can vary; publishTrack is the single-track API
            await room.localParticipant.publishTrack(t);
          } catch (e) {
            console.warn('publishTrack failed for one track', e);
          }
        }
      }

      setJoined(true);
    } catch (err) {
      console.error('Failed to join call', err);
    } finally {
      setConnecting(false);
    }
  }

  function leaveCall() {
    // remove audio elements
    audioElsRef.current.forEach((el) => {
      try {
        el.pause();
        if (el.srcObject) {
          // @ts-ignore
          const ms = el.srcObject as MediaStream;
          ms.getTracks().forEach((t) => t.stop());
        }
        el.remove();
      } catch (e) {
        // ignore
      }
    });
    audioElsRef.current = [];

    // stop local tracks
    localTracksRef.current.forEach((t) => {
      try {
        t.stop?.();
        if (t.mediaStreamTrack) t.mediaStreamTrack.stop?.();
      } catch (e) {}
    });
    localTracksRef.current = [];

    // disconnect room
    try {
      roomRef.current?.disconnect();
    } catch (e) {
      console.warn('Error disconnecting room', e);
    }
    roomRef.current = null;
    setJoined(false);
    setMuted(false);
  }

  function toggleMute() {
    const newMuted = !muted;
    setMuted(newMuted);
    // disable/enable local media tracks
    localTracksRef.current.forEach((t) => {
      try {
        if (t.mediaStreamTrack) {
          t.mediaStreamTrack.enabled = !newMuted;
        } else if (t.track) {
          t.track.enabled = !newMuted;
        }
      } catch (e) {
        // ignore
      }
    });
  }

  useEffect(() => {
    return () => {
      // cleanup on unmount
      leaveCall();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      {/* Floating button */}
      <div style={{ position: 'fixed', right: 20, bottom: 20, zIndex: 9999 }}>
        {!joined ? (
          <button
            onClick={joinCall}
            disabled={connecting}
            aria-label="Join call"
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: '#0ea5e9',
              color: 'white',
              boxShadow: '0 6px 18px rgba(0,0,0,.2)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {connecting ? '...' : 'Call'}
          </button>
        ) : (
          <div
            style={{
              width: 220,
              padding: 12,
              borderRadius: 12,
              background: 'rgba(255,255,255,0.95)',
              boxShadow: '0 6px 18px rgba(0,0,0,.12)',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              alignItems: 'stretch',
            }}
          >
            <div style={{ fontWeight: 600 }}>In call</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={toggleMute}
                style={{ flex: 1, padding: 8, borderRadius: 8, border: '1px solid #e5e7eb', background: muted ? '#f87171' : '#10b981', color: 'white' }}
              >
                {muted ? 'Unmute' : 'Mute'}
              </button>
              <button
                onClick={leaveCall}
                style={{ flex: 1, padding: 8, borderRadius: 8, border: '1px solid #e5e7eb', background: '#ef4444', color: 'white' }}
              >
                Leave
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
