import { FaInstagram, FaFacebookF, FaTelegramPlane } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-black text-gray-400">
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* BRAND */}
          <h2 className="text-white font-semibold tracking-wide">RS Al-Arif</h2>

          {/* SOCIAL MEDIA */}
          <div className="flex items-center gap-4">
            <a
              href="https://instagram.com/rsalarif"
              target="_blank"
              rel="noopener noreferrer"
              className="
      p-2 rounded-full
      bg-white/5
      hover:bg-white/10
      transition
    "
              title="Instagram"
            >
              <FaInstagram className="w-5 h-5 hover:text-white" />
            </a>

            <a
              href="https://facebook.com/rsalarif"
              target="_blank"
              rel="noopener noreferrer"
              className="
      p-2 rounded-full
      bg-white/5
      hover:bg-white/10
      transition
    "
              title="Facebook"
            >
              <FaFacebookF className="w-5 h-5 hover:text-white" />
            </a>

            <a
              href="https://t.me/rsalarif"
              target="_blank"
              rel="noopener noreferrer"
              className="
      p-2 rounded-full
      bg-white/5
      hover:bg-white/10
      transition
    "
              title="Telegram"
            >
              <FaTelegramPlane className="w-5 h-5 hover:text-white" />
            </a>
          </div>
        </div>

        <div className="mt-10 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} RS Al-Arif. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
