export const fadeUpVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.52, ease: [0.22, 1, 0.36, 1] },
  },
};

export const pageVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    y: 10,
    transition: { duration: 0.22, ease: [0.4, 0, 1, 1] },
  },
};

export const scaleInVariants = {
  hidden: { opacity: 0, scale: 0.96, y: 12 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

export const subtleStagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
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
      staggerChildren: 0.12,
      delayChildren: 0.07,
    },
  },
};

export const heroItemVariants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.58, ease: [0.22, 1, 0.36, 1] },
  },
};

export const modalBackdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.18 } },
  exit: { opacity: 0, transition: { duration: 0.14 } },
};

export const modalPanelVariants = {
  hidden: { opacity: 0, scale: 0.96, y: 12 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 320, damping: 28, mass: 0.9 },
  },
  exit: { opacity: 0, scale: 0.97, y: 10, transition: { duration: 0.16 } },
};

export const dropdownVariants = {
  hidden: { opacity: 0, y: -6, scale: 0.985 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] },
  },
  exit: { opacity: 0, y: -6, scale: 0.985, transition: { duration: 0.16 } },
};

export const hoverLift = {
  whileHover: { y: -4, scale: 1.008 },
  whileTap: { scale: 0.994 },
  transition: { type: "spring", stiffness: 260, damping: 26, mass: 0.84 },
};

export const buttonMotion = {
  whileHover: { scale: 1.018 },
  whileTap: { scale: 0.97 },
  transition: { type: "spring", stiffness: 320, damping: 26, mass: 0.86 },
};

export const cardGlowMotion = {
  whileHover: {
    y: -4,
    scale: 1.008,
    boxShadow: "0 22px 48px rgba(59,89,34,0.12)",
  },
  whileTap: { scale: 0.994 },
  transition: { type: "spring", stiffness: 260, damping: 26, mass: 0.86 },
};
