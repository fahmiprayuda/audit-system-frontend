export default function Contact() {
  return (
    <section id="contact" className="py-28 bg-gray-100">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-10">Hubungi Kami</h2>

        <form className="bg-white p-8 rounded-xl shadow space-y-4">
          <input
            className="w-full border rounded p-3 focus:outline-none focus:ring-2 focus:ring-brown-500"
            placeholder="Nama"
          />

          <input
            className="w-full border rounded p-3 focus:outline-none focus:ring-2 focus:ring-brown-500"
            placeholder="Email"
          />

          <textarea
            rows="4"
            className="w-full border rounded p-3 focus:outline-none focus:ring-2 focus:ring-brown-500"
            placeholder="Pesan"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Kirim Pesan
          </button>
        </form>
      </div>
    </section>
  );
}
