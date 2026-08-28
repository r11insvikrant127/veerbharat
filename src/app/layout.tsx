import { Cinzel, Inter } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import "./globals.css";

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "Veer Bharat",
  description:
    "An interactive digital museum of India's Bravehearts, Kingdoms and History.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${inter.variable} h-full scroll-smooth`}
    >
      <body className="min-h-screen bg-[#F8F5F0] text-gray-900">
        <Navbar />
        {children}
      </body>
    </html>
  );
}