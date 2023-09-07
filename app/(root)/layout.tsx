import { ClerkProvider } from "@clerk/nextjs/app-beta";
import "../globals.css";
import type { Metadata } from "next";
// import { Inter } from "next/font/google";
import TopBar from "@/components/shared/TopBar";
import LeftSidebar from "@/components/shared/LeftSidebar";
import RightSidebar from "@/components/shared/RightSidebar";
import BottomBar from "@/components/shared/BottomBar";
// import { ThemeProvider } from "@/components/theme/theme.-provider";
import JumpTopButton from "@/components/shared/JumpTopButton";

// const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "You're Wrong",
  description: "A social network application for respectful disagreements",
  creator: "Angus Macapella",
  applicationName: "You're Wrong",
  metadataBase:
    process.env.NODE_ENV === "development"
      ? new URL("http://localhost:3000")
      : new URL("https://you-are-wrong.vercel.app"),
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          // className={inter.className}
          suppressHydrationWarning={true}
        >
          <TopBar withLogout={true} />
          <main className="flex flex-row">
            <LeftSidebar />
            <section className="main-container">
              <div className="w-full max-w-4xl">{children}</div>
            </section>
            <RightSidebar />
          </main>
          <BottomBar />
          <JumpTopButton type="fixed" />
        </body>
      </html>
    </ClerkProvider>
  );
}