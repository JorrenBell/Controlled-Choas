# Controlled Chaos — starter prototype

A tiny browser-based prototype for a word-association game about making unusual but defensible connections.

## Run it locally

1. Download or clone this repository.
2. Open `index.html` in a browser.

No build tools, dependencies, API keys, or database are required.

## Publish with GitHub Pages

1. Create a new GitHub repository named `controlled-chaos`.
2. Upload `index.html`, `styles.css`, `app.js`, and this `README.md` to the repository root.
3. In the repository, open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select `main` and `/ (root)`, then save.
6. GitHub will provide the published site URL after deployment.

## What works in v0.1

- Starting prompt and answer input
- A growing chain of unique answers
- A visual chaos meter that rises with each answer
- Reset button
- Responsive layout for phones and desktop

## What is intentionally not built yet

- AI judging or prompt generation
- True rarity scoring based on all players' answers
- Multiplayer
- Accounts or cloud saving
- Validation that two answers are meaningfully connected

The current prototype is a **playable interface experiment**, not a finished scoring system. The next useful step is to test whether the chain mechanic feels fun, then define how a connection is judged before adding AI.

## Suggested next milestones

1. **Playtest:** Have a few people play the same starting prompt and compare their chains.
2. **Connection judging:** Add a simple “valid / questionable / invalid” decision, initially human-reviewed.
3. **Rarity:** Store answer counts per prompt and award more points to less common answers.
4. **AI assist:** Use an API to suggest follow-up constraints and explain possible connections. Keep the API key on a backend, never in browser JavaScript.
5. **Multiplayer:** Add rooms and shared rounds after the solo loop is fun.
