import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FiArrowUp } from "react-icons/fi";
import { useLocation } from "react-router-dom";

const SHOW_AFTER_PX = 260;
const MotionButton = motion.button;

export default function ScrollToTopButton() {
  const { pathname } = useLocation();
  const [visible, setVisible] = useState(false);
  const shouldReduceMotion = useReducedMotion();

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
          initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.9, y: 14 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1, scale: 1, y: 0 }}
          exit={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.92, y: 10 }}
          whileHover={shouldReduceMotion ? undefined : { scale: 1.04, y: -1 }}
          whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
          transition={
            shouldReduceMotion
              ? undefined
              : {
                  type: "spring",
                  stiffness: 320,
                  damping: 24,
                  mass: 0.88,
                }
          }
          className="fixed bottom-4 right-4 z-40 inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-[linear-gradient(135deg,rgba(102,169,57,0.95),rgba(83,143,43,0.92))] text-white shadow-[0_18px_40px_rgba(59,89,34,0.28)] backdrop-blur-xl transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#66a939]/35 focus-visible:ring-offset-2 focus-visible:ring-offset-white sm:bottom-6 sm:right-6 sm:h-13 sm:w-13"
        >
          <span className="absolute inset-0 rounded-full bg-white/10" aria-hidden="true" />
          <FiArrowUp className="relative h-5 w-5" aria-hidden="true" />
        </MotionButton>
      ) : null}
    </AnimatePresence>
  );
}
