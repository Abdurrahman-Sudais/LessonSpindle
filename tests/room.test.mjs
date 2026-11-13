import test from 'node:test';
import assert from 'node:assert/strict';
import {answers, bank, misconceptions, roles, people} from '../src/data.js';
import {act, groups, initial, map, pending} from '../src/engine.js';
import site from '../src/content.js';

const ctx = (state) => ({roles, actor: people[state.role], misconceptions, bank});
const run = (state, a) => act(state, a, ctx(state));

test('AI suggestions do not count until a teacher reviews them', () => {
  const s = initial(answers, roles);
  assert.equal(groups(s.answers).length, 0);
  const m = map(s.answers, misconceptions);
  assert.equal(m['add-across'].reviewed, 0);
  assert.equal(m['add-across'].pending, 5);
});

test('confirming, changing and rejecting', () => {
  let s = initial(answers, roles);
  s = run(s, {type: 'confirm', id: 'Amaka-Q1'}).state;
  s = run(s, {type: 'confirm', id: 'Chidi-Q1'}).state;
  assert.deepEqual(groups(s.answers)[0], {tag: 'add-across', students: ['Amaka', 'Chidi']});
  assert.equal(run(s, {type: 'reject', id: 'Ifeanyi-Q1', reason: 'slip'}).ok, false);
  s = run(s, {type: 'reject', id: 'Ifeanyi-Q1', reason: 'Unreadable — will ask Ifeanyi directly'}).state;
  s = run(s, {type: 'change', id: 'Fatima-Q2', tag: 'inverse-order'}).state;
  assert.equal(map(s.answers, misconceptions)['inverse-order'].reviewed, 1);
  assert.equal(run(s, {type: 'confirm', id: 'Daniel-Q1'}).ok, false);
  assert.equal(s.log.length, 4);
});

test('approval needs every related answer reviewed, approved practice and a note', () => {
  let s = initial(answers, roles);
  s = run(s, {type: 'confirm', id: 'Amaka-Q1'}).state;
  s = run(s, {type: 'confirm', id: 'Chidi-Q1'}).state;
  const ap = {type: 'approve', tag: 'add-across', items: ['P-01'], note: 'Let’s look at fraction bars together.'};
  assert.match(run(s, ap).error, /Review every answer/);
  for (const id of pending(s.answers, 'add-across').map((a) => a.id)) s = run(s, {type: 'confirm', id}).state;
  assert.match(run(s, {...ap, items: ['P-05']}).error, /approved bank/);
  assert.match(run(s, {...ap, note: 'ok'}).error, /note/);
  const r = run(s, ap);
  assert.ok(r.ok);
  assert.deepEqual(r.state.approved['add-across'].items, ['P-01']);
});

test('only teachers review and approve', () => {
  let s = run(initial(answers, roles), {type: 'role', role: 'assistant'}).state;
  assert.equal(run(s, {type: 'confirm', id: 'Amaka-Q1'}).ok, false);
  s = run(s, {type: 'role', role: 'hod'}).state;
  assert.ok(run(s, {type: 'confirm', id: 'Amaka-Q1'}).ok);
});

test('founders and practice bank integrity', () => {
  assert.deepEqual(site.team.map((p) => p.name), ['Adesua Osagie', 'Ibrahim Danjuma']);
  for (const p of bank) assert.ok(misconceptions[p.tag], p.id);
  for (const a of answers) if (a.tag) assert.ok(misconceptions[a.tag], a.id);
});
