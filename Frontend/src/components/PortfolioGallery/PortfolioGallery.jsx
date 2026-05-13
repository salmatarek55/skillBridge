import { useState } from "react";
import { FaImage, FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function PortfolioGallery({ images = [] }) {
  const [active, setActive]   = useState(0);
  const [lightbox, setLightbox] = useState(false);

  if (!images.length) {
    return (
      <div className="w-full h-52 bg-purple-50 border border-purple-100 rounded-2xl flex items-center justify-center text-4xl">
        <FaImage />
      </div>
    );
  }

  return (
    <div>
      <div
        className="relative w-full rounded-2xl overflow-hidden cursor-zoom-in mb-3"
        style={{ height: "280px" }}
        onClick={() => setLightbox(true)}
      >
        <img
          src={images[active]}
          alt={`portfolio-${active}`}
          className="w-full h-full object-cover transition duration-300"
        />
        {images.length > 1 && (
          <span className="absolute bottom-3 right-3 bg-black/40 text-white text-xs px-2 py-1 rounded-full">
            {active + 1} / {images.length}
          </span>
        )}
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 flex-wrap">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActive(idx)}
              className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition cursor-pointer flex-shrink-0 ${
                active === idx ? "border-purple-500" : "border-transparent"
              }`}
            >
              <img src={img} alt={`thumb-${idx}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
      {lightbox && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setLightbox(false)}
        >
          <div className="relative max-w-3xl w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={images[active]}
              alt="lightbox"
              className="w-full rounded-2xl object-contain max-h-[80vh]"
            />

            {/* Navigation */}
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setActive((prev) => (prev - 1 + images.length) % images.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition cursor-pointer"
                >
                  <FaChevronLeft />
                </button>
                <button
                  onClick={() => setActive((prev) => (prev + 1) % images.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition cursor-pointer"
                >
                  <FaChevronRight />
                </button>
              </>
            )}

            <button
              onClick={() => setLightbox(false)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition cursor-pointer text-sm"
            >
             <FaTimes />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
