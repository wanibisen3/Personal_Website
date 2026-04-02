import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { z } from "zod";
import { cvData } from "../src/data/cvData.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.set("trust proxy", 1);
app.use(helmet({
  contentSecurityPolicy: false,
}));
app.use(cors());
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use("/api/", limiter);

const getSupabase = () => {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  if (!url || !key) {
    console.warn("Supabase credentials missing. Database features will be disabled.");
    return null;
  }
  return createClient(url, key);
};

const getResend = () => {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.warn("Resend API key missing. Email features will be disabled.");
    return null;
  }
  return new Resend(key);
};

app.get("/api/experience", (req, res) => {
  res.json(cvData.experience);
});

app.get("/api/projects", (req, res) => {
  res.json(cvData.projects);
});

app.get("/api/product-os", (req, res) => {
  res.json(cvData.productOS);
});

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

    if (supabase) {
      const { error: dbError } = await supabase
        .from("contact_submissions")
        .insert([validatedData]);
      if (dbError) console.error("Supabase Error:", dbError);
    } else {
      console.warn("Skipping database save: Supabase not configured.");
    }

    if (resend) {
      const emailResult = await resend.emails.send({
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
      if (emailResult.error) {
        console.error("Resend API rejected the email:", emailResult.error);
        return res.status(500).json({ 
          success: false, 
          error: "Email delivery failed: Resend restrictions likely blocked the recipient email."
        });
      }
    } else {
      console.warn("Skipping email: Resend not configured.");
      return res.status(500).json({ success: false, error: "Server Error: RESEND_API_KEY is not configured on Vercel." });
    }

    res.status(200).json({ success: true, message: "Message processed." });
  } catch (error: any) {
    console.error("Contact Error:", error);
    res.status(400).json({ success: false, error: "Failed to send message: " + (error?.message || String(error)) });
  }
});

export default app;
