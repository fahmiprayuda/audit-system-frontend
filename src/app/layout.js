import "./globals.css";
import "react-datepicker/dist/react-datepicker.css";

import ClientLayout from "@/components/layout/ClientLayout";

export const metadata = {
  title: {
    default: "Audit Monitoring System",
    template: "%s | Audit Monitoring System",
  },
  description: "Internal Audit Action Plan Monitoring Dashboard",
};
export default function RootLayout({
  children,
}) {
  return (
    <html lang="en">
      <body className="bg-[#f8fafc]">
        <ClientLayout>
          {children}
        </ClientLayout >
      </body>
    </html>
  );
}