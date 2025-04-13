import "./globals.css";

export const metadata = {
  title: "Flashcards App",
  description: "A simple flashcards application for learning",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
