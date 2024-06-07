"use client"

import { PlaygroundToast, ToastType } from '@/components/toast/PlaygroundToast'
import { ConnectionMode, useConnection } from '@/hooks/useConnection'
import { useCallback, useMemo, useState } from 'react'
import { AnimatePresence, motion } from "framer-motion";
import { LiveKitRoom, RoomAudioRenderer, StartAudio } from '@livekit/components-react'
import Playground from '@/components/playground/Playground'
import { PlaygroundConnect } from '@/components/PlaygroundConnect'

const themeColors = [
  "cyan",
  "green",
  "amber",
  "blue",
  "violet",
  "rose",
  "pink",
  "teal",
];

export function HomeInner() {
    const [toastMessage, setToastMessage] = useState<{
      message: string;
      type: ToastType;
    } | null>(null);
    const { shouldConnect, wsUrl, token, mode, connect, disconnect } =
      useConnection();
    
    const handleConnect = useCallback(
      async (c: boolean, mode: ConnectionMode) => {
        c ? connect(mode) : disconnect();
      },
      [connect, disconnect]
    );
  
    const showPG = useMemo(() => {
      if (process.env.NEXT_PUBLIC_LIVEKIT_URL) {
        return true;
      }
      if(wsUrl) {
        return true;
      }
      return false;
    }, [wsUrl])
  
    return (
      <main className="relative flex flex-col justify-center px-4 items-center h-full w-full bg-black repeating-square-background">
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              className="left-0 right-0 top-0 absolute z-10"
              initial={{ opacity: 0, translateY: -50 }}
              animate={{ opacity: 1, translateY: 0 }}
              exit={{ opacity: 0, translateY: -50 }}
            >
              <PlaygroundToast
                message={toastMessage.message}
                type={toastMessage.type}
                onDismiss={() => {
                  setToastMessage(null);
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
        {showPG ? (
          <LiveKitRoom
            className="flex flex-col h-full w-full"
            serverUrl={wsUrl}
            token={token}
            connect={shouldConnect}
            onError={(e) => {
              setToastMessage({ message: e.message, type: "error" });
              console.error(e);
            }}
          >
            <Playground
              themeColors={themeColors}
              onConnect={(c) => {
                const m = process.env.NEXT_PUBLIC_LIVEKIT_URL ? "env" : mode;
                handleConnect(c, m);
              }}
            />
            <RoomAudioRenderer />
            <StartAudio label="Click to enable audio playback" />
          </LiveKitRoom>
        ) : (
          <PlaygroundConnect
            accentColor={themeColors[0]}
            onConnectClicked={(mode) => {
              handleConnect(true, mode);
            }}
          />
        )}
      </main>
    );
  }
  