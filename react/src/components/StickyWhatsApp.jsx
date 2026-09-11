import React from 'react';
const WHATSAPP_NUMBER = "923710282405"; // replace with your number, digits only, country code first
const DEFAULT_MESSAGE = "Hi Raja, I'd like to talk about a project";

export default function StickyWhatsApp() {
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="whatsapp-btn fixed right-5 bottom-6 sm:right-7 sm:bottom-8 z-50 grid place-items-center
                 w-14 h-14 rounded-full bg-[#25D366]
                 shadow-[0_8px_30px_-6px_rgba(37,211,102,.6)]
                 hover:scale-108 transition-transform duration-300"
    >
      <span className="whatsapp-ring" aria-hidden="true" />
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-7 h-7 relative" fill="white">
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.79.47 3.47 1.29 4.93L2 22l5.31-1.39a9.87 9.87 0 004.73 1.2h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2zm5.8 14.02c-.24.68-1.4 1.31-1.93 1.36-.5.05-1.02.24-3.4-.75-2.87-1.2-4.71-4.16-4.85-4.35-.14-.19-1.16-1.55-1.16-2.95 0-1.4.73-2.09.99-2.38.26-.28.57-.35.76-.35.19 0 .38 0 .55.01.18.01.42-.07.65.5.24.58.82 2 .89 2.15.07.14.12.31.02.5-.09.19-.14.31-.28.47-.14.17-.29.37-.42.5-.14.14-.28.29-.12.57.16.28.71 1.17 1.53 1.9 1.05.94 1.94 1.23 2.22 1.37.28.14.44.12.6-.07.16-.19.68-.79.87-1.06.19-.28.37-.23.62-.14.26.09 1.63.77 1.9.91.28.14.46.21.53.33.07.12.07.68-.17 1.36z" />
      </svg>
    </a>
  );
}
