export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-xl font-bold text-white mb-3">Smoky Coffee</h2>

        <p className="text-sm mb-4">
          © {new Date().getFullYear()} Smoky Coffee Indonesia
        </p>

        <p className="text-sm">All rights reserved.</p>
      </div>
    </footer>
  );
}
