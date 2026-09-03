export default function DomainMark({ className = "", upper = false }: { className?: string; upper?: boolean }) {
  const t = (s: string) => (upper ? s.toUpperCase() : s);
  return (
    <span className={`domain ${className}`.trim()} aria-label="launch.anapp.now">
      <span aria-hidden="true">{t("launch")}</span>
      <span className="dot" aria-hidden="true">.</span>
      <span aria-hidden="true">{t("anapp")}</span>
      <span className="dot" aria-hidden="true">.</span>
      <span className="now" aria-hidden="true">{t("now")}</span>
    </span>
  );
}
