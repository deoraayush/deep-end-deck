# Remove Team Session and add the two deck versions

## What will change
- Remove Team Session from the homepage and delete its room, facilitator, participant, beta badge, and AI-reflection screens.
- Keep one signed-in, single-device game flow: choose a deck version, choose its depth, then play normally.
- Name the decks **Original Edition** and **Corporate Edition** so the audience and rules are unambiguous.
- Use the existing three-level Original deck and the uploaded four-level Corporate deck (`Connect`, `Collaborate`, `Challenge`, `Create`).
- Keep Action Cards optional and on by default, mixed every 2–5 question cards without appearing back-to-back.
- Rewrite the home and How It Works content into separate Original Edition and Corporate Edition sections, using the uploaded wording for levels, audiences, card counts, goals, and rules.
- Keep the existing card appearance, Not Yet behavior, silence timer, controls, transitions, and end summary for both decks.

## Technical details
- Generalize the current setup and play state so deck version controls its available levels, labels, copy, questions, and actions.
- Remove now-unused Team Session files and references without changing authentication.
- Add complete, unique sharing metadata to the updated content pages.
- Verify both editions can start and render correctly on desktop and mobile, and confirm no Team Session links remain.
