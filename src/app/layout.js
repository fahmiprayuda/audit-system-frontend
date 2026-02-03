import "./globals.css";

export const metadata = {
  title: "Company Profile",
  description: "Smoky Coffee",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
