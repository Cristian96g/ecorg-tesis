import { FiShield, FiSliders } from "react-icons/fi";
import {
  AdminSectionHero,
  Card,
  CardBody,
  CardHeader,
} from "../../components/ui/Admin-ui";

export default function AdminAjustes() {
  return (
    <div className="space-y-6">
      <AdminSectionHero
        title="Ajustes"
        description="Configuración general del sistema. Esta pantalla queda preparada para futuras opciones administrativas reales."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader
            title="Configuración general"
            subtitle="Espacio reservado para branding institucional, parámetros globales y mantenimiento futuro."
          />
          <CardBody>
            <div className="flex items-start gap-4 rounded-3xl border border-dashed border-[#d7e5c5] bg-[#fbfdf8] p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eef6e4] text-[#66a939]">
                <FiSliders className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-[#24341a]">
                  Módulo informativo
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  En esta versión no hay configuraciones operativas para editar desde el panel.
                  Se mantiene la estructura lista para sumar opciones reales en una etapa futura.
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="Seguridad y permisos"
            subtitle="Referencia visual sobre cómo se gestionan hoy los accesos administrativos."
          />
          <CardBody>
            <div className="flex items-start gap-4 rounded-3xl border border-dashed border-[#d7e5c5] bg-[#fbfdf8] p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eef6e4] text-[#66a939]">
                <FiShield className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-[#24341a]">
                  Gestión centralizada
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Los permisos sensibles ya se controlan desde roles y rutas protegidas.
                  Este bloque deja documentado ese criterio sin prometer acciones que todavía no existen.
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
