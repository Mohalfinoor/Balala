import app from "./api/index";
import path from "path";
import { createServer as createViteServer } from "vite";

const PORT = 3000;

// Serve frontend with Vite in development and static in production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(expressStaticFallback(distPath));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Balla-AR Core] Server berjalan lancar di http://localhost:${PORT}`);
  });
}

// Simple fallback helper helper
import express from "express";
function expressStaticFallback(distPath: string) {
  const router = express.Router();
  router.use(express.static(distPath));
  router.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
  return router;
}

startServer();
