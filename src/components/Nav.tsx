import DomainMark from "./DomainMark.tsx";
import StartLink from "./StartLink.tsx";

export default function Nav({ chovyOrigin }: { chovyOrigin: string }) {
  return (
    <header className="nav">
      <div className="wrap">
        <a href="/" aria-label="launch.anapp.now home" style={{ textDecoration: "none" }}>
          <DomainMark />
        </a>
        <nav className="nav-links" aria-label="Primary">
          <a href="#how-it-works">How it works</a>
          <a href="#why-chovy">Why Chovy</a>
          <a href={chovyOrigin} rel="noopener">Sign in</a>
        </nav>
        <StartLink />
      </div>
    </header>
  );
}
