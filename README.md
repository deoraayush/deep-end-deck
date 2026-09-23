# Deep End Digital

DEEP END CLUB — WEB APP

A card game about people.

Build a premium web application for Deep End Club, a conversation card game designed to replace small talk with conversations people actually remember.

The app should feel less like a website and more like opening a physical card deck.

I will attach:

 Logo

 Penguin illustration

 Font reference

 Level 1 card PDF

 Level 2 card PDF

 Level 3 card PDF

 Action card PDF

The PDFs are the design source of truth.

Do not redesign the cards.

Recreate them as accurately as possible.

Match:

 spacing

 typography

 card proportions

 text placement

 penguin placement

 labels

 margins

 visual weight

 white space

The digital version should feel like holding the physical cards.

PRODUCT PHILOSOPHY

Deep End Club is not a party game.

It is not trivia.

It is not therapy.

It is a conversation experience.

The app should create the feeling that:

"Something meaningful is about to happen."

Everything should slow people down.

Nothing should feel rushed.

Nothing should feel gamified.

No points.

No leaderboards.

No achievements.

No streaks.

No notifications.

No social feed.

The conversation is the product.

BRAND

Name

Deep End Club

Tagline

A card game about people.

COLORS

Primary Navy

#1B2070

Action Orange

#E85D1A

White

#FFFFFF

TYPOGRAPHY

I will provide the font reference.

Use the uploaded font asset.

Do not substitute fonts unless absolutely necessary.

If a fallback is needed, use:

 Cooper Black

 Frankfurter

 Genty

 Rounded display fonts

Typography should feel:

 human

 slightly imperfect

 friendly

 warm

 memorable

AUTHENTICATION

Users must sign in before playing.

No guest mode.

No anonymous play.

Use Lovable's built-in Google Authentication.

Requirements:

 Google Sign In

 Session persistence

 User avatar

 Logout

 Protected routes

Users cannot access gameplay without signing in.

Disable Start Game until authenticated.

HOMEPAGE EXPERIENCE

The homepage should feel like opening the game box for the first time.

Large amount of white space.

Minimal interface.

No unnecessary UI.

Top section:

Deep End Club logo

Tagline:

"A card game about people."

Primary button:

START GAME

Secondary button:

HOW IT WORKS

HOMEPAGE CONTENT

Display two sections side-by-side on desktop.

Stack on mobile.

Left:

HOW IT WORKS

Right:

THE RULES

Use the exact copy provided.

Keep formatting clean and highly readable.

GAME SETUP

After authentication:

Show setup screen.

Options:

Game Mode

Perception Only

Perception + Connection

Full Game

Important:

Even in Full Game:

Cards must always progress:

Level 1 → Level 2 → Level 3

Never mix levels together.

The experience should feel like gradually going deeper.

Action Cards

Toggle

ON by default

If enabled:

Shuffle Action Cards naturally throughout gameplay.

Do not group them.

Do not show them back-to-back.

Target frequency:

1 Action Card every 2–5 cards.

CARD EXPERIENCE

The card is the interface.

Everything else should disappear.

Cards should occupy the majority of the screen.

Center aligned.

Subtle shadow.

Rounded corners.

Exact visual styling from PDFs.

No redesigns.

No modern card UI.

No gradients.

No glassmorphism.

No neumorphism.

No flashy effects.

Minimal.

Clean.

Physical.

LEVEL CARD DESIGN

Reference attached PDFs exactly.

LEVEL 1

White card

Navy text

Penguin bottom left

LEVEL 1 PERCEPTION label

LEVEL 2

White card

Navy text

Penguin bottom left

LEVEL 2 CONNECTION label

LEVEL 3

White card

Navy text

Penguin bottom left

LEVEL 3 REFLECTION label

ACTION CARDS

Orange background

White text

ACTION CARD label

Match attached PDFs exactly.

GAMEPLAY EXPERIENCE

Show:

Current Level

Cards Remaining

Progress Bar

Subtle and unobtrusive.

Example:

LEVEL 2 CONNECTION

8 / 20

CARD INTERACTIONS

Tap card → Next card

Swipe left → Next card

Spacebar → Next card

Right Arrow → Next card

Smooth card flip animation between cards.

Animation should feel physical.

Not flashy.

Approx 250–400ms.

NOT YET SYSTEM

Replace traditional skip.

Button text:

NOT YET

Rules:

One Not Yet per level.

When used:

Card returns to bottom of current level deck.

May appear later.

Display:

Not Yet Remaining: 1

After use:

Not Yet Remaining: 0

SILENCE MODE

After each card is revealed:

Show a subtle timer option.

5 second pause.

No forced interaction.

Just a gentle reminder:

"Sit with it."

This reinforces the Deep End Club experience.

LEVEL TRANSITIONS

When a level ends:

Show a full-screen transition.

Examples:

LEVEL 1 COMPLETE

You know a little more now.

Continue →

LEVEL 2 COMPLETE

The good stuff usually lives beneath the surface.

Continue →

LEVEL 3 COMPLETE

Thanks for showing up honestly.

Continue →

END EXPERIENCE

After final card:

Conversation Complete

Show:

Cards Played

Action Cards Drawn

Levels Completed

Time Spent

Then display:

"The goal was never to finish the deck.

The goal was to leave knowing people a little better."

Buttons:

Play Again

Return Home

RESPONSIVE EXPERIENCE

Desktop

Tablet

Mobile

All must feel native.

Cards should scale proportionally.

Never distort card dimensions.

Maintain exact visual hierarchy from PDFs.

ASSETS

I will upload:

 Logo

 Penguin illustration

 Font reference

 Level 1 PDF

 Level 2 PDF

 Level 3 PDF

 Action PDF

Use them directly.

Do not reinterpret.

Do not redesign.

The final product should feel like a digital version of the physical Deep End Club deck.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/2b2236ec-90d3-48ad-985e-e39c30e92291).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
