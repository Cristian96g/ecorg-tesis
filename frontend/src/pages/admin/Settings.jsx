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
        title="Ajustes institucionales"
        description="Resumen de criterios operativos y de seguridad con los que hoy funciona el panel administrativo de EcoRG."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader
            title="Configuración general"
            subtitle="Lineamientos del sistema para identidad visual, operación y continuidad administrativa."
          />
          <CardBody>
            <div className="flex items-start gap-4 rounded-3xl border border-dashed border-[#d7e5c5] bg-[#fbfdf8] p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eef6e4] text-[#66a939]">
                <FiSliders className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-[#24341a]">
                  Gestión centralizada
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Los criterios globales de EcoRG se administran de forma centralizada para preservar consistencia institucional, trazabilidad operativa y una experiencia unificada en toda la plataforma.
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="Seguridad y permisos"
            subtitle="Marco actual de acceso administrativo y control de acciones sensibles."
          />
          <CardBody>
            <div className="flex items-start gap-4 rounded-3xl border border-dashed border-[#d7e5c5] bg-[#fbfdf8] p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eef6e4] text-[#66a939]">
                <FiShield className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-[#24341a]">
                  Control por roles
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Los accesos sensibles se resguardan mediante roles, rutas protegidas y validaciones de backend, asegurando que la operatoria administrativa responda a criterios claros de gobernanza y seguridad.
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
