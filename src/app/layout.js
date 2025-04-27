import "./globals.css";
import { Navbar } from "@/components/navbar";

export const metadata = {
  title: "German Flashcards",
  description: "Interactive flashcards for learning German vocabulary",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased bg-zinc-950 text-zinc-100 min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
      </body>
    </html>
  );
}
