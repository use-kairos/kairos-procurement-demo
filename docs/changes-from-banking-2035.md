# Changes from Banking 2035 (baseline `e7908a0`)

The baseline commit ports the original demo unchanged. Everything below is a separate commit on top of it.

| Area | Change | Files |
| --- | --- | --- |
| Intro | Plays itself: 1 s after load the camera moves into the screen and enters the workspace. Title "Kairos · the transaction layer for AI agents"; the hint reads "Intent → Plan → Approval → Action → Proof". Skip stays. Device label "Signing key". | `intro/IntroScene.tsx`, `intro/SigningDevice.tsx` |
| Workspace | Pip's thread replays once on arrival. | `workspace/Workspace.tsx`, `workspace/AgentThread.tsx` |
| Brand | Certainty Bank as the trust layer → **Kairos** (plugin, passport issuer, signing-key screen, audit signer, "Kairos view", `hikairos.app`). Kairos mark on plugin tiles and cards; ink is Kairos navy, gold for the guide's active step. Certainty Bank stays only as a counterparty bank (Leo, Ivy). | 17 files, `brand/` |
| Agent to agent | Every handshake shows Kairos' three checks (who is acting / under what authority / backed by real money), from the Banking 2035 proposal mail. agent-7731 fails all three. | `workspace/HandshakeCard.tsx`, `agents*.ts`, `handshake.css` |
| Kit 02 | Pip's plan adds a cash-reserve check. Payment becomes an intent-bound single-use card. After the checks, the card shows three simulated authorizations (accepted / over limit / wrong merchant), labelled "Simulated · Airwallex Issuing planned". The 6th check is "Payment rail" instead of FAST. | `workspace/BankCard.tsx`, `checks.ts`, `agents-ops.ts`, `cards.css` |
| Guide | Five-step first-visit guide pointing at existing UI; Guide button to reopen. | `tour/` |
| Honesty | Kairos view footer: checks, signatures (ML-DSA-65 planned) and payments are simulated. The README has an implemented / simulated / planned table. | `BankView.tsx`, `README.md` |

Unchanged: 3D scene and assets, layout, all six agents and both companies, passport settings, signing-key overlay, plugin page, Lim Ventures onboarding chat.
