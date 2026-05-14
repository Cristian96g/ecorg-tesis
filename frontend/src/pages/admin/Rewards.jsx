import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FiCheckCircle,
  FiEdit2,
  FiGift,
  FiMapPin,
  FiPauseCircle,
  FiRefreshCw,
  FiSave,
  FiStar,
} from "react-icons/fi";
import { toast } from "react-toastify";
import { UsersAPI, getFriendlyApiError } from "../../api/api";
import Modal from "../../components/ui/Modal";
import {
  AdminSectionHero,
  Button,
  Card,
  CardBody,
  CardHeader,
  EmptyState,
  FilterBar,
  Input,
  ResultCount,
  Select,
} from "../../components/ui/Admin-ui";

const STATUS_OPTIONS = [
  { value: "", label: "Todos los estados" },
  { value: "activo", label: "Activo" },
  { value: "pausado", label: "Pausado" },
];

function statusBadge(status) {
  if (status === "activo") return "bg-emerald-100 text-emerald-700";
  return "bg-amber-100 text-amber-700";
}

function SummaryStat({ label, value, helper, icon }) {
  const Icon = icon;

  return (
    <article className="rounded-[24px] border border-[#dce8ce] bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#4f7a2f]">{label}</p>
          <p className="mt-2 text-3xl font-semibold text-[#203014]">{value}</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">{helper}</p>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eef6e4] text-[#66a939]">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </article>
  );
}

