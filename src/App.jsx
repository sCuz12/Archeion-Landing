import { useEffect, useRef, useState } from "react";
import {
  LuBellRing,
  LuChevronLeft,
  LuChevronRight,
  LuClipboardList,
  LuFileX,
  LuFolder,
  LuMail,
  LuMessageSquare,
} from "react-icons/lu";
import clientView from "./assets/client_view.png";
import clientNew from "./assets/client_new.png"
import dashboardView from "./assets/dashboard_view.png";
import wordmarkLogo from "./assets/wordmark-logo-tra.svg";

const months = [
  {
    label: "March 2026",
    complete: "12 / 18 complete",
    missing: 6,
    rows: [
      { name: "Georgiou & Co", status: "3 missing", type: "warn" },
      { name: "Karina Travel Ltd", status: "All received", type: "ok" },
      { name: "Limassol Auto", status: "2 missing", type: "warn" },
      { name: "Oceanic Supplies", status: "1 missing", type: "warn" },
    ],
  },
  {
    label: "February 2026",
    complete: "18 / 18 complete",
    missing: 0,
    rows: [
      { name: "Georgiou & Co", status: "All received", type: "ok" },
      { name: "Karina Travel Ltd", status: "All received", type: "ok" },
      { name: "Limassol Auto", status: "All received", type: "ok" },
      { name: "Oceanic Supplies", status: "All received", type: "ok" },
    ],
  },
  {
    label: "January 2026",
    complete: "16 / 18 complete",
    missing: 2,
    rows: [
      { name: "Georgiou & Co", status: "All received", type: "ok" },
      { name: "Karina Travel Ltd", status: "1 missing", type: "warn" },
      { name: "Limassol Auto", status: "1 missing", type: "warn" },
      { name: "Oceanic Supplies", status: "All received", type: "ok" },
    ],
  },
];

const problemCards = [
  {
    title: "WhatsApp threads",
    body: "Invoices are buried in chats, with no clear record of what was sent.",
  },
  {
    title: "Scattered emails",
    body: "Receipts arrive late, incomplete, and spread across multiple inboxes.",
  },
  {
    title: "Missing invoices",
    body: "You spend hours reminding clients and still don’t know who is done.",
  },
];

const steps = [
  { title: "Request with one click", body: "Select the month and client list." },
  { title: "Clients upload via a simple link", body: "No login, no confusion." },
  {
    title: "See who is missing instantly",
    body: "A dashboard that stays updated for you.",
  },
];

const features = [
  {
    title: "Track missing documents per client",
    body: "Know exactly what is still needed before you start filing.",
  },
  {
    title: "Send reminders automatically",
    body: "Gentle follow-ups go out without you lifting a finger.",
  },
  {
    title: "All files in one place",
    body: "One tidy folder, ready for your accounting workflow.",
  },
];

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

