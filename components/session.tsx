"use client";

import { SessionProvider } from "next-auth/react";
import React, { ReactNode } from "react";

interface SessionProps {
  children: ReactNode;
}

export const Session: React.FC<SessionProps> = ({ children }) => {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
};
