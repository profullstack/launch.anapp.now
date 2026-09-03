export default function DomainMark({ className = "", upper = false }: { className?: string; upper?: boolean }) {
  const t = (s: string) => (upper ? s.toUpperCase() : s);
  // Plain text: assistive tech reads "launch.anapp.now" as written.
  return (
    <span className={`domain ${className}`.trim()}>
      {t("launch")}
      <span className="dot">.</span>
      {t("anapp")}
      <span className="dot">.</span>
      <span className="now">{t("now")}</span>
    </span>
  );
}