export default function App() {
  const [active, setActive] = useState(0);
  const month = months[active];
  const revealRefs = useRef([]);
  const [isPaused, setIsPaused] = useState(false);
  const slides = [
    {
      src: dashboardView,
      alt: "Archeion dashboard overview",
    },
    {
      src: clientView,
      alt: "Archeion client profile view",
    },
    {
      src: clientNew,
      alt: "Create new client"
    }
  ];
  const [slideIndex, setSlideIndex] = useState(0);
  const prefersReducedMotion = useRef(false);

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
              alt="Archeion"
              className="w-auto h-8 md:h-9 lg:h-10"
            />
          </div>
          <a
            href="#waitlist"
            className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold shadow-sm transition hover:-translate-y-0.5"
          >
            Join waitlist
          </a>
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
                For accounting firms in Cyprus
              </p>
              <h1 className="text-5xl font-semibold leading-tight font-display text-ink md:text-7xl">
                Collect client invoices in days, not weeks
              </h1>
              <p className="text-2xl mt-7 text-muted">
                Automated requests, gentle reminders, and a single dashboard
                that shows what is still missing.
              </p>
              <div className="flex flex-wrap gap-3 mt-6 text-sm font-semibold text-ink/80">
                {["Choose month", "Share client link", "Track missing"].map(
                  (item) => (
                    <span
                      key={item}
                      className="px-4 py-2 bg-white border rounded-full border-black/10"
                    >
                      {item}
                    </span>
                  )
                )}
              </div>
              <form
                id="waitlist"
                className="flex flex-col gap-3 mt-8 sm:flex-row"
              >
                <input
                  type="email"
                  placeholder="Your work email"
                  required
                  className="flex-1 px-6 text-lg bg-white border rounded-full shadow-sm h-14 border-black/10 focus:border-emerald-500 focus:outline-none"
                />
                <button
                  className="h-14 rounded-full bg-accent px-7 text-lg font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-accentDark"
                  type="submit"
                >
                  Join waitlist
                </button>
              </form>
              <p className="mt-4 text-base text-muted">
                No pricing yet. We will send a short demo and early access.
              </p>
            </div>

            <div className="relative">
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
                    Send reminders
                  </button>
                  <button className="rounded-full bg-highlight px-5 py-2.5 text-sm font-semibold text-ink">
                    View dashboard
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
                One link per client. One dashboard for you.
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
                The problem
              </p>
              <h2 className="mt-5 text-4xl font-semibold font-display text-ink md:text-6xl">
                The monthly document chase
              </h2>
              <p className="mt-5 text-xl text-muted">
                Documents arrive from everywhere, and you never know what is
                still missing.
              </p>
            </div>
            <div className="px-8 py-6 mt-10 bg-white border rounded-3xl border-black/10 shadow-soft">
              <div className="flex flex-wrap items-center justify-between gap-6">
                <div>
                  <p className="mt-3 text-xl font-semibold text-ink">
                    The messy monthly inbox
                  </p>
                  <p className="mt-2 text-base text-muted">
                    Multiple channels, no single source of truth.
                  </p>
                </div>
                <svg
                  viewBox="0 0 260 140"
                  className="h-32 w-full max-w-[320px]"
                  fill="none"
                  aria-hidden="true"
                >
                  <rect
                    x="6"
                    y="10"
                    width="248"
                    height="120"
                    rx="24"
                    fill="#F8F4EF"
                  />
                  <rect
                    x="20"
                    y="26"
                    width="100"
                    height="24"
                    rx="12"
                    fill="#E7F5F1"
                  />
                  <rect
                    x="20"
                    y="62"
                    width="140"
                    height="24"
                    rx="12"
                    fill="#FFF1E8"
                  />
                  <rect
                    x="20"
                    y="98"
                    width="90"
                    height="24"
                    rx="12"
                    fill="#E9F0FF"
                  />
                  <circle cx="200" cy="48" r="18" fill="#E7F5F1" />
                  <circle cx="220" cy="84" r="18" fill="#FFF1E8" />
                  <circle cx="190" cy="104" r="14" fill="#E9F0FF" />
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
                 
                  </div>
                  <h3 className="text-xl font-semibold font-display">
                    {item.title}
                  </h3>
                  <p className="mt-4 text-base text-muted">{item.body}</p>
                </div>
              ))}
            </div>

            <div className="grid gap-3 mt-12 text-lg font-semibold text-ink">
              <p>Documents arrive late or incomplete</p>
              <p>You do not know who is done</p>
              <p>Follow-ups take hours every month</p>
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
                The solution
              </p>
              <h2 className="mt-5 text-4xl font-semibold font-display text-ink md:text-6xl">
                A calm, simple way to collect documents
              </h2>
              <div className="grid gap-6 mt-12">
                {steps.map((step, index) => (
                  <StepCard
                    key={step.title}
                    index={index}
                    title={step.title}
                    body={step.body}
                  />
                ))}
              </div>
            </div>

            <div className="p-10 bg-white border rounded-3xl border-black/10 shadow-soft">
              <p className="text-base font-semibold text-muted">
                Missing documents overview
              </p>
              <div className="space-y-4 mt-7">
                {[
                  { label: "March 2026", status: "6 missing", tone: "warn" },
                  { label: "February 2026", status: "All received", tone: "ok" },
                  { label: "January 2026", status: "All received", tone: "ok" },
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
                <span>Automatic reminders</span>
                <span>Every Friday at 15:00</span>
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
                The essentials
              </p>
              <h2 className="mt-6 text-5xl font-semibold font-display text-ink md:text-7xl">
                Only the essentials
              </h2>
              <p className="mt-6 text-2xl text-muted">
                Everything you need to stay in control each month.
              </p>
            </div>
            <div className="grid gap-10 mt-16 md:grid-cols-3">
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className="p-12 bg-white border shadow-sm rounded-3xl border-black/10 stagger-item"
                  style={{ transitionDelay: `${index * 90}ms` }}
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 rounded-2xl bg-highlight">
                      {featureIllustrations[index]}
                    </div>
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
          className="px-6 py-32 border-t border-black/5 reveal"
          ref={(el) => (revealRefs.current[4] = el)}
        >
          <div className="w-full max-w-6xl mx-auto">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-muted">
                The dashboard
              </p>
              <h2 className="mt-5 text-4xl font-semibold font-display text-ink md:text-6xl">
                See the full picture at a glance
              </h2>
              <p className="mt-5 text-xl text-muted">
                A single view of every client, every month, and what is still
                missing.
              </p>
            </div>
            <div className="mt-12">
              <div
                className="relative mx-auto w-full max-w-6xl rounded-[32px] border border-black/10 bg-white p-4 shadow-soft md:p-6"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
              >
                <div className="relative overflow-hidden rounded-[24px] border border-black/10 bg-white">
                  <div className="absolute z-10 px-3 py-2 rounded-full shadow-sm pointer-events-none left-4 top-4 bg-white/90">
                    <img
                      src={wordmarkLogo}
                      alt="Archeion"
                      className="w-auto h-5"
                    />
                  </div>
                  <div
                    className="flex transition-transform duration-700 ease-out"
                    style={{ transform: `translateX(-${slideIndex * 100}%)` }}
                  >
                    {slides.map((slide) => (
                      <img
                        key={slide.alt}
                        src={slide.src}
                        alt={slide.alt}
                        className="w-full shrink-0"
                      />
                    ))}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={goPrev}
                  aria-label="Previous screenshot"
                  className="absolute flex items-center justify-center w-10 h-10 transition -translate-y-1/2 border rounded-full shadow-sm left-6 top-1/2 border-black/10 bg-white/90 text-ink hover:-translate-y-1/2 hover:bg-white"
                >
                  <LuChevronLeft className="w-5 h-5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  aria-label="Next screenshot"
                  className="absolute flex items-center justify-center w-10 h-10 transition -translate-y-1/2 border rounded-full shadow-sm right-6 top-1/2 border-black/10 bg-white/90 text-ink hover:-translate-y-1/2 hover:bg-white"
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
          <div className="mx-auto grid w-full max-w-6xl gap-12 rounded-3xl border border-black/10 bg-gradient-to-br from-[#fef7ec] to-[#eef8f5] p-12 shadow-soft md:grid-cols-[1.2fr_0.8fr] md:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-muted">
                Early access
              </p>
              <h2 className="mt-5 text-4xl font-semibold font-display text-ink md:text-5xl">
                Ready to stop chasing documents?
              </h2>
              <p className="mt-5 text-xl text-muted">
                Join the waitlist and help shape the first version for Cyprus
                accountants.
              </p>
            </div>
            <form className="flex flex-col w-full gap-3 sm:flex-row">
              <input
                type="email"
                placeholder="Your work email"
                required
                className="flex-1 min-w-0 px-6 text-lg bg-white border rounded-full shadow-sm h-14 border-black/10 focus:border-emerald-500 focus:outline-none"
              />
              <button
                className="h-14 w-full rounded-full bg-accent px-7 text-lg font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-accentDark sm:w-auto"
                type="submit"
              >
                Get early access
              </button>
            </form>
          </div>
        </section>
      </main>

      <footer className="px-6 pb-10">
        <div className="flex flex-wrap items-center justify-between w-full max-w-6xl gap-3 mx-auto text-sm text-muted">
          <span>Archeion — built for small accounting firms in Cyprus.</span>
          <span>© 2026 Archeion</span>
        </div>
      </footer>
    </div>
  );
}
