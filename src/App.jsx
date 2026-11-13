import React, {useState} from 'react';
import site from './content.js';
import {answers, bank, concepts, misconceptions, questions, students} from './data.js';
import Room from './Room.jsx';
import LeadForm from './LeadForm.jsx';

export function Spindle({size = 34}) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
      <rect x="10" y="3" width="20" height="5" rx="2" fill="#1f3c88" />
      <rect x="10" y="32" width="20" height="5" rx="2" fill="#1f3c88" />
      <path d="M14 8 h12 l-2 24 h-8 z" fill="#f6f2e8" stroke="#1f3c88" strokeWidth="1.5" />
      <path d="M14.5 12 L25.5 15 M14.8 16 L25.2 19 M15.1 20 L24.9 23 M15.4 24 L24.6 27" stroke="#d1343c" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

const count = (tag) => answers.filter((a) => a.tag === tag).length;

function Header() {
  const [open, setOpen] = useState(false);
  const links = [['Why marks hide it', '/#marks'], ['Class map', '/#map'], ['How it works', '/#how'], ['Groups', '/#groups'], ['Pricing', '/#pricing'], ['Team', '/#team']];
  return (
    <header className="hdr">
      <a href="/" className="brand" aria-label="LessonSpindle home"><Spindle /><span>Lesson<b>Spindle</b></span></a>
      <nav id="nav" className={open ? 'nav open' : 'nav'} aria-label="Main">
        {links.map(([t, h]) => <a key={t} href={h} onClick={() => setOpen(false)}>{t}</a>)}
        <a className="nav-app" href="/app" onClick={() => setOpen(false)}>Marking room</a>
      </nav>
      <a className="hdr-cta" href="/app">Open the marking room</a>
      <button className="menu" aria-expanded={open} aria-controls="nav" onClick={() => setOpen(!open)}>{open ? 'Close' : 'Menu'}</button>
    </header>
  );
}

function Hero() {
  const n = count('add-across');
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="eyebrow">For secondary mathematics</p>
        <h1 id="hero-title">Show teachers where <span className="ul">understanding<svg viewBox="0 0 300 16" preserveAspectRatio="none" aria-hidden="true"><path data-mark pathLength="1" d="M3 11 C 60 4, 140 14, 200 7 S 280 9, 297 5" /></svg></span> breaks down.</h1>
        <p className="lede">{site.about}</p>
        <div className="cta-row"><a className="btn" href="/app">Open the marking room</a><a className="btn ghost" href="#pilot">Request a pilot</a></div>
        <p className="fine">A proposed product. The marking room runs in your browser on a fictional class.</p>
      </div>
      <figure className="script" data-reveal aria-label="Example of a marked answer">
        <p className="script-head"><span>Chidi · SS2 Gold</span><span>Week 6 check-in</span></p>
        <div className="sq">
          <p className="qn">1.&nbsp; Work out &nbsp;<b>½ + ⅓</b></p>
          <p className="hand">1 + 1 = 2</p>
          <p className="hand">2 + 3 = 5 &nbsp;&nbsp;→&nbsp; <span className="ring">2/5<svg viewBox="0 0 120 60" aria-hidden="true"><path data-mark pathLength="1" d="M14 34 C 10 12, 70 2, 104 18 C 122 30, 100 54, 52 54 C 20 54, 6 40, 22 22" /></svg></span></p>
          <p className="pen">adds the tops and the bottoms</p>
          <p className="qn q2">2.&nbsp; Solve &nbsp;<b>3x + 5 = 20</b></p>
          <p className="hand">x + 5 = 20 ÷ 3</p>
          <p className="pen small">divides before subtracting</p>
        </div>
        <figcaption className="thread-chip"><span className="dot" />Same reasoning in {n} of {students.length} scripts · suggested for review</figcaption>
      </figure>
    </section>
  );
}

const TRIO = [
  ['Amaka', ['add-across', 'first-term-only']],
  ['Bolu', ['unscaled-numerator', 'neg-times-neg']],
  ['Lami', ['add-across', 'inverse-order']],
];

function Marks() {
  return (
    <section className="sec" id="marks" aria-labelledby="marks-title">
      <p className="eyebrow">The problem</p>
      <h2 id="marks-title">The same mark can hide different problems.</h2>
      <p className="intro">Three students score 2 out of 4 on the same quiz. A mark book shows three identical results. Their working shows three different things to teach.</p>
      <div className="trio">
        {TRIO.map(([name, tags], i) => (
          <article key={name} className="mini" data-reveal style={{'--r': `${[-1.2, 0.8, -0.5][i]}deg`}}>
            <header><b>{name}</b><span className="score">2/4</span></header>
            <ul>{tags.map((t) => { const q = questions.find((x) => x.concept === misconceptions[t].concept); return <li key={t}><span className="mono">{q.id}</span><span className="hand">{answers.find((a) => a.student === name && a.q === q.id).given}</span><em>{misconceptions[t].label}</em></li>; })}</ul>
          </article>
        ))}
      </div>
      <p className="fine">Fictional students and answers, from the class used in the marking room.</p>
    </section>
  );
}

