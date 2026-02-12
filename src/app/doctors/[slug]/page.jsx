import { doctors } from "@/data/doctors";
import DoctorProfile from "@/components/DoctorProfile";
import { notFound } from "next/navigation";

export default async function DoctorPage(props) {
  const params = await props.params; // ⬅️ INI KUNCI UTAMA
  const slug = params.slug;

  const doctor = doctors.find((d) => d.slug === slug);

  if (!doctor) return notFound();

  return <DoctorProfile doctor={doctor} />;
}
