import "./globals.css";
import { Montserrat_Alternates, KoHo } from "next/font/google";
import Topbar from "@/components/layout/Topbar";
import Sidebar from "@/components/layout/Sidebar";

const heading = Montserrat_Alternates({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-heading",
});

const body = KoHo({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-body",
});

export const metadata = {
  title: "Monitoring Dashboard Audit",
  description: "Monitoring dashboard audit system",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${heading.variable} ${body.variable}`}>
      <body className="font-body bg-[#f8fafc] text-gray-900">
        <Topbar />

        <div>
          <Sidebar />

          <main className="flex-1 ml-20 p-6 min-h-screen transition-all duration-300">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}