function ClassMap() {
  const rows = Object.entries(misconceptions);
  return (
    <section className="sec board-sec" id="map" aria-labelledby="map-title">
      <p className="eyebrow">Misconception map</p>
      <h2 id="map-title">See the whole class at once.</h2>
      <p className="intro">Each row is a reasoning error from the rubric; each dot is a student whose working suggests it. Teachers see which ideas need reteaching for everyone and which need a small group.</p>
      <div className="cmap" data-reveal>
        <div className="cmap-names" aria-hidden="true"><span /><div className="dots">{students.map((s) => <span key={s}>{s.slice(0, 2)}</span>)}</div><span /></div>
        {rows.map(([k, m]) => (
          <div key={k} className="cmap-row">
            <p><span className="mono">{concepts[m.concept].label}</span>{m.label}</p>
            <div className="dots" role="img" aria-label={`${count(k)} students: ${answers.filter((a) => a.tag === k).map((a) => a.student).join(', ')}`}>
              {students.map((s) => { const hit = answers.find((a) => a.student === s && a.tag === k); return <span key={s} className={hit ? (hit.confidence < 0.6 ? 'hit low' : 'hit') : ''} />; })}
            </div>
            <b className="n">{count(k)}</b>
          </div>
        ))}
      </div>
      <p className="legend"><span><i className="hit" /> suggested</span><span><i className="hit low" /> low confidence, check first</span><span>Before teacher review · fictional class of {students.length}</span></p>
    </section>
  );
}

const STEPS = [
  ['Scan the working', 'Upload photos or scans of answer scripts, or question-level results from your existing tests.'],
  ['Read against the rubric', 'Each wrong answer is compared with the reasoning errors in your explicit marking rubric, with a confidence score.'],
  ['Teacher reviews', 'Confirm, change or reject every interpretation. Unclear handwriting and low-confidence readings come first.'],
  ['Group and choose practice', 'Students who share a reviewed misconception are grouped, with practice drawn only from materials you approved.'],
  ['Approve, then share', 'Nothing reaches a student until a teacher has approved the group’s feedback and practice.'],
];

function How() {
  return (
    <section className="sec" id="how" aria-labelledby="how-title">
      <p className="eyebrow">How it works</p>
      <h2 id="how-title">From a pile of scripts to tomorrow’s lesson.</h2>
      <ol className="steps">
        <svg className="thread" viewBox="0 0 1000 60" preserveAspectRatio="none" aria-hidden="true"><path data-mark pathLength="1" d="M0 30 C 100 0, 150 60, 250 30 S 400 0, 500 30 S 650 60, 750 30 S 900 0, 1000 30" /></svg>
        {STEPS.map(([t, d], i) => <li key={t} data-reveal><span className="num">{i + 1}</span><h3>{t}</h3><p>{d}</p></li>)}
      </ol>
    </section>
  );
}

const GROUPS = ['add-across', 'neg-times-neg', 'first-term-only'];

function Groups() {
  return (
    <section className="sec" id="groups" aria-labelledby="groups-title">
      <p className="eyebrow">Revision groups</p>
      <h2 id="groups-title">Small groups, with practice from your own materials.</h2>
      <p className="intro">Groups form from reviewed misconceptions, not from overall marks. Practice is chosen from your department’s approved question bank, never generated and sent on its own.</p>
      <div className="cards">
        {GROUPS.map((g, i) => { const who = answers.filter((a) => a.tag === g).map((a) => a.student); const p = bank.find((b) => b.tag === g); return (
          <article key={g} className="icard" data-reveal style={{'--r': `${[0.6, -0.8, 0.4][i]}deg`}}>
            <p className="mono">{concepts[misconceptions[g].concept].label}</p>
            <h3>{misconceptions[g].label}</h3>
            <p className="who">{who.join(' · ')}</p>
            <div className="pq"><span className="mono">{p.id} · {p.level}</span><p>{p.text}</p></div>
            <p className="await">Waiting for teacher approval</p>
          </article>); })}
      </div>
    </section>
  );
}

const RULES = [
  ['AI suggests. Teachers decide.', 'Every interpretation is a suggestion until a teacher confirms, changes or rejects it. Groups use reviewed answers only.'],
  ['Only approved materials', 'Practice comes from a question bank your department has approved. LessonSpindle does not invent questions for students.'],
  ['Nothing is shared without approval', 'Feedback and practice reach students only after a teacher approves them, group by group.'],
  ['Honest about uncertainty', 'Messy handwriting and weak matches are flagged with their confidence, so teachers check them first.'],
  ['A careless slip is not a misconception', 'Teachers can reject an interpretation with a reason, and that reasoning is kept in the log.'],
];

