import { motion, useReducedMotion } from "framer-motion";
import { FiLoader } from "react-icons/fi";
import { fadeUpVariants, scaleInVariants } from "./motion";

const MotionDiv = motion.div;

export default function LoadingState({
  title = "Cargando contenido",
  description = "Estamos preparando la información para vos.",
  compact = false,
  className = "",
  action = null,
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <MotionDiv
      initial={shouldReduceMotion ? false : "hidden"}
      animate={shouldReduceMotion ? undefined : "visible"}
      variants={shouldReduceMotion ? undefined : fadeUpVariants}
      className={`flex flex-col items-center justify-center rounded-[28px] border border-[#dbe7cf] bg-white px-6 py-10 text-center shadow-sm ${compact ? "min-h-[180px]" : "min-h-[260px]"} ${className}`.trim()}
    >
      <MotionDiv
        variants={shouldReduceMotion ? undefined : scaleInVariants}
        className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eef6e4] text-[#66a939]"
      >
        <motion.span
          animate={shouldReduceMotion ? undefined : { rotate: 360 }}
          transition={shouldReduceMotion ? undefined : { duration: 1.1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="inline-flex"
        >
          <FiLoader className="h-6 w-6" />
        </motion.span>
      </MotionDiv>
      <h3 className="mt-4 text-lg font-semibold text-[#24341a]">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">
        {description}
      </p>
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </MotionDiv>
  );
}
