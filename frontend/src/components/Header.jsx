import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FiAlertCircle,
  FiAward,
  FiBell,
  FiBookOpen,
  FiCalendar,
  FiCheck,
  FiChevronDown,
  FiChevronRight,
  FiHome,
  FiLogIn,
  FiLogOut,
  FiMap,
  FiMenu,
  FiShield,
  FiTrash2,
  FiUser,
  FiX,
} from "react-icons/fi";
import { NotificationsAPI, getFriendlyApiError } from "../api/api";
import { useAuth } from "../state/auth";
import { notifyError, notifySuccess } from "../utils/feedback";
import { buttonMotion, dropdownVariants } from "./ui/motion";
import Logo from "../assets/ecorg-logo.png";

const MotionButton = motion.button;
const MotionDiv = motion.div;
const MotionImg = motion.img;

function navItemClasses(isActive) {
  return [
    "group inline-flex items-center gap-2 rounded-2xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#66a939]/40",
    isActive
      ? "bg-[#eef6e4] text-[#35561a] shadow-[inset_0_0_0_1px_rgba(102,169,57,0.18)]"
      : "text-slate-600 hover:bg-[#f6faef] hover:text-[#4f7a2f]",
  ].join(" ");
}

function HeaderLink({ to, icon: Icon, children, onClick = undefined }) {
  return (
    <NavLink to={to} onClick={onClick} className={({ isActive }) => navItemClasses(isActive)}>
      {Icon ? <Icon className="h-4 w-4" aria-hidden="true" /> : null}
      <span>{children}</span>
    </NavLink>
  );
}

function formatRelativeDate(value) {
  if (!value) return "Recién";

  const date = new Date(value);
  const diffMs = date.getTime() - Date.now();
  const diffMinutes = Math.round(diffMs / 60000);
  const formatter = new Intl.RelativeTimeFormat("es-AR", { numeric: "auto" });

  if (Math.abs(diffMinutes) < 60) return formatter.format(diffMinutes, "minute");

  const diffHours = Math.round(diffMinutes / 60);
  if (Math.abs(diffHours) < 24) return formatter.format(diffHours, "hour");

  const diffDays = Math.round(diffHours / 24);
  return formatter.format(diffDays, "day");
}

function getNotificationTypeLabel(type) {
  const labels = {
    reporte: "Reporte",
    gamificacion: "Gamificación",
    sistema: "Sistema",
  };

  return labels[type] || "Sistema";
}

