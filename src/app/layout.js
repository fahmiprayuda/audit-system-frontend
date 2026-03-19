import "./globals.css";
import { Montserrat_Alternates, KoHo } from "next/font/google";
import Topbar from "@/components/layout/Topbar";
import Sidebar from "@/components/layout/Sidebar";

const heading = Montserrat_Alternates({
  subsets: ["latin"],
  weight: ["600","700"],
  variable: "--font-heading",
});

const body = KoHo({
  subsets: ["latin"],
  weight: ["400","500"],
  variable: "--font-body",
});

export const metadata = {
  title: "Nama - Personal Portfolio Website",
  description: "Personal Portfolio Website of Fahmi Prayuda, a passionate software developer specializing in web development and design. Explore my projects, skills, and experience in creating innovative and user-friendly web applications. Discover how I can help bring your ideas to life with my expertise in front-end and back-end development. Let's connect and collaborate on your next project!",
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