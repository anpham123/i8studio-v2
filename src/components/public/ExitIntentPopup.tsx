"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, Mail, ArrowRight } from "lucide-react";

export default function ExitIntentPopup() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success">("idle");

  useEffect(() => {
    if (sessionStorage.getItem("exitPopupShown")) return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 5) {
        setShow(true);
        sessionStorage.setItem("exitPopupShown", "1");
        document.removeEventListener("mouseleave", handleMouseLeave);
      }
    };

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
      setStatus("success");
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] bg-white/40 backdrop-blur-sm flex items-center justify-center p-4 hidden lg:flex"
          onClick={() => setShow(false)}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="max-w-md w-full bg-white rounded-2xl shadow-2xl shadow-black/15 border border-gray-200 overflow-hidden relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setShow(false)}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-200 transition-colors"
            >
              <X size={14} />
            </button>

            {status === "success" ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center p-10"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center">
                  <Download size={28} className="text-gray-900" />
                </div>
                <h3 className="text-gray-900 font-bold text-xl mb-1">Thank you!</h3>
                <p className="text-gray-500 text-sm">
                  We&apos;ll send you our portfolio shortly.
                </p>
              </motion.div>
            ) : (
              <div className="p-8">
                {/* Icon */}
                <div className="w-12 h-12 mb-5 rounded-xl bg-gray-900 flex items-center justify-center">
                  <Download size={20} className="text-white" />
                </div>

                {/* Title */}
                <h3 className="text-gray-900 font-bold text-2xl mb-2 font-serif">
                  Download Our Portfolio
                </h3>
                <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                  200+ projects showcase with detailed case studies and pricing guide. Free, no spam.
                </p>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="relative">
                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-gray-900 placeholder-gray-300 focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-300 text-sm transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white font-semibold py-3 rounded-xl hover:bg-gray-800 transition-colors text-sm disabled:opacity-60"
                  >
                    {status === "sending" ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Get it free <ArrowRight size={14} />
                      </>
                    )}
                  </button>
                </form>

                {/* Trust signals */}
                <div className="flex items-center justify-center gap-5 mt-5 text-gray-400 text-xs">
                  <span className="flex items-center gap-1.5">
                    <div className="w-1 h-1 rounded-full bg-gray-400" />
                    No spam
                  </span>
                  <span className="flex items-center gap-1.5">
                    <div className="w-1 h-1 rounded-full bg-gray-400" />
                    Unsubscribe anytime
                  </span>
                  <span className="flex items-center gap-1.5">
                    <div className="w-1 h-1 rounded-full bg-gray-400" />
                    Free forever
                  </span>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
