import express from "express";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json({ limit: "10mb" }));

// Lazy initializer for Gemini to prevent startup crash if API key is not set
let aiInstance: GoogleGenAI | null = null;

function getGeminiAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    throw new Error(
      "GEMINI_API_KEY belum dikonfigurasi. Harap masukkan kunci API Gemini Anda."
    );
  }
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiInstance;
}

// REST API Endpoints

// 1. Get status and check key availability
app.get("/api/status", (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  const isConfigured = !!apiKey && apiKey !== "MY_GEMINI_API_KEY";
  res.json({
    status: "ok",
    geminiConfigured: isConfigured,
    message: isConfigured 
      ? "Sistem Balla-AR siap dengan integrasi Gemini AI." 
      : "Gemini AI belum aktif. Beberapa fitur pembuatan cerita AI dan konversi 3D akan dijalankan dalam mode simulasi. Konfigurasikan API Key di host Anda untuk mengaktifkan fungsionalitas penuh."
  });
});

// 2. Generate custom cultural storytelling using Gemini AI
app.post("/api/gemini/generate-story", async (req, res) => {
  try {
    const { craftName, category, region, material } = req.body;
    
    if (!craftName) {
      return res.status(400).json({ error: "Nama kerajinan wajib diisi" });
    }

    let ai;
    try {
      ai = getGeminiAI();
    } catch (err: any) {
      // Fallback response with beautiful mock data if no API Key is set, so the app remains fully functional!
      console.warn("Using fallback story simulation due to missing Gemini Key");
      return res.json({
        isMock: true,
        title: `Filosofi Keagungan ${craftName}`,
        philosophy: `Mewakili kearifan lokal masyarakat ${region || 'Sulawesi Selatan'}, melambangkan hubungan harmonis antara manusia, alam semesta, dan sang pencipta. Dibuat menggunakan bahan berkualitas tinggi seperti ${material || 'sutera alam / kayu pilihan'}.`,
        motifs: [
          `Motif Pajjele' (Kerapian)`,
          `Motif Bunga Patola (Keindahan Abadi)`,
          `Suku Bunga ${region || 'Sulsel'} (Identitas Luhur)`
        ],
        story: `Kerajinan "${craftName}" bukan sekadar produk fungsional, melainkan lembaran sejarah yang ditenun atau dipahat dengan penuh dedikasi oleh pengrajin dari tanah ${region || 'Sulawesi Selatan'}. Teknik pembuatannya diwariskan secara lisan dari generasi ke generasi, menyimpan bisikan doa dan doa kebaikan. Menggunakan ${material || 'bahan alami'}, setiap garisnya melambangkan kekuatan karakter, ketekunan, dan cinta yang mendalam terhadap pelestarian warisan leluhur. Ketika Anda membawa pulang karya ini, Anda tidak hanya memiliki kerajinan fisik, melainkan sepotong jiwa dan warisan kebudayaan Nusantara yang abadi.`,
        artisanNotes: `Pengrajin lokal di ${region || 'Sulawesi Selatan'} mendedikasikan waktu hingga berminggu-minggu demi menghasilkan karya yang presisi. Balla-AR berkomitmen mendistribusikan hasil karya mereka secara transparan sekaligus mendokumentasikan nilai budayanya secara digital.`
      });
    }

    const prompt = `Buatlah naskah storytelling budaya mendalam untuk produk kerajinan berikut:
    Nama Produk: ${craftName}
    Kategori Budaya: ${category || "Kerajinan Sulsel"}
    Wilayah Asal: ${region || "Sulawesi Selatan, Indonesia"}
    Bahan Utama: ${material || "Bahan tradisional premium"}
    
    Tugas Anda adalah memproduksi output JSON dengan detail cerita budaya yang memikat, puitis, namun relevan untuk diposting di e-commerce Balla-AR, guna meningkatkan apresiasi pembeli.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "Anda adalah kurator budaya ahli dari Sulawesi Selatan (Bugis, Makassar, Toraja, Mandar) yang dipekerjakan oleh platform Balla-AR. Tanggapan Anda KHUSUS dalam bahasa Indonesia, berbobot puitis, mendalam, kaya nilai sejarah, dan wajib berformat JSON sesuai dengan schema yang ditentukan.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { 
              type: Type.STRING, 
              description: "Judul puitis nan memikat untuk storytelling kerajinan ini" 
            },
            philosophy: { 
              type: Type.STRING, 
              description: "Makna filosofis dari motif, bahan, atau teknik pembuatan yang digunakan dalam produk ini secara ringkas (1-2 paragraf)" 
            },
            motifs: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Daftar motif atau corak khas yang terdapat pada kerajinan ini (minimal 2-3 motif khas)"
            },
            story: { 
              type: Type.STRING, 
              description: "Cerita narasi utama yang mengharukan, estetis, menceritakan asal-usul, emosi pengrajin, dan pentingnya melestarikan karya ini (3-4 paragraf)" 
            },
            artisanNotes: { 
              type: Type.STRING, 
              description: "Catatan dari kurator mengenai dedikasi pengrajin lokal dan bantuan teknologi Balla-AR dalam melestarikannya" 
            }
          },
          required: ["title", "philosophy", "motifs", "story", "artisanNotes"]
        }
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("Tanggapan dari AI kosong.");
    }

    const data = JSON.parse(resultText.trim());
    res.json({ ...data, isMock: false });

  } catch (error: any) {
    console.error("Gemini Error:", error);
    res.status(500).json({ 
      error: "Gagal membuat cerita budaya otomatis", 
      message: error.message 
    });
  }
});

// 3. AI-assisted Photo-to-3D simulation
app.post("/api/gemini/convert-3d", async (req, res) => {
  try {
    const { craftName, imagesCount, region } = req.body;
    
    // Simulate photo analysis and generate custom 3D model properties using Gemini
    let ai;
    try {
      ai = getGeminiAI();
    } catch (err) {
      // Fallback
      return res.json({
        success: true,
        isMock: true,
        modelName: `3d_model_${craftName.toLowerCase().replace(/\s+/g, '_')}.glb`,
        vertices: 64201,
        polygons: 128400,
        textureResolution: "4096 x 4096 px (UHD)",
        estimatedProcessingTimeMs: 4500,
        nerfConfidenceScore: 98.4,
        culturalSignatureDetected: `Pola khas ${region || 'Sulawesi Selatan'} diidentifikasi secara akurat`,
        meshQuality: "Ultra High-Definition",
        fileSizeMb: 14.2
      });
    }

    const prompt = `Analisis file rendering 3D untuk kerajinan: ${craftName}. 
    Berikan statistik 3D sintetis yang realistis untuk model 3D hasil rekonstruksi NeRF (Neural Radiance Fields) dari ${imagesCount || 8} foto yang diunggah. 
    Kembalikan JSON spesifikasi teknis model 3D ini.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "Anda adalah asisten teknis AI Balla-AR yang menghitung metadata teknis rekonstruksi 3D objek menggunakan algoritma NeRF.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            modelName: { type: Type.STRING },
            vertices: { type: Type.INTEGER },
            polygons: { type: Type.INTEGER },
            textureResolution: { type: Type.STRING },
            nerfConfidenceScore: { type: Type.NUMBER },
            culturalSignatureDetected: { type: Type.STRING },
            fileSizeMb: { type: Type.NUMBER },
            meshQuality: { type: Type.STRING }
          },
          required: ["modelName", "vertices", "polygons", "textureResolution", "nerfConfidenceScore", "culturalSignatureDetected", "fileSizeMb", "meshQuality"]
        }
      }
    });

    const data = JSON.parse(response.text.trim());
    res.json({ ...data, success: true, isMock: false });

  } catch (error: any) {
    console.error("3D pipeline simulation error:", error);
    res.status(500).json({ error: "Gagal memproses model 3D", message: error.message });
  }
});

export default app;
