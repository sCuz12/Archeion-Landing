import { useEffect, useRef, useState } from "react";
import {
  LuArrowRight,
  LuBellRing,
  LuChevronLeft,
  LuChevronRight,
  LuClipboardList,
  LuFileCheck,
  LuFileX,
  LuFolder,
  LuLayoutDashboard,
  LuLink,
  LuMail,
  LuMessageSquare,
  LuSend,
  LuShieldCheck,
  LuUpload,
  LuUser,
  LuUsers,
} from "react-icons/lu";
import dashboardView from "./assets/dashboard_1.png";
import clientNew from "./assets/create_client.png"
import newRequests from "./assets/new_requests.png";
import requestsView from "./assets/requests_1.png";
import requestAssignments from "./assets/requests_assignments_1.png"
import notificationsView from "./assets/notifications.png";
import uploadPage from "./assets/upload_page.png"
import emailReceive from "./assets/email_receive.png"
import wordmarkLogo from "./assets/horizontal-wordmark-docminder-tra.svg";
import { translations } from "./translations";

const problemIllustrations = [
  <LuMessageSquare key="whatsapp" className="w-10 h-10 text-emerald-700" />,
  <LuMail key="email" className="w-10 h-10 text-amber-700" />,
  <LuFileX key="missing" className="w-10 h-10 text-violet-700" />,
];

const featureIllustrations = [
  <LuClipboardList key="track" className="w-12 h-12 text-emerald-700" />,
  <LuBellRing key="reminders" className="w-12 h-12 text-amber-700" />,
  <LuFolder key="folder" className="w-12 h-12 text-blue-700" />,
];

function StepCard({ index, title, body }) {
  return (
    <div className="relative p-8 bg-white border shadow-sm rounded-3xl border-black/10">
      <div className="absolute flex items-center justify-center w-10 h-10 text-base font-bold rounded-full right-4 top-4 bg-emerald-50 text-accentDark">
        {index + 1}
      </div>
      <p className="text-lg font-semibold text-ink">{title}</p>
      <p className="mt-3 text-base text-muted">{body}</p>
    </div>
  );
}

const BREVO_API_KEY = import.meta.env.VITE_BREVO_API_KEY;

