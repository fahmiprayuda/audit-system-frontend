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
  description: "A monitoring dashboard audit project built with Next.js, Tailwind CSS, and React. This project provides insights into the performance and health of your applications through a user-friendly interface. It includes features such as real-time monitoring, customizable dashboards, and alerting capabilities to help you stay on top of your application's performance. Whether you're a developer, DevOps engineer, or IT professional, this dashboard audit project is designed to help you optimize your monitoring strategy and ensure the reliability of your applications.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${heading.variable} ${body.variable}`}>
      <body className="font-body bg-white text-gray-900">
        <Topbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}