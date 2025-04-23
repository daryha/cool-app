import "./globals.css";
import { Geist, Geist_Mono, Roboto } from "next/font/google";
import Providers from "./providers";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { ClientAuthProvider } from "./ClientAuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const roboto = Roboto({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Спорт Платформа",
  description: "Выберите свой любимый вид спорта",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${roboto.className} antialiased`}
      >
        <Providers>
          <ClientAuthProvider>
            <Header />
            <main>{children}</main>
            <Footer />
          </ClientAuthProvider>
        </Providers>
      </body>
    </html>
  );
}
