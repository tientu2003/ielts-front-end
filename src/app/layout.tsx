import type { Metadata } from "next";
import { Provider } from "@/components/ui/provider"
import React from "react";
import {SessionWrapper} from "@/components/my-ui/session-wrapper";


export const metadata: Metadata = {
  title: "English Practice",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Provider>
          <SessionWrapper>
            {children}
          </SessionWrapper>
        </Provider>
      </body>
    </html>
  );
}
