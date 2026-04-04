// ─────────────────────────────────────────────────────────────
// FOOTER ORIGINAL — backup para revert
// Para restaurar: en App.tsx reemplazá <FooterNew /> con <FooterOld />
// ─────────────────────────────────────────────────────────────

export function FooterOld() {
    return (
        <footer className="bg-gray-50 border-t border-gray-100 py-12 px-6">
            <div className="max-w-6xl mx-auto">

                {/* Main footer grid: left = logo + contact, right = map */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10 items-start">

                    {/* LEFT: Logo + contact info */}
                    <div className="flex flex-col md:flex-row gap-10 items-center md:items-start text-center md:text-left">

                        {/* Logo + tagline */}
                        <div className="flex flex-col items-center md:items-start gap-3 shrink-0">
                            <img
                                src="/sticker.png"
                                alt="Camilo's BJJ Logo"
                                className="h-20 w-auto object-contain drop-shadow-md"
                            />
                            <p className="text-gray-500 text-xs font-light tracking-wide text-center md:text-left leading-relaxed">
                                Brazilian Jiu-Jitsu<br />Docklands, Melbourne
                            </p>
                        </div>

                        {/* Contact info */}
                        <div className="flex flex-col gap-6">

                            {/* Address */}
                            <div>
                                <p className="text-gray-400 text-[10px] font-bold tracking-[0.2em] uppercase mb-2">Find Us</p>
                                <p className="text-gray-700 text-sm font-light leading-relaxed">
                                    18 Import Ln<br />
                                    Docklands VIC 3008
                                </p>
                                <span className="text-gray-400 text-xs italic mt-1 block">Inside Empower Tactical</span>
                            </div>

                            {/* WhatsApp */}
                            <div>
                                <p className="text-gray-400 text-[10px] font-bold tracking-[0.2em] uppercase mb-2">WhatsApp</p>
                                <a
                                    href="https://wa.me/61489038711"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-gray-700 text-sm font-light hover:text-green-600 transition-colors"
                                >
                                    <svg className="w-4 h-4 text-green-500 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                    </svg>
                                    0489 038 711
                                </a>
                            </div>

                            {/* Instagram */}
                            <div>
                                <p className="text-gray-400 text-[10px] font-bold tracking-[0.2em] uppercase mb-2">Follow</p>
                                <a
                                    href="https://www.instagram.com/camilosbjj/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-gray-700 text-sm font-light hover:text-pink-600 transition-colors"
                                >
                                    <svg className="w-4 h-4 text-pink-500 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                    </svg>
                                    @camilosbjj
                                </a>
                            </div>

                        </div>
                    </div>

                    {/* RIGHT: Google Maps embed */}
                    <div className="w-full">
                        <p className="text-gray-400 text-[10px] font-bold tracking-[0.2em] uppercase mb-3 text-center lg:text-left">Location</p>
                        <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm w-full h-48 md:h-56">
                            <iframe
                                title="Camilo's BJJ — Empower Tactical, Docklands"
                                src="https://www.google.com/maps?q=18+Import+Ln,+Docklands+VIC+3008,+Australia&output=embed"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                        </div>
                        <a
                            href="https://www.google.com/maps/dir/?api=1&destination=18+Import+Ln,+Docklands+VIC+3008"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 mt-3 text-gray-500 text-xs font-medium hover:text-gray-800 transition-colors"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Get directions →
                        </a>
                    </div>

                </div>

                {/* Bottom legal bar */}
                <div className="border-t border-gray-200 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-gray-400 text-[11px] tracking-widest uppercase">
                        © {new Date().getFullYear()} Camilo's BJJ · All rights reserved
                    </p>
                    <p className="text-gray-400 text-[11px] tracking-widest uppercase">
                        No contract · No lock-in · Cancel anytime
                    </p>
                </div>

            </div>
        </footer>
    );
}
