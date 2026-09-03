import Process from "./Process.tsx";
import IdeaForm from "./IdeaForm.tsx";
import DomainMark from "./DomainMark.tsx";

export function ProcessSection() {
  return (
    <section className="section" id="how-it-works" data-section="process" aria-labelledby="process-title">
      <div className="wrap">
        <div className="section-head">
          <p className="eyebrow reveal">What happens next</p>
          <h2 className="h2 reveal" id="process-title" data-delay="1">You don't need to know how to build it.</h2>
          <p className="lede reveal" data-delay="2">You need to know what you want.</p>
        </div>
        <Process />
      </div>
    </section>
  );
}

export function ProofSection() {
  const rows: Array<{ t: string; who: "you" | "chovy" | "build"; text: string; actions?: Array<[string, boolean]> }> = [
    { t: "9:12 AM", who: "you", text: "Customers should be able to reschedule without calling us." },
    { t: "9:14 AM", who: "chovy", text: "Updated the booking flow plan. Reschedule allowed up to 24h before, with a confirmation email to both sides." },
    { t: "11:48 AM", who: "build", text: "Reschedule flow ready for review.", actions: [["Open preview", false]] },
    { t: "12:02 PM", who: "you", text: "Ship the shorter version.", actions: [["Approve", true]] },
  ];
  return (
    <section className="section dark proof" data-section="proof" aria-labelledby="proof-title">
      <div className="wrap">
        <div className="section-head">
          <p className="eyebrow reveal">Product proof</p>
          <h2 className="h2 reveal" id="proof-title" data-delay="1">Not another pitch deck.<em>Something you can open.</em></h2>
        </div>
        <div className="timeline reveal" data-delay="2" aria-label="A simulated Chovy project conversation">
          {rows.map((row) => (
            <div className="row" key={row.t}>
              <time>{row.t}</time>
              <div>
                <div className={`who ${row.who}`}>{row.who === "chovy" ? "Chovy" : row.who}</div>
                <p>{row.text}</p>
                {row.actions && (
                  <div className="actions" aria-hidden="true">
                    {row.actions.map(([label, go]) => <span key={label} className={go ? "go" : ""}>{label}</span>)}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="proof-lines reveal" data-delay="3">
          <p>See the work.</p>
          <p>Open the preview.</p>
          <p>Try it like a customer would.</p>
          <p>If it's wrong, say so. If it's right, approve it.</p>
        </div>
      </div>
    </section>
  );
}

export function PainSection() {
  return (
    <section className="section pain" id="why-chovy" data-section="pain" aria-labelledby="pain-title">
      <div className="wrap">
        <div className="section-head">
          <p className="eyebrow reveal">For people who already do the product part</p>
          <h2 className="h2 reveal" id="pain-title" data-delay="1">You already do the product part.</h2>
        </div>
        <div className="statements">
          <p className="reveal">You already know the <b>user flow</b>.</p>
          <p className="reveal" data-delay="1">You already know what the <b>dashboard</b> should show.</p>
          <p className="reveal" data-delay="2">You already know which <b>integration</b> you need.</p>
          <p className="reveal" data-delay="3">You already know what is broken about the <b>current workflow</b>.</p>
          <p className="reveal" data-delay="4">You may even have the Figma, the Notion doc, the spreadsheet, the tickets, or the landing page.</p>
        </div>
        <p className="punch reveal">The missing skill shouldn't be "become a full-stack engineer."</p>
        <div className="stops reveal" data-delay="1">
          <p>Stop waiting for the engineering backlog.</p>
          <p>Stop turning every product thought into six Jira tickets.</p>
          <p>Stop letting a prototype die because the no-code tool hit a wall.</p>
          <p>Stop interviewing developers just to test whether the idea is worth building.</p>
        </div>
        <p className="close reveal" data-delay="2">You own the product thinking. Chovy turns it into engineering execution.</p>
      </div>
    </section>
  );
}

export function OwnershipSection() {
  return (
    <section className="section dark yours" data-section="ownership" aria-labelledby="yours-title">
      <div className="wrap">
        <p className="eyebrow reveal">Your app means yours</p>
        <h2 className="giant reveal" id="yours-title" data-delay="1">YOURS<span className="dot">.</span></h2>
        <div className="owns">
          <div className="own reveal" data-delay="1"><h3>Your code</h3><p>You own the product code and repository under Chovy's current terms. Take it with you.</p></div>
          <div className="own reveal" data-delay="2"><h3>Your domain</h3><p>You control the product's domain. It points where you say it points.</p></div>
          <div className="own reveal" data-delay="3"><h3>Your decision</h3><p>Finishing a build does not publish it. Nothing goes live without your explicit approval.</p></div>
          <div className="own reveal" data-delay="4"><h3>Your team</h3><p>Bring your own developer, or ask for human help from inside the project when it's supported.</p></div>
        </div>
      </div>
    </section>
  );
}

export function CompareSection() {
  return (
    <section className="section" data-section="compare" aria-labelledby="compare-title">
      <div className="wrap">
        <div className="section-head">
          <p className="eyebrow reveal">Before vs. Chovy</p>
          <h2 className="h2 reveal" id="compare-title" data-delay="1">The idea is not the bottleneck.</h2>
        </div>
        <div className="compare">
          <div className="column before reveal">
            <h3>Before</h3>
            <p className="keep">Idea in Notion</p>
            <p className="keep">Flow in Figma</p>
            <p className="keep">Requirements in Slack</p>
            <p className="keep">Tasks in Jira</p>
            <p className="keep">Data in a spreadsheet</p>
            <p>Engineering backlog: 6 weeks</p>
            <p>AI prototype: almost works</p>
            <p>Still no shippable product</p>
          </div>
          <div className="column after reveal" data-delay="1">
            <h3>With Chovy</h3>
            <p>Describe it</p>
            <p>Read the plan</p>
            <p>See the work</p>
            <p>Open the preview</p>
            <p>Change what is wrong</p>
            <p>Approve what is right</p>
            <p>Keep moving</p>
          </div>
        </div>
        <p className="compare-cta reveal"><a className="btn" href="#idea">Start with the sentence <span className="arrow" aria-hidden="true">→</span></a></p>
      </div>
    </section>
  );
}

export const FAQ: Array<{ q: string; a: string }> = [
  { q: "Is this an AI app builder?", a: "Chovy may use AI in the work, but the value is the whole product-building workflow: turning your idea into a plan, coordinating execution, giving you working previews, capturing decisions, and keeping you in control." },
  { q: "Do I need to know how to code?", a: "No. Describe what you want the product to do in ordinary language. Use the product vocabulary you already use at work." },
  { q: "Do I need a developer?", a: "Not to begin. Chovy supports bringing in your own developer or asking for human help when a project needs it." },
  { q: "Who owns the code?", a: "You do, according to Chovy's current product terms. The repository and the product are yours to take with you." },
  { q: "Will Chovy automatically publish my app?", a: "No. Approval and publishing are explicit actions you take. Finishing a build is not the same as going live." },
  { q: "How much does it cost?", a: "Starting is free. Chovy shows its current pricing inside the product and surfaces any billable cost before it happens." },
  { q: "Does \"now\" mean my app is instantly live?", a: "No. It means you can stop circling the idea and start the process now. Real software still deserves review before it goes live." },
];

export function FaqSection() {
  return (
    <section className="section" id="faq" data-section="faq" aria-labelledby="faq-title">
      <div className="wrap">
        <div className="section-head">
          <p className="eyebrow reveal">Questions</p>
          <h2 className="h2 reveal" id="faq-title" data-delay="1">Straight answers.</h2>
        </div>
        <div className="faq-list reveal" data-delay="2">
          {FAQ.map((item) => (
            <details key={item.q}>
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FinalSection({ chovyOrigin }: { chovyOrigin: string }) {
  return (
    <section className="section final" data-section="final" aria-labelledby="final-title">
      <div className="wrap">
        <p className="eyebrow reveal">Last step before the first step</p>
        <h2 className="h2 reveal" id="final-title" data-delay="1">You've described it enough times.</h2>
        <p className="lede reveal" data-delay="2">Put the first sentence here.</p>
        <IdeaForm surface="final" id="idea-final" chips={false} />
        <div className="lockup reveal">
          <DomainMark />
          <a className="powered" href={chovyOrigin} rel="noopener"><span>Powered by</span><img src="/chovy-logo.png" alt="Chovy" width={2172} height={724} /></a>
        </div>
      </div>
    </section>
  );
}

export function Footer({ chovyOrigin }: { chovyOrigin: string }) {
  return (
    <footer className="footer">
      <div className="wrap">
        <p className="legend"><b>launch</b> → action · <b>anapp</b> → the thing in your head · <b>now</b> → stop waiting</p>
        <nav aria-label="Footer">
          <a href={chovyOrigin} rel="noopener">Chovy</a>
          <a href={`${chovyOrigin}/privacy`} rel="noopener">Privacy</a>
          <a href={`${chovyOrigin}/terms`} rel="noopener">Terms</a>
          <a href="#faq">FAQ</a>
        </nav>
        <p>© {new Date().getFullYear()} Chovy. Your idea stays private until you say otherwise.</p>
      </div>
    </footer>
  );
}
