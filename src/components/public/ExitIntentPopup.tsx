"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, Mail } from "lucide-react";

export default function ExitIntentPopup() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success">("idle");

  useEffect(() => {
    // Only show once per session
    if (sessionStorage.getItem("exitPopupShown")) return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 5) {
        setShow(true);
        sessionStorage.setItem("exitPopupShown", "1");
        document.removeEventListener("mouseleave", handleMouseLeave);
      }
    };

    // Small delay before activating
    const timer = setTimeout(() => {
      document.addEventListener("mouseleave", handleMouseLeave);
    }, 3000);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      await fetch("/api/subscribers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "EXIT_POPUP" }),
      });
      setStatus("success");
    } catch {
      setStatus("success"); // Close gracefully
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 hidden lg:flex"
          onClick={() => setShow(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="card-glass max-w-md w-full p-8 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShow(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>

            {status === "success" ? (
              <div className="text-center py-4">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Download size={28} className="text-green-400" />
                </div>
                <h3 className="text-white font-bold text-xl mb-2">Thank you!</h3>
                <p className="text-white/60 text-sm">
                  We&apos;ll send you our portfolio shortly.
                </p>
              </div>
            ) : (
              <>
                <div className="w-12 h-12 mb-4 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 flex items-center justify-center">
                  <Download size={22} className="text-blue-400" />
                </div>
                <h3 className="text-white font-bold text-2xl mb-2">
                  Download Our Portfolio
                </h3>
                <p className="text-white/60 text-sm mb-6">
                  Get our latest project showcase with pricing information.
                  Free, no spam, unsubscribe anytime.
                </p>

                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-3 text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 text-sm"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={status === "sending"}
                      className="btn-gradient px-4 py-3 whitespace-nowrap text-sm shrink-0 disabled:opacity-60"
                    >
                      {status === "sending" ? "..." : "Get it free"}
                    </button>
                  </div>
                  <p className="text-white/30 text-xs text-center">
                    No spam. Unsubscribe anytime.
                  </p>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
