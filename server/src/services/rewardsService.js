const REWARD_CATALOG = [
  {
    id: "cafe-barrial-15",
    partner: "Café del Centro",
    category: "Gastronomía local",
    title: "15% OFF en café de especialidad",
    description:
      "Un beneficio pensado para acompañar hábitos sustentables con consumo local responsable.",
    benefitLabel: "15% OFF",
    pointsRequired: 250,
    impactLabel: "Comercio adherido",
    status: "activo",
    featured: true,
    internalNotes: "Ideal para campañas de participación temprana y beneficios de bienvenida.",
  },
  {
    id: "libreria-eco-kit",
    partner: "Librería Horizonte",
    category: "Educación y cultura",
    title: "Descuento en cuadernos reciclados",
    description:
      "Accedé a materiales reutilizados y reforzá el vínculo entre educación ambiental y consumo consciente.",
    benefitLabel: "20% OFF",
    pointsRequired: 320,
    impactLabel: "Producto sustentable",
    status: "activo",
    featured: false,
    internalNotes: "Conecta muy bien con educación ambiental y consumo responsable.",
  },
  {
    id: "gym-pase-verde",
    partner: "Movimiento Sur",
    category: "Bienestar",
    title: "Pase diario con beneficio ciudadano",
    description:
      "Una invitación a combinar bienestar personal con participación comunitaria activa.",
    benefitLabel: "Pase diario",
    pointsRequired: 420,
    impactLabel: "Beneficio saludable",
    status: "activo",
    featured: false,
    internalNotes: "Aporta variedad y muestra alianzas más allá del reciclaje directo.",
  },
  {
    id: "almacen-recarga",
    partner: "Almacén Circular",
    category: "Consumo responsable",
    title: "Descuento en productos a granel",
    description:
      "Canjeá tus EcoPoints por una compra con menor huella y más incentivo al consumo responsable.",
    benefitLabel: "18% OFF",
    pointsRequired: 500,
    impactLabel: "Compra consciente",
    status: "activo",
    featured: true,
    internalNotes: "Muy alineado con el mensaje de consumo responsable y reducción de residuos.",
  },
  {
    id: "vivero-nativo",
    partner: "Vivero Patagonia Viva",
    category: "Ambiente",
    title: "Planta nativa o aromática",
    description:
      "Transformá tu participación en una acción tangible que también mejora entornos urbanos y domésticos.",
    benefitLabel: "Planta incluida",
    pointsRequired: 650,
    impactLabel: "Impacto ecológico",
    status: "activo",
    featured: true,
    internalNotes: "Beneficio simbólico y muy fuerte para la narrativa ambiental de la tesis.",
  },
  {
    id: "bicicleteria-ajuste",
    partner: "Pedal Urbano",
    category: "Movilidad sostenible",
    title: "Ajuste básico de bicicleta",
    description:
      "Promové una movilidad más limpia con un beneficio alineado a hábitos urbanos sustentables.",
    benefitLabel: "Service básico",
    pointsRequired: 780,
    impactLabel: "Movilidad limpia",
    status: "pausado",
    featured: false,
    internalNotes: "Se puede activar en campañas de movilidad sostenible o semanas temáticas.",
  },
];

function buildRedemptionCode() {
  const suffix = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `ECO-${suffix}`;
}

export function getRewardCatalog() {
  return REWARD_CATALOG.map((reward) => ({ ...reward }));
}

export function getAdminRewardCatalog() {
  return REWARD_CATALOG.map((reward) => ({ ...reward }));
}

