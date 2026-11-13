// Marking room rules: AI interpretations stay suggestions until a teacher reviews them; the misconception map
// and revision groups use reviewed answers only; practice comes only from the approved bank; feedback for a
// group is approved by a teacher once every related interpretation has been reviewed.

export const can = (roles, roleId, perm) => !!roles.find((r) => r.id === roleId)?.can.includes(perm);

/** The misconception a teacher has confirmed for an answer, or null. AI-only suggestions don't count. */
export function reviewedTag(ans) {
  if (ans.status === 'confirmed') return ans.tag;
  if (ans.status === 'changed') return ans.teacherTag;
  return null;
}

/** Counts per misconception: reviewed (confirmed by a teacher) and pending (AI suggestion awaiting review). */
export function map(answers, misconceptions) {
  const out = Object.fromEntries(Object.keys(misconceptions).map((k) => [k, {reviewed: 0, pending: 0}]));
  for (const x of answers) {
    const t = reviewedTag(x);
    if (t) out[t].reviewed += 1;
    else if (x.status === 'ai' && x.tag) out[x.tag].pending += 1;
  }
  return out;
}

/** Revision groups: students with the same reviewed misconception, where at least `min` share it. */
export function groups(answers, min = 2) {
  const by = {};
  for (const x of answers) { const t = reviewedTag(x); if (t) (by[t] ||= new Set()).add(x.student); }
  return Object.entries(by).filter(([, s]) => s.size >= min).map(([tag, s]) => ({tag, students: [...s].sort()})).sort((a, b) => b.students.length - a.students.length);
}

export const practice = (tag, bank) => bank.filter((p) => p.tag === tag);

/** Interpretations still waiting for a teacher, for one misconception (or all). */
export const pending = (answers, tag) => answers.filter((x) => x.status === 'ai' && (!tag || x.tag === tag));

export function initial(answers, roles) {
  return {answers: structuredClone(answers), approved: {}, log: [], role: roles[0].id};
}

const now = () => new Date().toISOString();

export function act(state, a, {roles, actor, misconceptions, bank}) {
  const fail = (error) => ({state, ok: false, error});
  if (a.type === 'role') return {state: {...state, role: a.role}, ok: true};
  const allow = (p) => can(roles, state.role, p);
  const log = (id, summary, patch) => ({ok: true, state: {...state, ...patch, log: [{at: now(), actor, role: state.role, id, summary}, ...state.log]}});

  if (a.type === 'approve') {
    if (!allow('approve')) return fail('Only teachers approve feedback before it reaches students.');
    if (!misconceptions[a.tag]) return fail('Unknown group.');
    if (pending(state.answers, a.tag).length) return fail('Review every answer suggested for this misconception first.');
    if (!groups(state.answers).some((g) => g.tag === a.tag)) return fail('This group has fewer than two students after review.');
    const items = (a.items || []).filter((id) => bank.some((p) => p.id === id && p.tag === a.tag));
    if (!items.length) return fail('Choose at least one practice question from the approved bank.');
    const note = (a.note || '').trim();
    if (note.length < 8) return fail('Write the note students will see (at least 8 characters).');
    return log(a.tag, `Approved feedback for “${misconceptions[a.tag].label}” with ${items.join(', ')}`, {approved: {...state.approved, [a.tag]: {items, note, by: actor, at: now()}}});
  }

  const ans = state.answers.find((x) => x.id === a.id);
  if (!ans) return fail('Answer not found.');
  const put = (next, summary) => log(ans.id, summary, {answers: state.answers.map((x) => (x.id === ans.id ? next : x))});
  switch (a.type) {
    case 'confirm':
      if (!allow('review')) return fail('Only teachers review interpretations.');
      if (ans.status !== 'ai') return fail('There is no AI suggestion to confirm on this answer.');
      return put({...ans, status: 'confirmed', by: actor}, `Confirmed “${misconceptions[ans.tag].label}”`);
    case 'change': {
      if (!allow('review')) return fail('Only teachers review interpretations.');
      if (ans.correct) return fail('This answer is correct.');
      if (!misconceptions[a.tag]) return fail('Choose a misconception from the rubric.');
      return put({...ans, status: 'changed', teacherTag: a.tag, by: actor}, `Changed to “${misconceptions[a.tag].label}”`);
    }
    case 'reject': {
      if (!allow('review')) return fail('Only teachers review interpretations.');
      const reason = (a.reason || '').trim();
      if (reason.length < 8) return fail('Say why the interpretation is wrong (at least 8 characters), e.g. a careless slip.');
      return put({...ans, status: 'rejected', by: actor, reason}, `Rejected interpretation — “${reason}”`);
    }
    default:
      return fail('Unknown action.');
  }
}
