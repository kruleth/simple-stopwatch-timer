# Reflection and Recommendations — draft

> Drafted only from what is already in the report. Anything that could not be
> sourced from the existing notes is marked **[GAP]** rather than invented.

---

## Reflection and Recommendations

### What I learned from users

The clearest lesson was that I could not have found most of these problems on my own. I built the app, so I already knew History rows opened when tapped, and I already knew the timer only moved in whole minutes. Two of the three participants did not know the first. The second cost Participant 2 the duration they actually wanted. Knowing how something works makes you a poor judge of whether it looks like it works.

Testing this late in the project cost me as well. If I had run even one session while building the timer screen, second-level precision would have been a feature I built rather than a problem I found.

### Where feedback challenged my assumptions

I assumed the ±1 min buttons were enough for durations outside the presets. Participant 2 showed otherwise. They abandoned 4 minutes 30 seconds, set a 5 minute timer, and let 30 seconds run to waste before starting what they were actually timing. They also opened Settings looking for a way to enter an exact duration, which tells me they expected that control somewhere other than where I put it.

I also assumed History rows looked tappable. Two of three participants never tried, and one said *"I didn't realise you can tap on each timer in history."* Nothing on the row marks it as interactive.

### Were user expectations met?

Mostly, yes. The stopwatch kept running while the app was closed and reopened where participants expected it to. Pressing Reset saved the run to History without anyone losing work they wanted to keep. Dark mode was well received by all three.

The design intention came through most clearly in something a participant said without being asked: *"It is nice, its a you see is what you get type of app."* I built the app deliberately without extra features, and simplicity was the first thing users named.

Expectations broke on precision. Participants expected to be able to enter an exact time, and the app offers no way to do it.

### Recommendations

| Priority | Change | Addresses | Effort |
| :-: | --- | --- | --- |
| 1 | Disable −1 min when subtracting would take the duration below the minimum | The 1 second defect | Small |
| 2 | Mark History rows as tappable, with a chevron or a View control | 2 of 3 never found the detail screen | Small |
| 3 | Allow an exact duration to be entered, including seconds | Participant 2 could not set 4:30 | Medium |
| 4 | Investigate whether users expect duration options in Settings | Participant 2 searched Settings for them | Needs further testing |

Items 1 and 2 are small changes against problems that affected real tasks, so they come first. Item 3 is the larger piece of work and the one participants asked for directly.

### Limitations

Three participants is enough to surface obvious problems and not enough to be representative, so these findings are indicative.

I moderated sessions for an app I had built myself, which carries a risk of steering participants without meaning to. Sessions ran 5–10 minutes rather than the 20–45 minutes suggested in the brief.

App state was not cleared between sessions. Participant 3 saw a 25 minute chip under Recent that Participant 2 had created, which may have made that feature easier to notice than it would be for a genuinely new user.

Screenshots were captured during one session only. Participant 3's prior-tool frustrations were not collected at intake, so their persona is incomplete.

---

## Gaps to fill

- **[GAP]** The *"what you see is what you get"* quote is unattributed in the report. Add the participant ID.
- **[GAP]** No quote recorded for the −1 min defect or the Settings search. Add if your notes have them.
- **[GAP]** No quantitative data anywhere in the report. The brief asks for qualitative **and** quantitative feedback. Task completion counts you already have (3/3, 2/3) can be stated as figures; a SUS score would be stronger if you can still reach participants.
- **[CHECK]** I have written that nobody lost work they wanted to keep at the Reset step. Your scenario table records it as a success, but confirm nobody hesitated before pressing it.