function Rules() {
  return (
    <section className="sec chalk" aria-labelledby="rules-title">
      <p className="eyebrow">Ground rules</p>
      <h2 id="rules-title">Built around the teacher’s judgement.</h2>
      <ul className="rules">{RULES.map(([t, d]) => <li key={t} data-reveal><h3>{t}</h3><p>{d}</p></li>)}</ul>
    </section>
  );
}

const TOPICS = [['Number', ['Adding and subtracting fractions', 'Directed numbers', 'Percentages']], ['Algebra', ['Linear equations', 'Expanding and factorising', 'Substitution']], ['Geometry', ['Angles in polygons', 'Pythagoras’ theorem']]];

function Scope() {
  return (
    <section className="sec" aria-labelledby="scope-title">
      <div className="split">
        <div>
          <p className="eyebrow">Initial scope</p>
          <h2 id="scope-title">Starting with selected secondary maths topics.</h2>
          <p className="intro">The first version covers topics where a good marking rubric already spells out the common reasoning errors. Each school’s rubric is loaded before any scripts are read, and topics are added only once they’re tested with teachers.</p>
        </div>
        <div className="topics" data-reveal>{TOPICS.map(([g, ts]) => <div key={g}><h3>{g}</h3><ul>{ts.map((t) => <li key={t}>{t}</li>)}</ul></div>)}</div>
      </div>
    </section>
  );
}

function Stats() {
  return (
    <section className="sec" aria-labelledby="stats-title">
      <p className="eyebrow">Why it matters</p>
      <h2 id="stats-title">Many students fall behind in maths, and feedback can help.</h2>
      <div className="stats">{site.stats.map((s) => <article key={s.value} data-reveal><b>{s.value}</b><p>{s.label}</p><a href={s.url} rel="noopener noreferrer" target="_blank">{s.source}</a></article>)}</div>
      <p className="fine">“Baseline proficiency” is PISA Level 2. Feedback effect sizes vary widely between studies and subjects.</p>
    </section>
  );
}

const WHO = [
  ['Secondary schools', 'Maths departments that want to know what to reteach after every test, not just who scored what.'],
  ['Tutorial centres', 'Tutors who need to see each learner’s gaps quickly and plan focused sessions.'],
  ['Exam preparation providers', 'Teams preparing large cohorts who need revision groups built from real errors.'],
  ['Education networks', 'Groups of schools that want shared rubrics and a consistent view of where learning breaks down.'],
];

function Who() {
  return (
    <section className="sec" aria-labelledby="who-title">
      <p className="eyebrow">Who it’s for</p>
      <h2 id="who-title">For the people who mark the scripts.</h2>
      <div className="who-grid">{WHO.map(([t, d]) => <article key={t} data-reveal><h3>{t}</h3><p>{d}</p></article>)}</div>
    </section>
  );
}

const PLANS = [
  ['Department', '$190', 'per month', ['Up to 300 students', 'Two maths topics', 'Misconception map and groups', 'Practice from your question bank'], false],
  ['School', '$490', 'per month', ['Up to 1,200 students', 'All available topics', 'Head of department overview', 'Exportable review log'], true],
  ['Network', 'Custom', '', ['Several schools or centres', 'Shared rubrics and question banks', 'Network-wide reporting', 'Onboarding support'], false],
];

function Pricing() {
  return (
    <section className="sec" id="pricing" aria-labelledby="pricing-title">
      <p className="eyebrow">Pricing</p>
      <h2 id="pricing-title">Priced by students, not by teachers.</h2>
      <p className="intro">Illustrative pricing for a proposed product, to be agreed with pilot schools.</p>
      <div className="plans">{PLANS.map(([n, p, per, items, hl]) => (
        <article key={n} className={hl ? 'plan hl' : 'plan'} data-reveal><h3>{n}</h3><p className="price">{p}<small>{per}</small></p><ul>{items.map((x) => <li key={x}>{x}</li>)}</ul><a className={hl ? 'btn' : 'btn ghost'} href="#pilot">{n === 'Network' ? 'Talk to us' : 'Request a pilot'}</a></article>
      ))}</div>
    </section>
  );
}

const STACK = [
  ['Amazon Textract', 'Reads text and handwriting from scanned answer scripts'],
  ['Amazon Bedrock', 'Compares working with rubric misconceptions and drafts feedback for review'],
  ['Amazon S3', 'Stores scripts, rubrics and approved materials'],
  ['Amazon DynamoDB', 'Keeps interpretations, reviews, groups and approvals'],
  ['AWS Lambda', 'Runs the processing steps after each upload'],
];

