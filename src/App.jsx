import CinematicHero from "./CinematicHero.jsx";
import { useState, useEffect, useRef, useCallback } from "react";

/* ── Cacheable image assets ── */
const IMG_LINCOLN = "/images/lincoln.jpg";

const IMG_EMBASSY = "/images/embassy.jpg";

const IMG_SHOCKWAVE = "/images/shockwave.jpg";

const IMG_HEYCHIC = "/images/heychic.jpg";

const IMG_SEINA = "/images/seina.jpg";

const IMG_MCUBE = "/images/mcube.jpg";


/* ── Intersection Observer ── */
function useInView(threshold = 0.12) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.unobserve(el); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function Reveal({ children, delay = 0, style = {} }) {
  const [ref, visible] = useInView(0.08);
  return (
    <div ref={ref} style={{
      ...style,
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(28px)",
      transition: `opacity 0.85s cubic-bezier(.25,.46,.45,.94) ${delay}s, transform 0.85s cubic-bezier(.25,.46,.45,.94) ${delay}s`,
    }}>
      {children}
    </div>
  );
}

/* ── Tokens ── */
const C = {
  bg: "#0B0C0D", bg2: "#111314", fg: "#EDE8DF", mid: "#ABA9A3",
  light: "#93918C", accent: "#C4B292", line: "#2C2D2D",
};
const font = { display: "'Cormorant', serif", body: "'DM Sans', sans-serif" };

/* ── Work Data (ordered: Lincoln, Embassy, Shockwave, Heychic, M-cube, Seina) ── */
const WORKS = [
  {
    id: 1, title: "Lincoln Aviator — Exhibition Film",
    subtitle: "Promotional Video · Editing & Post-production",
    category: "Commercial",
    org: "SMG & SMT · Shanghai",
    year: "2025",
    desc: "Produced a promotional video for the Lincoln Aviator exhibition booth, translating brand aesthetics into cinematic visual language under a tight post-production timeline.",
    img: IMG_LINCOLN,
    video: "https://youtu.be/LRORdtVOStY",
  },
  {
    id: 2, title: "Embassy Reception Coverage",
    subtitle: "Diplomatic Event · Sole Media Representative",
    category: "Event",
    org: "Lion Media Group · Melbourne",
    year: "2026",
    desc: "Selected as the sole company representative to attend an embassy reception. Independently documented the entire event through photography and video for corporate publicity use.",
    img: IMG_EMBASSY,
    video: "",
  },
  {
    id: 3, title: "Shockwave — Band Documentary",
    subtitle: "Documentary Short · Direction & Editing",
    category: "Film",
    org: "Professional Project",
    year: "2025",
    desc: "Directed and edited a documentary short capturing the live music scene and creative spirit of an independent band, blending intimate interviews with energetic performance footage.",
    img: IMG_SHOCKWAVE,
    video: "https://youtu.be/fhp0VorZtNg",
  },
  {
    id: 4, title: "Heychic — Fashion Campaign",
    subtitle: "Fashion Photography · Marketing Strategy",
    category: "Marketing",
    org: "Heychic · Sydney",
    year: "2024",
    desc: "Led apparel photography and post-production for brand promotions. Simultaneously developed seasonal marketing strategies to strengthen online brand visibility and engagement.",
    img: IMG_HEYCHIC,
    video: "",
  },
  {
    id: 5, title: "M-cube Studio — Promo Film",
    subtitle: "Studio Promotional Video · Full Production",
    category: "Commercial",
    org: "SMG & SMT · Shanghai",
    year: "2025",
    desc: "Produced a promotional video for the M-cube recording studio, showcasing its professional-grade facilities and creative atmosphere through carefully composed cinematography.",
    img: IMG_MCUBE,
    video: "https://youtu.be/nJOPZ7Z6ZHo",
  },
  {
    id: 6, title: "Seina — Artist Interview",
    subtitle: "Music Producer Interview · Direction & Editing",
    category: "Film",
    org: "SMG & SMT · Shanghai",
    year: "2025",
    desc: "Filmed and edited an in-depth interview with music producer Seina at M-cube Studio, managing the entire workflow from interview planning through final cut delivery.",
    img: IMG_SEINA,
    video: "",
  },
  {
    id: 7, title: "Sailing — Brand Promo Film",
    subtitle: "Promotional Film · Cinematography & Editing",
    category: "Commercial",
    org: "Personal Project · Sydney",
    year: "2026",
    desc: "Shot and edited a cinematic promotional film on the water, capturing the speed, light and atmosphere of sailing on Sydney Harbour and shaping the footage into a polished brand piece.",
    img: "https://img.youtube.com/vi/abNL4PHTx4M/hqdefault.jpg",
    video: "https://youtu.be/abNL4PHTx4M",
  },
  {
    id: 8, title: "Short-Form Social — Reels & TikTok",
    subtitle: "Vertical Short · Concept, Shooting & Editing",
    category: "Social",
    org: "Personal Project",
    year: "2026",
    desc: "Created a scroll-stopping vertical short for Instagram Reels and TikTok, handling the concept, filming and fast-cut editing to demonstrate native short-form content production.",
    img: "https://img.youtube.com/vi/w1Qqm3mSKcc/hqdefault.jpg",
    video: "https://youtube.com/shorts/w1Qqm3mSKcc",
  },
  {
    id: 9, title: "Ningen wo Kaburu — Band Promo Film",
    subtitle: "Promotional Film · Direction & Editing",
    category: "Film",
    org: "Personal Project",
    year: "2026",
    desc: "Directed and edited a promotional film for the band Ningen wo Kaburu, translating the group's sound and identity into a cohesive visual piece through performance footage and atmospheric cinematography.",
    img: "/images/ningen.png",
    video: "https://youtu.be/jmcTJLom44M",
  },
];

