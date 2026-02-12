import Image from "next/image";

export default function DoctorProfile({ doctor }) {
  return (
    <section className="py-28 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-10 items-center">
          <div className="relative w-64 h-64 rounded-xl overflow-hidden shadow">
            <Image
              src={doctor.image}
              fill
              alt={doctor.name}
              loading="eager"
              sizes="(max-width: 768px) 100vw, 256px"
              className="object-cover"
            />
          </div>

          <div>
            <h1 className="text-3xl font-bold">{doctor.name}</h1>
            <p className="text-gray-600 mt-2">{doctor.specialty}</p>

            <div className="mt-4 space-y-2 text-sm">
              <p>
                <strong>Pengalaman:</strong> {doctor.experience}
              </p>
              <p>
                <strong>Jadwal:</strong> {doctor.schedule}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 text-gray-700 leading-relaxed">
          {doctor.description}
        </div>
      </div>
    </section>
  );
}
