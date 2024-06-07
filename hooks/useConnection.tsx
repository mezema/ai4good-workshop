"use client"

import { useCloud } from "@/cloud/useCloud";
import React, { createContext, useState } from "react";
import { useCallback } from "react";
import { useConfig } from "./useConfig";

export type ConnectionMode = "cloud" | "manual" | "env"

type TokenGeneratorData = {
  shouldConnect: boolean;
  wsUrl: string;
  token: string;
  mode: ConnectionMode;
  disconnect: () => Promise<void>;
  connect: (mode: ConnectionMode) => Promise<void>;
};

const ConnectionContext = createContext<TokenGeneratorData | undefined>(undefined);

export const ConnectionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { generateToken, wsUrl: cloudWSUrl } = useCloud();
  const { config } = useConfig();
  const [connectionDetails, setConnectionDetails] = useState<{
    wsUrl: string;
    token: string;
    mode: ConnectionMode;
    shouldConnect: boolean;
  }>({ wsUrl: "", token: "", shouldConnect: false, mode: "manual" });

  const connect = useCallback(async (mode: ConnectionMode) => {
    let token = "";
    let url = "";
    if (mode === "cloud") {
      token = await generateToken();
      url = cloudWSUrl;
    } else if (mode === "env") {
      if (!process.env.NEXT_PUBLIC_LIVEKIT_URL) {
        throw new Error("NEXT_PUBLIC_LIVEKIT_URL is not set");
      }
      url = process.env.NEXT_PUBLIC_LIVEKIT_URL;
      const response = await fetch("/api/token");
      if (!response.ok) {
        throw new Error(`Failed to fetch token: ${response.statusText}`);
      }
      const data = await response.json().catch(() => {
        throw new Error("Failed to parse JSON response from /api/token");
      });
      token = data.accessToken;
    } else {
      token = config.settings.token;
      url = config.settings.ws_url;
    }
    setConnectionDetails({ wsUrl: url, token, shouldConnect: true, mode });
  }, [
    cloudWSUrl,
    config.settings.token,
    config.settings.ws_url,
    generateToken,
  ]);

  const disconnect = useCallback(async () => {
    setConnectionDetails((prev) => ({ ...prev, shouldConnect: false }));
  }, []);

  return (
    <ConnectionContext.Provider
      value={{
        wsUrl: connectionDetails.wsUrl,
        token: connectionDetails.token,
        shouldConnect: connectionDetails.shouldConnect,
        mode: connectionDetails.mode,
        connect,
        disconnect,
      }}
    >
      {children}
    </ConnectionContext.Provider>
  );
};

export const useConnection = () => {
  const context = React.useContext(ConnectionContext);
  if (context === undefined) {
    throw new Error("useConnection must be used within a ConnectionProvider");
  }
  return context;
}