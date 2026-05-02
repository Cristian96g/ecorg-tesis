export const fadeUpVariants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.56, ease: [0.22, 1, 0.36, 1] },
  },
};

export const subtleStagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.06,
    },
  },
};

export const gentleStagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.11,
      delayChildren: 0.08,
    },
  },
};

export const heroContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.13,
      delayChildren: 0.08,
    },
  },
};

export const heroItemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.62, ease: [0.22, 1, 0.36, 1] },
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
  hidden: { opacity: 0, y: -8, scale: 0.985 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] },
  },
  exit: { opacity: 0, y: -6, scale: 0.985, transition: { duration: 0.16 } },
};

export const hoverLift = {
  whileHover: { y: -6, scale: 1.012 },
  whileTap: { scale: 0.992 },
  transition: { type: "spring", stiffness: 300, damping: 24, mass: 0.82 },
};

export const buttonMotion = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.97 },
  transition: { type: "spring", stiffness: 360, damping: 24, mass: 0.82 },
};

export const cardGlowMotion = {
  whileHover: {
    y: -6,
    scale: 1.012,
    boxShadow: "0 24px 54px rgba(59,89,34,0.14)",
  },
  whileTap: { scale: 0.992 },
  transition: { type: "spring", stiffness: 280, damping: 24, mass: 0.84 },
};
