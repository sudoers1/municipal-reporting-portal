"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { insertFeedbackwIMG } from "@/lib/db/feedback";
import { Feedback } from "@/lib/structures/feedback";

async function uploadHandler(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "bloobase4");

  try {
    const response = await fetch(
      "https://api.cloudinary.com/v1_1/dncfvewe2/image/upload",
      { method: "POST", body: formData }
    );
    const data = await response.json();
    console.log("Image uploaded:", data);
    return data;
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
}

export default function FeedbackModal({ 
  onClose, 
  uid = "", 
  cid = "" 
}: { 
  uid: string; 
  cid: string; 
  onClose: () => void; 
}) {
  const [form, setForm] = useState({
    uid: uid,
    cid: cid,
    details: "",
    photo: null as File | null,
    rating: 0,
    name: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadSession() {
      const session = await authClient.getSession();
      if (session?.data?.user) {
        setForm((prev) => ({ 
          ...prev, 
          uid: session.data!.user.id,
          name: session.data!.user.name
        }));
      }
    }
    loadSession();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    try {

      if (!form.photo) {
        toast.error("An image needs to be uploaded");
        setIsSubmitting(false);
        return;
      }

  
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      if (form.photo.size > 5_000_000) {
        toast.error("File too large (max 5MB)");
        setIsSubmitting(false);
        return;
      }

      if (!allowedTypes.includes(form.photo.type)) {
        toast.error("Only JPG, PNG, or WEBP images allowed");
        setIsSubmitting(false);
        return;
      }
      const uploaded = await uploadHandler(form.photo);
      
      if (!uploaded?.url) {
        toast.error("Failed to upload image. Try again later.");
        setIsSubmitting(false);
        return;
      }
      const feedback = new Feedback(
        0, 
        form.uid,
        parseInt(form.cid),
        form.details,
        uploaded.url,
        new Date(),
        form.rating,
        form.name
      );

      const validationError = feedback.validateForInsert();
      if (validationError) {
        toast.error(validationError);
        setIsSubmitting(false);
        return;
      }

      await insertFeedbackwIMG(
        feedback.getUserId(),
        form.cid,
        feedback.getDetails(),
        feedback.getImage(),
        feedback.getRating()
      );

      toast.success("Feedback submitted successfully.");
      setForm({
        uid: uid,
        cid: cid,
        details: "",
        photo: null,
        rating: 0,
        name: form.name
      });
      onClose();
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Failed to submit feedback. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="fixed inset-0 flex items-center justify-center z-50" onClick={onClose}>
      <section 
        className="bg-white/60 backdrop-blur-md rounded-2xl shadow-lg w-full max-w-lg p-8 relative" 
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-black text-2xl font-bold"
        >
          ×
        </button>

        <header>
          <h2 className="text-2xl font-bold text-center text-black mb-6">
            Feedback for Report #{form.cid}
          </h2>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          <fieldset>
            <label className="block font-semibold mb-2 text-black">
              Description
            </label>
            <textarea
              value={form.details}
              onChange={(e) => setForm({ ...form, details: e.target.value })}
              className="w-full bg-white border rounded-xl px-4 py-3 text-black focus:ring-2 focus:ring-brand-accent focus:outline-none"
              rows={4}
              required
              placeholder="Describe your experience..."
            />
          </fieldset>

          <fieldset>
            <label className="block font-semibold mb-2 text-black">
              Upload Photo
            </label>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={(e) => setForm({ ...form, photo: e.target.files?.[0] || null })}
              className="w-full bg-white border rounded-xl px-4 py-3 text-black focus:ring-2 focus:ring-brand-accent focus:outline-none"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Max size: 5MB. Allowed: JPG, PNG, WEBP
            </p>
          </fieldset>

          <fieldset>
            <label className="block font-semibold mb-2 text-black">
              Satisfaction Rating
            </label>

            <section className="flex gap-2 justify-center">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setForm({ ...form, rating: value })}
                  className={`w-12 h-12 rounded-full border text-lg font-bold transition-colors text-black border-brand-accent
                    ${form.rating >= value ? "bg-brand-accent" : "bg-white"}`}
                >
                  {value}
                </button>
              ))}
            </section>
          </fieldset>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-brand-primary text-white font-semibold py-3 rounded-xl shadow-md 
              hover:bg-brand-accent hover:text-black transition-colors duration-300
              ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isSubmitting ? "Submitting..." : "Submit Feedback"}
          </button>
        </form>
      </section>
    </section>
  );
}