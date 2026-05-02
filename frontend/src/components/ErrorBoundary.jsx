import { Component } from "react";
import { FiAlertCircle, FiHome, FiRefreshCw } from "react-icons/fi";
import { Link } from "react-router-dom";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    if (import.meta.env.DEV) {
      console.error("ERROR_BOUNDARY_CAUGHT", error, errorInfo);
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.resetKey !== this.props.resetKey && this.state.hasError) {
      this.setState({ hasError: false });
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(214,237,194,0.35),_transparent_45%),linear-gradient(180deg,_#f7fbf4_0%,_#ffffff_100%)] px-6 py-12">
        <div className="w-full max-w-xl rounded-[32px] border border-[#dbe8cc] bg-white px-6 py-8 text-center shadow-[0_24px_80px_rgba(59,89,34,0.14)] sm:px-10 sm:py-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-[#eef6e4] text-[#66a939] shadow-sm">
            <FiAlertCircle className="h-8 w-8" aria-hidden="true" />
          </div>

          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-[#5f8d32]">
            EcoRG
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-[#203014] sm:text-4xl">
            Algo salió mal
          </h1>
          <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
            Ocurrió un error inesperado en esta vista. Podés reintentar ahora o volver al inicio
            para seguir navegando.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={this.handleRetry}
              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-2xl bg-[#66a939] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#588f31] focus:outline-none focus:ring-2 focus:ring-[#66a939]/35"
            >
              <FiRefreshCw className="h-4 w-4" aria-hidden="true" />
              Reintentar
            </button>

            <Link
              to="/"
              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-2xl border border-[#dbe8cc] bg-white px-5 py-3 text-sm font-semibold text-[#35561a] transition hover:bg-[#f5faef] focus:outline-none focus:ring-2 focus:ring-[#66a939]/20"
            >
              <FiHome className="h-4 w-4" aria-hidden="true" />
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
