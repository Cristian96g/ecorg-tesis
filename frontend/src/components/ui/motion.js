export const fadeUpVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] },
  },
};

export const subtleStagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
};

export const modalBackdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.18 } },
  exit: { opacity: 0, transition: { duration: 0.14 } },
};

export const modalPanelVariants = {
  hidden: { opacity: 0, scale: 0.96, y: 14 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 320, damping: 28, mass: 0.9 },
  },
  exit: { opacity: 0, scale: 0.97, y: 10, transition: { duration: 0.16 } },
};

export const dropdownVariants = {
  hidden: { opacity: 0, y: -10, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.18, ease: [0.22, 1, 0.36, 1] },
  },
  exit: { opacity: 0, y: -8, scale: 0.98, transition: { duration: 0.14 } },
};

export const hoverLift = {
  whileHover: { y: -4, scale: 1.01 },
  whileTap: { scale: 0.99 },
  transition: { type: "spring", stiffness: 320, damping: 22, mass: 0.8 },
};

export const buttonMotion = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.98 },
  transition: { type: "spring", stiffness: 380, damping: 26, mass: 0.8 },
};
