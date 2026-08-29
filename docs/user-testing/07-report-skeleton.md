# User Testing Report — Lapse (Stopwatch & Timer)

**Module:** Mobile Applications [module code]
**Student:** [Your name]
**App:** Lapse — Stopwatch & Timer
**Word count:** [ ] *(target 1,000–1,500)*

> Skeleton only. Every heading below maps to a marking band, and the word budget
> is weighted to match how the marks are distributed. Delete these quoted notes
> before submitting.

**Budget:** §1 ≈100 · §2 ≈280 · §3 ≈200 · §4 ≈400 · §5 ≈330 → ≈1,310 words.
Appendices do not count toward the total.

---

## 1. Overview  *(≈100 words)*

> What the app is, what these sessions set out to learn, and how many people
> took part. Two or three sentences of context, then straight into it. Do not
> spend words re-describing features — the marks here are for the testing, not
> the app.

[ ]

---

## 2. Testing Design & Methodology  *(≈280 words — 20 marks)*

> This band rewards a *defensible plan*. Cover objectives, who you recruited and
> why, the environment, and the task design. Pull the detail from
> `01-test-plan.md` rather than rewriting it.

### 2.1 Objectives

[ ]

### 2.2 Participants

> Include the demographics table. State the recruitment logic explicitly — that
> you varied technology confidence rather than domain expertise, because a
> stopwatch needs no specialist knowledge. Saying *why* you chose people this
> way is what separates 15/20 from 8/20 here.

| # | Age band | Occupation | Tech confidence | Prior stopwatch use | Device |
| --- | --- | --- | --- | --- | --- |
| P1 | [ ] | [ ] | [ ] | [ ] | [ ] |
| P2 | [ ] | [ ] | [ ] | [ ] | [ ] |
| P3 | [ ] | [ ] | [ ] | [ ] | [ ] |
| P4 | [ ] | [ ] | [ ] | [ ] | [ ] |

### 2.3 Test environment

[ ]

### 2.4 Method

> Moderated think-aloud, task scenarios, interview, SUS. Say why you chose
> think-aloud, and mention the no-hints rule — deliberately avoiding steering is
> methodological rigour and worth stating.

[ ]

### 2.5 Task scenarios

> Summarise the tasks and, briefly, why each one exists. The strongest point to
> make: several tasks deliberately target behaviours you suspected were
> unclear — that resetting saves the run, that no preset exists for 7 minutes —
> rather than only happy paths that were always going to succeed.

| # | Scenario | What it tests |
| --- | --- | --- |
| T1 | Time a run with four laps | Core flow, lap discoverability |
| T2 | Identify the fastest lap | Readability of split vs total |
| T3 | Finish and keep the run | Whether "Reset" reads as save or discard |
| T4 | Retrieve a past run | History and stack navigation |
| T5 | Set exactly 7 minutes | Discoverability of ±1 min |
| T6 | Reuse a custom duration | Discoverability of Recent chips |
| T7 | Configure for a dark room | Settings findability |
| T8 | Close and reopen mid-run | Persistence vs expectation |

---

## 3. Execution & Evidence of Testing  *(≈200 words — 20 marks)*

> This band is about *documentation*, so refer explicitly to your appendices.
> Report consistency across sessions, and be honest about anything that varied.

### 3.1 How sessions ran

[ ]

### 3.2 Task completion summary

> The quantitative backbone. Fill from the observation logs.
> S = success · SD = success with difficulty · A = needed an assist · F = failed

| Task | P1 | P2 | P3 | P4 | Success rate | Mean time |
| --- | :-: | :-: | :-: | :-: | :-: | :-: |
| T1 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| T2 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| T3 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| T4 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| T5 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| T6 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| T7 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| T8 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |

### 3.3 SUS results

| P1 | P2 | P3 | P4 | Mean | Range |
| :-: | :-: | :-: | :-: | :-: | :-: |
| [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |

### 3.4 Evidence collected

[ ] *(Reference Appendix A–D: logs, screenshots, transcripts, completed surveys.)*

---

## 4. Analysis & Findings  *(≈400 words — 25 marks, the largest band)*

> The biggest band, so give it the most words. What earns marks here:
>
> - **Patterns across participants**, not a retelling of each session in turn
> - Every finding **backed by a specific quote or observation**
> - **Severity judgement** — which issues actually matter and why
> - Distinguishing *usability* problems from *functional* bugs
> - Findings that **surprised you**, including where nobody struggled with something you expected to be hard
>
> A finding without evidence is an opinion. A quote without a conclusion is a
> transcript. You need both, joined up.

### 4.1 Findings

> One sub-heading per finding. Suggested shape for each:
> **What happened** → **who it affected** → **evidence (quote/metric)** → **why it matters** → **severity**.

#### Finding 1 — [ ]

| | |
| --- | --- |
| **Observed** | [ ] |
| **Affected** | [ ] of 4 participants |
| **Evidence** | "[verbatim quote]" — P[ ] |
| **Impact** | [ ] |
| **Severity** | [High / Medium / Low] |

#### Finding 2 — [ ]

*(repeat)*

### 4.2 What worked

> Do not skip this. A report that only lists problems reads as unbalanced, and
> the brief explicitly asks for strengths as well as weaknesses.

[ ]

### 4.3 Patterns

> Did tech confidence predict anything? Did anyone approach it completely
> differently from the rest? Did SUS scores agree with what you observed — and
> if a participant scored it highly while visibly struggling, say so, because
> that gap is itself a finding.

[ ]

---

## 5. Reflection & Recommendations  *(≈330 words — 20 marks)*

### 5.1 What I learned from users

[ ]

### 5.2 Where feedback challenged my assumptions

> The highest-value part of the whole report. Name a design decision you made
> confidently and were wrong about — assumptions you can point to are far more
> convincing than general statements about the value of testing.

[ ]

### 5.3 Recommendations

> Prioritise them, and be concrete. Each should trace to a finding above, not
> arrive from nowhere.

| Priority | Change | Addresses | Effort |
| --- | --- | --- | --- |
| 1 | [ ] | Finding [ ] | [ ] |
| 2 | [ ] | Finding [ ] | [ ] |
| 3 | [ ] | Finding [ ] | [ ] |

### 5.4 Were user expectations met?

> Answer this directly — it is named in the brief and maps to learning outcome
> MO2. T8 (closing the app mid-run) gives you evidence about expectation
> specifically.

[ ]

### 5.5 Limitations

> Stating these earns marks rather than costing them: small sample, developer
> acting as moderator, mixed devices, single session per participant.

[ ]

---

## Appendices *(not counted in the word total)*

- **Appendix A** — Completed observation logs, P1–P[ ]
- **Appendix B** — Screenshots and session evidence
- **Appendix C** — Completed SUS questionnaires and scoring
- **Appendix D** — Interview notes / transcripts
- **Appendix E** — Blank consent form and task script

---

### Before submitting

- [ ] Word count within 1,000–1,500 (appendices excluded)
- [ ] Every finding carries a quote or a metric
- [ ] No participant is identifiable
- [ ] Every recommendation traces back to a finding
- [ ] Strengths reported alongside weaknesses
- [ ] Screenshots legible and captioned
- [ ] Consent obtained and evidenced for all participants