export default function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [notificationsError, setNotificationsError] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [markingAll, setMarkingAll] = useState(false);
  const [busyNotificationId, setBusyNotificationId] = useState("");
  const notificationsRef = useRef(null);
  const userMenuRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  const mainLinks = useMemo(
    () => {
      const links = [
        { to: "/", label: "Inicio", icon: FiHome },
        { to: "/mapa", label: "Mapa", icon: FiMap },
        { to: "/calendario", label: "Calendario", icon: FiCalendar },
        { to: "/reportes", label: "Reportes", icon: FiAlertCircle },
        { to: "/educacion", label: "Educación", icon: FiBookOpen },
      ];

      if (!user) {
        links.push({ to: "/gamificacion", label: "Gamificación", icon: FiAward });
      }

      return links;
    },
    [user]
  );

  const userName = user?.nombre?.split(" ")[0] || "Mi cuenta";

  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.read).length,
    [notifications]
  );

  const loadNotifications = useCallback(async () => {
    if (!user) return;

    try {
      setNotificationsLoading(true);
      setNotificationsError("");
      const data = await NotificationsAPI.listMine({ limit: 6 });
      setNotifications(Array.isArray(data?.items) ? data.items : []);
    } catch (error) {
      setNotificationsError(
        getFriendlyApiError(error, "No pudimos cargar tus notificaciones.")
      );
    } finally {
      setNotificationsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setNotificationsOpen(false);
      return;
    }

    loadNotifications();
  }, [user, loadNotifications]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (!notificationsRef.current?.contains(event.target)) {
        setNotificationsOpen(false);
      }
      if (!userMenuRef.current?.contains(event.target)) {
        setUserMenuOpen(false);
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        setNotificationsOpen(false);
        setUserMenuOpen(false);
      }
    }

    function handleRefresh() {
      if (user) {
        loadNotifications();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    window.addEventListener("ecorg:notifications-updated", handleRefresh);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
      window.removeEventListener("ecorg:notifications-updated", handleRefresh);
    };
  }, [user, loadNotifications]);

  const handleLogout = () => {
    logout();
    setOpen(false);
    setNotifications([]);
    setNotificationsOpen(false);
    setUserMenuOpen(false);
    navigate("/login");
  };

  const closeMobile = () => {
    setOpen(false);
    setUserMenuOpen(false);
    setNotificationsOpen(false);
  };

  const handleOpenNotifications = async () => {
    const nextOpen = !notificationsOpen;
    setNotificationsOpen(nextOpen);
    if (nextOpen) {
      await loadNotifications();
    }
  };

  const handleMarkAllNotifications = async () => {
    try {
      setMarkingAll(true);
      await NotificationsAPI.markAllRead();
      setNotifications((current) => current.map((item) => ({ ...item, read: true })));
      notifySuccess("Marcaste todas las notificaciones como leídas.");
    } catch (error) {
      notifyError(
        getFriendlyApiError(error, "No pudimos actualizar tus notificaciones.")
      );
    } finally {
      setMarkingAll(false);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      setBusyNotificationId(id);
      await NotificationsAPI.markRead(id);
      setNotifications((current) =>
        current.map((item) => (item._id === id ? { ...item, read: true } : item))
      );
    } catch (error) {
      notifyError(
        getFriendlyApiError(error, "No pudimos marcar la notificación.")
      );
    } finally {
      setBusyNotificationId("");
    }
  };

  const handleDeleteNotification = async (id) => {
    try {
      setBusyNotificationId(id);
      await NotificationsAPI.remove(id);
      setNotifications((current) => current.filter((item) => item._id !== id));
    } catch (error) {
      notifyError(
        getFriendlyApiError(error, "No pudimos eliminar la notificación.")
      );
    } finally {
      setBusyNotificationId("");
    }
  };

  const openNotificationsPage = () => {
    setNotificationsOpen(false);
    setOpen(false);
    navigate("/notificaciones");
  };

  const goToUserSection = (path) => {
    setUserMenuOpen(false);
    setOpen(false);
    navigate(path);
  };

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-4 lg:px-6">
      <div className="mx-auto max-w-7xl">
        <nav
          aria-label="Navegación principal"
          className="rounded-[28px] border border-[#dce8ce]/90 bg-white/88 shadow-[0_18px_40px_rgba(59,89,34,0.08)] backdrop-blur-xl"
        >
          <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-5 lg:px-6">
            <NavLink
              to="/"
              className="flex items-center rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#66a939]/40"
              onClick={closeMobile}
              aria-label="Ir al inicio de EcoRG"
            >
              <MotionImg
                src={Logo}
                alt="EcoRG"
                whileHover={shouldReduceMotion ? undefined : { scale: 1.02, y: -1 }}
                transition={
                  shouldReduceMotion
                    ? undefined
                    : { type: "spring", stiffness: 320, damping: 22 }
                }
                className="h-12 w-auto sm:h-14"
                draggable="false"
              />
            </NavLink>

            <div className="hidden items-center gap-2 lg:flex">
              {mainLinks.map((link) => (
                <HeaderLink key={link.to} to={link.to} icon={link.icon}>
                  {link.label}
                </HeaderLink>
              ))}
            </div>

            <div className="hidden items-center gap-2 lg:flex">
              {!user ? (
                <MotionDiv {...(shouldReduceMotion ? {} : buttonMotion)}>
                  <NavLink
                  to="/login"
                  className="inline-flex items-center gap-2 rounded-2xl bg-[#66a939] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5a9732] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#66a939]/40"
                  >
                    <FiLogIn className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                    Acceder
                  </NavLink>
                </MotionDiv>
              ) : (
                <>
                  <div className="relative" ref={notificationsRef}>
                    <button
                      type="button"
                      onClick={handleOpenNotifications}
                      className="relative inline-flex items-center justify-center rounded-2xl border border-[#dce8ce] bg-white p-2.5 text-slate-600 transition hover:border-[#66a939] hover:bg-[#f7fbf1] hover:text-[#4f7a2f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#66a939]/40"
                      aria-label="Abrir notificaciones"
                    >
                      <motion.span
                        whileHover={shouldReduceMotion ? undefined : { rotate: -8, scale: 1.05 }}
                        transition={
                          shouldReduceMotion
                            ? undefined
                            : { type: "spring", stiffness: 340, damping: 22 }
                        }
                        className="inline-flex"
                      >
                        <FiBell className="h-5 w-5" />
                      </motion.span>
                      {unreadCount > 0 ? (
                        <span className="absolute -right-1 -top-1 inline-flex min-h-[1.2rem] min-w-[1.2rem] items-center justify-center rounded-full bg-[#66a939] px-1 text-[11px] font-semibold text-white">
                          {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                      ) : null}
                    </button>

                    <AnimatePresence>
                    {notificationsOpen ? (
                      <MotionDiv
                        variants={shouldReduceMotion ? undefined : dropdownVariants}
                        initial={shouldReduceMotion ? false : "hidden"}
                        animate={shouldReduceMotion ? undefined : "visible"}
                        exit={shouldReduceMotion ? undefined : "exit"}
                        className="absolute right-0 top-[calc(100%+12px)] z-50 w-[360px] overflow-hidden rounded-[28px] border border-[#dce8ce] bg-white shadow-[0_24px_60px_rgba(59,89,34,0.16)]"
                      >
                        <div className="flex items-center justify-between border-b border-[#edf3e4] px-4 py-4">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#4f7a2f]">
                              Notificaciones
                            </p>
                            <p className="mt-1 text-sm text-slate-500">
                              {unreadCount > 0 ? `${unreadCount} sin leer` : "Todo al día"}
                            </p>
                          </div>
                          {unreadCount > 0 ? (
                            <button
                              type="button"
                              onClick={handleMarkAllNotifications}
                              disabled={markingAll}
                              className="rounded-2xl bg-[#f5faee] px-3 py-2 text-xs font-semibold text-[#4f7a2f] transition hover:bg-[#eef6e4] disabled:cursor-not-allowed disabled:opacity-70"
                            >
                              {markingAll ? "Actualizando..." : "Marcar todas"}
                            </button>
                          ) : null}
                        </div>

                        <div className="max-h-[420px] overflow-y-auto px-3 py-3">
                          {notificationsLoading ? (
                            <div className="space-y-3">
                              {Array.from({ length: 3 }).map((_, index) => (
                                <div
                                  key={`notification-skeleton-${index + 1}`}
                                  className="animate-pulse rounded-2xl border border-[#edf3e4] bg-[#fbfdf8] p-4"
                                >
                                  <div className="h-3 w-20 rounded-full bg-[#e8f0dc]" />
                                  <div className="mt-3 h-4 w-40 rounded-full bg-[#eef4e5]" />
                                  <div className="mt-2 h-3 w-full rounded-full bg-[#f2f6eb]" />
                                </div>
                              ))}
                            </div>
                          ) : notificationsError ? (
                            <div className="rounded-2xl border border-[#f0d7dc] bg-[#fff8f8] px-4 py-5 text-center">
                              <p className="text-sm leading-6 text-slate-600">{notificationsError}</p>
                              <button
                                type="button"
                                onClick={loadNotifications}
                                className="mt-3 text-sm font-semibold text-[#4f7a2f] transition hover:text-[#35561a]"
                              >
                                Reintentar
                              </button>
                            </div>
                          ) : notifications.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-[#d7e5c5] bg-[#fbfdf8] px-4 py-8 text-center">
                              <p className="text-base font-semibold text-[#203014]">
                                No tenés notificaciones
                              </p>
                              <p className="mt-2 text-sm leading-6 text-slate-600">
                                Cuando haya novedades sobre tus reportes o logros, las vas a ver acá.
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              {notifications.map((item) => (
                                <article
                                  key={item._id}
                                  className={`rounded-2xl border px-4 py-4 ${
                                    item.read
                                      ? "border-[#e5edd9] bg-[#fbfdf8]"
                                      : "border-[#dce8ce] bg-white shadow-sm"
                                  }`}
                                >
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                      <div className="flex flex-wrap items-center gap-2">
                                        <span className="rounded-full bg-[#eef6e4] px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#4f7a2f]">
                                          {getNotificationTypeLabel(item.type)}
                                        </span>
                                        {!item.read ? (
                                          <span className="rounded-full bg-[#edf4ff] px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#25548a]">
                                            Nueva
                                          </span>
                                        ) : null}
                                      </div>
                                      <p className="mt-3 text-sm font-semibold text-[#203014]">
                                        {item.title}
                                      </p>
                                      <p className="mt-2 text-sm leading-6 text-slate-600">
                                        {item.message}
                                      </p>
                                      <p className="mt-3 text-xs font-medium uppercase tracking-[0.12em] text-slate-500">
                                        {formatRelativeDate(item.createdAt)}
                                      </p>
                                    </div>

                                    <div className="flex shrink-0 flex-col gap-2">
                                      {!item.read ? (
                                        <button
                                          type="button"
                                          onClick={() => handleMarkRead(item._id)}
                                          disabled={busyNotificationId === item._id}
                                          className="rounded-xl bg-[#f5faee] px-2.5 py-2 text-[#4f7a2f] transition hover:bg-[#eef6e4] disabled:cursor-not-allowed disabled:opacity-70"
                                          aria-label="Marcar como leída"
                                        >
                                          <FiCheck className="h-4 w-4" />
                                        </button>
                                      ) : null}
                                      <button
                                        type="button"
                                        onClick={() => handleDeleteNotification(item._id)}
                                        disabled={busyNotificationId === item._id}
                                        className="rounded-xl bg-rose-50 px-2.5 py-2 text-rose-600 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-70"
                                        aria-label="Eliminar notificación"
                                      >
                                        <FiTrash2 className="h-4 w-4" />
                                      </button>
                                    </div>
                                  </div>
                                </article>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="border-t border-[#edf3e4] px-4 py-3">
                          <button
                            type="button"
                            onClick={openNotificationsPage}
                            className="w-full rounded-2xl bg-[#f7fbf1] px-4 py-3 text-sm font-semibold text-[#4f7a2f] transition hover:bg-[#eef6e4]"
                          >
                            Ver todas
                          </button>
                        </div>
                      </MotionDiv>
                    ) : null}
                    </AnimatePresence>
                  </div>

                  <div className="relative" ref={userMenuRef}>
                    <MotionButton
                      {...(shouldReduceMotion ? {} : buttonMotion)}
                      type="button"
                      onClick={() => setUserMenuOpen((value) => !value)}
                      className="inline-flex items-center gap-3 rounded-2xl border border-[#dce8ce] bg-white px-3 py-2.5 text-left text-sm font-medium text-slate-600 transition hover:border-[#66a939] hover:bg-[#f7fbf1] hover:text-[#35561a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#66a939]/40"
                      aria-haspopup="menu"
                      aria-expanded={userMenuOpen}
                      aria-label="Abrir menú de usuario"
                    >
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-[#eef6e4] text-[#4f7a2f]">
                        <FiUser className="h-4 w-4" />
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="block max-w-[8rem] truncate font-semibold text-[#203014]">
                            {userName}
                          </span>
                          {user.role === "admin" ? (
                            <span className="rounded-full bg-[#eef6e4] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#4f7a2f]">
                              Admin
                            </span>
                          ) : null}
                        </div>
                      </div>
                      <FiChevronDown
                        className={`h-4 w-4 shrink-0 transition-transform ${
                          userMenuOpen ? "rotate-180" : ""
                        }`}
                      />
                    </MotionButton>

                    <AnimatePresence>
                    {userMenuOpen ? (
                      <MotionDiv
                        variants={shouldReduceMotion ? undefined : dropdownVariants}
                        initial={shouldReduceMotion ? false : "hidden"}
                        animate={shouldReduceMotion ? undefined : "visible"}
                        exit={shouldReduceMotion ? undefined : "exit"}
                        className="absolute right-0 top-[calc(100%+12px)] z-50 w-[250px] rounded-[28px] border border-[#dce8ce] bg-white p-2 shadow-[0_24px_60px_rgba(59,89,34,0.16)]"
                      >
                        <button
                          type="button"
                          onClick={() => goToUserSection("/perfil")}
                          className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-medium text-slate-600 transition hover:bg-[#f7fbf1] hover:text-[#35561a]"
                        >
                          <FiUser className="h-4 w-4 text-[#4f7a2f]" />
                          <span>Perfil</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => goToUserSection("/gamificacion")}
                          className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-medium text-slate-600 transition hover:bg-[#f7fbf1] hover:text-[#35561a]"
                        >
                          <FiAward className="h-4 w-4 text-[#4f7a2f]" />
                          <span>{user.role === "admin" ? "Gamificación" : "Mis logros"}</span>
                        </button>
                        {user.role === "admin" ? (
                          <button
                            type="button"
                            onClick={() => goToUserSection("/admin")}
                            className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-medium text-slate-600 transition hover:bg-[#f7fbf1] hover:text-[#35561a]"
                          >
                            <FiShield className="h-4 w-4 text-[#4f7a2f]" />
                            <span>Panel admin</span>
                          </button>
                        ) : null}
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-medium text-rose-600 transition hover:bg-rose-50"
                        >
                          <FiLogOut className="h-4 w-4" />
                          <span>Salir</span>
                        </button>
                      </MotionDiv>
                    ) : null}
                    </AnimatePresence>
                  </div>
                </>
              )}
            </div>

            <button
              type="button"
              className="inline-flex items-center justify-center rounded-2xl border border-[#dce8ce] bg-white p-2.5 text-slate-600 transition hover:border-[#66a939] hover:bg-[#f7fbf1] hover:text-[#4f7a2f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#66a939]/40 lg:hidden"
              aria-label={open ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((value) => !value)}
            >
              <motion.span
                whileHover={shouldReduceMotion ? undefined : { scale: 1.06, rotate: open ? -8 : 8 }}
                transition={
                  shouldReduceMotion
                    ? undefined
                    : { type: "spring", stiffness: 340, damping: 22 }
                }
                className="inline-flex"
              >
                {open ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
              </motion.span>
            </button>
          </div>

          <div
            id="mobile-menu"
            className={`overflow-hidden border-t border-[#e7efdb] transition-all duration-300 lg:hidden ${
              open ? "max-h-[80vh] overflow-y-auto" : "max-h-0"
            }`}
          >
            <div className="space-y-5 px-4 py-4 sm:px-5">
              <div className="grid gap-2">
                {mainLinks.map((link) => (
                  <HeaderLink
                    key={link.to}
                    to={link.to}
                    icon={link.icon}
                    onClick={closeMobile}
                  >
                    {link.label}
                  </HeaderLink>
                ))}
              </div>

              <div className="rounded-[24px] border border-[#e5eed8] bg-[#fbfdf8] p-3">
                {!user ? (
                  <NavLink
                    to="/login"
                    onClick={closeMobile}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#66a939] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#5a9732] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#66a939]/40"
                  >
                    <FiLogIn className="h-4 w-4" />
                    Acceder
                  </NavLink>
                ) : (
                  <div className="space-y-2">
                    <HeaderLink to="/notificaciones" icon={FiBell} onClick={closeMobile}>
                      Notificaciones
                      {unreadCount > 0 ? (
                        <span className="ml-auto rounded-full bg-[#eef6e4] px-2 py-1 text-xs font-semibold text-[#4f7a2f]">
                          {unreadCount}
                        </span>
                      ) : null}
                    </HeaderLink>
                    <HeaderLink to="/perfil" icon={FiUser} onClick={closeMobile}>
                      Perfil
                    </HeaderLink>
                    <HeaderLink to="/gamificacion" icon={FiAward} onClick={closeMobile}>
                      {user.role === "admin" ? "Gamificación" : "Mis logros"}
                    </HeaderLink>
                    {user.role === "admin" && (
                      <HeaderLink to="/admin" icon={FiShield} onClick={closeMobile}>
                        Panel admin
                      </HeaderLink>
                    )}
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="inline-flex w-full items-center justify-between rounded-2xl px-3.5 py-3 text-left text-sm font-medium text-slate-500 transition hover:bg-rose-50 hover:text-rose-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-200"
                    >
                      <span className="inline-flex items-center gap-2">
                        <FiLogOut className="h-4 w-4" />
                        Salir
                      </span>
                      <FiChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}

