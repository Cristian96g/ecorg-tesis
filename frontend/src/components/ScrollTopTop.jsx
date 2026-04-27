import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiArrowUp } from "react-icons/fi";
import { useLocation } from "react-router-dom";

const SHOW_AFTER_PX = 350;
const MotionButton = motion.button;

export default function ScrollToTopButton() {
  const { pathname } = useLocation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > SHOW_AFTER_PX);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {visible ? (
        <MotionButton
          key="scroll-to-top"
          type="button"
          aria-label="Volver arriba"
          onClick={scrollToTop}
          initial={{ opacity: 0, scale: 0.88, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 14 }}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          transition={{
            type: "spring",
            stiffness: 340,
            damping: 24,
            mass: 0.9,
          }}
          className="fixed bottom-5 right-5 z-40 inline-flex h-13 w-13 items-center justify-center rounded-full border border-white/30 bg-[linear-gradient(135deg,rgba(102,169,57,0.95),rgba(83,143,43,0.92))] text-white shadow-[0_18px_40px_rgba(59,89,34,0.28)] backdrop-blur-xl transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#66a939]/35 focus-visible:ring-offset-2 focus-visible:ring-offset-white sm:bottom-6 sm:right-6"
        >
          <span className="absolute inset-0 rounded-full bg-white/10" aria-hidden="true" />
          <FiArrowUp className="relative h-5 w-5" aria-hidden="true" />
        </MotionButton>
      ) : null}
    </AnimatePresence>
  );
}
