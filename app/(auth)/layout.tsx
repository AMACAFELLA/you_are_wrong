import { ClerkProvider } from "@clerk/nextjs";
import React from "react";
import "../globals.css";
export const metadata = {
  title: "Your Wrong",
  description: "Respectful disagreement platform",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className="bg-dark-1"
          suppressHydrationWarning={true}
        >
          <div className="w-full flex flex-row justify-center items-center min-h-screen">
            {children}
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
};

export default RootLayout;
