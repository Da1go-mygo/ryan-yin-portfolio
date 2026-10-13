import { useEffect, useRef, useState } from "react";
import "./cinematic.css";

const FILMS = [
  { id: "LRORdtVOStY", title: "Lincoln Aviator", category: "Automotive / Exhibition film", poster: "/images/lincoln.jpg", start: 3 },
  { id: "abNL4PHTx4M", title: "Sailing", category: "Sydney Harbour / Brand film", poster: "https://img.youtube.com/vi/abNL4PHTx4M/maxresdefault.jpg", start: 3 },
];

let youtubeAPI;
function loadYouTube() {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (!youtubeAPI) {
    youtubeAPI = new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error("Video service unavailable")), 12000);
      const previous = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        clearTimeout(timeout);
        previous?.();
        resolve(window.YT);
      };
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      script.onerror = () => { clearTimeout(timeout); reject(new Error("Video service unavailable")); };
      document.head.appendChild(script);
    }).catch(error => { youtubeAPI = null; throw error; });
  }
  return youtubeAPI;
}

function BackgroundFilm({ film, play, load, onStatus, onEnd }) {
  const host = useRef(null);
  const player = useRef(null);
  const desired = useRef(play);
  const callbacks = useRef({ onStatus, onEnd });
  desired.current = play;
  callbacks.current = { onStatus, onEnd };

  useEffect(() => {
    if (!load) return;
    let disposed = false;
    let ready = false;
    let instance;
    // YouTube replaces its target. Keep that target outside React's managed children.
    const target = document.createElement("div");
    host.current.appendChild(target);
    const timeout = setTimeout(() => {
      if (!disposed && !ready) callbacks.current.onStatus("unavailable");
    }, 15000);
    loadYouTube().then(YT => {
      if (disposed) return;
      instance = new YT.Player(target, {
        videoId: film.id,
        playerVars: { autoplay: 0, controls: 0, disablekb: 1, playsinline: 1, rel: 0, start: film.start, origin: window.location.origin },
        events: {
          onReady: event => {
            if (disposed) return;
            ready = true;
            clearTimeout(timeout);
            player.current = event.target;
            const frame = event.target.getIframe();
            frame.tabIndex = -1;
            frame.title = `${film.title} background film`;
            event.target.mute();
            if (desired.current) event.target.playVideo();
          },
          onStateChange: event => {
            if (disposed) return;
            if (event.data === YT.PlayerState.PLAYING) {
              if (!desired.current) { event.target.pauseVideo(); return; }
              ready = true;
              clearTimeout(timeout);
              callbacks.current.onStatus("playing");
            }
            if (event.data === YT.PlayerState.ENDED && desired.current) callbacks.current.onEnd();
          },
          onError: () => { if (!disposed) callbacks.current.onStatus("unavailable"); },
          onAutoplayBlocked: () => { if (!disposed) callbacks.current.onStatus("blocked"); },
        },
      });
    }).catch(() => { if (!disposed) callbacks.current.onStatus("unavailable"); });
    return () => {
      disposed = true;
      clearTimeout(timeout);
      player.current = null;
      instance?.destroy();
      target.remove();
    };
  }, [film, load]);

  useEffect(() => {
    const current = player.current;
    if (!current) return;
    if (play) { current.mute(); current.playVideo(); }
    else current.pauseVideo();
  }, [play]);

  return <div ref={host} className="film-player" aria-hidden="true" />;
}

export default function CinematicHero({ suspended = false }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches || Boolean(navigator.connection?.saveData));
  const [started, setStarted] = useState(!paused);
  const [visible, setVisible] = useState(true);
  const [tabVisible, setTabVisible] = useState(!document.hidden);
  const [status, setStatus] = useState("loading");
  const [attempt, setAttempt] = useState(0);
  const root = useRef(null);
  const playing = !paused && visible && tabVisible && !suspended;
  const film = FILMS[active];
  const choose = index => { if (index !== active) { setStatus("loading"); setActive(index); } };
  const next = () => { setStatus("loading"); setActive(index => (index + 1) % FILMS.length); };

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.1 });
    observer.observe(root.current);
    const onVisibility = () => setTabVisible(!document.hidden);
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMotion = () => { if (motion.matches) setPaused(true); };
    document.addEventListener("visibilitychange", onVisibility);
    motion.addEventListener("change", onMotion);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", onVisibility); motion.removeEventListener("change", onMotion); };
  }, []);

  useEffect(() => {
    if (!playing || status !== "playing") return;
    const timer = setTimeout(next, 18000);
    return () => clearTimeout(timer);
  }, [active, playing, status]);

  function togglePlayback() {
    if (paused && status === "unavailable") { setAttempt(value => value + 1); setStatus("loading"); }
    setStarted(true);
    setPaused(value => !value);
  }

  function handleStatus(value) {
    setStatus(value);
    if (value === "unavailable" || value === "blocked") setPaused(true);
  }

  return (
    <section id="top" ref={root} className="cinematic-hero" aria-label="Introduction">
      <div className="film-stage" aria-hidden="true" inert="">
        {FILMS.map((item, index) => <img key={item.id} className={`film-poster ${index === active ? "is-active" : ""}`} src={item.poster} alt="" fetchpriority={index === 0 ? "high" : "auto"} onError={event => { if (!event.currentTarget.dataset.fallback) { event.currentTarget.dataset.fallback = "true"; event.currentTarget.src = `https://img.youtube.com/vi/${item.id}/hqdefault.jpg`; } }} />)}
        <div className={`film-video ${status === "playing" ? "is-ready" : ""}`}>
          <BackgroundFilm key={`${film.id}-${attempt}`} film={film} play={playing} load={started} onStatus={handleStatus} onEnd={next} />
        </div>
      </div>
      <div className="film-shade" aria-hidden="true" />
      <div className="film-grain" aria-hidden="true" />
      <div className="hero-content">
        <div className="hero-eyebrow"><span /> MEDIA · MARKETING · COMMERCE</div>
        <h1>Ruilong<br /><em>( Ryan )</em> Yin<span className="hero-period">.</span></h1>
        <div className="hero-rule" />
        <p className="hero-description">Telling stories through the lens.<br />Building brands through strategy.</p>
        <p className="hero-credential">UNSW Media <span> / </span> Cross-border Entrepreneur</p>
        <div className="hero-actions">
          <a className="hero-primary" href="#works">Explore my work <span aria-hidden="true">↗</span></a>
          <a className="hero-contact" href="#contact">Get in touch <span aria-hidden="true">↗</span></a>
        </div>
      </div>
      <div className="hero-footer">
        <a className="hero-scroll" href="#works"><span aria-hidden="true">↓</span> SCROLL TO EXPLORE</a>
        <div className="film-selector" role="group" aria-label="Background film">
          {FILMS.map((item, index) => <button key={item.id} onClick={() => choose(index)} aria-pressed={index === active} className={index === active ? "is-selected" : ""}><span className="film-number">0{index + 1}</span><span>{item.title}<small>{item.category}</small></span><span className="film-indicator" /></button>)}
        </div>
        <button className="film-toggle" onClick={togglePlayback} aria-label={paused ? "Play background video" : "Pause background video"} aria-pressed={paused}>
          <span aria-hidden="true">{paused ? "▷" : "Ⅱ"}</span><span>{paused ? "PLAY FILM" : status === "playing" ? "PAUSE FILM" : status === "unavailable" || status === "blocked" ? "FILM STILL" : "LOADING FILM"}</span>
        </button>
      </div>
    </section>
  );
}

