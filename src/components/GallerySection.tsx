import React, { useState, useRef, useEffect } from "react";
import { CraftItem } from "../types";
import { INITIAL_CRAFTS } from "../data";
import { 
  Camera, 
  Rotate3d, 
  BookOpen, 
  ShoppingBag, 
  User, 
  Info, 
  Sparkles, 
  Maximize2, 
  Compass, 
  MapPin, 
  Plus, 
  Check, 
  Smartphone, 
  Volume2, 
  Lock
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface GallerySectionProps {
  onAddToCart?: (item: CraftItem) => void;
  geminiConfigured: boolean;
}

export default function GallerySection({ onAddToCart, geminiConfigured }: GallerySectionProps) {
  const [crafts, setCrafts] = useState<CraftItem[]>(INITIAL_CRAFTS);
  const [selectedItem, setSelectedItem] = useState<CraftItem | null>(null);
  const [activeTab, setActiveTab] = useState<"story" | "artisan" | "specs">("story");
  
  // Interactive 3D drag values
  const [rotation, setRotation] = useState({ x: 12, y: -20 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [lightSetting, setLightSetting] = useState<"warm" | "daylight" | "studio">("studio");
  
  // AR Simulation values
  const [arMode, setArMode] = useState<"3D" | "AR">("3D");
  const [cameraActive, setCameraActive] = useState(false);
  const [selectedBackdrop, setSelectedBackdrop] = useState<string>("living-room");
  const [objectPosition, setObjectPosition] = useState({ x: 0, y: 20 });
  const [isPlacing, setIsPlacing] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Advanced Gyroscopic & Camera Pan Anchoring systems
  const [initialOrientation, setInitialOrientation] = useState<{ alpha: number; beta: number; gamma: number } | null>(null);
  const [orientationOffset, setOrientationOffset] = useState({ x: 0, y: 0 });
  const [isWallAnchored, setIsWallAnchored] = useState(true);
  const [wallSide, setWallSide] = useState<"front" | "left" | "right">("front");
  const [cameraPanX, setCameraPanX] = useState(0);
  const [cameraPanY, setCameraPanY] = useState(0);

  // Recalibrate and center the physical wall-mounted alignment
  const recalibrateWallAnchor = () => {
    setInitialOrientation(null);
    setOrientationOffset({ x: 0, y: 0 });
    setCameraPanX(0);
    setCameraPanY(0);
  };

  // Compute the 3D perspective skew strings for left, right, and flat walls
  const getWallTransform = () => {
    if (wallSide === "left") {
      return "perspective(800px) rotateY(28deg) skewY(2deg)";
    }
    if (wallSide === "right") {
      return "perspective(800px) rotateY(-28deg) skewY(-2deg)";
    }
    return "perspective(800px) rotateY(0deg) skewY(0deg)";
  };
  
  // AI Story generation values
  const [generatingStory, setGeneratingStory] = useState(false);
  const [customStory, setCustomStory] = useState<any | null>(null);
  const [storyError, setStoryError] = useState<string | null>(null);

  // Sound effects / speech simulation
  const [ttsPlaying, setTtsPlaying] = useState(false);
  const [ttsUtterance, setTtsUtterance] = useState<SpeechSynthesisUtterance | null>(null);

  const backdrops = [
    { id: "living-room", name: "Ruang Tamu Modern", url: "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&q=80&w=800" },
    { id: "desk", name: "Meja Kerja Kayu", url: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&q=80&w=800" },
    { id: "gallery", name: "Studio Minimalis", url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800" }
  ];

  // Camera stream activation
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        try {
          await videoRef.current.play();
        } catch (playErr) {
          console.warn("Autoplay block prevented playing immediately:", playErr);
        }
      }
      setCameraActive(true);
    } catch (err) {
      console.warn("Camera streaming unavailable", err);
      alert("Tidak dapat mengakses kamera. Menggunakan simulasi latar belakang ruang nyata.");
      setSelectedBackdrop("living-room");
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  useEffect(() => {
    if (arMode === "AR") {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [arMode]);

  // Real-time device orientation tracking hook for spatial mapping fallbacks
  useEffect(() => {
    if (!isWallAnchored || arMode !== "AR") {
      setOrientationOffset({ x: 0, y: 0 });
      return;
    }

    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.alpha === null || e.beta === null || e.gamma === null) return;
      
      // Store initial references
      if (!initialOrientation) {
        setInitialOrientation({ alpha: e.alpha, beta: e.beta, gamma: e.gamma });
        return;
      }

      let diffAlpha = e.alpha - initialOrientation.alpha;
      let diffBeta = e.beta - initialOrientation.beta;

      if (diffAlpha > 180) diffAlpha -= 360;
      if (diffAlpha < -180) diffAlpha += 360;
      if (diffBeta > 180) diffBeta -= 360;
      if (diffBeta < -180) diffBeta += 360;

      // Map rotation angles to screen pixels to keep objects locked on the virtual coordinate
      const sensitivity = 6; 
      setOrientationOffset({
        x: diffAlpha * sensitivity,
        y: -diffBeta * sensitivity
      });
    };

    window.addEventListener("deviceorientation", handleOrientation);
    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, [isWallAnchored, arMode, initialOrientation]);

  // Handle Drag on Interactive 3D model
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setRotation(prev => ({
      x: Math.max(-45, Math.min(45, prev.x - dy * 0.5)),
      y: prev.y + dx * 0.5
    }));
    dragStart.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Drag on AR simulation
  const handleArDragStart = (e: React.MouseEvent) => {
    setIsPlacing(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
  };

  const handleArDragMove = (e: React.MouseEvent) => {
    if (!isPlacing) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setObjectPosition(prev => ({
      x: prev.x + dx,
      y: prev.y + dy
    }));
    dragStart.current = { x: e.clientX, y: e.clientY };
  };

  const handleArDragEnd = () => {
    setIsPlacing(false);
  };

  // Generate cultural storytelling using Gemini API route
  const generateAICulturalStory = async (item: CraftItem) => {
    setGeneratingStory(true);
    setStoryError(null);
    try {
      const res = await fetch("/api/gemini/generate-story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          craftName: item.name,
          category: item.category,
          region: item.region,
          material: item.material
        })
      });
      const data = await res.json();
      if (res.ok) {
        setCustomStory(data);
        setActiveTab("story");
      } else {
        throw new Error(data.message || "Gagal menghubungi modul Gemini");
      }
    } catch (err: any) {
      setStoryError(err.message || "Gagal menyulut kisah budaya digital.");
    } finally {
      setGeneratingStory(false);
    }
  };

  // Text-To-Speech Cultural Storyteller
  const speakStory = (text: string) => {
    if (ttsPlaying) {
      window.speechSynthesis.cancel();
      setTtsPlaying(false);
      return;
    }

    const cleanText = text.replace(/[#*`_]/g, "");
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = "id-ID";
    utterance.rate = 0.95;
    utterance.onend = () => setTtsPlaying(false);
    utterance.onerror = () => setTtsPlaying(false);

    setTtsUtterance(utterance);
    setTtsPlaying(true);
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  return (
    <div className="py-6 px-4 max-w-7xl mx-auto" id="gallery_viewport">
      {/* Search and Filters */}
      <div className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold font-sans text-neutral-900 tracking-tight" id="gallery_title">
            Galeri Kerajinan Balla-AR
          </h2>
          <p className="text-neutral-500 text-sm mt-1">
            Jelajahi karya luhur, rasakan penempatan spasial nyata dengan AR, dan selami rahasia budayanya.
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {["Semua", "Bugis (Sengkang)", "Makassar", "Toraja", "Mandar"].map((reg) => (
            <button
              key={reg}
              onClick={() => {
                if (reg === "Semua") {
                  setCrafts(INITIAL_CRAFTS);
                } else {
                  setCrafts(INITIAL_CRAFTS.filter(c => c.region.includes(reg.split(" ")[0])));
                }
              }}
              className="px-4 py-1.5 rounded-full text-xs font-medium bg-white text-neutral-700 border border-neutral-200 shadow-xs hover:border-amber-600 hover:text-amber-700 transition"
              id={`filter_btn_${reg.replace(/\s+/g, '_')}`}
            >
              {reg}
            </button>
          ))}
        </div>
      </div>

      {/* Grid List */}
      {!selectedItem ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" id="crafts_grid">
          {crafts.map((item) => (
            <motion.div
              layoutId={`card_${item.id}`}
              key={item.id}
              className="bg-white rounded-2xl border border-neutral-100 shadow-xs overflow-hidden hover:shadow-md transition duration-300 flex flex-col cursor-pointer"
              onClick={() => {
                setSelectedItem(item);
                setCustomStory(null);
                setArMode("3D");
                setScale(1);
                setRotation({ x: 12, y: -20 });
                recalibrateWallAnchor();
              }}
              id={`craft_card_${item.id}`}
            >
              <div className="relative aspect-square overflow-hidden bg-neutral-50 group">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute top-3 left-3 bg-neutral-900/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wider text-white uppercase">
                  {item.region}
                </div>
                <div className="absolute top-3 right-3 bg-amber-500 text-neutral-900 text-[10px] font-bold px-2 py-0.5 rounded-md">
                  ★ {item.ratings.toFixed(1)}
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">{item.category}</span>
                  <h3 className="font-semibold text-neutral-900 text-sm mt-1 line-clamp-1 group-hover:text-amber-700">
                    {item.name}
                  </h3>
                  <div className="flex gap-1.5 items-center mt-2.5 text-xs text-neutral-500">
                    <User className="w-3.5 h-3.5" />
                    <span>{item.artisanName}</span>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-neutral-50 pt-3">
                  <div>
                    <span className="text-[10px] text-neutral-400 block uppercase">Harga Warisan</span>
                    <span className="text-sm font-bold text-neutral-900">
                      Rp {item.price.toLocaleString("id-ID")}
                    </span>
                  </div>
                  <div className="text-xs text-amber-600 font-semibold flex items-center gap-1">
                    <span>Lihat Detail & AR</span>
                    <Compass className="w-3.5 h-3.5 animate-pulse" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        /* Detailed View Screen */
        <div className="bg-neutral-50 rounded-3xl p-4 md:p-8 border border-neutral-200/60 shadow-lg" id="detail_view">
          <button
            onClick={() => setSelectedItem(null)}
            className="mb-6 inline-flex items-center gap-1.5 text-neutral-500 hover:text-neutral-900 font-semibold text-xs transition"
            id="back_to_gallery_btn"
          >
            ← Kembali ke Galeri
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT COLUMN: INTERACTIVE AR / 3D VIEWER WORKSPACE */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-neutral-100 shadow-xs overflow-hidden flex flex-col h-[520px] relative">
              <div className="p-4 border-b border-neutral-100 flex items-center justify-between z-10 bg-white">
                <div className="flex bg-neutral-100 p-1 rounded-lg">
                  <button
                    onClick={() => setArMode("3D")}
                    className={`flex items-center gap-1 px-4 py-1.5 rounded-md text-xs font-bold transition ${
                      arMode === "3D" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-900"
                    }`}
                    id="tab_view_3d"
                  >
                    <Rotate3d className="w-4 h-4" /> Rotasi 3D
                  </button>
                  <button
                    onClick={() => setArMode("AR")}
                    className={`flex items-center gap-1 px-4 py-1.5 rounded-md text-xs font-bold transition ${
                      arMode === "AR" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-900"
                    }`}
                    id="tab_view_ar"
                  >
                    <Camera className="w-4 h-4" /> Tempatkan di Ruangan (AR)
                  </button>
                </div>

                {/* Display Lighting config for 3D Mode */}
                {arMode === "3D" && (
                  <div className="flex gap-1">
                    {(["studio", "warm", "daylight"] as const).map((lit) => (
                      <button
                        key={lit}
                        onClick={() => setLightSetting(lit)}
                        className={`px-2.5 py-1 rounded text-[10px] font-bold border capitalize transition ${
                          lightSetting === lit 
                            ? "border-amber-600 bg-amber-50 text-amber-700" 
                            : "border-neutral-200 text-neutral-500 hover:bg-neutral-50"
                        }`}
                        id={`light_btn_${lit}`}
                      >
                        {lit}
                      </button>
                    ))}
                  </div>
                )}

                {/* Backdrop controls for AR (if non-camera background is preferred) */}
                {arMode === "AR" && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        if (cameraActive) stopCamera();
                        else startCamera();
                      }}
                      className={`p-1.5 rounded-full border transition ${
                        cameraActive 
                          ? "bg-emerald-50 border-emerald-500 text-emerald-700" 
                          : "border-neutral-200 text-neutral-500 hover:bg-neutral-50"
                      }`}
                      title={cameraActive ? "Matikan Kamera Web" : "Aktifkan Kamera Web"}
                      id="webcam_toggle_btn"
                    >
                      <Smartphone className="w-4 h-4" />
                    </button>
                    {!cameraActive && (
                      <select
                        value={selectedBackdrop}
                        onChange={(e) => setSelectedBackdrop(e.target.value)}
                        className="text-xs border border-neutral-200 focus:border-amber-500 focus:outline-hidden rounded px-2 py-1 bg-white font-medium text-neutral-700"
                        id="backdrop_select"
                      >
                        {backdrops.map(bd => (
                          <option key={bd.id} value={bd.id}>{bd.name}</option>
                        ))}
                      </select>
                    )}
                  </div>
                )}
              </div>

              {/* Viewport Render Area */}
              <div 
                className="flex-1 relative overflow-hidden select-none bg-neutral-950 flex items-center justify-center cursor-grab active:cursor-grabbing"
                onMouseDown={arMode === "3D" ? handleMouseDown : handleArDragStart}
                onMouseMove={arMode === "3D" ? handleMouseMove : handleArDragMove}
                onMouseUp={arMode === "3D" ? handleMouseUp : handleArDragEnd}
                onMouseLeave={arMode === "3D" ? handleMouseUp : handleArDragEnd}
                id="interactive_viewport"
              >
                {/* 3D ROTATION MODE */}
                {arMode === "3D" && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                    {/* Shadow overlay matching lighting setup */}
                    <div className="text-center text-[10px] text-neutral-400 bg-neutral-900/60 backdrop-blur-md px-3 py-1 rounded-full absolute bottom-4 border border-neutral-800 flex items-center gap-1.5 select-none pointer-events-none">
                      <Rotate3d className="w-3 h-3 animate-spin" />
                      <span>Tarik objek dengan mouse/sentuh untuk merotasi benda ke segala sudut</span>
                    </div>

                    {/* Highly Premium rotated CSS container */}
                    <div 
                      className={`relative transition-all duration-300 max-w-[280px] sm:max-w-[340px] aspect-square rounded-2xl flex items-center justify-center overflow-visible`}
                      style={{
                        transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(${scale})`,
                        filter: lightSetting === "warm" 
                          ? "sepia(0.2) saturate(1.2) drop-shadow(0 25px 35px rgba(217, 119, 6, 0.45))" 
                          : lightSetting === "daylight"
                          ? "brightness(1.1) contrast(1.05) drop-shadow(0 25px 35px rgba(0, 0, 0, 0.6))"
                          : "drop-shadow(0 25px 40px rgba(0,0,0,0.5))"
                      }}
                    >
                      <img
                        src={selectedItem.imageUrl}
                        alt={selectedItem.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain pointer-events-none rounded-xl"
                      />
                    </div>
                  </div>
                )}

                {/* AR SIMULATION MODE */}
                {arMode === "AR" && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    {/* Fallback environment backdrop */}
                    <img
                      src={backdrops.find(b => b.id === selectedBackdrop)?.url}
                      alt="Environment Backdrop"
                      className="absolute inset-0 w-full h-full object-cover brightness-[0.85] contrast-[1.05] z-0 transition-transform duration-100 ease-out"
                      style={{
                        transform: `scale(1.25) translate(${cameraPanX}px, ${cameraPanY}px)`
                      }}
                    />

                    {/* Camera real-feed stream that sits on top when active */}
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 z-10`}
                      style={{
                        transform: `scale(1.25) translate(${cameraPanX}px, ${cameraPanY}px)`
                      }}
                    />

                    {/* Drop shadow / Grid surface indicator on environment */}
                    <div className="absolute inset-x-0 bottom-12 h-20 border-t border-dashed border-white/25 bg-radial-gradient from-transparent to-black/10 flex items-center justify-center select-none pointer-events-none z-20">
                      <div className="text-[10px] text-white/50 bg-black/60 px-2 py-1 rounded flex items-center gap-1.5 backdrop-blur-xs">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
                        <span>Bidang vertikal (tembok) terdeteksi & terkalibrasi</span>
                      </div>
                    </div>

                    {/* Interactive Object Layer with physical locking offsets */}
                    <div
                      className="absolute max-w-[170px] sm:max-w-[210px] cursor-move flex flex-col items-center justify-center origin-center transition-all duration-75 z-25"
                      style={{
                        transform: `translate(${objectPosition.x + (isWallAnchored ? cameraPanX + orientationOffset.x : 0)}px, ${objectPosition.y + (isWallAnchored ? cameraPanY + orientationOffset.y : 0)}px) scale(${scale})`,
                        filter: "drop-shadow(0 25px 30px rgba(0, 0, 0, 0.75))"
                      }}
                    >
                      {/* Physical Ruler Overlays which satisfy Problem Statement 1 */}
                      <div className="absolute -top-7 px-2 py-0.5 bg-neutral-900 border border-neutral-700 rounded text-[9px] font-mono text-white flex items-center gap-1 select-none pointer-events-none shadow-md z-40">
                        <span>P: {selectedItem.dimensions_cm.w}cm</span>
                        <span>x</span>
                        <span>T: {selectedItem.dimensions_cm.h}cm</span>
                      </div>
                      
                      <div className="relative group/overlay w-full">
                        {/* Dynamic Wall orientation 3D skew */}
                        <img
                          src={selectedItem.imageUrl}
                          alt={selectedItem.name}
                          referrerPolicy="no-referrer"
                          className="w-full object-contain rounded-lg border-2 border-amber-500/15 transition-all duration-300 pointer-events-none"
                          style={{
                            transform: getWallTransform(),
                            boxShadow: wallSide === "left" 
                              ? "-18px 18px 30px rgba(0,0,0,0.65)" 
                              : wallSide === "right" 
                              ? "18px 18px 30px rgba(0,0,0,0.65)" 
                              : "0 22px 35px rgba(0,0,0,0.6)"
                          }}
                        />

                        {/* Anchored status pin badge */}
                        {isWallAnchored && (
                          <div className="absolute -bottom-2 right-2 bg-emerald-600 border border-neutral-900 text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded shadow-sm opacity-90 pointer-events-none flex items-center gap-1">
                            <Lock className="w-2.5 h-2.5" /> JANGKAR MEMPEL
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Info bar explaining Wall attachment state */}
                    <div className="absolute bottom-4 left-4 bg-black/85 backdrop-blur-md px-3 py-2 rounded-xl text-[9px] text-white/95 max-w-[210px] pointer-events-none select-none border border-neutral-800 z-30 space-y-1">
                      <div className="font-bold flex items-center gap-1 text-amber-400">
                        <Lock className="w-3 h-3" />
                        <span>Kunci Spasial Aktif</span>
                      </div>
                      <p className="text-neutral-300 leading-tight">
                        Ornamen terkunci di dinding asal ({wallSide === "front" ? "Tengah" : wallSide === "left" ? "Kiri" : "Kanan"}). Jika kamera bergeser/goyang, posisinya diatur tetap di sana.
                      </p>
                    </div>

                    {/* Floating Calibration Deck & Joystick for Wall Lock System */}
                    <div className="absolute top-4 right-4 bg-neutral-950/90 border border-neutral-800 backdrop-blur-md p-3.5 rounded-2xl z-30 w-52 flex flex-col gap-2.5 shadow-lg select-auto text-white">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-amber-500 font-extrabold tracking-wider uppercase">Sistem Jangkar AR</span>
                        <button
                          onClick={recalibrateWallAnchor}
                          className="text-[8px] bg-neutral-800 hover:bg-neutral-700 px-1.5 py-0.5 rounded font-bold text-neutral-300 transition"
                          title="Reset center point"
                        >
                          Reset
                        </button>
                      </div>

                      {/* 1. Toggle Lock Anchor */}
                      <button
                        onClick={() => setIsWallAnchored(!isWallAnchored)}
                        className={`w-full py-1.5 px-2.5 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1.5 transition ${
                          isWallAnchored 
                            ? "bg-emerald-600 text-white hover:bg-emerald-700" 
                            : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
                        }`}
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>{isWallAnchored ? "Jangkar Tembok: ON" : "Jangkar Tembok: OFF"}</span>
                      </button>

                      {/* 2. Choose Wall Perspective Plane */}
                      <div className="space-y-1">
                        <span className="text-[8px] text-neutral-400 font-bold block">Sisi Tempel Tempel Dinding:</span>
                        <div className="grid grid-cols-3 gap-1">
                          {(["left", "front", "right"] as const).map((side) => (
                            <button
                              key={side}
                              onClick={() => setWallSide(side)}
                              className={`py-1 rounded text-[8px] font-extrabold capitalize border transition ${
                                wallSide === side
                                  ? "bg-amber-500 border-amber-500 text-neutral-950"
                                  : "border-neutral-800 text-neutral-400 hover:bg-neutral-900"
                              }`}
                            >
                              {side === "left" ? "Kiri 🧱" : side === "right" ? "Kanan 🧱" : "Tengah 🧱"}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* 3. Simulate camera panning movement */}
                      <div className="space-y-1 border-t border-neutral-800/60 pt-2 text-[8px]">
                        <div className="flex justify-between text-neutral-400">
                          <span className="font-bold">Uji Kamera Geser (Simulasi):</span>
                          <span className="font-mono">{cameraPanX}px</span>
                        </div>
                        <input
                          type="range"
                          min="-120"
                          max="120"
                          step="5"
                          value={cameraPanX}
                          onChange={(e) => setCameraPanX(p => parseInt(e.target.value))}
                          className="w-full accent-amber-500 text-amber-500 bg-neutral-800 h-1.5 rounded-lg cursor-pointer"
                        />
                        <p className="text-[7px] text-neutral-500 leading-none italic mt-0.5">
                          Geser slider ini untuk mengerakkan kamera. Objek akan tetap mengunci di titik tembok.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Workspace Dimension Control (Scale) */}
                <div className="absolute left-4 bottom-4 bg-neutral-900/90 border border-neutral-800 backdrop-blur-md p-3 rounded-xl z-25 flex flex-col gap-1 w-44">
                  <span className="text-[10px] text-neutral-400 font-bold tracking-wider uppercase">Penskalaan Realistis</span>
                  <div className="flex items-center justify-between mt-1 gap-2.5">
                    <span className="text-[9px] text-white">Scale: {(scale * 100).toFixed(0)}%</span>
                    <input
                      type="range"
                      min="0.4"
                      max="1.8"
                      step="0.05"
                      value={scale}
                      onChange={(e) => setScale(parseFloat(e.target.value))}
                      className="w-full accent-amber-500 text-amber-500 bg-neutral-700 h-1.5 rounded-lg opacity-80 cursor-pointer"
                      id="dimension_scale_slider"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: INFORMATION, STORYTELLING, AI POWER AND E-COMMERCE CONFLICT */}
            <div className="lg:col-span-5 flex flex-col h-[520px] bg-white rounded-2xl border border-neutral-100 shadow-xs p-6 overflow-y-auto">
              <div>
                <span className="text-xs font-extrabold text-amber-700 uppercase tracking-widest">{selectedItem.category}</span>
                <h1 className="text-2xl font-bold font-sans text-neutral-900 tracking-tight mt-1">
                  {selectedItem.name}
                </h1>
                <div className="flex items-center gap-2.5 mt-2">
                  <span className="bg-amber-50 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-md border border-amber-200">
                    {selectedItem.region} Origin
                  </span>
                  <span className="text-xs text-neutral-500 font-medium">★ {selectedItem.ratings} Rating Konsumen</span>
                </div>
              </div>

              {/* Story Tab / Artisan / Specs Toggle Navigation */}
              <div className="flex border-b border-neutral-100 my-5 gap-4">
                <button
                  onClick={() => setActiveTab("story")}
                  className={`pb-2.5 font-bold text-xs border-b-2 transition ${
                    activeTab === "story" ? "border-amber-600 text-neutral-900" : "border-transparent text-neutral-400 hover:text-neutral-700"
                  }`}
                  id="tab_cultural_narrative"
                >
                  Filosofi & Kisah Budaya
                </button>
                <button
                  onClick={() => setActiveTab("artisan")}
                  className={`pb-2.5 font-bold text-xs border-b-2 transition ${
                    activeTab === "artisan" ? "border-amber-600 text-neutral-900" : "border-transparent text-neutral-400 hover:text-neutral-700"
                  }`}
                  id="tab_artisan_details"
                >
                  Profil Pengrajin
                </button>
                <button
                  onClick={() => setActiveTab("specs")}
                  className={`pb-2.5 font-bold text-xs border-b-2 transition ${
                    activeTab === "specs" ? "border-amber-600 text-neutral-900" : "border-transparent text-neutral-400 hover:text-neutral-700"
                  }`}
                  id="tab_product_specs"
                >
                  Spesifikasi Spasial
                </button>
              </div>

              {/* TAB CONTENT SPACES */}
              <div className="flex-1 overflow-y-auto pr-1">
                {activeTab === "story" && (
                  <div className="space-y-4 text-xs text-neutral-700 leading-relaxed" id="story_tab_content">
                    {/* Cultivated Story Display */}
                    {customStory ? (
                      <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/60 p-4 rounded-xl space-y-3.5 relative shadow-xs">
                        <div className="flex items-center justify-between">
                          <span className="bg-amber-500 font-bold text-white text-[8px] tracking-wider uppercase px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
                            <Sparkles className="w-2.5 h-2.5" /> REGENERASI CERITA GEMINI AI
                          </span>
                          <button
                            onClick={() => {
                              const speakText = `Judul: ${customStory.title}. Filosofi: ${customStory.philosophy}. Kisah Budaya: ${customStory.story}`;
                              speakStory(speakText);
                            }}
                            className={`p-1.5 rounded-full border flex items-center gap-1 transition ${
                              ttsPlaying 
                                ? "bg-red-50 text-red-600 border-red-200" 
                                : "bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50"
                            }`}
                            id="tts_speak_ai_story"
                            title="Narasikan Teks Audio Alami"
                          >
                            <Volume2 className="w-3 h-3" />
                            <span>{ttsPlaying ? "Berhenti" : "Dengarkan"}</span>
                          </button>
                        </div>
                        <div>
                          <h4 className="font-bold text-neutral-900 text-sm">{customStory.title}</h4>
                          <p className="mt-1 pb-2 border-b border-amber-200/30 text-neutral-600 italic">"{customStory.philosophy}"</p>
                        </div>
                        <div>
                          <span className="font-bold text-neutral-800 text-[10px] uppercase block mb-1">Motif Warisan Teridentifikasi:</span>
                          <div className="flex gap-1.5 flex-wrap">
                            {customStory.motifs.map((mot: string, idx: number) => (
                              <span key={idx} className="bg-white px-2 py-0.5 rounded-md text-[9px] text-neutral-600 border border-amber-200">{mot}</span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <span className="font-bold text-neutral-800 text-[10px] uppercase block mb-1">Kisah Epik AI:</span>
                          <p className="text-neutral-700 leading-relaxed font-sans">{customStory.story}</p>
                        </div>
                        <div className="text-[10px] text-neutral-500 pt-2 border-t border-amber-200/30">
                          {customStory.artisanNotes}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {/* Audio Narrator for default story */}
                        <div className="flex justify-between items-center bg-neutral-50 p-2.5 rounded-lg border border-neutral-200/40">
                          <span className="text-[10px] font-bold text-neutral-500">Narasikan cerita pusaka kerajinan asli ini:</span>
                          <button
                            onClick={() => speakStory(selectedItem.story)}
                            className={`px-3 py-1 rounded-md text-[10px] font-bold border flex items-center gap-1 transition ${
                              ttsPlaying 
                                ? "bg-red-50 text-red-600 border-red-200" 
                                : "bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50"
                            }`}
                            id="tts_speak_default_story"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                            {ttsPlaying ? "Berhenti" : "Narasikan"}
                          </button>
                        </div>

                        <div>
                          <strong className="text-neutral-900 font-bold block mb-1 uppercase text-[10px] tracking-wider text-amber-700">Filosofi Kehidupan:</strong>
                          <p>{selectedItem.philosophy}</p>
                        </div>

                        <div className="py-2.5 border-y border-neutral-100">
                          <strong className="text-neutral-900 font-bold block mb-1.5 uppercase text-[10px] tracking-wider text-amber-700">Ragam Hias Motif Tradisional:</strong>
                          <ul className="grid grid-cols-1 gap-2">
                            {selectedItem.motifs.map((motif, i) => (
                              <li key={i} className="bg-neutral-50 p-2 rounded-lg border border-neutral-100 flex items-start gap-1.5 text-[11px] text-neutral-800">
                                <span className="text-amber-500 mt-0.5">•</span>
                                <span>{motif}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <strong className="text-neutral-900 font-bold block mb-1 uppercase text-[10px] tracking-wider text-amber-700">Kisah di Balik Karya:</strong>
                          <p>{selectedItem.story}</p>
                        </div>
                      </div>
                    )}

                    {/* Gemini Generative Tool satisfying Problem statement 2 */}
                    <div className="mt-6 bg-gradient-to-r from-neutral-900 to-indigo-950 text-white rounded-xl p-4 border border-neutral-800">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <h5 className="font-bold text-xs">Penjaga Warisan - Gemini AI Storyteller</h5>
                      </div>
                      <p className="text-[10px] text-neutral-300 mt-1 lines-clamp-2">
                        Gunakan kecerdasan buatan Gemini untuk menggali, merekonstruksi, dan menulis cerita budaya baru berdasarkan teknik tempaan dan tenunan adat.
                      </p>
                      
                      <button
                        onClick={() => generateAICulturalStory(selectedItem)}
                        disabled={generatingStory}
                        className="mt-3.5 w-full bg-amber-500 text-neutral-900 text-[10px] font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-1 hover:bg-amber-400 cursor-pointer disabled:opacity-50 transition"
                        id="generate_curator_copy_btn"
                      >
                        {generatingStory ? (
                          <span className="flex items-center gap-1.5">
                            <span className="w-3 h-3 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin"></span>
                            Menganyam Kata Budaya dengan Gemini AI...
                          </span>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5" />
                            Aktivasi Cerita Budaya Gemini AI {geminiConfigured ? "" : "(Kunci Mock Active)"}
                          </>
                        )}
                      </button>
                      {storyError && <p className="text-[10px] text-red-300 mt-2">{storyError}</p>}
                    </div>
                  </div>
                )}

                {activeTab === "artisan" && (
                  <div className="space-y-4 text-xs text-neutral-700" id="artisan_tab_content">
                    <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-100 flex items-start gap-4">
                      <div className="bg-amber-500 text-white rounded-2xl w-12 h-12 flex items-center justify-center font-bold text-xl uppercase tracking-wider flex-shrink-0">
                        {selectedItem.artisanName[0]}
                      </div>
                      <div>
                        <h4 className="font-bold text-neutral-900 text-sm">{selectedItem.artisanName}</h4>
                        <p className="text-neutral-500 font-medium">Maestro Kulit Kriya & Pengrajin Tradisional</p>
                        <div className="flex items-center gap-1 mt-1 text-neutral-400 text-[10px]">
                          <MapPin className="w-3 h-3" />
                          <span>{selectedItem.region}, Sulawesi Selatan</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h5 className="font-bold text-neutral-800 text-[10px] uppercase tracking-wider">Catatan Dedikasi Pengrajin:</h5>
                      <p className="leading-relaxed leading-6">{selectedItem.artisanNotes}</p>
                      
                      <div className="border border-neutral-150 p-4 rounded-xl flex items-center justify-between text-[11px] bg-neutral-50">
                        <div>
                          <strong>Metodologi Produksi:</strong>
                          <p className="text-neutral-500 text-[10px] mt-0.5">100% Buatan Tangan / Atbm tradisional</p>
                        </div>
                        <span className="bg-emerald-100 border border-emerald-300 text-emerald-800 text-[9px] font-bold px-2 py-0.5 rounded">Identitas Budaya Terverifikasi</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "specs" && (
                  <div className="space-y-3 text-xs text-neutral-700" id="specs_tab_content">
                    <h5 className="font-bold text-neutral-800 text-[10px] uppercase tracking-wider mb-2">Metadata Fisik & Penskalaan AR:</h5>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-100">
                        <span className="text-neutral-400 text-[9px] block">Massa & Dimensi</span>
                        <strong className="text-neutral-800 font-semibold">{selectedItem.dimensions}</strong>
                      </div>
                      <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-100">
                        <span className="text-neutral-400 text-[9px] block">Bahan Baku Utama</span>
                        <strong className="text-neutral-800 font-semibold">{selectedItem.material.split("(")[0]}</strong>
                      </div>
                      <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-100">
                        <span className="text-neutral-400 text-[9px] block">Lebar Target (Untuk AR)</span>
                        <strong className="text-neutral-800 font-semibold">{selectedItem.dimensions_cm.w} CM</strong>
                      </div>
                      <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-100">
                        <span className="text-neutral-400 text-[9px] block">Tinggi Target (Untuk AR)</span>
                        <strong className="text-neutral-800 font-semibold">{selectedItem.dimensions_cm.h} CM</strong>
                      </div>
                    </div>

                    <div className="border border-amber-100 bg-amber-50/50 p-4 rounded-xl flex gap-3 text-[11px] leading-relaxed text-amber-900 mt-4">
                      <Info className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <strong>Akurasi Kalibrasi Spasial 3D:</strong>
                        <p className="text-[10px] text-amber-800 mt-0.5">
                          Melalui pendaftaran grid ARCore, dimensi centimeter di atas direfleksikan secara presisi pada lensa kamera smartphone / browser Anda dengan toleransi kekeliruan di bawah 0.5 cm.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* BUY & CHECKOUT CTA AND LOCK SYSTEM */}
              <div className="border-t border-neutral-150 pt-5 mt-5 flex items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] text-neutral-400 uppercase tracking-widest block">Harga Penawaran</span>
                  <span className="text-2xl font-bold text-neutral-900 font-sans">
                    Rp {selectedItem.price.toLocaleString("id-ID")}
                  </span>
                </div>

                <button
                  onClick={() => {
                    if (onAddToCart) onAddToCart(selectedItem);
                    alert(`[Mock E-Commerce] ${selectedItem.name} ditambahkan ke keranjang pembelian. Menghubungkan ke gateway pembayaran partner Balla-AR.`);
                  }}
                  className="flex-1 max-w-[220px] bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition cursor-pointer shadow-md shadow-amber-600/10"
                  id="checkout_cta_btn"
                >
                  <ShoppingBag className="w-4.5 h-4.5" />
                  <span>Beli via Balla-AR</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
