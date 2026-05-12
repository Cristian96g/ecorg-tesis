import { Suspense } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AppRoutes from "./Router";
import ErrorBoundary from "./components/ErrorBoundary";
import Footer from "./components/Footer";
import Header from "./components/Header";
import ScrollToTopButton from "./components/ScrollTopTop";
import LoadingState from "./components/ui/LoadingState";
import { pageVariants } from "./components/ui/motion";

const MotionDiv = motion.div;

function App() {
  const { pathname } = useLocation();
  const shouldReduceMotion = useReducedMotion();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <ErrorBoundary resetKey={pathname}>
      <div className="min-h-screen">
        {!isAdmin && <Header />}

        <main className="mx-auto">
          <Suspense
            fallback={
              <div className="mx-auto max-w-7xl px-6 py-10 md:px-8">
                <LoadingState
                  title="Cargando sección"
                  description="Esperá un momento mientras preparamos esta vista de EcoRG."
                />
              </div>
            }
          >
            <AnimatePresence mode="wait">
              <MotionDiv
                key={pathname}
                initial={shouldReduceMotion ? false : "hidden"}
                animate={shouldReduceMotion ? undefined : "visible"}
                exit={shouldReduceMotion ? undefined : "exit"}
                variants={shouldReduceMotion ? undefined : pageVariants}
              >
                <AppRoutes />
              </MotionDiv>
            </AnimatePresence>
          </Suspense>
        </main>

        {!isAdmin && <Footer />}
        <ScrollToTopButton />

        <ToastContainer
          position="top-right"
          autoClose={3200}
          hideProgressBar
          newestOnTop
          closeOnClick
          pauseOnHover
          theme="light"
          toastClassName={() =>
            "!min-h-0 !rounded-2xl !border !border-[#d8e7c5] !bg-white !px-3 !py-3 !text-sm !text-slate-700 !shadow-[0_18px_40px_rgba(59,89,34,0.14)]"
          }
          bodyClassName={() => "!m-0 !p-0 !font-medium"}
          className="!py-2"
        />
      </div>
    </ErrorBoundary>
  );
}

export default App;
