# NaviFin — India–Finland Talent & Relocation Companion

Front-end for an AI relocation companion, with a real Supabase backend for auth and document storage.

## Files
- `index.html` — page structure and content
- `styles.css` — all styling
- `app.js` — all interactivity (auth, questionnaire, roadmap, documents, chat)
- `config.js` — your Supabase Project URL and anon key. The only file you should need to edit for setup; never touched by app.js changes.

All four must stay in the same folder — `index.html` links to the other three by filename.

There's also a `navifin-single-file.html` — the whole app bundled into one self-contained file (config included inline), for quick sharing/demoing. Not meant for active development; edit the split files above and re-bundle if needed.

## Run
Open `index.html` in a browser. No build step required.

## Backend setup (one-time)
1. Create a project at supabase.com.
2. Run `supabase_schema.sql` in the Supabase SQL Editor — creates `profiles`, `documents`, the private `documents` storage bucket, and row-level security so each user only ever sees their own data.
3. In `config.js`, replace the two placeholders with your real Project URL and anon key (Project Settings → API).
4. For faster testing, Authentication → Providers → Email → toggle off "Confirm email" (turn back on before real users touch this).

If `config.js` is misconfigured or the Supabase SDK fails to load, the app degrades gracefully — the marketing site still works, and sign-in shows a clear error instead of a silent crash. Check the browser console for a specific message (SDK failed to load vs. config still has placeholders) if something's not working.

## Sign-in
Real accounts via Supabase Auth (email + password), not demo logins. Anyone can sign up from the site.

## Included
- **Public marketing site** (hero, journeys, five-phase overview, sources, CTA), fully separate from the logged-in app screen — nothing app-related is visible before sign-in
- **Real auth**: sign-up + sign-in via Supabase, with a blurred/skeleton dashboard reveal and a "Creating your personalised roadmap…" transition while the questionnaire is answered
- **Persona selection** (Student / Researcher / Professional), all three now going through the same intake questionnaire:
  1. Full name
  2. Nationality (dropdown)
  3. City in Finland (dropdown: Espoo, Helsinki, Vantaa, Tampere, Oulu, Turku, Jyväskylä, Other)
  4. Student/Professional only: relocating alone / with spouse / with spouse and kids (with ages) — Researcher stops after city
  - Back navigation at every step, preserving previously entered answers; going back from the first question exits to the persona picker
  - "Edit details" re-opens the questionnaire post-signup to change answers; resets task-completion progress
- **Personalised roadmap**: persistent header (name, route, phase icons) + a master-detail layout — a left sidebar listing every stage (grouped pre-arrival/after-arrival for Professional; a flat task list for Student/Researcher), with a spacious detail panel on the right
  - Selected stages show a checklist, and — for stages we've filled in (currently Immigration, Local registration/DVV, Tax card, Social security/Kela) — an **Official Source** block (real government link) and a **Verification Required** notice
  - Full name and chosen city are wired into the actual roadmap text, not just captured and ignored
- **Documents tab**: real upload to Supabase Storage, per-user private bucket, with **View** (signed URL) and **Replace** once something's uploaded
- **Chat**: collapsed to a floating bottom-right bubble, opens a panel on click; currently a scripted demo, with a Supabase Edge Function (`chat-assistant-index.ts`) ready to wire in real Claude API calls
- **Visual identity**: Espoo-inspired cobalt/navy palette, compass-needle logo, no gradients

## Known gaps / what's mocked
- Chat is scripted, not yet calling the real Claude API (Edge Function code exists but isn't wired into `app.js` yet)
- Only 4 of 11 Professional stages have real Official Source data — the rest need doc name, authority, and a real government URL
- Nationality is captured but not yet used anywhere in the roadmap content
- No RAG/citations — chat and source links are curated, not retrieved

## Production roadmap
1. Wire the chat UI to the real Claude API Edge Function
2. Fill in Official Source data for the remaining stages
3. Retrieval-augmented generation with citations and freshness checks
4. Housing, tax, healthcare, banking modules beyond what's covered
5. English/Finnish/Hindi support
6. Human escalation for high-stakes immigration/legal questions
7. Employer/B2B provisioning (currently open self-sign-up for anyone)
