import { doctors } from "@/data/doctors";
import DoctorCard from "@/components/DoctorCard";

export default function DoctorsPage() {
  return (
    <section className="py-28 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-3xl font-bold text-center mb-14">Daftar Dokter</h1>

        <div className="grid sm:grid-cols-6 md:grid-cols-6 gap-8">
          {doctors.map((doctor) => (
            <DoctorCard key={doctor.slug} doctor={doctor} />
          ))}
        </div>
      </div>
    </section>
  );
}
