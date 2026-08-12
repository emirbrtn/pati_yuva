import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { AuthProvider } from "@/context/AuthContext";
import { getCurrentUser } from "@/server/auth";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://patiyuva.test"),
  title: "PatiYuva | Hayvan Sahiplendirme Platformu",
  description:
    "Türkiye'deki barınak hayvanlarını görünür kılan ve doğru hayvanı doğru insanla buluşturan modern sahiplendirme platformu.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  return (
    <html lang="tr" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <AuthProvider initialUser={user}>
          <Header />
          <div className="flex-1">{children}</div>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}