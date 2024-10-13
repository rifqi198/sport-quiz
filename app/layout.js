import "./globals.css";
import { DM_Sans } from 'next/font/google'

const dmSans = DM_Sans({subsets: ["latin"]})

export const metadata = {
  title: "Sports Quiz",
  description: "Quiz about sports",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${dmSans} bg-gradient-to-b from-[#00124D] to-[#4C016E] antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