export function updateRewardCatalogItem(rewardId, patch = {}) {
  const reward = REWARD_CATALOG.find((item) => item.id === rewardId);

  if (!reward) {
    const error = new Error("Beneficio no encontrado");
    error.status = 404;
    throw error;
  }

  if (patch.status && !["activo", "pausado"].includes(patch.status)) {
    const error = new Error("Estado de beneficio inválido");
    error.status = 400;
    throw error;
  }

  if (patch.partner !== undefined) reward.partner = String(patch.partner).trim() || reward.partner;
  if (patch.title !== undefined) reward.title = String(patch.title).trim() || reward.title;
  if (patch.category !== undefined) reward.category = String(patch.category).trim() || reward.category;
  if (patch.benefitLabel !== undefined) reward.benefitLabel = String(patch.benefitLabel).trim() || reward.benefitLabel;
  if (patch.impactLabel !== undefined) reward.impactLabel = String(patch.impactLabel).trim() || reward.impactLabel;
  if (patch.description !== undefined) reward.description = String(patch.description).trim() || reward.description;
  if (patch.internalNotes !== undefined) reward.internalNotes = String(patch.internalNotes).trim();
  if (patch.status !== undefined) reward.status = patch.status;
  if (patch.featured !== undefined) reward.featured = Boolean(patch.featured);

  if (patch.pointsRequired !== undefined) {
    const parsedPoints = Number(patch.pointsRequired);
    if (!Number.isFinite(parsedPoints) || parsedPoints < 0) {
      const error = new Error("La cantidad de puntos requerida no es válida");
      error.status = 400;
      throw error;
    }
    reward.pointsRequired = Math.round(parsedPoints);
  }

  return { ...reward };
}

export function getRewardSummary(user) {
  const totalPoints = Math.max(0, Number(user?.points || 0));
  const spentPoints = Math.max(0, Number(user?.rewardPointsSpent || 0));
  const availablePoints = Math.max(0, totalPoints - spentPoints);
  const redemptions = Array.isArray(user?.rewardRedemptions) ? user.rewardRedemptions : [];
  const unlockedCount = REWARD_CATALOG.filter((reward) => availablePoints >= reward.pointsRequired).length;
  const nextReward =
    REWARD_CATALOG.filter((reward) => availablePoints < reward.pointsRequired)
      .sort((a, b) => a.pointsRequired - b.pointsRequired)[0] || null;

  return {
    totalPoints,
    spentPoints,
    availablePoints,
    unlockedCount,
    redeemedCount: redemptions.length,
    nextReward: nextReward
      ? {
          id: nextReward.id,
          title: nextReward.title,
          partner: nextReward.partner,
          pointsRequired: nextReward.pointsRequired,
          remainingPoints: Math.max(0, nextReward.pointsRequired - availablePoints),
        }
      : null,
  };
}

export function serializeRewardCatalogForUser(user) {
  const summary = getRewardSummary(user);
  return REWARD_CATALOG.filter((reward) => reward.status !== "pausado").map((reward) => ({
    ...reward,
    unlocked: summary.availablePoints >= reward.pointsRequired,
    remainingPoints: Math.max(0, reward.pointsRequired - summary.availablePoints),
    progressPercent: Math.min(
      100,
      Math.round((summary.availablePoints / reward.pointsRequired) * 100)
    ),
  }));
}

export function redeemRewardForUser(user, rewardId) {
  const reward = REWARD_CATALOG.find((item) => item.id === rewardId);

  if (!reward) {
    const error = new Error("Beneficio no encontrado");
    error.status = 404;
    throw error;
  }

  const summary = getRewardSummary(user);
  if (summary.availablePoints < reward.pointsRequired) {
    const error = new Error("No tenés EcoPoints suficientes para este beneficio");
    error.status = 400;
    throw error;
  }

  if (!Array.isArray(user.rewardRedemptions)) {
    user.rewardRedemptions = [];
  }

  user.rewardPointsSpent = Math.max(0, Number(user.rewardPointsSpent || 0) + reward.pointsRequired);

  const redemption = {
    rewardId: reward.id,
    title: reward.title,
    partner: reward.partner,
    category: reward.category,
    benefitLabel: reward.benefitLabel,
    pointsSpent: reward.pointsRequired,
    redeemedAt: new Date(),
    status: "emitido",
    code: buildRedemptionCode(),
  };

  user.rewardRedemptions.unshift(redemption);

  return {
    reward,
    redemption,
    summary: getRewardSummary(user),
  };
}
