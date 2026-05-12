import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FiX } from "react-icons/fi";
import { buttonMotion, modalBackdropVariants, modalPanelVariants } from "./motion";

const MotionButton = motion.button;
const MotionDiv = motion.div;

const SIZE_CLASSES = {
  sm: "max-w-md",
  md: "max-w-2xl",
  lg: "max-w-4xl",
};

let scrollLockCount = 0;
let previousBodyOverflow = "";

function lockBodyScroll() {
  if (typeof document === "undefined") return;

  if (scrollLockCount === 0) {
    previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
  }

  scrollLockCount += 1;
}

function unlockBodyScroll() {
  if (typeof document === "undefined" || scrollLockCount === 0) return;

  scrollLockCount -= 1;

  if (scrollLockCount === 0) {
    document.body.style.overflow = previousBodyOverflow;
    previousBodyOverflow = "";
  }
}

export default function Modal({ open, onClose, title, children, size = "md", lockScroll = true }) {
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (open) {
      setMounted(true);
      const frame = requestAnimationFrame(() => setVisible(true));

      if (lockScroll) {
        lockBodyScroll();
      }

      return () => {
        cancelAnimationFrame(frame);
        if (lockScroll) {
          unlockBodyScroll();
        }
      };
    }

    setVisible(false);
    const timeout = setTimeout(() => setMounted(false), 180);

    return () => {
      clearTimeout(timeout);
    };
  }, [open, lockScroll]);

  useEffect(() => {
    if (!mounted) return undefined;

    function onKeyDown(event) {
      if (event.key === "Escape") onClose?.();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mounted, onClose]);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
        <MotionButton
          type="button"
          aria-label="Cerrar modal"
          onClick={onClose}
          variants={shouldReduceMotion ? undefined : modalBackdropVariants}
          initial={shouldReduceMotion ? false : "hidden"}
          animate={shouldReduceMotion ? undefined : "visible"}
          exit={shouldReduceMotion ? undefined : "exit"}
          className={`absolute inset-0 bg-black/40 backdrop-blur-md transition-opacity duration-200 ${
            visible ? "opacity-100" : "opacity-0"
          }`}
        />

        <MotionDiv
          variants={shouldReduceMotion ? undefined : modalPanelVariants}
          initial={shouldReduceMotion ? false : "hidden"}
          animate={shouldReduceMotion ? undefined : "visible"}
          exit={shouldReduceMotion ? undefined : "exit"}
          className={`relative z-10 flex max-h-[92vh] w-full flex-col overflow-hidden rounded-[24px] bg-white shadow-[0_28px_70px_rgba(15,23,42,0.24)] transition-all duration-200 sm:max-h-[95vh] sm:rounded-[28px] ${
            SIZE_CLASSES[size] || SIZE_CLASSES.md
          } ${visible ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}
        >
          <MotionDiv
            initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={shouldReduceMotion ? undefined : { duration: 0.28, delay: 0.04 }}
            className="flex items-center justify-between gap-4 border-b border-[#e8efdf] px-4 py-4 sm:px-6"
          >
            <h2 className="min-w-0 break-words text-lg font-semibold text-[#203014] sm:text-xl">
              {title}
            </h2>
            <MotionButton
              {...(shouldReduceMotion ? {} : buttonMotion)}
              type="button"
              onClick={onClose}
              aria-label="Cerrar modal"
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#66a939]/30"
            >
              <motion.span
                whileHover={shouldReduceMotion ? undefined : { rotate: 90, scale: 1.06 }}
                transition={
                  shouldReduceMotion
                    ? undefined
                    : { type: "spring", stiffness: 320, damping: 22 }
                }
                className="inline-flex"
              >
                <FiX className="h-5 w-5" />
              </motion.span>
            </MotionButton>
          </MotionDiv>

          <MotionDiv
            initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={shouldReduceMotion ? undefined : { duration: 0.3, delay: 0.08 }}
            className="overflow-y-auto px-4 py-4 sm:px-6 sm:py-6"
          >
            {children}
          </MotionDiv>
        </MotionDiv>
      </div>
    </AnimatePresence>
  );
}
