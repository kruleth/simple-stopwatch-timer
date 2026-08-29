# Test Plan — Lapse (Stopwatch & Timer)

> Fill the bracketed fields before your first session. Everything here is an
> instrument to be completed with real observations — nothing in this folder
> contains results.

---

## 1. Objectives

What these sessions are trying to find out:

1. Whether a first-time user can time a run and record laps without guidance.
2. Whether users understand that **resetting the stopwatch saves the run** rather than discarding it.
3. Whether users can set a duration that has no preset button (e.g. exactly 7 minutes).
4. Whether the **Recent** durations feature is discoverable, and whether users expect it.
5. Whether History and the per-run detail screen are findable when a user wants to look back.
6. Whether the app's persistence behaviour (a run survives the app closing) matches what users expect.
7. Overall satisfaction with clarity, responsiveness and visual design.

## 2. Participants

Target: **[4]** participants (the brief requires 3–5).

Recruitment criteria — vary **technology confidence**, not domain expertise. A
stopwatch needs no specialist knowledge, so the useful variation is between
someone who rarely installs apps and someone fluent with them.

| # | Pseudonym | Age band | Occupation | Tech confidence (low/med/high) | Prior stopwatch app use | Device tested on |
| --- | --- | --- | --- | --- | --- | --- |
| P1 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| P2 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| P3 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| P4 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| P5 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |

Participants are referred to as P1–P5 throughout. No names or identifying
details appear in the report.

## 3. Test environment

| | |
| --- | --- |
| **App version** | Lapse v1.0.0 |
| **Platform** | Expo SDK 54 (React Native 0.81) |
| **iOS delivery** | Expo Go on the researcher's iPhone, handed to the participant |
| **Android delivery** | Standalone `.apk` (EAS build) installed on the participant's own device |
| **Session format** | [In person / Remote via video call] |
| **Session length** | 20–30 minutes |
| **Recording** | [Screen recording / audio / written notes only] — with consent |
| **Location** | [ ] |
| **Date range** | [ ] |

Note any difference in conditions between sessions here, because inconsistent
setup weakens comparison across participants:

- [ ]

## 4. Methodology

**Moderated usability testing with think-aloud**, followed by a short interview
and a standardised survey.

**Session structure**

| Stage | Time | What happens |
| --- | --- | --- |
| Briefing & consent | 3 min | Explain purpose, confirm consent, stress that the *app* is being tested, not them |
| First impressions | 2 min | Hand over the app unopened. "What do you think this does?" Then 60 seconds to look around |
| Task scenarios | 12–15 min | The 9 tasks in `02-task-scenarios.md`, in order |
| Interview | 5 min | Prompts from `04-interview-questions.md` |
| SUS survey | 3 min | `05-sus-survey.md` |

**Think-aloud.** Ask participants to narrate what they are doing and expecting.
Where they go quiet, prompt once with "what are you thinking?" — never with a
hint.

**Moderator discipline.** Do not name buttons, point, or rescue. If a
participant is stuck, wait. Only after a genuine impasse, record it as an
*assist* and move on. Every hint given is a finding destroyed.

**Measures collected**

*Quantitative* — task outcome (success / success with difficulty / failure),
time on task, error count, assists required, SUS score (0–100).

*Qualitative* — think-aloud commentary, verbatim quotes, points of hesitation,
interview responses.

## 5. Risks and limitations

Note these honestly in the report; acknowledging them earns marks rather than
losing them.

- Small sample (3–5) — findings are indicative, not statistically significant.
- Moderator is also the developer, which risks unconscious steering. Mitigated by scripted task wording and a no-hints rule.
- [Mixed devices / mixed session formats, if applicable]
- [ ]
