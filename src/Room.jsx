import React, {useEffect, useState} from 'react';
import site from './content.js';
import {answers, bank, concepts, klass, misconceptions, people, questions, roles, students} from './data.js';
import {act, can, groups, initial, map, pending, practice, reviewedTag} from './engine.js';
import {Spindle} from './App.jsx';

const KEY = 'lessonspindle-room-v1';
const STATUS = {ai: 'AI suggestion — not reviewed', confirmed: 'Confirmed by teacher', changed: 'Changed by teacher', rejected: 'Rejected — no misconception'};
const wrong = (list) => list.filter((a) => !a.correct);
const order = (list) => [...list].sort((a, b) => (a.status === 'ai' ? 0 : 1) - (b.status === 'ai' ? 0 : 1) || a.confidence - b.confidence);

export default function Room() {
  const [state, setState] = useState(() => initial(answers, roles));
  const [tab, setTab] = useState('review');
  const [q, setQ] = useState('all');
  const [sel, setSel] = useState('Ifeanyi-Q1');
  const [msg, setMsg] = useState('');
  const [reason, setReason] = useState({});
  const [alt, setAlt] = useState({});
  const [pick, setPick] = useState({});
  const [note, setNote] = useState({});
  useEffect(() => { try { const s = JSON.parse(localStorage.getItem(KEY) || 'null'); if (s?.answers) setState(s); } catch { /* ignore */ } }, []);
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* ignore */ } }, [state]);

  const actor = people[state.role];
  const allow = (p) => can(roles, state.role, p);
  const run = (a) => { const r = act(state, a, {roles, actor, misconceptions, bank}); setMsg(r.ok ? '' : r.error); if (r.ok) setState(r.state); return r.ok; };
  const list = order(wrong(state.answers).filter((a) => q === 'all' || a.q === q));
  const ans = state.answers.find((a) => a.id === sel) || list[0];
  const qq = questions.find((x) => x.id === ans.q);
  const left = pending(state.answers).length;
  const total = wrong(state.answers).filter((a) => a.tag).length;
  const m = map(state.answers, misconceptions);
  const gs = groups(state.answers);
  const options = Object.entries(misconceptions).filter(([, v]) => v.concept === qq.concept);
  const exportLog = () => { const rows = [['time', 'person', 'role', 'item', 'change'], ...state.log.map((l) => [l.at, l.actor, l.role, l.id, l.summary])].map((x) => x.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')); const url = URL.createObjectURL(new Blob([rows.join('\n')], {type: 'text/csv'})); const a = document.createElement('a'); a.href = url; a.download = 'lessonspindle-review-log.csv'; a.click(); URL.revokeObjectURL(url); };

  return (
    <div className="room">
      <header className="rm-top">
        <a href="/" className="brand" aria-label="Back to the LessonSpindle website"><Spindle size={28} /> Lesson<b>Spindle</b></a>
        <span className="rm-class">{klass.name} · {klass.subject} · {klass.quiz}</span>
        <label className="rm-role">Signed in as <select value={state.role} onChange={(e) => run({type: 'role', role: e.target.value})}>{roles.map((x) => <option key={x.id} value={x.id}>{x.label}</option>)}</select></label>
        <button className="btn ghost sm" onClick={() => { setState(initial(answers, roles)); setMsg(''); }}>Reset</button>
      </header>
      <p className="rm-banner">A fictional class. AI interpretations are suggestions until a teacher reviews them, and nothing is shared with students without a teacher’s approval.</p>
      <main className="rm-main">
        <div className="rm-title">
          <h1>{site.app.title}</h1>
          <div className="progress" aria-label={`${total - left} of ${total} interpretations reviewed`}><span style={{width: `${((total - left) / total) * 100}%`}} /><p>{total - left} of {total} interpretations reviewed</p></div>
        </div>
        <div className="rm-tabs" role="group" aria-label="View">{[['review', `Review answers (${left})`], ['map', 'Misconception map'], ['groups', `Revision groups (${gs.length})`]].map(([id, t]) => <button key={id} aria-pressed={tab === id} className={tab === id ? 'on' : ''} onClick={() => { setTab(id); setMsg(''); }}>{t}</button>)}</div>
        {msg && <p className="rm-err" role="alert">{msg}</p>}
        {!allow('review') && <p className="rm-note">{roles.find((r) => r.id === state.role).label}s can view and add notes; teachers review interpretations and approve feedback.</p>}

        <div className="rm-grid">
          <div className="rm-work">
            {tab === 'review' && (
              <div className="rv">
                <aside className="rm-card rv-list" aria-label="Wrong answers">
                  <div className="qchips">{['all', ...questions.map((x) => x.id)].map((id) => <button key={id} className={q === id ? 'on' : ''} aria-pressed={q === id} onClick={() => setQ(id)}>{id === 'all' ? 'All' : id}</button>)}</div>
                  <ul>{list.map((a) => (
                    <li key={a.id}><button className={a.id === ans.id ? 'on' : ''} onClick={() => { setSel(a.id); setMsg(''); }}>
                      <span className={`st st-${a.status}`} aria-hidden="true" />
                      <span><b>{a.student}</b> · {a.q}<small>{a.status === 'ai' ? `${misconceptions[a.tag].label} · ${Math.round(a.confidence * 100)}%` : a.status === 'none' ? 'No suggestion' : STATUS[a.status]}</small></span>
                    </button></li>
                  ))}</ul>
                </aside>
                <section className="rm-card paper" aria-labelledby="ans-title">
                  <p className="mono">{qq.id} · {concepts[qq.concept].label} · expected {qq.answer}</p>
                  <h2 id="ans-title">{ans.student}: {qq.text}</h2>
                  <div className="sheet"><p className="hand big">{ans.working || '(no working shown)'}</p><p className="hand ansline">Answer: <span className="redring">{ans.given}</span></p></div>
                  <div className={`interp interp-${ans.status}`}>
                    <p className="mono">{STATUS[ans.status] || 'No AI suggestion'}{ans.tag ? ` · ${Math.round(ans.confidence * 100)}% confidence` : ''}</p>
                    {ans.tag && <h3>{misconceptions[reviewedTag(ans) || ans.tag].label}</h3>}
                    {ans.tag && <p className="ex">Typical working: <span className="hand">{misconceptions[reviewedTag(ans) || ans.tag].example}</span></p>}
                    {ans.confidence > 0 && ans.confidence < 0.6 && ans.status === 'ai' && <p className="warn">Low confidence — the handwriting or working is unclear. Check the script.</p>}
                    {ans.reason && <p className="why">“{ans.reason}” — {ans.by}</p>}
                  </div>
                  {ans.status === 'ai' && (
                    <div className="acts">
                      <button className="btn" disabled={!allow('review')} onClick={() => run({type: 'confirm', id: ans.id})}>Confirm</button>
                      <div className="row"><select aria-label="Different misconception" value={alt[ans.id] || ''} onChange={(e) => setAlt({...alt, [ans.id]: e.target.value})} disabled={!allow('review')}><option value="">Choose a different misconception…</option>{options.map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}</select>
                        <button className="btn ghost sm" disabled={!allow('review')} onClick={() => run({type: 'change', id: ans.id, tag: alt[ans.id]})}>Change</button></div>
                      <div className="row"><input aria-label="Reason for rejecting" placeholder="Why it’s not a misconception (e.g. a copying slip)" value={reason[ans.id] || ''} onChange={(e) => setReason({...reason, [ans.id]: e.target.value})} disabled={!allow('review')} />
                        <button className="btn ghost sm" disabled={!allow('review')} onClick={() => run({type: 'reject', id: ans.id, reason: reason[ans.id]})}>Reject</button></div>
                    </div>
                  )}
                </section>
              </div>
            )}

            {tab === 'map' && (
              <section className="rm-card" aria-labelledby="map-h">
                <h2 id="map-h">Misconception map</h2>
                <p className="rm-fine">Solid bars are teacher-reviewed; outlined bars are AI suggestions still waiting for review.</p>
                <ul className="bars">{Object.entries(misconceptions).map(([k, v]) => (
                  <li key={k}><p><span className="mono">{concepts[v.concept].label}</span>{v.label}</p>
                    <div className="bar"><span className="rev" style={{width: `${(m[k].reviewed / students.length) * 100}%`}} /><span className="pen" style={{width: `${(m[k].pending / students.length) * 100}%`}} /></div>
                    <b>{m[k].reviewed}<small>{m[k].pending ? ` +${m[k].pending}` : ''}</small></b></li>
                ))}</ul>
                <h3>By student</h3>
                <div className="by-student">{students.map((s) => { const mine = state.answers.filter((a) => a.student === s); const score = mine.filter((a) => a.correct).length; const tags = mine.map(reviewedTag).filter(Boolean); return (
                  <div key={s}><b>{s}</b><span className="mono">{score}/4</span><small>{tags.length ? tags.map((t) => misconceptions[t].label).join('; ') : mine.some((a) => a.status === 'ai') ? 'Awaiting review' : score === 4 ? 'All correct' : 'No misconception recorded'}</small></div>); })}</div>
              </section>
            )}

            {tab === 'groups' && (
              <section className="rm-card" aria-labelledby="gr-h">
                <h2 id="gr-h">Revision groups</h2>
                <p className="rm-fine">Groups of two or more students who share a reviewed misconception. Choose practice from the approved bank, write the note students will see, then approve.</p>
                {!gs.length && <p className="empty">No groups yet. Confirm interpretations in “Review answers” and groups appear here.</p>}
                <div className="groups">{gs.map((g) => { const ap = state.approved[g.tag]; const wait = pending(state.answers, g.tag).length; const ch = pick[g.tag] || []; return (
                  <article key={g.tag} className={ap ? 'grp done' : 'grp'}>
                    <p className="mono">{concepts[misconceptions[g.tag].concept].label} · {g.students.length} students</p>
                    <h3>{misconceptions[g.tag].label}</h3>
                    <p className="who">{g.students.join(', ')}</p>
                    {ap ? (<div className="approved"><p className="mono">Approved by {ap.by}</p><p>“{ap.note}”</p><ul>{ap.items.map((id) => <li key={id}>{bank.find((b) => b.id === id).text}</li>)}</ul></div>) : (<>
                      {wait > 0 && <p className="warn">{wait} more answer{wait > 1 ? 's' : ''} suggested for this misconception still need review.</p>}
                      <fieldset><legend>Practice from the approved bank</legend>{practice(g.tag, bank).map((p) => (
                        <label key={p.id} className="pk"><input type="checkbox" checked={ch.includes(p.id)} disabled={!allow('approve')} onChange={(e) => setPick({...pick, [g.tag]: e.target.checked ? [...ch, p.id] : ch.filter((x) => x !== p.id)})} /><span><span className="mono">{p.id} · {p.level}</span>{p.text}</span></label>
                      ))}</fieldset>
                      <label className="nt">Note for students<textarea rows="2" value={note[g.tag] || ''} placeholder="e.g. We’ll look at why the bottoms of fractions don’t add." onChange={(e) => setNote({...note, [g.tag]: e.target.value})} disabled={!allow('approve')} /></label>
                      <button className="btn sm" disabled={!allow('approve')} onClick={() => run({type: 'approve', tag: g.tag, items: ch, note: note[g.tag]})}>Approve feedback</button>
                    </>)}
                  </article>); })}</div>
              </section>
            )}
          </div>

          <aside className="rm-card rm-side" aria-label="Review log">
            <h2>Review log</h2>
            <ul className="log">{state.log.slice(0, 10).map((l, i) => <li key={i}><time>{new Date(l.at).toLocaleTimeString()}</time> <b>{l.actor}</b> · {l.id} · {l.summary}</li>)}{!state.log.length && <li className="rm-fine">Confirmations, changes, rejections and approvals appear here.</li>}</ul>
            {allow('export') && state.log.length > 0 && <button className="btn ghost sm" onClick={exportLog}>Export log</button>}
            <h3>Approved for sharing</h3>
            {Object.keys(state.approved).length ? <ul className="shared">{Object.keys(state.approved).map((t) => <li key={t}>{misconceptions[t].label}</li>)}</ul> : <p className="rm-fine">Nothing yet. Students see nothing until a teacher approves a group.</p>}
          </aside>
        </div>
      </main>
    </div>
  );
}