export default function AdminRewards() {
  const [loading, setLoading] = useState(true);
  const [catalog, setCatalog] = useState([]);
  const [summary, setSummary] = useState({
    total: 0,
    active: 0,
    paused: 0,
    featured: 0,
  });
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const loadRewards = useCallback(async () => {
    try {
      setLoading(true);
      const data = await UsersAPI.listAdminRewards();
      setCatalog(Array.isArray(data?.items) ? data.items : []);
      setSummary(
        data?.summary || {
          total: 0,
          active: 0,
          paused: 0,
          featured: 0,
        }
      );
    } catch (error) {
      toast.error(getFriendlyApiError(error, "No se pudieron cargar los beneficios adheridos."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRewards();
  }, [loadRewards]);

  const rows = useMemo(() => {
    return catalog.filter((item) => {
      const matchesStatus = !status || item.status === status;
      const haystack = `${item.partner} ${item.title} ${item.category} ${item.benefitLabel}`.toLowerCase();
      const matchesQuery = !q.trim() || haystack.includes(q.trim().toLowerCase());
      return matchesStatus && matchesQuery;
    });
  }, [catalog, q, status]);

  async function handleSaveReward(payload) {
    try {
      setSaving(true);
      const result = await UsersAPI.updateAdminReward(editing.id, payload);
      toast.success(result?.message || "Beneficio actualizado.");
      setEditing(null);
      await loadRewards();
    } catch (error) {
      toast.error(getFriendlyApiError(error, "No se pudo actualizar el beneficio."));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <AdminSectionHero
        eyebrow="Gamificación y beneficios"
        title="Comercios adheridos"
        description="Administrá el catálogo institucional de beneficios ciudadanos asociados a EcoPoints. Esta vista está pensada para defensa y muestra cómo EcoRG puede conectar participación ambiental con incentivos locales reales."
        action={
          <Button variant="ghost" onClick={loadRewards}>
            <FiRefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Actualizar
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryStat label="Beneficios" value={summary.total} helper="Catálogo visible para el sistema." icon={FiGift} />
        <SummaryStat label="Activos" value={summary.active} helper="Disponibles para usuarios con puntos." icon={FiCheckCircle} />
        <SummaryStat label="Pausados" value={summary.paused} helper="Ocultos temporalmente del canje." icon={FiPauseCircle} />
        <SummaryStat label="Destacados" value={summary.featured} helper="Priorizados en la experiencia pública." icon={FiStar} />
      </div>

      <Card>
        <CardHeader
          title="Catálogo de beneficios adheridos"
          subtitle="Gestioná estado, puntaje requerido y narrativa institucional sin convertir EcoRG en un marketplace."
        />
        <CardBody>
          <FilterBar className="mb-5">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <Input
                placeholder="Buscar por comercio, beneficio o categoría..."
                value={q}
                onChange={(event) => setQ(event.target.value)}
              />
              <Select value={status} onChange={(event) => setStatus(event.target.value)}>
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value || "all"} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
              <div className="flex flex-wrap items-center gap-2 md:justify-end">
                <ResultCount count={rows.length} label="beneficios" />
                <Button
                  variant="ghost"
                  onClick={() => {
                    setQ("");
                    setStatus("");
                  }}
                >
                  Limpiar
                </Button>
              </div>
            </div>
          </FilterBar>

          {loading ? (
            <div className="rounded-[24px] border border-[#edf3e6] bg-white px-4 py-8 text-center text-sm text-slate-500">
              Cargando comercios adheridos...
            </div>
          ) : rows.length === 0 ? (
            <EmptyState
              icon={FiGift}
              title="No encontramos beneficios"
              description="Ajustá los filtros para revisar el catálogo de recompensas ciudadanas."
            />
          ) : (
            <div className="grid gap-4 xl:grid-cols-2">
              {rows.map((item) => (
                <article key={item.id} className="rounded-[24px] border border-[#e7efdb] bg-white p-5 shadow-sm">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusBadge(item.status)}`}>
                          {item.status === "activo" ? "Activo" : "Pausado"}
                        </span>
                        {item.featured ? (
                          <span className="inline-flex rounded-full bg-[#eef6e4] px-2.5 py-1 text-xs font-semibold text-[#4f7a2f]">
                            Destacado
                          </span>
                        ) : null}
                        <span className="inline-flex rounded-full bg-[#f6f8f2] px-2.5 py-1 text-xs font-semibold text-slate-600">
                          {item.pointsRequired} pts
                        </span>
                      </div>
                      <h3 className="mt-3 text-lg font-semibold text-[#203014]">{item.title}</h3>
                      <p className="mt-1 text-sm font-medium text-[#4f7a2f]">{item.partner}</p>
                      <p className="mt-3 text-sm leading-6 text-slate-600">{item.description}</p>
                    </div>

                    <Button variant="ghost" className="px-3 py-2" onClick={() => setEditing(item)}>
                      <FiEdit2 className="h-4 w-4" />
                      Editar
                    </Button>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <InfoPill label="Categoría" value={item.category} />
                    <InfoPill label="Beneficio" value={item.benefitLabel} />
                    <InfoPill label="Impacto" value={item.impactLabel} />
                  </div>

                  <div className="mt-4 rounded-2xl border border-[#edf3e6] bg-[#fbfdf8] px-4 py-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Nota institucional</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {item.internalNotes || "Sin nota interna definida para este beneficio."}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      {editing ? (
        <RewardEditModal
          item={editing}
          saving={saving}
          onClose={() => setEditing(null)}
          onSave={handleSaveReward}
        />
      ) : null}
    </div>
  );
}

function InfoPill({ label, value }) {
  return (
    <div className="rounded-2xl border border-[#edf3e6] bg-[#fbfdf8] px-3 py-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-medium text-[#203014]">{value}</p>
    </div>
  );
}

function RewardEditModal({ item, saving, onClose, onSave }) {
  const [form, setForm] = useState({
    partner: item.partner || "",
    title: item.title || "",
    category: item.category || "",
    benefitLabel: item.benefitLabel || "",
    impactLabel: item.impactLabel || "",
    description: item.description || "",
    internalNotes: item.internalNotes || "",
    status: item.status || "activo",
    featured: Boolean(item.featured),
    pointsRequired: item.pointsRequired || 0,
  });

  const onChange = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  return (
    <Modal open={!!item} onClose={onClose} title="Editar beneficio adherido" size="lg">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Comercio">
          <Input value={form.partner} onChange={(event) => onChange("partner", event.target.value)} />
        </Field>
        <Field label="Categoría">
          <Input value={form.category} onChange={(event) => onChange("category", event.target.value)} />
        </Field>
        <Field label="Beneficio" className="md:col-span-2">
          <Input value={form.title} onChange={(event) => onChange("title", event.target.value)} />
        </Field>
        <Field label="Etiqueta visible">
          <Input value={form.benefitLabel} onChange={(event) => onChange("benefitLabel", event.target.value)} />
        </Field>
        <Field label="Impacto / enfoque">
          <Input value={form.impactLabel} onChange={(event) => onChange("impactLabel", event.target.value)} />
        </Field>
        <Field label="Puntos requeridos">
          <Input
            type="number"
            min="0"
            value={form.pointsRequired}
            onChange={(event) => onChange("pointsRequired", event.target.value)}
          />
        </Field>
        <Field label="Estado">
          <Select value={form.status} onChange={(event) => onChange("status", event.target.value)}>
            <option value="activo">Activo</option>
            <option value="pausado">Pausado</option>
          </Select>
        </Field>
        <Field label="Descripción" className="md:col-span-2">
          <textarea
            value={form.description}
            onChange={(event) => onChange("description", event.target.value)}
            rows={4}
            className="w-full rounded-2xl border border-[#d7e5c5] bg-white px-3.5 py-3 text-sm text-slate-700 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-[#66a939] focus:ring-2 focus:ring-[#66a939]/20"
          />
        </Field>
        <Field label="Nota interna institucional" className="md:col-span-2">
          <textarea
            value={form.internalNotes}
            onChange={(event) => onChange("internalNotes", event.target.value)}
            rows={3}
            className="w-full rounded-2xl border border-[#d7e5c5] bg-white px-3.5 py-3 text-sm text-slate-700 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-[#66a939] focus:ring-2 focus:ring-[#66a939]/20"
          />
        </Field>
      </div>

      <label className="mt-4 inline-flex items-center gap-3 text-sm font-medium text-slate-700">
        <input
          type="checkbox"
          checked={form.featured}
          onChange={(event) => onChange("featured", event.target.checked)}
          className="h-4 w-4 rounded border-[#cfe1b7] text-[#66a939] focus:ring-[#66a939]/25"
        />
        Destacar este beneficio dentro del catálogo público
      </label>

      <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
        <Button variant="ghost" onClick={onClose}>
          Cancelar
        </Button>
        <Button
          variant="primary"
          disabled={saving}
          onClick={() =>
            onSave({
              ...form,
              pointsRequired: Number(form.pointsRequired || 0),
            })
          }
        >
          <FiSave className="h-4 w-4" />
          {saving ? "Guardando..." : "Guardar cambios"}
        </Button>
      </div>
    </Modal>
  );
}

function Field({ label, children, className = "" }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-sm font-medium text-slate-700">{label}</span>
      {children}
    </label>
  );
}
