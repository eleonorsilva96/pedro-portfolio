import type { Metadata } from "next";
import { quicksand } from "@/app/ui/fonts";
import "./globals.css";
import Header from '@/app/ui/header';
import Footer from "@/app/ui/footer";

export const metadata: Metadata = {
  title: "Pedro Martins | Videógrafo e fotógrafo | Aveiro",
  description: "Olá, o meu nome é Pedro Martins, sou videógrafo e fotógrafo freelancer de Aveiro. Faço gravação, edição de vídeo, motion-graphics, registo de fotos, edição de fotos e gravação com drone.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${quicksand.className} antialiased text-gray-950`}
      >
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
