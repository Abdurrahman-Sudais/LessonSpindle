# LessonSpindle

**Show teachers where understanding breaks down.**

LessonSpindle helps secondary schools, tutorial centres, exam preparation providers and education networks find the misconceptions behind wrong answers. AI reads students' written working and question-level results and maps likely reasoning errors against explicit rubrics. It then suggests revision groups and practice drawn from approved materials. Teachers review every interpretation and approve all feedback before it is shared.

> LessonSpindle is a proposed product. Pricing is illustrative and the prototype uses a fictional class. Founded by **Adesua Osagie** with co-founder **Ibrahim Danjuma**. The domain `lessonspindle.com` and the email `adesua@lessonspindle.com` are placeholders; confirm them before launch. Organisation types named on the site are prospective customers with no implied affiliation.

## Design

Squared maths paper, ballpoint blue, the teacher's red pen and a chalkboard green. Type is Lexend for the interface, Kalam for handwriting and margin notes, and Sometype Mono for labels.

- **Hero**: a student's answer script on squared paper. A red pen circles the wrong answer and writes the likely reasoning in the margin.
- **The problem**: three students who all scored 2/4 for three different reasons.
- **Class map**: a chalkboard misconception map with students as dots, low-confidence readings outlined, all computed from the prototype's data.
- **How it works**: five steps joined by a red thread.
- **Groups**: revision groups on index cards with practice from the approved bank.
- **Ground rules**: written in chalk.
- **Other sections**: initial maths scope, sourced statistics (OECD PISA 2022 and a feedback-research brief, with its caveat), pricing, a proposed AWS architecture (Textract, Bedrock, S3, DynamoDB, Lambda), team and FAQ.

## Marking room (`/app`)

The marking room uses a fictional SS2 class of 12 students and a four-question quiz.

- **Reviewing**: each wrong answer shows the student's working, the AI's suggested misconception and its confidence. Low-confidence readings are listed first. Teachers confirm, change (to another misconception from the rubric) or reject with a reason.
- **Misconception map**: separates teacher-reviewed answers from pending AI suggestions.
- **Revision groups**: form only from reviewed misconceptions shared by two or more students.
- **Approval**: a teacher approves a group's feedback only after every related suggestion has been reviewed, choosing at least one question from the approved bank and writing the note students will see.
- **Roles**: Class Teacher, Head of Mathematics, Teaching Assistant (view and notes) and School Administrator (view and export).

Every action is written to an exportable log. Changes persist in `localStorage`. Motion is skipped when the visitor prefers reduced motion, and every page is server-rendered so it reads without JavaScript.

## Develop

```bash
npm install
npm run dev
```

```bash
npm run build   # Vite build, server render, static prerender of /, /app, /privacy, /terms and 404.html
npm test        # rules and content tests (node --test)
```

The output in `dist/` is fully static. `public/_headers` and `public/_redirects` cover Netlify/Cloudflare Pages, and `vercel.json` covers Vercel. Until a form service is connected, the pilot form keeps requests in the browser and opens a pre-filled email. To send submissions to HubSpot instead, set `VITE_HUBSPOT_PORTAL_ID` and `VITE_HUBSPOT_FORM_GUID` at build time, and update the privacy notice first.
