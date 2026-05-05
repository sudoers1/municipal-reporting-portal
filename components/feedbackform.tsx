"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { insertFeedbackwIMG } from "@/lib/db/feedback";

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

export default function FeedbackModal({ onClose, uid="",cid="" }: { uid:string; cid:string; onClose: () => void; }) {
  const [form, setForm] = useState({
    uid: uid,
    cid: cid,
    details: "",
    photo: null as File | null,
    
  });

  useEffect(() => {
    async function loadSession() {
      const session = await authClient.getSession();
      if (session?.data?.user?.id) {
        setForm((prev) => ({ ...prev, created_by: session.data!.user.id }));
      }
    }
    loadSession();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!form.uid) {
      toast.error("Session not loaded yet, please try again.");
      return;
    }
   
    if (form.photo)
    {   
        if (form.photo.size > 5_000_000) {
            
            toast("ERROR:File too large (max 5MB)");
            return;
        }

        if (!allowedTypes.includes(form.photo.type)) {
            toast("ERROR: Only JPG, PNG, or WEBP images allowed");
            return;
        }

            try 
            {
                let uploaded:string ="";
                uploaded = await uploadHandler(form.photo);
                if (uploaded!="")
                {
                    await insertFeedbackwIMG(
                        form.uid,
                        form.cid,
                        form.details,
                        uploaded
                    );
                }
                else
                {
                    toast("ERROR: Failed to Upload. Try again Later");
                     return;
                }
      

                toast.success("Feedback submitted successfully.");
                setForm({uid:uid, cid: cid, details: "", photo: null});
                onClose();
            } 
            catch (error) {
                console.error("Submission error:", error);
                console.log(form);
                toast.error("Failed to submit feedback. Please try again later.");
            }
    }
    else
    {
        toast.error("An image needs to be uploaded");
        return;
    }

    


  }

  return (
    <section className="fixed inset-0  flex items-center justify-center z-50">
      <section className="bg-white/60 backdrop-blur-md rounded-2xl shadow-lg w-full max-w-lg p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-black text-2xl font-bold"
        >
          ×
        </button>

        <header>
          <h2 className="text-2xl font-bold text-center text-black mb-6">
            Feedback
          </h2>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <fieldset>
            <label className="block font-semibold mb-2 text-black">Description</label>
            <textarea
              value={form.details}
              onChange={(e) => setForm({ ...form, details: e.target.value })}
              className="w-full bg-white border rounded-xl px-4 py-3 text-black focus:ring-2 focus:ring-brand-accent focus:outline-none"
              rows={4}
              required
            />
          </fieldset>

          <fieldset>
            <label className="block font-semibold mb-2 text-black">Upload Photo</label>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={(e) => setForm({ ...form, photo: e.target.files?.[0] || null })}
              className="w-full bg-white border rounded-xl px-4 py-3 text-black focus:ring-2 focus:ring-brand-accent focus:outline-none"
            />
          </fieldset>


          <button
            type="submit"
            className="w-full bg-brand-primary text-white font-semibold py-3 rounded-xl shadow-md hover:bg-brand-accent hover:text-black transition-colors duration-300"
          >
            Submit Feedback
          </button>
        </form>
      </section>
    </section>
  );
}