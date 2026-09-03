"use client";
import { useEffect, useState } from "react";

const STEPS = [
  { n: "01", title: "Say it.", body: "Describe the product in ordinary language. The flow, the screens, the users, the outcome. No technical brief." },
  { n: "02", title: "See the plan.", body: "Chovy turns the rough idea into something concrete enough to read, question, and change before any work starts." },
  { n: "03", title: "Watch it become real.", body: "See actual progress and open working previews. Try it the way a customer would." },
  { n: "04", title: "Decide what ships.", body: "Approve it, change it, or keep working. Finishing a build never means publishing it." },
];

function Console({ step }: { step: number }) {
  return (
    <div className="console" aria-hidden="true">
      <header><span className="dots">●●●</span><b>Chovy</b><span>/ your project</span></header>
      <div className="body" key={step}>
        {step === 0 && (
          <div className="msg you"><small>You</small><span>I want an app where independent music teachers can list availability and students book and pay.</span></div>
        )}
        {step === 1 && (
          <>
            <div className="msg you"><small>You</small><span>…students book and pay.</span></div>
            <div className="msg"><small>Chovy · plan</small>
              <ul className="plan">
                <li>Teacher profile and weekly availability</li>
                <li>Student booking flow with card payment</li>
                <li>Reminders and reschedule rules</li>
                <li className="todo">Admin view for payouts</li>
              </ul>
            </div>
          </>
        )}
        {step === 2 && (
          <>
            <div className="msg build"><small>Build</small><span>Booking flow ready for review.</span></div>
            <div className="preview">
              <div className="chrome">preview · booking</div>
              <div className="screen"><i className="w" /><i className="x" /><i /><i className="y" /></div>
            </div>
          </>
        )}
        {step === 3 && (
          <>
            <div className="msg"><small>Chovy</small><span>Reschedule flow shipped to preview. Approve, change, or keep going?</span></div>
            <div className="actions"><span className="go">Approve</span><span className="quiet">Change it</span><span className="quiet">Keep working</span></div>
            <div className="msg you"><small>You</small><span>Ship the shorter version.</span></div>
          </>
        )}
      </div>
    </div>
  );
}

export default function Process() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-step]"));
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(Number((visible.target as HTMLElement).dataset.step));
      },
      { threshold: [0.4, 0.7], rootMargin: "-20% 0px -35% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return (
    <div className="process-grid">
      <ol className="steps" style={{ margin: 0, padding: 0 }}>
        {STEPS.map((s, i) => (
          <li className={`step ${i === active ? "active" : ""}`} data-step={i} key={s.n}>
            <small>{s.n}</small>
            <div><h3>{s.title}</h3><p>{s.body}</p></div>
          </li>
        ))}
      </ol>
      <div className="console-wrap"><Console step={active} /></div>
    </div>
  );
}
