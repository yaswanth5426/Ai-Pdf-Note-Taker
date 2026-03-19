import "./globals.css";
import Provider from "./provider";
import { ClerkProvider } from "@clerk/nextjs";
import Script from "next/script"; // ✅ import Script

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="antialiased">
          
          <Provider>{children}</Provider>
        </body>
      </html>
    </ClerkProvider>
  );
}