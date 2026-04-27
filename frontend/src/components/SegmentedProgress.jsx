import React from "react";

/**
 * Progreso circular segmentado (tipo "10 pasos") con texto centrado.
 *
 * Props:
 * - value: número de pasos activos (0..max)
 * - max: cantidad de segmentos (por defecto 10)
 * - size: tamaño del SVG (px)
 * - strokeBg: grosor trazo de fondo (px)
 * - strokeFg: grosor trazo de progreso (px)
 * - color: color del progreso (EcoRG green)
 * - primary: texto principal (ej. "15,000+")
 * - secondary: texto secundario (ej. "Usuarios activos")
 */
export default function SegmentedProgress({
  value = 7,
  max = 10,
  size = 160,
  strokeBg = 5,
  strokeFg = 6,
  color = "#66a939",
  primary = "0/10",
  secondary = "",
}) {
  const cx = size / 2;
  const cy = size / 2;

  // Radio: que quede aire entre borde y trazo
  const r = Math.round((size / 2) - Math.max(strokeBg, strokeFg) - 5);
  

  // Circunferencia
  const C = 2 * Math.PI * r;

  // Elegimos un spacing constante y calculamos el largo del tramo
  // por segmento: (circunf/segmentos) - spacing
  const spacing = 10;
  const stepLen = Math.max(2, (C / max) - spacing); // evita negativo

  // Genera dasharray para N segmentos activos
  const dashArrayFor = (segments) => {
    if (segments <= 0) return "0 1000"; // nada
    const parts = [];
    for (let i = 0; i < segments; i++) {
      parts.push(stepLen.toFixed(2));                // trazo
      // al último le ponemos un hueco gigante para que no repita
      parts.push(i === segments - 1 ? "1000" : spacing.toFixed(2));
    }
    return parts.join(" ");
  };

  // Fondo con TODOS los segmentos (gris)
  const backgroundDashArray = (() => {
    const parts = [];
    for (let i = 0; i < max; i++) {
      parts.push(stepLen.toFixed(2));
      parts.push(spacing.toFixed(2));
    }
    return parts.join(" ");
  })();

  // Progreso (value -> segmentos activos)
  const clamped = Math.max(0, Math.min(max, value));
  const progressDashArray = dashArrayFor(clamped);

  return (
    <div className="relative inline-block">
      {/* Texto centrado (con aire extra) */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-8 py-5 gap-1">
        <div className="text-2xl md:text-3xl font-semibold text-[#2d3d33] leading-tight">
          {primary}
        </div>
        {secondary && (
          <div className="text-gray-500 text-xs md:text-sm">{secondary}</div>
        )}
      </div>

      {/* SVG con rotación para comenzar arriba (12 en punto) */}
      <svg width={size} height={size} className="block">
        <g transform={`rotate(-90 ${cx} ${cy})`}>
          {/* fondo segmentado */}
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke="#d1d5db"
            strokeWidth={strokeBg}
            strokeLinecap="round"
            strokeDasharray={backgroundDashArray}
          />
          {/* progreso segmentado */}
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={strokeFg}
            strokeLinecap="round"
            strokeDasharray={progressDashArray}
            // animación suave al cambiar value
            style={{ transition: "stroke-dasharray 600ms ease" }}
          />
        </g>
      </svg>
    </div>
  );
}