const CATEGORIES = ["All", "Film", "Commercial", "Event", "Marketing", "Social"];

/* ── WorkCard ── */
function WorkCard({ work, index, onClick }) {
  const [hovered, setHovered] = useState(false);
  const [imgOk, setImgOk] = useState(true);
  return (
    <Reveal delay={0.06 * index}>
      <div
        onClick={() => onClick(work)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          cursor: "pointer", position: "relative", overflow: "hidden",
          aspectRatio: "16/10",
          /* Branded fallback shown when there is no usable cover image */
          background: `linear-gradient(135deg, ${C.accent} 0%, ${C.fg} 100%)`,
          transition: "transform 0.5s cubic-bezier(.25,.46,.45,.94), box-shadow 0.5s ease",
          transform: hovered ? "translateY(-6px)" : "none",
          boxShadow: hovered ? "0 20px 60px rgba(0,0,0,0.15)" : "0 2px 12px rgba(0,0,0,0.06)",
        }}
      >
        {work.img && imgOk && (
          <img src={work.img} alt={work.title} onError={() => setImgOk(false)} style={{
            width: "100%", height: "100%", objectFit: "cover", display: "block",
            transition: "transform 0.6s cubic-bezier(.25,.46,.45,.94)",
            transform: hovered ? "scale(1.04)" : "scale(1)",
          }} />
        )}
        {/* Overlay */}
        <div style={{
          position: "absolute", inset: 0,
          background: hovered
            ? "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)"
            : "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)",
          transition: "all 0.45s ease",
        }} />
        {/* Play badge — only on works that have a video */}
        {work.video && (
          <div style={{
            position: "absolute", top: "50%", left: "50%", zIndex: 4,
            transform: hovered ? "translate(-50%,-50%) scale(1.08)" : "translate(-50%,-50%) scale(1)",
            width: 56, height: 56, borderRadius: "50%",
            background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)",
            border: "1px solid rgba(255,255,255,0.6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "transform 0.4s cubic-bezier(.25,.46,.45,.94), background 0.3s ease",
            pointerEvents: "none",
          }}>
            <div style={{
              width: 0, height: 0, marginLeft: 4,
              borderTop: "9px solid transparent", borderBottom: "9px solid transparent",
              borderLeft: "15px solid rgba(255,255,255,0.95)",
            }} />
          </div>
        )}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 3,
          padding: "24px 20px 18px",
          transform: hovered ? "translateY(0)" : "translateY(4px)",
          opacity: hovered ? 1 : 0.85, transition: "all 0.45s ease",
        }}>
          <div style={{
            fontFamily: font.body, fontSize: 9, letterSpacing: 2.5,
            color: "rgba(255,255,255,0.55)", textTransform: "uppercase", marginBottom: 6,
          }}>{work.category} · {work.year}</div>
          <div style={{
            fontFamily: font.display, fontSize: "clamp(16px, 2vw, 22px)",
            fontWeight: 400, color: "rgba(255,255,255,0.95)", lineHeight: 1.3,
          }}>{work.title}</div>
        </div>
      </div>
    </Reveal>
  );
}

