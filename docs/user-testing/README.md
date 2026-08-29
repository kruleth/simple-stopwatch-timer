# User Testing Pack — Lapse

Instruments for the User Testing assessment (25% weighting, 100 marks). Every
file here is a **blank template**. Nothing contains results, and nothing should
be filled in except from real sessions with real participants.

## Files, in order of use

| File | When | Purpose |
| --- | --- | --- |
| [`01-test-plan.md`](01-test-plan.md) | Before recruiting | Objectives, participants, environment, method |
| [`06-consent-form.md`](06-consent-form.md) | Start of each session | Information sheet and consent |
| [`02-task-scenarios.md`](02-task-scenarios.md) | During each session | Scripted tasks — read the "Say this" lines verbatim |
| [`03-observation-log.md`](03-observation-log.md) | During each session | One copy per participant |
| [`04-interview-questions.md`](04-interview-questions.md) | After the tasks | Post-session prompts |
| [`05-sus-survey.md`](05-sus-survey.md) | End of each session | Standard usability questionnaire plus scoring |
| [`07-report-skeleton.md`](07-report-skeleton.md) | After all sessions | Report structure, weighted to the mark scheme |

## Running a session

1. Reset the app first — History empty, settings at defaults. Uninstall and reinstall, or clear history and reset settings from the Settings tab.
2. Consent before anything else.
3. T0 first impressions **before** they touch it. You only get one chance at an untainted first reading.
4. Work through T1–T8 in order. T6 depends on T5 having happened, so do not reorder those.
5. Ask the Single Ease Question straight after each task, while it is fresh.
6. Interview, then survey.
7. Write up your notes the same day.

## The one rule that matters

**Do not help.** No pointing, no naming buttons, no "have you tried…". Silence
is uncomfortable and it is where the findings are. If someone is genuinely
stuck, wait longer than feels polite, then record it as an assist and move on.

Every hint you give converts a finding into nothing.

## Getting the app onto a participant's device

| Route | Works for | Notes |
| --- | --- | --- |
| Your own iPhone, handed over | iOS | Simplest. Requires being in the same room |
| `eas build -p android --profile preview` | Android | Standalone `.apk`, no Expo Go needed — best remote option |
| `npx expo start --tunnel` | Either | Reachable off your network, but the tester needs Expo Go on **SDK 54** |

TestFlight is not viable here — it needs a paid Apple developer account.

A practical mix: two or three sessions in person on your iPhone, the rest
remotely on Android with an APK. That also satisfies the brief's suggestion to
test on both platforms.

## Producing the final document

The report skeleton is Markdown for drafting. The submission will likely want a
Word document — once the content is written, it can be converted with formatting,
headings and captions intact.
