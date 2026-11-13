// Fictional class: SS2 Gold, a 4-question mathematics quiz with explicit rubrics. Students and answers are invented.

export const klass = {name: 'SS2 Gold', subject: 'Mathematics', quiz: 'Week 6 check-in'};

export const questions = [
  {id: 'Q1', text: '1/2 + 1/3 = ?', answer: '5/6', concept: 'fractions'},
  {id: 'Q2', text: 'Solve 3x + 5 = 20', answer: 'x = 5', concept: 'equations'},
  {id: 'Q3', text: 'Expand 2(x + 4)', answer: '2x + 8', concept: 'expansion'},
  {id: 'Q4', text: '(−3) × (−4) = ?', answer: '12', concept: 'integers'},
];

export const concepts = {
  fractions: {label: 'Adding fractions', parent: 'Number'},
  equations: {label: 'Solving linear equations', parent: 'Algebra'},
  expansion: {label: 'Expanding brackets', parent: 'Algebra'},
  integers: {label: 'Multiplying negatives', parent: 'Number'},
};

/** Misconceptions in the rubric, each tied to a concept. */
export const misconceptions = {
  'add-across': {label: 'Adds numerators and denominators', concept: 'fractions', example: '1/2 + 1/3 = 2/5'},
  'unscaled-numerator': {label: 'Finds a common denominator but doesn’t rescale numerators', concept: 'fractions', example: '1/2 + 1/3 = 2/6'},
  'inverse-order': {label: 'Undoes operations in the wrong order', concept: 'equations', example: '3x + 5 = 20 → x + 5 = 20/3'},
  'one-side': {label: 'Applies an operation to one side only', concept: 'equations', example: '3x + 5 = 20 → 3x = 20'},
  'first-term-only': {label: 'Multiplies only the first term in the bracket', concept: 'expansion', example: '2(x + 4) = 2x + 4'},
  'neg-times-neg': {label: 'Thinks a negative times a negative is negative', concept: 'integers', example: '(−3) × (−4) = −12'},
};

export const students = ['Amaka', 'Bolu', 'Chidi', 'Daniel', 'Efe', 'Fatima', 'Gift', 'Halima', 'Ifeanyi', 'Jide', 'Kemi', 'Lami'];

const a = (student, q, given, working, tag = null, confidence = 0) => ({id: `${student}-${q}`, student, q, given, working, tag, confidence, correct: false, status: tag ? 'ai' : 'none'});
const ok = (student, q, given, working) => ({id: `${student}-${q}`, student, q, given, working, tag: null, confidence: 0, correct: true, status: 'none'});