/* ── Video helpers ──
   Convert a YouTube/Vimeo/Google-Drive share link into an embeddable URL.
   Returns null when the link is a direct video file (mp4/webm), so the modal
   falls back to a native <video> player. */
function toEmbedUrl(url) {
  if (!url) return null;
  let m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/);
  if (m) return `https://www.youtube.com/embed/${m[1]}?rel=0`;
  m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (m) return `https://player.vimeo.com/video/${m[1]}`;
  m = url.match(/drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?(?:export=\w+&)?id=)([\w-]+)/);
  if (m) return `https://drive.google.com/file/d/${m[1]}/preview`;
  return null;
}

/* ── Work Detail Modal ── */
function WorkModal({ work, onClose }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);
  if (!work) return null;
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(42,40,37,0.55)", backdropFilter: "blur(14px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
      animation: "modalIn 0.35s ease",
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: C.bg, maxWidth: 680, width: "100%",
        padding: 0, position: "relative", maxHeight: "90vh", overflowY: "auto",
      }}>
        {/* Media header — video player when a link exists, otherwise the image */}
        <div style={{ position: "relative", overflow: "hidden", background: "#000" }}>
          {work.video ? (
            toEmbedUrl(work.video) ? (
              <div style={{ position: "relative", width: "100%", aspectRatio: "16/9" }}>
                <iframe
                  src={toEmbedUrl(work.video)}
                  title={work.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0, display: "block" }}
                />
              </div>
            ) : (
              <video src={work.video} poster={work.img} controls playsInline preload="metadata" style={{
                width: "100%", aspectRatio: "16/9", objectFit: "cover", display: "block", background: "#000",
              }} />
            )
          ) : (
            <img src={work.img} alt={work.title} style={{
              width: "100%", aspectRatio: "16/9", objectFit: "cover", display: "block",
            }} />
          )}
          <button onClick={onClose} style={{
            position: "absolute", top: 16, right: 16,
            background: "rgba(0,0,0,0.4)", backdropFilter: "blur(8px)",
            border: "none", cursor: "pointer", fontSize: 18, color: "rgba(255,255,255,0.8)",
            width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center",
            borderRadius: 0, transition: "background 0.2s",
          }}
            onMouseEnter={e => e.target.style.background = "rgba(0,0,0,0.7)"}
            onMouseLeave={e => e.target.style.background = "rgba(0,0,0,0.4)"}
          >×</button>
        </div>
        {/* Content */}
        <div style={{ padding: "clamp(24px,4vw,40px)" }}>
          <div style={{ fontFamily: font.body, fontSize: 9, letterSpacing: 3, color: C.accent, textTransform: "uppercase", marginBottom: 14 }}>{work.category} · {work.year}</div>
          <h3 style={{ fontFamily: font.display, fontSize: "clamp(26px,3.5vw,36px)", fontWeight: 400, color: C.fg, margin: "0 0 8px", lineHeight: 1.2 }}>{work.title}</h3>
          <div style={{ fontFamily: font.body, fontSize: 13, color: C.mid, marginBottom: 6 }}>{work.subtitle}</div>
          <div style={{ fontFamily: font.body, fontSize: 12, color: C.light, marginBottom: 28, letterSpacing: 0.5 }}>{work.org}</div>
          <p style={{ fontFamily: font.body, fontSize: 15, color: C.fg, lineHeight: 2, margin: 0, fontWeight: 300 }}>{work.desc}</p>
        </div>
      </div>
    </div>
  );
}

