// LessonSpindle — site facts used by the pages, the prerender step and the tests.
// A proposed product: pricing is illustrative; the domain, email and LinkedIn page are placeholders to confirm.
const site = {
  name: 'LessonSpindle',
  slug: 'lessonspindle',
  tagline: 'Show teachers where understanding breaks down.',
  about: 'LessonSpindle helps schools and tutorial centres find the misconceptions behind wrong answers. AI reads written working and question-level results, then suggests revision groups and practice from approved materials — for teachers to review.',
  url: 'https://lessonspindle.site',
  email: 'adesua@lessonspindle.site',
  team: [
    {name: 'Adesua Osagie', role: 'Founder/CEO', initials: 'AO', bio: 'Adesua taught secondary mathematics and spent too many evenings working out why half a class got the same question wrong in different ways. She founded LessonSpindle and leads product and school partnerships.'},
    {name: 'Ibrahim Danjuma', role: 'Co-founder', initials: 'ID', bio: 'Ibrahim leads the platform: reading scanned working, classifying likely reasoning errors against explicit rubrics, and making every interpretation easy for a teacher to check.'},
  ],
  stats: [
    {value: '31%', label: 'Share of 15-year-olds below baseline proficiency in mathematics, on average across OECD countries.', source: 'OECD, PISA 2022 Results', url: 'https://www.oecd.org/en/publications/pisa-2022-results-volume-i_53f23881-en/full-report/what-can-students-do-in-mathematics-reading-and-science_6b45422e.html'},
    {value: '35', label: 'Education systems where more than half of students scored below baseline proficiency in mathematics.', source: 'OECD, PISA 2022 Results', url: 'https://www.oecd.org/en/publications/pisa-2022-results-volume-i_53f23881-en/full-report/what-can-students-do-in-mathematics-reading-and-science_6b45422e.html'},
    {value: '~0.7', label: 'Effect size often cited for feedback in Hattie’s research — though independent reviews of formative assessment in maths find smaller effects.', source: 'Kentucky Department of Education, evidence-based practice brief', url: 'https://education.ky.gov/curriculum/standards/kyacadstand/Documents/EBIP_6_Feedback.pdf'},
  ],
  app: {
    title: 'Marking room',
    subtitle: 'Review AI interpretations of a fictional SS2 mathematics quiz, see the misconception map, and approve revision groups and practice.',
  },
};
export default site;