function Stack() {
  return (
    <section className="sec" aria-labelledby="stack-title">
      <div className="split">
        <div><p className="eyebrow">Proposed platform</p><h2 id="stack-title">Proposed architecture on AWS.</h2><p className="intro">Not yet built. This website and the marking room run entirely in your browser.</p></div>
        <ul className="stack" data-reveal>{STACK.map(([t, d]) => <li key={t}><b>{t}</b><span>{d}</span></li>)}</ul>
      </div>
    </section>
  );
}

function Team() {
  return (
    <section className="sec" id="team" aria-labelledby="team-title">
      <p className="eyebrow">Team</p>
      <h2 id="team-title">The founders of LessonSpindle.</h2>
      <div className="team">{site.team.map((p) => (
        <article key={p.name} data-reveal><span className="av" aria-hidden="true">{p.initials}</span><div><h3>{p.name}</h3><p className="role">{p.role}</p><p>{p.bio}</p></div></article>
      ))}</div>
    </section>
  );
}

const FAQ = [
  ['Does LessonSpindle mark students’ work?', 'No. It suggests the likely reasoning behind wrong answers. Teachers review each suggestion, and marks stay with the teacher.'],
  ['Which subjects and topics are covered?', 'Selected secondary maths topics with explicit rubrics, to start. Other topics are added once they are tested with teachers.'],
  ['Where does the practice come from?', 'Only from question banks your school or centre has approved. LessonSpindle picks from them; it does not write questions for students.'],
  ['Do students see anything automatically?', 'No. Feedback and practice are shared only after a teacher approves them.'],
  ['Is LessonSpindle live?', 'Not yet. It is a proposed product; the marking room is a prototype running in your browser on a fictional class.'],
];

function Faq() {
  return (
    <section className="sec" aria-labelledby="faq-title">
      <p className="eyebrow">FAQ</p>
      <h2 id="faq-title">Frequently asked questions.</h2>
      <div className="faq">{FAQ.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}</div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="ftr">
      <a href="/" className="brand light" aria-label="LessonSpindle home"><Spindle /><span>Lesson<b>Spindle</b></span></a>
      <p>{site.tagline}</p>
      <nav aria-label="Footer"><a href="/app">Marking room</a><a href="/#pricing">Pricing</a><a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href={`mailto:${site.email}`}>{site.email}</a></nav>
      <p className="fine">© 2026 LessonSpindle. Founded by {site.team[0].name} with {site.team[1].name}. A proposed product: pricing is illustrative and the marking room uses a fictional class.</p>
    </footer>
  );
}

function Home() {
  return (<><Hero /><Marks /><ClassMap /><How /><Groups /><Rules /><Scope /><Stats /><Who /><Pricing /><Stack /><Team /><Faq /><LeadForm /></>);
}

const LEGAL = {
  privacy: ['Privacy notice', [
    ['This website', 'LessonSpindle is a proposed product. This website and the marking room run in your browser on a fictional class.'],
    ['Marking room', 'Your changes are kept in your browser’s local storage (key lessonspindle-room-v1) and never leave your device. “Reset” clears them. Do not enter real student information.'],
    ['Pilot requests', `Until a form service is connected, the form keeps your request in this browser and opens a pre-filled email to ${site.email}. Nothing is sent until you send it. This notice will be updated before any customer-relationship service is connected.`],
    ['Student data in a future service', 'Any pilot will be agreed in writing with the school, covering what student work is processed, where it is stored and how long it is kept.'],
    ['Cookies & analytics', 'None.'],
  ]],
  terms: ['Terms of use', [
    ['A proposed product', 'Nothing here is an offer of service. Pricing is illustrative.'],
    ['Demonstration only', 'The marking room uses a fictional class and must not be used with real student work.'],
    ['Teachers decide', 'LessonSpindle suggests interpretations; teachers review them and approve all feedback before it is shared.'],
    ['No affiliation', 'Organisation types named are prospective customers; no affiliation is implied.'],
  ]],
};

function Legal({kind}) {
  const [title, items] = LEGAL[kind];
  return <section className="sec legal"><p className="eyebrow">Review draft</p><h1>{title}</h1>{items.map(([t, d]) => <div key={t}><h2>{t}</h2><p>{d}</p></div>)}</section>;
}

function NotFound() {
  return <section className="sec legal"><p className="eyebrow">404</p><h1>This page isn’t on the syllabus.</h1><p>We couldn’t find it.</p><p><a className="btn" href="/">Back to LessonSpindle</a></p></section>;
}

export default function App({path = '/'}) {
  if (path.startsWith('/app')) return <Room />;
  const page = path === '/' ? <Home /> : path === '/privacy' ? <Legal kind="privacy" /> : path === '/terms' ? <Legal kind="terms" /> : <NotFound />;
  return (<><a className="skip" href="#main">Skip to content</a><Header /><main id="main">{page}</main><Footer /></>);
}
