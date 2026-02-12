import Image from "next/image";
import Link from "next/link";

export default function DoctorCard({ doctor }) {
  return (
    <Link
      href={`/doctors/${doctor.slug}`}
      className="group bg-white rounded-xl shadow hover:shadow-xl transition overflow-hidden"
    >
      <div className="relative h-64">
        <Image
          src={doctor.image}
          fill
          className="object-cover group-hover:scale-110 transition"
          alt={doctor.name}
        />
      </div>

      <div className="p-5 text-center">
        <h5 className="font-semibold text-sm">{doctor.name}</h5>
        <p className="text-gray-600 text-sm mt-1">{doctor.specialty}</p>
      </div>
    </Link>
  );
}
