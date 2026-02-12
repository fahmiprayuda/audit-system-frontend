import "./globals.css";
import NavbarTesla from "@/components/NavbarTesla";
import Footer from "@/components/Footer";

export const metadata = {
  title: "RSU Al-Arif Ciamis",
  description: "Rumah Sakit Umum Tipe D di Ciamis dengan Layanan BPJS, USG 4D, Hemodialisa, dan Dokter Spesialis Berpengalaman",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <NavbarTesla/>
        {children}
        <Footer/>
        </body>
    </html>
  );
}
