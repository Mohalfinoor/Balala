import React, { useState, useEffect } from "react";
import GallerySection from "./components/GallerySection";
import { 
  Sparkles, 
  ShoppingBag, 
  Compass, 
  MapPin, 
  Layers, 
  Phone,
  Mail,
  HelpCircle 
} from "lucide-react";
import { CraftItem } from "./types";

export default function App() {
  const [cartCount, setCartCount] = useState(0);
  const [geminiConfigured, setGeminiConfigured] = useState(false);
  const [statusMessage, setStatusMessage] = useState("Memeriksa status integrasi...");

  // Load API status check on startup to determine if a full key is available
  useEffect(() => {
    fetch("/api/status")
      .then((res) => {
        if (!res.ok) throw new Error("Server not responding fully");
        return res.json();
      })
      .then((data) => {
        setGeminiConfigured(data.geminiConfigured);
        setStatusMessage(data.message);
      })
      .catch((err) => {
        console.warn("API check failed, defaulting to mock fallback mode", err);
        setStatusMessage("Berjalan dalam Mode Simulasi Offline.");
      });
  }, []);

  const handleAddToCart = (item: CraftItem) => {
    setCartCount(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-neutral-50/50 flex flex-col font-sans selection:bg-amber-100 selection:text-amber-800 antialiased text-neutral-800" id="balla_ar_root">
      {/* Top Banner Alert indicating Gemini setup */}
      <div className="bg-amber-600 text-white text-[10px] font-bold py-1.5 px-4 text-center tracking-wider relative flex items-center justify-center gap-1.5 border-b border-amber-700/60 shadow-xs z-30">
        <Sparkles className="w-3.5 h-3.5 text-amber-350 animate-pulse" />
        <span>{statusMessage}</span>
        {!geminiConfigured && (
          <span className="opacity-95 font-medium underline">
            (Atur kunci API Anda di menu Secrets samping jika Anda ingin menguji respon AI secara dinamis!)
          </span>
        )}
      </div>

      {/* Main Beautiful Header Navigation */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-neutral-200/50 z-20 shadow-xs" id="app_header">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          
          {/* Logo Brand Brand */}
          <div className="flex items-center gap-2.5 cursor-pointer">
            <div className="bg-gradient-to-br from-amber-500 to-amber-700 text-white p-2.5 rounded-2xl shadow-md flex items-center justify-center">
              <Compass className="w-5 h-5 animate-spin-reverse" style={{ animationDuration: "15s" }} />
            </div>
            <div>
              <h1 className="text-xl font-extrabold font-sans tracking-tight text-neutral-900 bg-linear-to-r from-neutral-950 via-amber-900 to-neutral-800 bg-clip-text text-transparent">
                Balla-AR
              </h1>
              <span className="text-[9px] text-neutral-400 font-bold block uppercase tracking-widest mt-0.5">
                Spasial Kriya & Warisan Budaya
              </span>
            </div>
          </div>

          {/* AR Focus Badge Indicator */}
          <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs font-bold shadow-xs">
            <span className="w-2 h-2 rounded-full bg-amber-600 animate-ping"></span>
            <span>Mode Spesifikasi & Penempatan Kamera Real-Time Aktif</span>
          </div>

          {/* Header Actions (Shopping cart & details info) */}
          <div className="flex items-center gap-3">
            <div className="bg-neutral-50 p-2.5 rounded-xl border border-neutral-200/40 flex items-center justify-center gap-2 text-xs relative" title="Keranjang Simulasi E-Commerce">
              <ShoppingBag className="w-4 h-4 text-neutral-600" />
              <span className="font-bold text-neutral-900">{cartCount}</span>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 bg-amber-600 text-white rounded-full text-[9px] font-extrabold flex items-center justify-center animate-bounce">
                  {cartCount}
                </span>
              )}
            </div>
          </div>

        </div>
      </header>

      {/* Main Body Routing Frames - Hardcoded to AR Gallery Area */}
      <main className="flex-1 bg-white/20">
        <GallerySection onAddToCart={handleAddToCart} geminiConfigured={geminiConfigured} />
      </main>

      {/* Modern High-End Footer complying anti-ai-slop guidelines */}
      <footer className="bg-neutral-950 text-white border-t border-neutral-900 py-12 px-4 z-10" id="app_footer">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Logo Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-amber-500 text-neutral-950 rounded-lg font-bold text-sm">B-AR</span>
              <span className="font-sans font-extrabold text-base tracking-tighter">Balla-AR Platform</span>
            </div>
            <p className="text-neutral-500 text-[11px] leading-5">
              Platform kriya interaktif berbasis augmented reality digital dan dokumentasi sejarah kultural, memberdayakan pengrajin lokal di Sulawesi Selatan (Gowa, Wajo, Bulukumba, dan Tana Toraja) untuk melestarikan ornamen adat nusantara dalam visualisasi spasial modern.
            </p>
          </div>

          {/* Product Scope & Guides */}
          <div className="space-y-2 text-xs">
            <h5 className="font-extrabold text-amber-500 uppercase tracking-widest text-[10px]">PANDUAN NAVIGASI AR</h5>
            <p className="text-[11px] text-neutral-400 font-medium leading-relaxed">
              Pilih kerajinan budaya favorit Anda di galeri, pilih tab <strong>Rotasi 3D</strong> untuk melihat detail ornamen dari berbagai sudut, atau pilih tab <strong>Tempatkan di Ruangan (AR)</strong> untuk menyimulasikan kecocokan ukuran langsung di hunian Anda.
            </p>
            <div className="text-[10px] text-neutral-500 italic mt-2">
              Mewujudkan kecocokan nilai tradisi melalui presisi teknologi spasial masa depan.
            </div>
          </div>

          {/* Creators Section */}
          <div className="space-y-3.5 text-xs text-neutral-400">
            <h5 className="font-extrabold text-amber-500 uppercase tracking-widest text-[10px]">TIM PENGEMBANG PLATFORM</h5>
            <div className="space-y-1.5 text-[11px]">
              <div className="flex justify-between">
                <strong>Muhammad Ramdan Alqadri</strong>
                <span className="text-neutral-600">Product Business & Culture</span>
              </div>
              <div className="flex justify-between">
                <strong>Mohalfinoor Wirabuana</strong>
                <span className="text-neutral-600">Lead Spatial Developer</span>
              </div>
              <div className="text-[10px] text-neutral-500 mt-2.5">
                Balala Studio Kolektif &bull; Makassar, ID
              </div>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto text-center border-t border-neutral-900 mt-8 pt-6 select-none">
          <span className="text-[10px] text-neutral-600">
            © 2026 Balla-AR. Hak cipta dilindungi oleh Hukum Adat & Hukum Negara Republik Indonesia.
          </span>
        </div>
      </footer>
    </div>
  );
}