/* ────────────────── MAIN APP ────────────────── */
export default function Portfolio() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedWork, setSelectedWork] = useState(null);
  const [scrollY, setScrollY] = useState(0);



  useEffect(() => {
    const h = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const filtered = activeFilter === "All" ? WORKS : WORKS.filter(w => w.category === activeFilter);

  const scrollTo = useCallback((id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }, []);

  return (
    <div style={{ background: C.bg, color: C.fg, minHeight: "100vh", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { overflow-x: hidden; }
        ::selection { background: rgba(184,168,138,0.25); }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #0B0C0D; }
        ::-webkit-scrollbar-thumb { background: #383A3A; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #C5BFB6; }
        @keyframes modalIn { from { opacity:0; } to { opacity:1; } }
        @media (max-width: 640px) {
          .work-grid { grid-template-columns: 1fr !important; }
          .hero-grid { grid-template-columns: 1fr !important; text-align: center !important; }
          .hero-right { justify-content: center !important; }
          .nav-links { display: none !important; }
          .stat-row { grid-template-columns: 1fr 1fr !important; }
          .exp-row { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ── NAV ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: scrollY > 40 ? "rgba(11,12,13,0.90)" : "transparent",
        backdropFilter: scrollY > 40 ? "blur(16px)" : "none",
        borderBottom: scrollY > 40 ? `1px solid ${C.line}` : "1px solid transparent",
        transition: "all 0.4s ease",
      }}>
        <div style={{
          maxWidth: 1280, margin: "0 auto", padding: "0 clamp(24px,5vw,64px)",
          height: 64, display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <a href="#top" style={{ textDecoration: "none",
            cursor: "pointer", fontFamily: font.display, fontSize: 20, fontWeight: 400, color: C.fg, letterSpacing: 1,
          }}>Ryan Yin</a>
          <div className="nav-links" style={{ display: "flex", gap: 32, alignItems: "center" }}>
            {[["Works", "works"], ["Experience", "experience"], ["About", "about"], ["Contact", "contact"]].map(([label, id]) => (
              <button key={id} onClick={() => scrollTo(id)} style={{
                background: "none", border: "none", cursor: "pointer",
                fontFamily: font.body, fontSize: 12, fontWeight: 400,
                color: C.mid, letterSpacing: 1.5, textTransform: "uppercase", transition: "color 0.3s", padding: 0,
              }}
                onMouseEnter={e => e.target.style.color = C.fg}
                onMouseLeave={e => e.target.style.color = C.mid}
              >{label}</button>
            ))}
            <a href="https://www.linkedin.com/in/ruilong-yin-b82ab13b0" target="_blank" rel="noopener noreferrer" style={{
              fontFamily: font.body, fontSize: 11, letterSpacing: 1.5,
              color: C.bg, background: C.fg, padding: "8px 20px",
              textDecoration: "none", textTransform: "uppercase", transition: "opacity 0.3s",
            }}
              onMouseEnter={e => e.target.style.opacity = "0.8"}
              onMouseLeave={e => e.target.style.opacity = "1"}
            >LinkedIn</a>
          </div>
        </div>
        <a className="mobile-contact" href="#contact">LET’S TALK ↗</a>
      </nav>

      <CinematicHero suspended={Boolean(selectedWork)} />

      {/* ── WORKS ── */}
      <section id="works" style={{ padding: "clamp(60px,10vh,120px) clamp(24px,5vw,64px)", background: C.bg }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <Reveal>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 24, marginBottom: 48 }}>
              <div>
                <div style={{ fontFamily: font.body, fontSize: 10, letterSpacing: 3, color: C.accent, textTransform: "uppercase", marginBottom: 12 }}>Selected Works</div>
                <h2 style={{ fontFamily: font.display, fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 300, color: C.fg, lineHeight: 1.15, margin: 0 }}>Portfolio</h2>
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {CATEGORIES.map(cat => (
                  <button key={cat} onClick={() => setActiveFilter(cat)} style={{
                    fontFamily: font.body, fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase",
                    padding: "7px 16px",
                    background: activeFilter === cat ? C.fg : "transparent",
                    color: activeFilter === cat ? C.bg : C.mid,
                    border: `1px solid ${activeFilter === cat ? C.fg : C.line}`,
                    cursor: "pointer", transition: "all 0.3s",
                  }}>{cat}</button>
                ))}
              </div>
            </div>
          </Reveal>
          <div className="work-grid" style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 380px), 1fr))", gap: 3,
          }}>
            {filtered.map((w, i) => (
              <WorkCard key={w.id} work={w} index={i} onClick={setSelectedWork} />
            ))}
          </div>
        </div>
      </section>

      {/* ── EXPERIENCE ── */}
      <section id="experience" style={{ padding: "clamp(60px,10vh,120px) clamp(24px,5vw,64px)", background: C.bg2 }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <Reveal>
            <div style={{ fontFamily: font.body, fontSize: 10, letterSpacing: 3, color: C.accent, textTransform: "uppercase", marginBottom: 12 }}>Experience</div>
            <h2 style={{ fontFamily: font.display, fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 300, color: C.fg, lineHeight: 1.15, margin: "0 0 56px" }}>Professional Journey</h2>
          </Reveal>
          {[
            {
              period: "Nov 2025 — Feb 2026", title: "Media & Content Intern",
              company: "Lion Media Group · Melbourne, Australia",
              points: ["Managed WeChat public account with daily content updates", "Produced video content from planning through final editing", "Coordinated media coverage for multiple high-profile corporate events", "Selected as sole company representative for embassy reception", "Developed content strategies increasing social media audience reach"],
              tag: "Media",
            },
            {
              period: "Dec 2024 — Jan 2025", title: "Media Production Intern",
              company: "SMG & SMT · Shanghai, China",
              points: ["Mixed live audio during New Year's Day broadcast", "Filmed & edited interview with music producer Seina", "Produced promotional video for M-cube recording studio", "Edited Lincoln Aviator exhibition promo under overnight deadline"],
              tag: "Production",
            },
            {
              period: "Aug 2023 — Jun 2024", title: "Marketing & Operations Assistant",
              company: "Heychic Marketing & Fashion Photography · Sydney, Australia",
              points: ["Developed sales strategies boosting marketing campaign engagement", "Captured and edited apparel photography for brand promotions", "Assisted campaign planning boosting seasonal product visibility", "Monitored e-commerce operations improving order accuracy"],
              tag: "Marketing",
            },
          ].map((exp, i) => (
            <Reveal key={i} delay={0.08 * i}>
              <div className="exp-row" style={{
                padding: "clamp(24px,3vw,40px) 0", borderBottom: `1px solid ${C.line}`,
                display: "grid", gridTemplateColumns: "clamp(100px,18%,200px) 1fr",
                gap: "clamp(16px,3vw,40px)", alignItems: "start",
              }}>
                <div>
                  <div style={{ fontFamily: font.body, fontSize: 12, color: C.light, letterSpacing: 0.5, marginBottom: 8 }}>{exp.period}</div>
                  <span style={{
                    fontFamily: font.body, fontSize: 9, letterSpacing: 2, color: C.accent,
                    textTransform: "uppercase", padding: "3px 8px", background: "rgba(184,168,138,0.1)",
                  }}>{exp.tag}</span>
                </div>
                <div>
                  <h3 style={{ fontFamily: font.display, fontSize: "clamp(20px,2.5vw,28px)", fontWeight: 400, color: C.fg, margin: "0 0 4px" }}>{exp.title}</h3>
                  <div style={{ fontFamily: font.body, fontSize: 13, color: C.mid, marginBottom: 16 }}>{exp.company}</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 16px" }}>
                    {exp.points.map((p, j) => (
                      <span key={j} style={{ fontFamily: font.body, fontSize: 13, color: C.mid, fontWeight: 300, lineHeight: 1.8 }}>
                        <span style={{ color: C.accent, marginRight: 6, fontSize: 8, verticalAlign: "middle" }}>●</span>{p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
          <Reveal delay={0.2}>
            <div style={{
              marginTop: 48, padding: "clamp(28px,4vw,48px)",
              background: C.bg, border: `1px solid ${C.line}`,
            }}>
              <div style={{ fontFamily: font.body, fontSize: 9, letterSpacing: 3, color: C.accent, textTransform: "uppercase", marginBottom: 16 }}>Current Venture</div>
              <h3 style={{ fontFamily: font.display, fontSize: "clamp(24px,3.5vw,36px)", fontWeight: 300, color: C.fg, margin: "0 0 16px", lineHeight: 1.3 }}>Cross-border E-commerce · Solo Founder</h3>
              <p style={{ fontFamily: font.body, fontSize: 14, color: C.mid, lineHeight: 2, maxWidth: 640, fontWeight: 300, margin: 0 }}>
                Building a personal brand company focused on import/export e-commerce between China and Australia. Combining media production skills, marketing strategy expertise, and cross-cultural business insight to create distinctive brand value and market differentiation.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" style={{ padding: "clamp(60px,10vh,120px) clamp(24px,5vw,64px)", background: C.bg }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%,400px),1fr))", gap: "clamp(40px,6vw,80px)" }}>
            <div>
              <Reveal>
                <div style={{ fontFamily: font.body, fontSize: 10, letterSpacing: 3, color: C.accent, textTransform: "uppercase", marginBottom: 12 }}>About</div>
                <h2 style={{ fontFamily: font.display, fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 300, color: C.fg, lineHeight: 1.2, margin: "0 0 32px" }}>
                  Where storytelling<br /><span style={{ fontStyle: "italic" }}>meets business</span>
                </h2>
              </Reveal>
              <Reveal delay={0.1}>
                <p style={{ fontFamily: font.body, fontSize: 15, color: C.mid, lineHeight: 2.1, fontWeight: 300, margin: "0 0 24px" }}>
                  I believe great content goes beyond visual aesthetics — it requires a deep understanding of the audience. From Shanghai broadcast studios to Melbourne embassy events, every project has been an exercise in cross-cultural communication.
                </p>
              </Reveal>
              <Reveal delay={0.15}>
                <p style={{ fontFamily: font.body, fontSize: 15, color: C.mid, lineHeight: 2.1, fontWeight: 300, margin: 0 }}>
                  My academic training at UNSW gave me a strong foundation in screen production, while real commercial projects taught me how content serves brand objectives. Now, I'm bringing these skills into my own cross-border e-commerce venture.
                </p>
              </Reveal>
            </div>
            <div>
              <Reveal delay={0.15}>
                <div className="stat-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 1, background: C.line, marginBottom: 36 }}>
                  {[{ n: "2+", l: "Years" }, { n: "3", l: "Countries" }, { n: "10+", l: "Projects" }].map((s, i) => (
                    <div key={i} style={{ background: C.bg, padding: "clamp(20px,2.5vw,32px)", textAlign: "center" }}>
                      <div style={{ fontFamily: font.display, fontSize: "clamp(28px,4vw,40px)", fontWeight: 300, color: C.fg }}>{s.n}</div>
                      <div style={{ fontFamily: font.body, fontSize: 10, letterSpacing: 2, color: C.light, textTransform: "uppercase", marginTop: 6 }}>{s.l}</div>
                    </div>
                  ))}
                </div>
              </Reveal>
              <Reveal delay={0.2}>
                <div style={{ marginBottom: 28 }}>
                  <div style={{ fontFamily: font.body, fontSize: 10, letterSpacing: 2, color: C.accent, textTransform: "uppercase", marginBottom: 14 }}>Tools & Skills</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {["Premiere Pro", "After Effects", "DaVinci Resolve", "Photoshop", "Illustrator", "Final Cut Pro", "OBS Studio", "Canva", "HTML/CSS/JS", "Unity/C#"].map((s, i) => (
                      <span key={i} style={{
                        padding: "6px 14px", border: `1px solid ${C.line}`,
                        fontFamily: font.body, fontSize: 11, color: C.mid, fontWeight: 300,
                      }}>{s}</span>
                    ))}
                  </div>
                </div>
              </Reveal>
              <Reveal delay={0.25}>
                <div>
                  <div style={{ fontFamily: font.body, fontSize: 10, letterSpacing: 2, color: C.accent, textTransform: "uppercase", marginBottom: 14 }}>Languages</div>
                  <div style={{ display: "flex", gap: 24 }}>
                    {[["Chinese", "Native"], ["English", "Fluent"], ["Japanese", "Basic"]].map(([lang, level], i) => (
                      <div key={i}>
                        <div style={{ fontFamily: font.display, fontSize: 18, color: C.fg, fontWeight: 400 }}>{lang}</div>
                        <div style={{ fontFamily: font.body, fontSize: 11, color: C.light, marginTop: 2 }}>{level}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── EDUCATION ── */}
      <section style={{ padding: "clamp(40px,6vh,80px) clamp(24px,5vw,64px)", background: C.bg2 }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", gap: 32, flexWrap: "wrap" }}>
          <Reveal>
            <div style={{ fontFamily: font.body, fontSize: 10, letterSpacing: 3, color: C.accent, textTransform: "uppercase", marginBottom: 8 }}>Education</div>
            <div style={{ fontFamily: font.display, fontSize: "clamp(22px,3vw,30px)", fontWeight: 400, color: C.fg }}>The University of New South Wales</div>
            <div style={{ fontFamily: font.body, fontSize: 13, color: C.mid, marginTop: 4 }}>Bachelor of Media (Screen and Sound Production) · 2023 — 2026</div>
          </Reveal>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" style={{ padding: "clamp(80px,12vh,140px) clamp(24px,5vw,64px)", background: "#090A0B", color: C.fg }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <Reveal>
            <div style={{ fontFamily: font.body, fontSize: 10, letterSpacing: 3, color: C.accent, textTransform: "uppercase", marginBottom: 24 }}>Get in Touch</div>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 style={{
              fontFamily: font.display, fontSize: "clamp(32px, 6vw, 56px)",
              fontWeight: 300, lineHeight: 1.2, margin: "0 0 20px", color: "rgba(250,248,245,0.95)",
            }}>
              Let's create something<br /><span style={{ fontStyle: "italic", color: C.accent }}>together</span>
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p style={{
              fontFamily: font.body, fontSize: 14, color: "rgba(250,248,245,0.45)",
              lineHeight: 1.9, maxWidth: 440, margin: "0 auto 40px", fontWeight: 300,
            }}>Whether it's media production, brand marketing, or cross-border business collaboration.</p>
          </Reveal>
          <Reveal delay={0.2}>
            <a href="mailto:yinruilong228@gmail.com" style={{
              display: "inline-block", padding: "14px 44px",
              border: "1px solid rgba(250,248,245,0.2)", background: "transparent",
              color: "rgba(250,248,245,0.9)", textDecoration: "none",
              fontFamily: font.body, fontSize: 14, letterSpacing: 1, transition: "all 0.3s",
            }}
              onMouseEnter={e => { e.target.style.background = C.bg; e.target.style.color = C.fg; }}
              onMouseLeave={e => { e.target.style.background = "transparent"; e.target.style.color = "rgba(250,248,245,0.9)"; }}
            >yinruilong228@gmail.com</a>
          </Reveal>
          <Reveal delay={0.25}>
            <div style={{ display: "flex", justifyContent: "center", gap: 32, marginTop: 28, flexWrap: "wrap" }}>
              <a href="tel:+61490261223" style={{ fontFamily: font.body, fontSize: 13, color: "rgba(250,248,245,0.35)", textDecoration: "none", transition: "color 0.3s" }}
                onMouseEnter={e => e.target.style.color = C.accent} onMouseLeave={e => e.target.style.color = "rgba(250,248,245,0.35)"}
              >+61 490 261 223</a>
              <span style={{ color: "rgba(250,248,245,0.15)" }}>·</span>
              <a href="https://www.linkedin.com/in/ruilong-yin-b82ab13b0" target="_blank" rel="noopener noreferrer" style={{ fontFamily: font.body, fontSize: 13, color: "rgba(250,248,245,0.35)", textDecoration: "none", transition: "color 0.3s" }}
                onMouseEnter={e => e.target.style.color = C.accent} onMouseLeave={e => e.target.style.color = "rgba(250,248,245,0.35)"}
              >LinkedIn</a>
              <span style={{ color: "rgba(250,248,245,0.15)" }}>·</span>
              <span style={{ fontFamily: font.body, fontSize: 13, color: "rgba(250,248,245,0.35)" }}>Sydney, Australia</span>
            </div>
          </Reveal>
        </div>
        <Reveal delay={0.3}>
          <div style={{
            maxWidth: 1280, margin: "80px auto 0", paddingTop: 28,
            borderTop: "1px solid rgba(250,248,245,0.06)",
            display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12,
          }}>
            <span style={{ fontFamily: font.body, fontSize: 11, color: "rgba(250,248,245,0.2)", letterSpacing: 1 }}>© 2026 Ruilong Yin</span>
            <span style={{ fontFamily: font.body, fontSize: 11, color: "rgba(250,248,245,0.15)", letterSpacing: 1 }}>UNSW · Bachelor of Media</span>
          </div>
        </Reveal>
      </section>

      {selectedWork && <WorkModal work={selectedWork} onClose={() => setSelectedWork(null)} />}
    </div>
  );
}