export default function App() {
  const [lang, setLang] = useState("en");
  const t = translations[lang];

  const [active, setActive] = useState(0);
  const revealRefs = useRef([]);
  const [isPaused, setIsPaused] = useState(false);
  const [lightbox, setLightbox] = useState(null);
  const [email, setEmail] = useState("");
  const [submitStatus, setSubmitStatus] = useState("idle"); // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState("");

  const months = [
    {
      label: t.march2026,
      complete: t.complete_12_18,
      missing: 6,
      rows: [
        { name: "Georgiou & Co", status: t.missing3, type: "warn" },
        { name: "Karina Travel Ltd", status: t.allReceived, type: "ok" },
        { name: "Limassol Auto", status: t.missing2, type: "warn" },
        { name: "Oceanic Supplies", status: t.missing1, type: "warn" },
      ],
    },
    {
      label: t.february2026,
      complete: t.complete_18_18,
      missing: 0,
      rows: [
        { name: "Georgiou & Co", status: t.allReceived, type: "ok" },
        { name: "Karina Travel Ltd", status: t.allReceived, type: "ok" },
        { name: "Limassol Auto", status: t.allReceived, type: "ok" },
        { name: "Oceanic Supplies", status: t.allReceived, type: "ok" },
      ],
    },
    {
      label: t.january2026,
      complete: t.complete_16_18,
      missing: 2,
      rows: [
        { name: "Georgiou & Co", status: t.allReceived, type: "ok" },
        { name: "Karina Travel Ltd", status: t.missing1, type: "warn" },
        { name: "Limassol Auto", status: t.missing1, type: "warn" },
        { name: "Oceanic Supplies", status: t.allReceived, type: "ok" },
      ],
    },
  ];

  const month = months[active];

  const problemCards = [
    {
      title: t.card1Title,
      body: t.card1Body,
      stat: "50+",
      statLabel: t.card1StatLabel,
    },
    {
      title: t.card2Title,
      body: t.card2Body,
      stat: "30%",
      statLabel: t.card2StatLabel,
    },
    {
      title: t.card3Title,
      body: t.card3Body,
      stat: "12+",
      statLabel: t.card3StatLabel,
    },
  ];

  const steps = [
    { title: t.solStep1Title, body: t.solStep1Body },
    { title: t.solStep2Title, body: t.solStep2Body },
    { title: t.solStep3Title, body: t.solStep3Body },
  ];

  const features = [
    { title: t.feat1Title, body: t.feat1Body, highlight: t.feat1Highlight },
    { title: t.feat2Title, body: t.feat2Body, highlight: t.feat2Highlight },
    { title: t.feat3Title, body: t.feat3Body, highlight: t.feat3Highlight },
  ];

  const slides = [
    { src: dashboardView, alt: "DocMinder dashboard overview", caption: t.slide1Caption },
    { src: clientNew, alt: "Create new client", caption: t.slide2Caption },
    { src: newRequests, alt: "New document requests", caption: t.slide3Caption },
    { src: requestsView, alt: "Requests overview", caption: t.slide4Caption },
    { src: requestAssignments, alt: "Request assignments", caption: t.slide5Caption },
    { src: emailReceive, alt: "Email Received", caption: t.slide6Caption },
    { src: uploadPage, alt: "Document upload page", caption: t.slide7Caption },
    { src: notificationsView, alt: "Notifications", caption: t.slide8Caption },
  ];

  const [slideIndex, setSlideIndex] = useState(0);
  const prefersReducedMotion = useRef(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email || submitStatus === "loading") return;

    setSubmitStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("https://api.brevo.com/v3/contacts", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "api-key": BREVO_API_KEY,
        },
        body: JSON.stringify({
          email: email,
          listIds: [2],
          updateEnabled: true,
        }),
      });

      if (response.ok || response.status === 201) {
        setSubmitStatus("success");
        setEmail("");
      } else {
        const data = await response.json();
        if (data.code === "duplicate_parameter") {
          setSubmitStatus("success");
        } else {
          throw new Error(data.message || "Failed to subscribe");
        }
      }
    } catch (error) {
      setSubmitStatus("error");
      setErrorMessage(error.message || "Something went wrong. Please try again.");
    }
  };

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") setLightbox(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      prefersReducedMotion.current = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
    }

    const elements = revealRefs.current.filter(Boolean);
    if (!elements.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (prefersReducedMotion.current || isPaused) return undefined;
    const timer = setInterval(() => {
      setSlideIndex((current) => (current + 1) % slides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [isPaused, slides.length]);

  const goPrev = () => {
    setSlideIndex((current) =>
      current === 0 ? slides.length - 1 : current - 1
    );
  };

  const goNext = () => {
    setSlideIndex((current) => (current + 1) % slides.length);
  };

  return (
    <div className="relative overflow-hidden">
      <div className="absolute w-64 h-64 -translate-x-1/2 rounded-full pointer-events-none -top-24 left-1/2 bg-emerald-200/40 blur-3xl animate-glow" />
      <div className="absolute w-48 h-48 rounded-full pointer-events-none top-40 right-10 bg-amber-200/40 blur-3xl animate-glow" />

      <header className="px-6 pt-6">
        <div className="flex items-center justify-between w-full max-w-6xl mx-auto">
          <div className="flex items-center">
            <img
              src={wordmarkLogo}
              alt="DocMinder"
              className="w-auto h-8 md:h-9 lg:h-10"
            />
          </div>
          <div className="flex items-center gap-3">
            {/* Language switcher */}
            <div className="flex items-center gap-1 p-1 bg-white border rounded-full shadow-sm border-black/10">
              {["en", "el"].map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`rounded-full px-3 py-1 text-sm font-semibold transition-all duration-200 ${
                    lang === l
                      ? "bg-ink text-white shadow-sm"
                      : "text-muted hover:text-ink"
                  }`}
                >
                  {l === "en" ? "EN" : "EL"}
                </button>
              ))}
            </div>
            <a
              href="#waitlist"
              className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold shadow-sm transition hover:-translate-y-0.5"
            >
              {t.navCta}
            </a>
          </div>
        </div>
      </header>

      <main>
        <section
          className="px-6 pb-32 pt-28 reveal"
          ref={(el) => (revealRefs.current[0] = el)}
        >
          <div className="mx-auto grid w-full max-w-6xl gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="mb-5 text-sm font-semibold uppercase tracking-[0.35em] text-muted">
                {t.heroTagline}
              </p>
              <h1 className="text-5xl font-semibold leading-tight font-display text-ink md:text-7xl">
                {t.heroHeading}
              </h1>
              <p className="text-2xl mt-7 text-muted">
                {t.heroSubheading}
              </p>
              <div className="flex flex-wrap gap-4 mt-8">
                <div className="flex items-center gap-3 px-5 py-3 bg-white border shadow-sm rounded-2xl border-black/10">
                  <span className="text-3xl font-bold text-accent">10+</span>
                  <span className="text-sm leading-tight whitespace-pre-line text-muted">{t.statHoursSaved}</span>
                </div>
                <div className="flex items-center gap-3 px-5 py-3 bg-white border shadow-sm rounded-2xl border-black/10">
                  <span className="text-3xl font-bold text-accent">80%</span>
                  <span className="text-sm leading-tight whitespace-pre-line text-muted">{t.statFewerFollowups}</span>
                </div>
                <div className="flex items-center gap-3 px-5 py-3 bg-white border shadow-sm rounded-2xl border-black/10">
                  <span className="text-3xl font-bold text-accent">3x</span>
                  <span className="text-sm leading-tight whitespace-pre-line text-muted">{t.statFasterCollection}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 mt-6 text-sm font-semibold text-ink/80">
                {[t.badge1, t.badge2, t.badge3].map((item) => (
                  <span
                    key={item}
                    className="px-4 py-2 bg-white border rounded-full border-black/10"
                  >
                    {item}
                  </span>
                ))}
                <span className="flex items-center gap-1.5 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-full text-accentDark">
                  <LuShieldCheck className="w-4 h-4" />
                  {t.badgeEncrypted}
                </span>
              </div>
              <form
                id="waitlist"
                className="flex flex-col gap-3 mt-8 sm:flex-row"
                onSubmit={handleSubscribe}
              >
                <input
                  type="email"
                  placeholder={t.emailPlaceholder}
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={submitStatus === "loading" || submitStatus === "success"}
                  className="flex-1 px-6 text-lg bg-white border rounded-full shadow-sm h-14 border-black/10 focus:border-emerald-500 focus:outline-none disabled:opacity-50"
                />
                <button
                  className="h-14 rounded-full bg-accent px-7 text-lg font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-accentDark disabled:opacity-50 disabled:hover:translate-y-0"
                  type="submit"
                  disabled={submitStatus === "loading" || submitStatus === "success"}
                >
                  {submitStatus === "loading" ? t.ctaLoading : submitStatus === "success" ? t.ctaSuccess : t.ctaButton}
                </button>
              </form>
              {submitStatus === "success" ? (
                <p className="mt-4 text-base font-semibold text-accent">
                  {t.heroSuccessMsg}
                </p>
              ) : submitStatus === "error" ? (
                <p className="mt-4 text-base text-red-600">
                  {errorMessage}
                </p>
              ) : (
                <p className="mt-4 text-base text-muted">
                  {t.heroSubtext}
                </p>
              )}
            </div>

            <div className="relative">
              {/* Decorative floating documents illustration */}
              <svg className="absolute hidden w-24 h-24 -right-8 -top-12 lg:block" viewBox="0 0 100 100" fill="none" aria-hidden="true">
                <rect x="10" y="20" width="35" height="45" rx="4" stroke="#1e7f6d" strokeWidth="2" fill="white" transform="rotate(-12 27 42)"/>
                <path d="M18 35 L38 35 M18 42 L32 42" stroke="#1e7f6d" strokeWidth="2" strokeLinecap="round" transform="rotate(-12 27 42)"/>
                <circle cx="70" cy="25" r="12" stroke="#1e7f6d" strokeWidth="2" fill="white"/>
                <path d="M66 25 L69 28 L75 22" stroke="#1e7f6d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <svg className="absolute hidden w-20 h-20 -left-12 bottom-20 lg:block" viewBox="0 0 80 80" fill="none" aria-hidden="true">
                <rect x="10" y="15" width="30" height="40" rx="3" stroke="#f1c48c" strokeWidth="2" fill="white" transform="rotate(8 25 35)"/>
                <path d="M16 28 L34 28 M16 35 L28 35" stroke="#f1c48c" strokeWidth="2" strokeLinecap="round" transform="rotate(8 25 35)"/>
                <path d="M50 50 L65 35" stroke="#1e7f6d" strokeWidth="2" strokeLinecap="round" strokeDasharray="4 4"/>
                <circle cx="68" cy="32" r="8" stroke="#1e7f6d" strokeWidth="2" fill="#cfeadf"/>
                <path d="M65 32 L67 34 L72 29" stroke="#1e7f6d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div className="absolute -left-6 -top-6 hidden h-full w-full rounded-[32px] border border-black/5 bg-white/50 lg:block" />
              <div className="relative rounded-[28px] border border-black/10 bg-white p-8 shadow-soft">
                <div className="flex items-center justify-between text-base text-muted">
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-50 text-accentDark">
                    {month.label}
                  </span>
                  <span>{month.complete}</span>
                </div>
                <div className="grid gap-3 mt-5">
                  {month.rows.map((row) => (
                    <div
                      key={row.name}
                      className="flex items-center justify-between px-5 py-4 text-base rounded-xl bg-highlight"
                    >
                      <span>{row.name}</span>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          row.type === "ok" ? "bg-ok" : "bg-warn"
                        }`}
                      >
                        {row.status}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-3 mt-5">
                  <button className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white">
                    {t.btnSendReminders}
                  </button>
                  <button className="rounded-full bg-highlight px-5 py-2.5 text-sm font-semibold text-ink">
                    {t.btnViewDashboard}
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-6">
                {months.map((item, index) => (
                  <button
                    key={item.label}
                    onClick={() => setActive(index)}
                    className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                      active === index
                        ? "bg-ink text-white"
                        : "bg-white text-ink/70"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <p className="mt-4 text-base text-muted">
                {t.heroCaption}
              </p>
            </div>
          </div>
        </section>

        <section
          className="px-6 py-32 border-t border-black/5 reveal"
          ref={(el) => (revealRefs.current[1] = el)}
        >
          <div className="w-full max-w-6xl mx-auto">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-muted">
                {t.problemLabel}
              </p>
              <h2 className="mt-5 text-4xl font-semibold font-display text-ink md:text-6xl">
                {t.problemHeading}
              </h2>
              <p className="mt-5 text-xl text-muted">
                {t.problemSubheading}
              </p>
            </div>
            <div className="px-8 py-6 mt-10 bg-white border rounded-3xl border-black/10 shadow-soft">
              <div className="flex flex-wrap items-center justify-between gap-6">
                <div>
                  <p className="mt-3 text-xl font-semibold text-ink">
                    {t.messyInboxTitle}
                  </p>
                  <p className="mt-2 text-base text-muted">
                    {t.messyInboxDesc}
                  </p>
                </div>
                <svg
                  viewBox="0 0 300 160"
                  className="h-36 w-full max-w-[360px]"
                  fill="none"
                  aria-hidden="true"
                >
                  {/* Background */}
                  <rect x="5" y="5" width="290" height="150" rx="20" fill="#F8F4EF"/>

                  {/* Scattered documents */}
                  <rect x="20" y="25" width="50" height="65" rx="4" fill="white" stroke="#e5e0db" strokeWidth="1.5" transform="rotate(-15 45 57)"/>
                  <path d="M28 45 L55 45 M28 55 L48 55" stroke="#d4cfc8" strokeWidth="2" strokeLinecap="round" transform="rotate(-15 45 57)"/>

                  <rect x="60" y="50" width="50" height="65" rx="4" fill="white" stroke="#e5e0db" strokeWidth="1.5" transform="rotate(8 85 82)"/>
                  <path d="M68 70 L95 70 M68 80 L88 80" stroke="#d4cfc8" strokeWidth="2" strokeLinecap="round" transform="rotate(8 85 82)"/>

                  <rect x="100" y="20" width="50" height="65" rx="4" fill="white" stroke="#e5e0db" strokeWidth="1.5" transform="rotate(-5 125 52)"/>
                  <path d="M108 40 L135 40 M108 50 L128 50" stroke="#d4cfc8" strokeWidth="2" strokeLinecap="round" transform="rotate(-5 125 52)"/>

                  {/* WhatsApp bubble */}
                  <rect x="170" y="20" width="70" height="35" rx="12" fill="#25D366" fillOpacity="0.15" stroke="#25D366" strokeWidth="1.5"/>
                  <circle cx="185" cy="37" r="6" fill="#25D366" fillOpacity="0.3"/>
                  <path d="M198 32 L225 32 M198 42 L215 42" stroke="#25D366" strokeWidth="2" strokeLinecap="round"/>

                  {/* Email icon */}
                  <rect x="180" y="70" width="55" height="40" rx="6" fill="#f1c48c" fillOpacity="0.2" stroke="#f1c48c" strokeWidth="1.5"/>
                  <path d="M185 78 L207 92 L230 78" stroke="#f1c48c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>

                  {/* Question marks - confusion */}
                  <text x="250" y="45" fill="#dc6b6b" fontSize="20" fontWeight="bold">?</text>
                  <text x="145" y="100" fill="#dc6b6b" fontSize="16" fontWeight="bold">?</text>
                  <text x="265" y="90" fill="#dc6b6b" fontSize="14" fontWeight="bold">?</text>

                  {/* Red X marks */}
                  <circle cx="55" cy="115" r="12" fill="#fee2e2"/>
                  <path d="M50 110 L60 120 M60 110 L50 120" stroke="#dc6b6b" strokeWidth="2" strokeLinecap="round"/>

                  {/* Clock - wasted time */}
                  <circle cx="250" cy="125" r="18" fill="white" stroke="#f1c48c" strokeWidth="2"/>
                  <path d="M250 115 L250 125 L258 130" stroke="#f1c48c" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
            </div>
            <div className="grid gap-8 mt-14 md:grid-cols-3">
              {problemCards.map((item, index) => (
                <div
                  key={item.title}
                  className="p-10 bg-white border shadow-sm rounded-3xl border-black/10 stagger-item"
                  style={{ transitionDelay: `${index * 90}ms` }}
                >
                  <div className="flex items-center justify-between mb-5">
                    <div className="p-3 rounded-2xl bg-highlight">
                      {problemIllustrations[index]}
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-ink">{item.stat}</span>
                      <p className="text-xs text-muted">{item.statLabel}</p>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold font-display">
                    {item.title}
                  </h3>
                  <p className="mt-4 text-base text-muted">{item.body}</p>
                </div>
              ))}
            </div>

            <div className="grid gap-3 mt-12 text-lg text-ink">
              <p className="flex items-center gap-3"><span className="font-bold text-accent">30%</span> {t.stat30desc}</p>
              <p className="flex items-center gap-3"><span className="font-bold text-accent">40%</span> {t.stat40desc}</p>
              <p className="flex items-center gap-3"><span className="font-bold text-accent">12+</span> {t.stat12desc}</p>
            </div>
          </div>
        </section>

        {/* Workflow Diagram Section */}
        <section
          className="px-6 py-24 border-t border-black/5 bg-gradient-to-b from-white to-emerald-50/30 reveal"
          ref={(el) => (revealRefs.current[7] = el)}
        >
          <div className="w-full max-w-6xl mx-auto">
            <div className="max-w-2xl mx-auto mb-16 text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-muted">
                {t.howLabel}
              </p>
              <h2 className="mt-5 text-4xl font-semibold font-display text-ink md:text-5xl">
                {t.howHeading}
              </h2>
            </div>

            {/* Desktop Workflow - Horizontal */}
            <div className="hidden lg:block">
              <div className="flex items-center justify-between gap-4">
                {/* Step 1 */}
                <div className="flex-1 text-center">
                  <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 bg-white border shadow-sm rounded-2xl border-black/10">
                    <LuClipboardList className="w-10 h-10 text-accent" />
                  </div>
                  <div className="p-5 bg-white border shadow-sm rounded-2xl border-black/10">
                    <span className="inline-block px-2 py-1 mb-2 text-xs font-bold text-white rounded-full bg-accent">1</span>
                    <h3 className="font-semibold text-ink">{t.step1Title}</h3>
                    <p className="mt-1 text-sm text-muted">{t.step1Desc}</p>
                  </div>
                </div>

                {/* Arrow */}
                <div className="flex flex-col items-center flex-shrink-0">
                  <LuArrowRight className="w-8 h-8 text-accent/50" />
                  <div className="w-16 h-0.5 bg-gradient-to-r from-accent/50 to-accent/20 -mt-4"></div>
                </div>

                {/* Step 2 */}
                <div className="flex-1 text-center">
                  <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 bg-white border shadow-sm rounded-2xl border-black/10">
                    <LuLink className="w-10 h-10 text-amber-600" />
                  </div>
                  <div className="p-5 bg-white border shadow-sm rounded-2xl border-black/10">
                    <span className="inline-block px-2 py-1 mb-2 text-xs font-bold text-white rounded-full bg-amber-500">2</span>
                    <h3 className="font-semibold text-ink">{t.step2Title}</h3>
                    <p className="mt-1 text-sm text-muted">{t.step2Desc}</p>
                  </div>
                </div>

                {/* Arrow */}
                <div className="flex flex-col items-center flex-shrink-0">
                  <LuArrowRight className="w-8 h-8 text-amber-500/50" />
                  <div className="w-16 h-0.5 bg-gradient-to-r from-amber-500/50 to-amber-500/20 -mt-4"></div>
                </div>

                {/* Step 3 */}
                <div className="flex-1 text-center">
                  <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 bg-white border shadow-sm rounded-2xl border-black/10">
                    <LuUpload className="w-10 h-10 text-blue-600" />
                  </div>
                  <div className="p-5 bg-white border shadow-sm rounded-2xl border-black/10">
                    <span className="inline-block px-2 py-1 mb-2 text-xs font-bold text-white bg-blue-500 rounded-full">3</span>
                    <h3 className="font-semibold text-ink">{t.step3Title}</h3>
                    <p className="mt-1 text-sm text-muted">{t.step3Desc}</p>
                  </div>
                </div>

                {/* Arrow */}
                <div className="flex flex-col items-center flex-shrink-0">
                  <LuArrowRight className="w-8 h-8 text-blue-500/50" />
                  <div className="w-16 h-0.5 bg-gradient-to-r from-blue-500/50 to-blue-500/20 -mt-4"></div>
                </div>

                {/* Step 4 */}
                <div className="flex-1 text-center">
                  <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 bg-white border shadow-sm rounded-2xl border-black/10">
                    <LuLayoutDashboard className="w-10 h-10 text-emerald-600" />
                  </div>
                  <div className="p-5 bg-white border shadow-sm rounded-2xl border-black/10">
                    <span className="inline-block px-2 py-1 mb-2 text-xs font-bold text-white rounded-full bg-emerald-500">4</span>
                    <h3 className="font-semibold text-ink">{t.step4Title}</h3>
                    <p className="mt-1 text-sm text-muted">{t.step4Desc}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Workflow - Vertical */}
            <div className="space-y-6 lg:hidden">
              {[
                { icon: LuClipboardList, color: "accent", bgColor: "bg-accent", title: t.step1Title, desc: t.step1Desc, num: 1 },
                { icon: LuLink, color: "amber-600", bgColor: "bg-amber-500", title: t.step2Title, desc: t.step2Desc, num: 2 },
                { icon: LuUpload, color: "blue-600", bgColor: "bg-blue-500", title: t.step3Title, desc: t.step3Desc, num: 3 },
                { icon: LuLayoutDashboard, color: "emerald-600", bgColor: "bg-emerald-500", title: t.step4Title, desc: t.step4Desc, num: 4 },
              ].map((step, index) => (
                <div key={step.num} className="flex items-center gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-14 h-14 rounded-xl bg-white border border-black/10 shadow-sm flex items-center justify-center`}>
                      <step.icon className={`w-7 h-7 text-${step.color}`} />
                    </div>
                    {index < 3 && <div className="w-0.5 h-6 bg-black/10 mt-2"></div>}
                  </div>
                  <div className="flex-1 p-4 bg-white border shadow-sm rounded-xl border-black/10">
                    <span className={`inline-block px-2 py-0.5 text-xs font-bold rounded-full ${step.bgColor} text-white mb-1`}>{step.num}</span>
                    <h3 className="font-semibold text-ink">{step.title}</h3>
                    <p className="text-sm text-muted">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Visual summary */}
            <div className="mt-16 text-center">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-white border rounded-full shadow-sm border-black/10">
                <LuFileCheck className="w-5 h-5 text-accent" />
                <span className="font-medium text-ink">{t.howSummary}</span>
              </div>
            </div>
          </div>
        </section>

        <section
          className="px-6 py-32 border-t border-black/5 bg-white/60 reveal"
          ref={(el) => (revealRefs.current[2] = el)}
        >
          <div className="mx-auto grid w-full max-w-6xl gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-muted">
                {t.solutionLabel}
              </p>
              <h2 className="mt-5 text-4xl font-semibold font-display text-ink md:text-6xl">
                {t.solutionHeading}
              </h2>
              <div className="grid gap-6 mt-12">
                {steps.map((step, index) => (
                  <StepCard
                    key={index}
                    index={index}
                    title={step.title}
                    body={step.body}
                  />
                ))}
              </div>
            </div>

            <div className="relative">
              {/* Decorative organized documents illustration */}
              <svg className="absolute hidden -right-6 -top-10 w-28 h-28 lg:block" viewBox="0 0 120 120" fill="none" aria-hidden="true">
                <rect x="30" y="20" width="45" height="58" rx="4" fill="white" stroke="#1e7f6d" strokeWidth="2"/>
                <path d="M38 35 L65 35 M38 45 L58 45 M38 55 L62 55" stroke="#1e7f6d" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
                <rect x="35" y="25" width="45" height="58" rx="4" fill="white" stroke="#1e7f6d" strokeWidth="2"/>
                <path d="M43 40 L70 40 M43 50 L63 50 M43 60 L67 60" stroke="#1e7f6d" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
                <circle cx="90" cy="35" r="15" fill="#cfeadf" stroke="#1e7f6d" strokeWidth="2"/>
                <path d="M83 35 L88 40 L97 30" stroke="#1e7f6d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <svg className="absolute hidden w-20 h-20 -left-8 bottom-10 lg:block" viewBox="0 0 80 80" fill="none" aria-hidden="true">
                <path d="M10 60 Q 25 40 40 45 Q 55 50 70 30" stroke="#1e7f6d" strokeWidth="2" strokeLinecap="round" fill="none" strokeDasharray="4 3"/>
                <path d="M65 25 L70 30 L65 35" stroke="#1e7f6d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                <rect x="5" y="50" width="20" height="26" rx="3" fill="white" stroke="#1e7f6d" strokeWidth="1.5"/>
                <path d="M9 58 L20 58 M9 64 L17 64" stroke="#1e7f6d" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
              </svg>
              <div className="p-10 bg-white border rounded-3xl border-black/10 shadow-soft">
                <p className="text-base font-semibold text-muted">
                  {t.missingOverview}
                </p>
              <div className="space-y-4 mt-7">
                {[
                  { label: t.march2026, status: t.missing6, tone: "warn" },
                  { label: t.february2026, status: t.allReceived, tone: "ok" },
                  { label: t.january2026, status: t.allReceived, tone: "ok" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between px-6 py-4 text-base rounded-xl bg-highlight"
                  >
                    <span>{item.label}</span>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        item.tone === "warn" ? "bg-warn" : "bg-ok"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between mt-6 text-sm text-muted">
                <span>{t.autoReminders}</span>
                <span>{t.everyFriday}</span>
              </div>
              </div>
            </div>
          </div>
        </section>

        <section
          className="px-6 py-24 border-t border-black/5 bg-gradient-to-b from-emerald-50/50 to-white reveal"
          ref={(el) => (revealRefs.current[6] = el)}
        >
          <div className="w-full max-w-6xl mx-auto">
            <div className="max-w-2xl mx-auto mb-16 text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-muted">
                {t.impactLabel}
              </p>
              <h2 className="mt-5 text-4xl font-semibold font-display text-ink md:text-5xl">
                {t.impactHeading}
              </h2>
              <p className="mt-5 text-xl text-muted">
                {t.impactSubheading}
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-4">
              <div className="p-8 text-center bg-white border shadow-sm rounded-3xl border-black/10">
                <span className="text-5xl font-bold md:text-6xl text-accent">10+</span>
                <p className="mt-3 text-lg font-semibold text-ink">{t.impact1Label}</p>
                <p className="mt-2 text-sm text-muted">{t.impact1Desc}</p>
              </div>
              <div className="p-8 text-center bg-white border shadow-sm rounded-3xl border-black/10">
                <span className="text-5xl font-bold md:text-6xl text-accent">80%</span>
                <p className="mt-3 text-lg font-semibold text-ink">{t.impact2Label}</p>
                <p className="mt-2 text-sm text-muted">{t.impact2Desc}</p>
              </div>
              <div className="p-8 text-center bg-white border shadow-sm rounded-3xl border-black/10">
                <span className="text-5xl font-bold md:text-6xl text-accent">3x</span>
                <p className="mt-3 text-lg font-semibold text-ink">{t.impact3Label}</p>
                <p className="mt-2 text-sm text-muted">{t.impact3Desc}</p>
              </div>
              <div className="p-8 text-center bg-white border shadow-sm rounded-3xl border-black/10">
                <span className="text-5xl font-bold md:text-6xl text-accent">100%</span>
                <p className="mt-3 text-lg font-semibold text-ink">{t.impact4Label}</p>
                <p className="mt-2 text-sm text-muted">{t.impact4Desc}</p>
              </div>
            </div>
          </div>
        </section>

        <section
          className="bg-[#f7f5f2] px-6 py-36 border-t border-black/5 reveal"
          ref={(el) => (revealRefs.current[3] = el)}
        >
          <div className="w-full max-w-6xl mx-auto">
            <div className="max-w-2xl">
              <p className="text-base font-semibold uppercase tracking-[0.35em] text-muted">
                {t.featuresLabel}
              </p>
              <h2 className="mt-6 text-5xl font-semibold font-display text-ink md:text-7xl">
                {t.featuresHeading}
              </h2>
              <p className="mt-6 text-2xl text-muted">
                {t.featuresSubheading}
              </p>
            </div>
            <div className="grid gap-10 mt-16 md:grid-cols-3">
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className="p-12 bg-white border shadow-sm rounded-3xl border-black/10 stagger-item"
                  style={{ transitionDelay: `${index * 90}ms` }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="p-3 rounded-2xl bg-highlight">
                      {featureIllustrations[index]}
                    </div>
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-50 text-accent">
                      {feature.highlight}
                    </span>
                  </div>
                  <h3 className="text-2xl font-semibold font-display">
                    {feature.title}
                  </h3>
                  <p className="mt-5 text-lg text-muted">{feature.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          className="px-6 py-24 border-t border-black/5 bg-gradient-to-b from-white to-emerald-50/20 reveal"
          ref={(el) => (revealRefs.current[8] = el)}
        >
          <div className="w-full max-w-6xl mx-auto">
            <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-muted">
                  {t.securityLabel}
                </p>
                <h2 className="mt-5 text-4xl font-semibold font-display text-ink md:text-5xl">
                  {t.securityHeading}
                </h2>
                <p className="mt-6 text-xl text-muted">
                  {t.securityBody}
                </p>
              </div>
              <div className="grid gap-6">
                <div className="flex items-start gap-5 p-8 bg-white border shadow-sm rounded-3xl border-black/10">
                  <div className="p-3 rounded-2xl bg-emerald-50 shrink-0">
                    <LuShieldCheck className="w-8 h-8 text-accentDark" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg font-semibold text-ink">{t.sec1Title}</span>
                      <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-50 text-accentDark">{t.sec1Badge}</span>
                    </div>
                    <p className="text-base text-muted">{t.sec1Desc}</p>
                  </div>
                </div>
                <div className="flex items-start gap-5 p-8 bg-white border shadow-sm rounded-3xl border-black/10">
                  <div className="p-3 rounded-2xl bg-emerald-50 shrink-0">
                    <LuUser className="w-8 h-8 text-accentDark" />
                  </div>
                  <div>
                    <span className="text-lg font-semibold text-ink">{t.sec2Title}</span>
                    <p className="mt-1 text-base text-muted">{t.sec2Desc}</p>
                  </div>
                </div>
                <div className="flex items-start gap-5 p-8 bg-white border shadow-sm rounded-3xl border-black/10">
                  <div className="p-3 rounded-2xl bg-emerald-50 shrink-0">
                    <LuFileCheck className="w-8 h-8 text-accentDark" />
                  </div>
                  <div>
                    <span className="text-lg font-semibold text-ink">{t.sec3Title}</span>
                    <p className="mt-1 text-base text-muted">{t.sec3Desc}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          className="px-6 py-32 border-t border-black/5 reveal"
          ref={(el) => (revealRefs.current[4] = el)}
        >
          <div className="w-full max-w-6xl mx-auto">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-muted">
                {t.dashLabel}
              </p>
              <h2 className="mt-5 text-4xl font-semibold font-display text-ink md:text-6xl">
                {t.dashHeading}
              </h2>
              <p className="mt-5 text-xl text-muted">
                {t.dashSubheading}
              </p>
            </div>
            <div className="mt-12">
              {/* Browser chrome frame */}
              <div
                className="relative w-full max-w-6xl mx-auto overflow-hidden border shadow-2xl rounded-2xl border-black/10"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
              >
                {/* Title bar */}
                <div className="flex items-center gap-2 px-4 py-3 border-b bg-zinc-100 border-black/10">
                  <span className="w-3 h-3 bg-red-400 rounded-full"></span>
                  <span className="w-3 h-3 bg-yellow-400 rounded-full"></span>
                  <span className="w-3 h-3 bg-green-400 rounded-full"></span>
                  <div className="flex-1 mx-4">
                    <div className="flex items-center max-w-xs gap-2 px-3 py-1 mx-auto text-xs text-center border rounded-md bg-white/70 border-black/10 text-zinc-400">
                      <span className="w-2 h-2 rounded-full bg-accent/60 shrink-0"></span>
                      app.DocMinder.io
                    </div>
                  </div>
                </div>
                {/* Slides */}
                <div className="relative overflow-hidden bg-white">
                  <div
                    className="flex transition-transform duration-700 ease-out will-change-transform"
                    style={{ transform: `translateX(-${slideIndex * 100}%)` }}
                  >
                    {slides.map((slide, i) => (
                      <img
                        key={slide.alt}
                        src={slide.src}
                        alt={slide.alt}
                        className="w-full h-auto shrink-0 cursor-zoom-in"
                        decoding="async"
                        fetchPriority={i === 0 ? "high" : "low"}
                        onClick={() => setLightbox(slide)}
                      />
                    ))}
                  </div>
                </div>
                {/* Caption + dots */}
                <div className="flex flex-col items-center gap-2 px-6 py-3 border-t border-black/5 bg-zinc-50">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0"></span>
                    <p className="text-sm text-center text-muted">{slides[slideIndex].caption}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {slides.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setSlideIndex(i)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${i === slideIndex ? "w-6 bg-accent" : "w-1.5 bg-black/20"}`}
                        aria-label={`Go to slide ${i + 1}`}
                      />
                    ))}
                  </div>
                </div>
                {/* Prev / Next */}
                <button
                  type="button"
                  onClick={goPrev}
                  aria-label="Previous screenshot"
                  className="absolute flex items-center justify-center w-10 h-10 transition -translate-y-1/2 border rounded-full shadow-sm left-4 top-1/2 border-black/10 bg-white/90 text-ink hover:bg-white"
                >
                  <LuChevronLeft className="w-5 h-5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  aria-label="Next screenshot"
                  className="absolute flex items-center justify-center w-10 h-10 transition -translate-y-1/2 border rounded-full shadow-sm right-4 top-1/2 border-black/10 bg-white/90 text-ink hover:bg-white"
                >
                  <LuChevronRight className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </section>

        <section
          className="px-6 py-32 border-t border-black/5 reveal"
          ref={(el) => (revealRefs.current[5] = el)}
        >
          <div className="mx-auto grid w-full max-w-6xl gap-12 rounded-3xl border border-black/10 bg-gradient-to-br from-[#fef7ec] to-[#eef8f5] p-12 shadow-soft md:grid-cols-[1.2fr_0.8fr] md:items-center relative overflow-hidden">
            {/* Decorative background illustration */}
            <svg className="absolute top-0 right-0 hidden w-64 h-64 opacity-10 md:block" viewBox="0 0 200 200" fill="none" aria-hidden="true">
              <circle cx="150" cy="50" r="80" stroke="#1e7f6d" strokeWidth="2"/>
              <circle cx="150" cy="50" r="60" stroke="#1e7f6d" strokeWidth="1.5"/>
              <circle cx="150" cy="50" r="40" stroke="#1e7f6d" strokeWidth="1"/>
              <rect x="20" y="100" width="60" height="80" rx="6" stroke="#1e7f6d" strokeWidth="2"/>
              <path d="M30 120 L70 120 M30 135 L60 135 M30 150 L65 150" stroke="#1e7f6d" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <div>
              {/* Small illustration next to heading */}
              <div className="flex items-start gap-4">
                <svg className="flex-shrink-0 hidden w-16 h-16 sm:block" viewBox="0 0 64 64" fill="none" aria-hidden="true">
                  <circle cx="32" cy="32" r="28" fill="white" stroke="#1e7f6d" strokeWidth="2"/>
                  <circle cx="32" cy="32" r="24" fill="none" stroke="#1e7f6d" strokeWidth="1" opacity="0.3"/>
                  <path d="M32 16 L32 32 L44 38" stroke="#1e7f6d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="52" cy="12" r="10" fill="#cfeadf" stroke="#1e7f6d" strokeWidth="1.5"/>
                  <path d="M48 12 L51 15 L57 9" stroke="#1e7f6d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.35em] text-muted">
                    {t.earlyLabel}
                  </p>
              <h2 className="mt-5 text-4xl font-semibold font-display text-ink md:text-5xl">
                {t.earlyHeading}
              </h2>
              <p className="mt-5 text-xl text-muted">
                {t.earlySubheading}
              </p>
              <div className="flex flex-wrap gap-4 mt-6 text-sm text-muted">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent"></span>
                  {t.earlyBullet1}
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent"></span>
                  {t.earlyBullet2}
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent"></span>
                  {t.earlyBullet3}
                </span>
              </div>
                </div>
              </div>
            </div>
            <form className="flex flex-col w-full gap-3" onSubmit={handleSubscribe}>
              <input
                type="email"
                placeholder={t.emailPlaceholder}
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={submitStatus === "loading" || submitStatus === "success"}
                className="w-full px-6 text-lg bg-white border rounded-full shadow-sm h-14 border-black/10 focus:border-emerald-500 focus:outline-none disabled:opacity-50"
              />
              <button
                className="h-14 w-full rounded-full bg-accent px-7 text-lg font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-accentDark disabled:opacity-50 disabled:hover:translate-y-0"
                type="submit"
                disabled={submitStatus === "loading" || submitStatus === "success"}
              >
                {submitStatus === "loading" ? t.ctaLoading : submitStatus === "success" ? t.ctaSuccess : t.ctaButton}
              </button>
              {submitStatus === "success" ? (
                <p className="text-sm font-semibold text-center text-accent">{t.earlySuccessMsg}</p>
              ) : submitStatus === "error" ? (
                <p className="text-sm text-center text-red-600">{errorMessage}</p>
              ) : (
                <p className="text-sm text-center text-muted">{t.earlySubtext}</p>
              )}
            </form>
          </div>
        </section>
      </main>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm cursor-zoom-out"
          onClick={() => setLightbox(null)}
        >
          <img
            src={lightbox.src}
            alt={lightbox.alt}
            className="object-contain max-w-full max-h-full shadow-2xl rounded-xl"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="absolute flex items-center justify-center text-xl leading-none text-white transition rounded-full top-4 right-4 w-9 h-9 bg-white/10 hover:bg-white/20"
            onClick={() => setLightbox(null)}
            aria-label="Close"
          >
            ✕
          </button>
        </div>
      )}

      <footer className="px-6 pb-10">
        <div className="flex flex-wrap items-center justify-between w-full max-w-6xl gap-3 mx-auto text-sm text-muted">
          <span>{t.footerTagline}</span>
          <span>{t.footerCopyright}</span>
        </div>
      </footer>
    </div>
  );
}
