import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import '@rainbow-me/rainbowkit/styles.css';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "DW3Punks",
  description: "NFT Collection for Dennys Wamb",
};

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en">
      <body className={inter.className + "bg-yellow-100"}>
        <Providers >{children}</Providers></body>
    </html>
  );
}
