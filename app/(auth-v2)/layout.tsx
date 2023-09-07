import React from "react";
import "../globals.css";
import TopBar from "@/components/shared/TopBar";
export const metadata = {
  title: "You're Wrong",
  description: "Respectful disagreements",
};

// const inter = Inter({ subsets: ["latin"] });

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    // should be replaced with local-auth provider component
    // <ClerkProvider>
    <html lang="en">
      <body
        // className={`${inter.className} bg-dark-1`}
        className="bg-dark-1"
        suppressHydrationWarning={true}
      >
        {/* <TopBar withLogout={false} /> */}
        <main className="w-full flex flex-row justify-center items-center min-h-screen">
          {children}
        </main>
      </body>
    </html>
    // </ClerkProvider>
  );
};

export default RootLayout;
