import { Link } from "react-router-dom";

function CallToAction() {
  return (
    <section className="bg-primary-700 text-white py-16">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold">
          ¡Sumate al cambio en Río Gallegos!
        </h2>
        <p className="mt-4 text-lg text-white/90">
          Registrate gratis en EcoRG y empezá a reciclar, ganar puntos y cuidar
          el ambiente junto a toda la comunidad.
        </p>
        <Link
          to="/perfil"
          className="mt-6 inline-block rounded-md bg-white text-primary-700 px-8 py-3 font-semibold shadow hover:bg-gray-100"
        >
          Crear cuenta
        </Link>
      </div>
    </section>
  );
}

export default CallToAction;
