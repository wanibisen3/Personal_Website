import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { createServer as createViteServer } from "vite";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { z } from "zod";
import { cvData } from "./src/data/cvData.ts";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Trust proxy for rate limiting behind AI Studio infrastructure
  app.set("trust proxy", 1);

  // Security Middlewares
  app.use(helmet({
    contentSecurityPolicy: false, // Disable for Vite dev
  }));
  app.use(cors());
  app.use(express.json());

  // Rate Limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  });
  app.use("/api/", limiter);

  // --- API Routes ---

  // Helper for Supabase
  const getSupabase = () => {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_ANON_KEY;
    if (!url || !key) {
      console.warn("Supabase credentials missing. Database features will be disabled.");
      return null;
    }
    return createClient(url, key);
  };

  // Helper for Resend
  const getResend = () => {
    const key = process.env.RESEND_API_KEY;
    if (!key) {
      console.warn("Resend API key missing. Email features will be disabled.");
      return null;
    }
    return new Resend(key);
  };

  // 1. Experience Data
  app.get("/api/experience", (req, res) => {
    res.json(cvData.experience);
  });

  // 2. Projects Data
  app.get("/api/projects", (req, res) => {
    res.json(cvData.projects);
  });

  // 3. Product OS Data
  app.get("/api/product-os", (req, res) => {
    res.json(cvData.productOS);
  });

  // 4. Contact Form Submission
  const contactSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    subject: z.string().optional(),
    message: z.string().min(10),
  });

  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = contactSchema.parse(req.body);
      const supabase = getSupabase();
      const resend = getResend();

      // A. Save to Supabase
      if (supabase) {
        const { error: dbError } = await supabase
          .from("contact_submissions")
          .insert([validatedData]);
        if (dbError) console.error("Supabase Error:", dbError);
      } else {
        console.warn("Skipping database save: Supabase not configured.");
      }

      // B. Send Email via Resend
      if (resend) {
        await resend.emails.send({
          from: "Portfolio <onboarding@resend.dev>",
          to: process.env.CONTACT_EMAIL_RECIPIENT || "wanibisen3@gmail.com",
          subject: `New Contact Form: ${validatedData.subject || "No Subject"}`,
          html: `
            <h3>New Message from ${validatedData.name}</h3>
            <p><strong>Email:</strong> ${validatedData.email}</p>
            <p><strong>Message:</strong></p>
            <p>${validatedData.message}</p>
          `,
        });
      } else {
        console.warn("Skipping email: Resend not configured.");
      }

      res.status(200).json({ success: true, message: "Message processed." });
    } catch (error) {
      console.error("Contact Error:", error);
      res.status(400).json({ success: false, error: "Failed to send message." });
    }
  });

  // --- Vite / Frontend Integration ---

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch(console.error);