export const answers = [
  a('Amaka', 'Q1', '2/5', '1+1 = 2, 2+3 = 5 → 2/5', 'add-across', 0.93), ok('Amaka', 'Q2', 'x = 5', '3x = 15, x = 5'), a('Amaka', 'Q3', '2x + 4', '2·x + 4', 'first-term-only', 0.88), ok('Amaka', 'Q4', '12', 'neg × neg = pos'),
  a('Bolu', 'Q1', '2/6', 'LCM 6 → 1/6 + 1/6 = 2/6', 'unscaled-numerator', 0.9), ok('Bolu', 'Q2', 'x = 5', '20 − 5 = 15, ÷3'), ok('Bolu', 'Q3', '2x + 8', '2x + 2·4'), a('Bolu', 'Q4', '−12', '3 × 4 = 12, signs negative', 'neg-times-neg', 0.95),
  a('Chidi', 'Q1', '2/5', 'add top, add bottom', 'add-across', 0.96), a('Chidi', 'Q2', 'x = 20/3 − 5', 'x + 5 = 20/3', 'inverse-order', 0.84), a('Chidi', 'Q3', '2x + 4', '2x + 4', 'first-term-only', 0.82), ok('Chidi', 'Q4', '12', ''),
  ok('Daniel', 'Q1', '5/6', '3/6 + 2/6'), ok('Daniel', 'Q2', 'x = 5', '3x = 15'), ok('Daniel', 'Q3', '2x + 8', ''), ok('Daniel', 'Q4', '12', ''),
  a('Efe', 'Q1', '2/6', '1/6 + 1/6', 'unscaled-numerator', 0.87), a('Efe', 'Q2', 'x = 20/3', '3x = 20', 'one-side', 0.79), ok('Efe', 'Q3', '2x + 8', ''), a('Efe', 'Q4', '−12', '−3 × −4 = −12', 'neg-times-neg', 0.97),
  ok('Fatima', 'Q1', '5/6', ''), a('Fatima', 'Q2', 'x = 25/3', '3x = 20 + 5', 'one-side', 0.58), ok('Fatima', 'Q3', '2x + 8', ''), ok('Fatima', 'Q4', '12', ''),
  a('Gift', 'Q1', '2/5', '1/2 + 1/3 = 2/5', 'add-across', 0.9), ok('Gift', 'Q2', 'x = 5', ''), a('Gift', 'Q3', '2x + 4', 'multiply x by 2', 'first-term-only', 0.86), a('Gift', 'Q4', '−12', 'same signs → negative?', 'neg-times-neg', 0.74),
  ok('Halima', 'Q1', '5/6', '3/6 + 2/6 = 5/6'), ok('Halima', 'Q2', 'x = 5', ''), ok('Halima', 'Q3', '2x + 8', ''), ok('Halima', 'Q4', '12', ''),
  a('Ifeanyi', 'Q1', '1/5', 'scribbled — 1/5?', 'add-across', 0.41), a('Ifeanyi', 'Q2', 'x = 20/3 − 5', 'divide first', 'inverse-order', 0.89), ok('Ifeanyi', 'Q3', '2x + 8', ''), ok('Ifeanyi', 'Q4', '12', ''),
  a('Jide', 'Q1', '2/6', 'common bottom 6, 1 + 1', 'unscaled-numerator', 0.85), ok('Jide', 'Q2', 'x = 5', ''), a('Jide', 'Q3', '2x + 4', '', 'first-term-only', 0.62), ok('Jide', 'Q4', '12', ''),
  ok('Kemi', 'Q1', '5/6', ''), ok('Kemi', 'Q2', 'x = 5', ''), ok('Kemi', 'Q3', '2x + 8', ''), a('Kemi', 'Q4', '−12', '− × − = −', 'neg-times-neg', 0.92),
  a('Lami', 'Q1', '2/5', '1+1 over 2+3', 'add-across', 0.94), a('Lami', 'Q2', 'x = 20/3 − 5', '÷3 then −5', 'inverse-order', 0.91), ok('Lami', 'Q3', '2x + 8', ''), ok('Lami', 'Q4', '12', ''),
];

/** Teacher-approved question bank. Practice is only ever drawn from here. */
export const bank = [
  {id: 'P-01', tag: 'add-across', text: 'Shade 1/2 and 1/3 of the same bar. What fraction is shaded altogether?', level: 'Concrete'},
  {id: 'P-02', tag: 'add-across', text: 'Is 1/4 + 1/4 equal to 2/8? Explain using a diagram.', level: 'Reasoning'},
  {id: 'P-03', tag: 'unscaled-numerator', text: 'Write 1/2 and 1/3 as sixths, then add.', level: 'Procedural'},
  {id: 'P-04', tag: 'unscaled-numerator', text: 'Which is larger: 1/2 or 1/6? How many sixths make a half?', level: 'Reasoning'},
  {id: 'P-05', tag: 'inverse-order', text: 'Undo these steps in reverse: “times 3, then add 5, gives 20”.', level: 'Concrete'},
  {id: 'P-06', tag: 'inverse-order', text: 'Solve 4x + 3 = 19, showing each inverse step.', level: 'Procedural'},
  {id: 'P-07', tag: 'one-side', text: 'Use a balance diagram to solve 2x + 6 = 14.', level: 'Concrete'},
  {id: 'P-08', tag: 'first-term-only', text: 'Use an area model to expand 3(x + 2).', level: 'Concrete'},
  {id: 'P-09', tag: 'first-term-only', text: 'Expand 5(2 + y) and check by substituting y = 1.', level: 'Reasoning'},
  {id: 'P-10', tag: 'neg-times-neg', text: 'Continue the pattern: 3 × −4 = −12, 2 × −4 = −8, 1 × −4 = −4, 0 × −4 = 0, −1 × −4 = ?', level: 'Reasoning'},
  {id: 'P-11', tag: 'neg-times-neg', text: 'Work out (−2) × (−5) and (−6) × 3.', level: 'Procedural'},
];

export const roles = [
  {id: 'teacher', label: 'Class Teacher', can: ['view', 'note', 'review', 'approve', 'export']},
  {id: 'hod', label: 'Head of Mathematics', can: ['view', 'note', 'review', 'approve', 'export']},
  {id: 'assistant', label: 'Teaching Assistant', can: ['view', 'note']},
  {id: 'admin', label: 'School Administrator', can: ['view', 'export']},
];
export const people = {teacher: 'Mrs Okonkwo', hod: 'Mr Adeyemi', assistant: 'Miss Bello', admin: 'Mr Nwosu'};
