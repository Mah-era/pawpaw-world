# PawPaw World — Complete Project Report

**A non-combat, open-world cyberpunk cat exploration game**
Built in vanilla JavaScript · Canvas 2D · WebAudio · localStorage · zero dependencies.

| | |
|---|---|
| **Title** | PawPaw World — *A Cyberpunk Cat Odyssey* |
| **Genre** | 2D open-world exploration / relaxing parkour platformer |
| **Platform** | Any modern web browser (desktop) |
| **Tech** | Vanilla JavaScript (ES6), HTML5 Canvas 2D, Web Audio API, localStorage |
| **Dependencies** | None (no framework, no build step, no bundler, no network at runtime) |
| **Live demo** | https://mah-era.github.io/pawpaw-world/ |
| **Project report (web)** | https://mah-era.github.io/pawpaw-world/report/ |
| **Repository** | https://github.com/Mah-era/pawpaw-world |
| **Codebase size** | ~5,450 lines across 11 JS modules + HTML + CSS |
| **World size** | 12,800 × 3,700 px deterministic city (single seed) |

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Design Philosophy & Identity](#2-design-philosophy--identity)
3. [Functional Specification](#3-functional-specification)
   - 3.1 [Core Gameplay Loop](#31-core-gameplay-loop)
   - 3.2 [The World — Three Layers, Seven Districts](#32-the-world--three-layers-seven-districts)
   - 3.3 [Movement & Traversal](#33-movement--traversal)
   - 3.4 [Collectibles](#34-collectibles)
   - 3.5 [Missions & Tasks](#35-missions--tasks)
   - 3.6 [City Curiosities](#36-city-curiosities)
   - 3.7 [NPCs & City Life](#37-npcs--city-life)
   - 3.8 [Situations & Events](#38-situations--events)
   - 3.9 [Progression & Tracking](#39-progression--tracking)
   - 3.10 [Economy, Shop & Skill Tree](#310-economy-shop--skill-tree)
   - 3.11 [Meta / Engagement Systems](#311-meta--engagement-systems)
   - 3.12 [Paw Shrine & Kittens](#312-paw-shrine--kittens)
   - 3.13 [Story, Lore & Mystery](#313-story-lore--mystery)
   - 3.14 [Audio](#314-audio)
   - 3.15 [User Interface](#315-user-interface)
   - 3.16 [Controls](#316-controls)
4. [Technical Specification](#4-technical-specification)
   - 4.1 [Architecture Overview](#41-architecture-overview)
   - 4.2 [Module Breakdown](#42-module-breakdown)
   - 4.3 [The Global Namespace & State Model](#43-the-global-namespace--state-model)
   - 4.4 [Boot Sequence & Game Loop](#44-boot-sequence--game-loop)
   - 4.5 [Deterministic World Generation](#45-deterministic-world-generation)
   - 4.6 [Physics & Collision](#46-physics--collision)
   - 4.7 [Rendering Pipeline](#47-rendering-pipeline)
   - 4.8 [Procedural Audio Engine](#48-procedural-audio-engine)
   - 4.9 [Save System](#49-save-system)
   - 4.10 [Performance Techniques](#410-performance-techniques)
   - 4.11 [Tooling & The Report Pipeline](#411-tooling--the-report-pipeline)
   - 4.12 [Deployment](#412-deployment)
5. [Key Constants Reference](#5-key-constants-reference)
6. [File & Directory Structure](#6-file--directory-structure)
7. [Quality, Testing & Verification](#7-quality-testing--verification)
8. [Known Limitations & Future Work](#8-known-limitations--future-work)
9. [Changelog Highlights](#9-changelog-highlights)

---

## 1. Executive Summary

PawPaw World is a finished, self-contained browser game in which the player controls **PawPaw**, a cyber-enhanced calico cat, exploring a dense neon megacity. The design deliberately rejects the usual action-game framing: there is **no combat, no game-over, and no levels gating the world**. Every system is built to reward curiosity — collecting, climbing, hacking, racing, rescuing lost kittens, photographing landmarks, and slowly piecing together the mystery of *Line 9*, the ghost train, and a scattered city AI.

The entire experience runs from static files with **no dependencies and no build step**. The deterministic city of 12,800 × 3,700 px is generated from a single random seed, so every player explores the identical world; all building facades are pre-rendered to offscreen canvases for performance, and the entire soundtrack and sound-effects set is synthesized at runtime with the Web Audio API. Progress persists to `localStorage`, so the city "remembers you" between sessions.

The project ships with an extensive, self-contained HTML project report (`report/`) that embeds live in-game screenshots and gameplay video, and a suite of small Python tools used to capture that media directly from the running canvas.

---

## 2. Design Philosophy & Identity

PawPaw World is built around five pillars:

1. **Exploration over combat.** The city *is* the content. There are no enemies; everything you find rewards curiosity rather than aggression.
2. **Soft failure only.** Nothing ends the game. A missed race timer simply pays a smaller medal; an expired courier job only resets a streak. The player is always encouraged to continue.
3. **Always something to do.** The systems are layered so the game supports 5-minute, 20-minute, and completion-length sessions equally well.
4. **Atmosphere first.** A full procedural day/night cycle, five blending weather states, random city events, and adaptive procedural music carry the mood as much as the mechanics.
5. **Self-contained & honest.** No heavy dependencies, no network requirement, no paid systems, no gambling or real-money loot. Mystery rewards are earned only through play.

The emotional centre is warm: a lone cat on a rainy rooftop, lost kittens to carry home, quiet "ghosts" of the old city left in data fragments, and a Paw Shrine to rebuild.

---

## 3. Functional Specification

### 3.1 Core Gameplay Loop

1. **Explore** the city with relaxed parkour movement across three connected layers.
2. **Collect** holo-kibble, data chips, lost memories, artifacts, legendaries, and special keys.
3. **Complete** activities: courier jobs, parkour races, hacking terminals, NPC quests & errands, photo challenges, kitten rescues, data-wisp chases, and 24 interactive curiosities.
4. **Earn** credits, XP, upgrade points, cosmetics, badges, mystery rewards, lore, and shrine pieces.
5. **Spend** at vendors and in the skill tree; rebuild the Paw Shrine; customise PawPaw.
6. **Reach** more secrets with better movement, hints, and economy bonuses.
7. **Chase** 100% District Completion.

### 3.2 The World — Three Layers, Seven Districts

The city is **one continuous, fully-walkable world** stacked in three traversable layers and divided into seven named districts.

**Three layers**

- **Road / Street** — Buildings open onto a ground-floor **storefront arcade** (a 170-px walkable corridor beneath each tower), so the entire street reads as one continuous promenade past shops, stalls, vendors and pedestrians. A climbable drainpipe on **every** building links the road up to the rooftops.
- **Rooftops** — The parkour layer: ziplines, balance wires, fire escapes, water towers, antennas, a rooftop garden, the Apex Spire, the Skybridge, and the Heartbeat Mast.
- **Underground** — Tunnels reached through street hatches/ladders: the Drowned Arcade, the Line 9 Platform, the Hacker Den, glow mushrooms, the Rat Court, drip pools, and a tunnel mural.

**Seven districts** (each with its own colour identity and music mood)

| District | Identity |
|---|---|
| Back Alley Network | Cramped neon alleys, fire escapes, graffiti clues |
| Neon Market | Busy storefront strip, stalls, vendors, signs |
| Transit Plaza | Open glass station hall, Line 9 |
| Corporate Sector | Tall glass towers, window-washer platforms |
| Old Signal Docks | Antenna farm, the Heartbeat Mast |
| Rooftop Layer | The traversal/parkour highway |
| Underground | Tunnels and secret pockets |

The world also contains landmarks, teleport (transit) nodes, sealed doors, hackable terminals, neon signs, holographic ads, a mega-billboard, a gravity lift, and special traversal geometry.

### 3.3 Movement & Traversal

PawPaw's movement is a tight 2D platformer toolkit with generous feel (coyote time, jump buffering, variable jump height):

- **Walk / Run / Sprint** (190 / 330 / 480 px·s⁻¹)
- **Jump** and **Double Jump** (double jump available from the start)
- **Wall-slide**, **Wall-jump**, and **Wall-run** (wall-run unlocked at 45 kibble)
- **Dash** (teleport-style, unlocked at 10 kibble)
- **Glide** (hold jump while falling, via a shop upgrade)
- **Slide** (sprint + down) and **drop-through** one-way platforms
- **Ledge-grab / hang / climb-up**
- **Ladders, drainpipes, and pipes** (climb speed 300 px·s⁻¹)
- **Ziplines** (auto-ride downhill, jump to detach) and **balance wires**
- **Scratch** (press **C**) — an expressive idle action with its own animation and sound

Chaining moves feeds the **Flow combo** system, which pays out in credits and, at a high enough chain, triggers **Fever** (double rewards).

### 3.4 Collectibles

**177 tracked collectibles** across six categories:

| Type | Count | Role |
|---|---|---|
| Holo-kibble | 140 | Currency-of-curiosity; unlocks core abilities |
| Data chips | 18 | Lore fragments |
| Lost memories | 10 | Emotional lore fragments |
| Rare artifacts | 5 | Deeper lore |
| Legendaries | 2 | Apex Spire & Heartbeat Mast summits |
| Special keys | 2 | Unlock sealed rooms |

Holo-kibble gate the three movement-ability unlocks (dash @ 10, wall-run @ 45; double jump is granted immediately). Completing a full collectible set grants a bonus mystery reward.

### 3.5 Missions & Tasks

Nothing is mandatory, but there is always a thread to pull:

- **Courier board jobs** — endless, repeatable deliveries from boards across the city, with random routes, distance labels, a streak multiplier, perfect-delivery bonuses, rush-hour double pay, and optional streak protection.
- **Parkour races** (3) — *Market Rooftop Run*, *Alley Scramble*, *Corporate Drop*. Each has bronze/silver/gold medal targets, a live timer, saved best times, and a **transparent ghost replay** of your best run.
- **Hacking terminals** (4) — a signal-trace breach mini-game that unseals doors, restores the mega-billboard, and activates the grav-lift.
- **Story quests** (3 chains) — *Ghost in the Grid*, *Green Thumbs*, *The Last Driver* — covering the scattered AI, the rooftop garden, Line 9, and the ghost train.
- **NPC help errands** (6) — small favours for named characters who remember your help.
- **Photo challenges** (9) — landmark and condition-based photo targets (incl. the ghost train, a rescued-kitten shrine moment, a rooftop jump, and the rainy Neon Market).
- **Kitten rescues** (8) and **data-wisp** chases.

### 3.6 City Curiosities

**24 interactive "curiosity" spots** are seeded across all three layers — e.g. the fish stall, scratch post, neon koi pond, busker tip jar, holo-mouse, rain puddle (street); rooftop pigeons, sunlamp lounge, observatory, satellite dish, mast windsock (rooftops); glow mushrooms, the Rat Court, drip pool, tunnel mural, broken jukebox, stray nest (underground). Each gives kibble, credits, or XP, plays a flavour line and sound, then cools down (≈45 s) so it can be revisited.

### 3.7 NPCs & City Life

The city breathes: **35+ live NPCs**.

- **Pedestrians** wander on day/night schedules, raise umbrellas in the rain, show chatter bubbles, and crowd around street performers.
- **Fixed characters** run stalls, the vendor shop, and courier boards, and hand out quests (Vega, Patch, Solder, Ms. Vance, Greasy Jin, the Static Quartet busker, etc.). Talking to one opens a dialog with the character's speech.
- **Traffic** — hover-cars in two lanes and transit buses.
- **Drones** — cargo and police types, with night searchlights and malfunction events.

### 3.8 Situations & Events

A full **day/night cycle** interpolates a ten-stop sky gradient over a 360-second day. **Five weather states** blend smoothly: clear, light rain, heavy rain, fog, and storm — accumulating wet-surface sheen, wind-slanted rain, fog banks, and lightning flashes synced to thunder in the audio engine.

On top of the weather, **nine random city events** break the routine:

| Event | Effect |
|---|---|
| Power outage | A district's grid (windows, signs) goes dark |
| Kibble-rain bonus | Food falls from the sky for ~45 s |
| Wisp swarm | Several data-wisps scatter loose at once |
| Line 9 ghost train | A driverless train glides through the dead tunnel |
| Hologram glitch | The neon ad-grid stutters and tears |
| Cargo-drone malfunction | A delivery drone sparks and tumbles from its lane |
| Street performance | A busker plays; pedestrians gather into a crowd |
| Security sweep | A corporate searchlight rakes the towers at night |
| (Rush hour) | Courier jobs temporarily pay double |

### 3.9 Progression & Tracking

Progress is measured at every grain and surfaced in a live HUD and a 10-tab journal:

- **Paw Level (XP)** with eight titles from *Street Kitten* to *City Legend*; level-ups grant credits, an upgrade point, and a celebratory effect.
- **Rotating challenges** — three always-active goals that escalate in tier as you clear them.
- **Discovery %** — a weighted meter across landmarks, teleports, lore, and photos.
- **District Completion %** — folds together collectibles, secrets, kittens, shrine, mysteries, upgrades, cosmetics, mini-games, achievements, photos, courier records, race medals, and hidden rewards.
- **25 achievements** with animated toasts.
- A full **Stats** page (distance, jumps, wall-jumps, dashes, ziplines, best combo, jobs, streaks, medals, lifetime credits, photos, etc.).

The **journal** (press **J**) has 10 tabs: Quests, Completion, Achievements, Collection, Skill Tree, Cosmetics, Shrine, Race Records, Photo Challenges, Stats.

### 3.10 Economy, Shop & Skill Tree

**Credits** are earned from almost everything — collectibles, flow combos, races, courier jobs, wisps, golden kibble, supply capsules, secrets, NPC help, shrine blessings, set bonuses, and city events. They are spent at street **vendors** and on **shrine rebuilding**.

The **vendor shop** sells movement upgrades (turbo, coil, phase, glide, magnet, sniffer), a consumable speed snack, economy upgrades, cosmetics (neon trail + colours, collar colours, pawsteps, sparkle, afterimage, skins), photo filters, and shrine decorations.

The **skill tree** has four branches — **Movement, Exploration, Economy, Style** — funded by upgrade points from levelling.

### 3.11 Meta / Engagement Systems

A dedicated meta layer keeps long sessions rewarding:

- **Fever** — while a high Flow combo lives, all credit and XP gains are **doubled** (implemented by wrapping the earn function once), with a pulsing magenta screen glow.
- **Rotating challenges** with escalating tiers.
- **City bonus events** — Rush Hour, Kibble Rain, Wisp Swarm.
- **Supply drones** — fly across the screen; pounce one for a **mystery capsule** with a weighted loot table (small credits → snack buff → XP cache → rare jackpot).
- **Welcome-back bonus** on returning to a save.

### 3.12 Paw Shrine & Kittens

Eight named **lost kittens** (Miso, Null, Pebble, Saffron, Mica, Byte, Taro, Lantern), each with a personality and rescue location, are carried one at a time to the **Paw Shrine**. The shrine is a multi-level rebuild project funded by shrine pieces, credits, rescued kittens, rare collectibles, and story progress; upgrades unlock cosmetics, passive exploration help, lore, and visual growth, and rescued kittens appear at the shrine.

### 3.13 Story, Lore & Mystery

Lore is delivered through short collectible fragments rather than long dialogue. The mystery threads are: what happened to **Line 9**, why the **ghost train** appears, what the **scattered city AI** really is, why **PawPaw** can interface with city systems, and what the **Paw Shrine** connects to. Sources include data chips, lost memories, artifacts, legendaries, secret rooms, NPC quests, and shrine progress.

### 3.14 Audio

All audio is synthesized live with the Web Audio API — there are no audio files. It includes:

- **Adaptive zone music** — two detuned saw oscillators + a triangle through a moving low-pass filter, a drifting pad chord, zone-specific arpeggio plucks on musical scales, a rhythmic bass/kick/hi-hat beat clock, and a delay/echo bus. Fever opens the filter and doubles the note rate.
- **Ambience** — rain and wind noise buffers, a city hum, and underground reverberation.
- **Cat foley** — speed-scaled paw-tap footsteps, metallic ladder-rung ticks while climbing, a warm wobbling purr while resting, and a raspy claw scratch.
- **SFX** — jumps, dashes, lands, coins, chimes, mews, zaps, thunder, and a level-up fanfare.

### 3.15 User Interface

A compact cyberpunk HUD (holographic panels with neon glow): zone, time & weather, discovery bar, Paw Level + title, collectible counters, rotating challenges, ability icons, a flow-combo meter, a buff timer, a bonus-event banner, a live minimap, bottom-screen reward popups, achievement toasts, a guide companion, and an interact prompt. Modals cover the journal, vendor shop, transit/fast-travel menu, hacking mini-game, dialog/lore reader, and photo-mode overlay. The title screen is a cinematic, letterboxed menu rendering the live city behind a lone cat on a rainy rooftop.

### 3.16 Controls

| Key | Action |
|---|---|
| ← → / A D | Move |
| ↑ | Jump / double jump |
| W | Climb ladders & drainpipes |
| Space | Sprint |
| S | Slide / drop through |
| X | Dash (once unlocked) |
| E | Interact |
| C | Scratch |
| M | City map |
| J | Journal |
| P / Enter | Photo mode / capture |
| Esc | Close menus |

---

## 4. Technical Specification

### 4.1 Architecture Overview

PawPaw World is a **static, dependency-free single-page application**. It is plain ES6 split across eleven JavaScript modules that share a single global namespace object, `G`. There is no module system, no transpilation, and no build tooling — the eleven scripts are loaded in dependency order by `index.html` and communicate exclusively through `G`. Everything renders to one `<canvas>` (plus a small minimap canvas), and the UI/menus are HTML/CSS overlays on top.

```
index.html  ──loads──▶  config → world → player → citizens → systems →
                        activities → progression → meta → render → ui → main
```

### 4.2 Module Breakdown

| Module | Lines | Responsibility |
|---|---:|---|
| `js/config.js` | 350 | Shared state object, world constants, ability unlock thresholds, completion totals, zone definitions, lore text, shop catalog, skill data, quests, kittens, courier-board locations, seeded RNG factory. |
| `js/world.js` | 275 | Deterministic city generation — buildings, open ground-floor corridors, drainpipes, ladders, ziplines, balance wires, fire escapes, doors, props, signs, holograms, teleport nodes, landmarks. |
| `js/player.js` | 569 | PawPaw movement state machine, axis-separated collision, all abilities, footstep/purr/scratch audio hooks, and the layered cat rendering (calico body, cyber-eye, backpack, collar, cosmetics, animation states). |
| `js/citizens.js` | 252 | Pedestrians, vendors, quest characters, performers, vehicles, drones; schedules, chatter, rain behaviour, crowd gathering. |
| `js/systems.js` | 313 | Day/night cycle, weather state machine, random city events, and the entire procedural Web Audio engine. |
| `js/activities.js` | 496 | Collectible placement, the 24 curiosities, hacking terminals, deliveries, races (+ ghost replay), photo targets, interaction dispatch, set rewards, and save/load. |
| `js/progression.js` | 720 | Economy & credit earning, achievements, the flow-combo system, courier board, quests, NPC errands, kittens, data wisps, golden kibble, secret rooms, the Paw Shrine, skill purchases, and completion %. |
| `js/meta.js` | 265 | XP/levels & titles, Fever, rotating challenges, city bonus events (rush hour, kibble rain, wisp swarm), supply drones, mystery capsules, welcome-back bonus. |
| `js/render.js` | 949 | The full Canvas 2D renderer — sky gradient, parallax skylines, underground, street & wet sheen, pre-rendered building facades, open ground-floor arcades, infrastructure, props, signs, holograms, collectibles, ghost replay, weather, events, vignette, and the fever overlay. |
| `js/ui.js` | 547 | HUD refresh, the 10-tab journal, vendor shop, teleport menu, hacking mini-game UI, photo targets, notifications, guide companion, and the minimap. |
| `js/main.js` | 129 | Keyboard input mapping, boot sequence, the cinematic title screen (Resume / New Game), the welcome-back bonus, and the requestAnimationFrame game loop. |

Supporting front-end files: `index.html` (195 lines — canvas, HUD, modals, title screen, script ordering) and `style.css` (389 lines — the cyberpunk interface theme).

### 4.3 The Global Namespace & State Model

A single object `G` holds everything: configuration (`G.CFG`), the generated world (`G.world`), the player (`G.player`), camera (`G.cam`), input (`G.keys`), runtime subsystems (`G.audio`, `G.flow`, `G.ach`, `G.board`, `G.challenges`, `G.bonus`, …), and crucially the **persistent save state** `G.state`.

`G.state` is the single source of truth for everything that persists: counts (food/chip/mem/art/leg/key/credits/…), abilities, upgrades, cosmetics/style, stats, achievements, quests, kittens, shrine, skills, XP/level, rotating-challenge tier, and completion %. A `G.resetState()` helper restores a fresh-game state for "New Game".

### 4.4 Boot Sequence & Game Loop

On `DOMContentLoaded`, `main.js` runs: `buildWorld → initPlayer → initCitizens → initSystems → initActivities → initRender → ui.init → loadGame`, then frames a **cinematic title backdrop** (a lone, sitting cat on a rainy market rooftop with the real city rendering behind a letterboxed menu) and waits for **Resume** or **New Game**.

The main loop is a single `requestAnimationFrame` with a `dt` clamp (≤ 0.05 s) to absorb tab-switch spikes:

```
if (started):  updateSystems → updateCitizens → updatePlayer →
               (if no modal) updateActivities → updateProgression → updateMeta →
               ui.update → autosave-every-8s
else:          idle world sim (systems + citizens) behind the title
render(dt)     // always
```

### 4.5 Deterministic World Generation

`G.buildWorld()` constructs the entire city from a single seeded RNG (`G.makeRng(1337)`), so the 12,800 × 3,700 world is identical for every player. It places 22 buildings (from a hand-authored `G.BUILDINGS` table of `[x, width, height, style]`), then procedurally adds: open ground-floor corridors (each building solid only from its roof down to `STREET_Y − 170`, leaving a walkable arcade), a street→roof **drainpipe per building**, underground holes with ladders, fire-escape zig-zags, window-washer platforms, balconies, climbable pipes, a skybridge, 10 ziplines, 3 balance wires, the Apex antenna and Heartbeat Mast, a hacker den and forgotten room behind sealed doors, a gravity-lift beam, street props (stalls, dumpsters, crates, vending machines, lamps, benches, graffiti, shrine, garden, arcade, the Line 9 platform), neon signs, holographic ads, a mega-billboard, teleport nodes, and landmarks.

Collidable geometry is kept in flat arrays (`solids`, `oneways`, `ladders`, `ziplines`, `doors`, …); a broad-phase helper `G.solidsNear(x, y, r)` returns only nearby solids each frame.

### 4.6 Physics & Collision

Movement is fixed-timestep-friendly Euler integration with **axis-separated collision resolution** (resolve X, then Y, against the broad-phase set). Feel features include **coyote time** (0.12 s), **jump buffering** (0.14 s), variable jump height (extra gravity when the jump key is released), wall-probe detection for wall-slide/grab even when not moving into a wall, **one-way platforms** (including wires) with a **drop-through** (down + jump) mechanic, ledge-grab, and dedicated states for zipline-riding, ladder/pipe climbing, hanging, and dashing.

A notable design fix: buildings were originally solid to the ground, which broke continuous street walking. Building collision now stops 170 px above the street (`GROUND`), creating a walkable storefront arcade, while a non-colliding climbable drainpipe on every building preserves vertical access from road to rooftop.

### 4.7 Rendering Pipeline

A single immediate-mode Canvas 2D renderer (`G.render`) draws back-to-front each frame:

1. **Sky** — a gradient built from a ten-stop colour table interpolated by time-of-day, plus stars and a moon at night.
2. **Parallax skylines** — two background silhouette layers at different scroll factors.
3. **World space** (camera-translated & scaled): underground cavern, street + wet sheen + puddle reflections + rain ripples, **pre-rendered building facades**, the lit-window layer (night-scaled, outage-aware), the open ground-floor storefront arcades, infrastructure (one-ways, wires, ladders, ziplines, beams), props, activity markers, curiosity beacons, collectibles, progression & meta overlays, the ghost train, citizens, and PawPaw.
4. **Post / weather** — rain particles with wind slant, fog, night tint, lightning flash, security-sweep searchlight, the screen vignette, and the Fever glow.

The camera follows the cat with a lerp (and a clamp), screen-shake on impacts, and holds a fixed cinematic frame on the title screen. Building facades (windows, grime, glass strips) are rasterised **once** to offscreen canvases during init and blitted thereafter.

### 4.8 Procedural Audio Engine

`G.audio` builds a small synth graph once: a master gain → a low-pass-filtered pad (two detuned saws + triangle), looping band-pass noise sources for rain and wind, a sine city hum, a delay/feedback echo bus, and a gated sub-bass for the beat. `update(dt)` drives a drifting pad chord per zone mood, zone-specific arpeggio plucks on musical scales, and a BPM beat clock (kick / hi-hat / bass), with everything brightening and quickening during Fever. One-shot helpers synthesize every sound effect (footsteps, climb ticks, purr, scratch, blips, pings, chimes, dashes, lands, thunder, fanfare). The context is created lazily and resumed on first user gesture (the title-screen button).

### 4.9 Save System

`G.saveGame()` serialises the full `G.state` plus derived run data to `localStorage` (key `pawpaw-save`): taken-collectible state is encoded as a compact **bit-string**, alongside hacked terminals, race best-times and **ghost-replay paths**, upgrades, cosmetics, abilities, quests, kittens, shrine progress, achievements, stats, rotating-challenge tier, set rewards, and completion %. Saving is automatic (every ~8 s and on key events). `G.loadGame()` restores it; the title screen offers **Resume** (returning bonus) or **New Game** (which wipes the save via `G.resetState()` after a confirm).

### 4.10 Performance Techniques

- **Pre-rendered facades** to offscreen canvases (hundreds of lit windows cost one `drawImage`).
- **Broad-phase culling** (`solidsNear`) so collision and many draw loops only touch on-screen geometry.
- **View-frustum checks** in every draw loop (skip anything outside the camera view).
- **Particle pools** for rain.
- **`dt` clamping** to keep physics stable across frame-rate spikes.
- A single canvas and a single RAF loop; no per-frame allocations in hot paths where avoidable.

### 4.11 Tooling & The Report Pipeline

A small `tools/` suite generates the project's media report directly from the running game:

- **`tools/save_server.py`** — a tiny HTTP endpoint (`localhost:8000`) that receives canvas screenshots and recorded gameplay clips from the page (POST `"filename|<base64/data-URI>"`) and writes them into `report/report-assets/`.
- **In-browser capture** — screenshots are composited by drawing the live game canvas, the minimap, and an `html2canvas` rasterisation of the HTML HUD/modals into one image; gameplay video is recorded via `canvas.captureStream()` + `MediaRecorder` (VP9/Opus), driven by a scripted camera/route, then POSTed to the saver.
- **`tools/inline_images.py`** — a build step that reads `report/index.html` and inlines every `report-assets/*.jpg|webm` reference as a base64 data-URI, producing the **fully self-contained** `report/PawPaw-World-Report.html` (openable anywhere with no folder).

### 4.12 Deployment

The game is a set of static files served over plain HTTP. Locally it runs with any static server (e.g. `python3 -m http.server 3000`, then `http://localhost:3000`) or by opening `index.html` directly. In production it is published via **GitHub Pages** at `https://mah-era.github.io/pawpaw-world/`, with the web report at `/report/`. There is no server-side component and no runtime network dependency.

---

## 5. Key Constants Reference

| Constant | Value | Meaning |
|---|---:|---|
| `WORLD_W × WORLD_H` | 12,800 × 3,700 | World dimensions (px) |
| `STREET_Y` | 2,800 | Top of the street surface |
| `UNDER_Y` | 3,460 | Underground tunnel floor |
| `GROUND` | 170 | Open ground-floor corridor height |
| `GRAVITY` | 2,300 | px·s⁻² |
| `WALK / RUN / SPRINT` | 190 / 330 / 480 | Horizontal speeds |
| `JUMP_V` | −760 | Jump impulse |
| `DASH_V / DASH_T / DASH_CD` | 980 / 0.16 / 1.1 | Dash speed / duration / cooldown |
| `CLIMB` | 300 | Ladder/pipe climb speed |
| `WALL_SLIDE / WALL_JUMP_X` | 130 / 430 | Wall slide cap / wall-jump push |
| `COYOTE / JUMP_BUFFER` | 0.12 / 0.14 | Forgiveness windows (s) |
| `DAY_LENGTH` | 360 | Seconds per full day/night cycle |
| `CAM_LERP` | 5.5 | Camera follow smoothing |
| Ability unlocks | dash @ 10, djump @ 0, wallrun @ 45 | Kibble thresholds |

**Content totals:** 177 collectibles (140 kibble · 18 chips · 10 memories · 5 artifacts · 2 legendaries · 2 keys) · 9 photo targets · 8 kittens · 4 terminals · 3 races · 3 quest chains · 6 NPC errands · 6 secret rooms · 5 mysteries · 5 shrine levels · 12 mini-games · 12 hidden rewards · 24 curiosities · 25 achievements · 7 districts · 10 ziplines · 22 buildings.

---

## 6. File & Directory Structure

```
pawpaw-world/
├── index.html                 Game page: canvas, HUD, modals, title screen, script order
├── style.css                  Cyberpunk UI theme
├── js/
│   ├── config.js              Shared state, constants, lore, shop, skills, totals, RNG
│   ├── world.js               Deterministic city generation
│   ├── player.js              Movement, collision, abilities, cat rendering, foley
│   ├── citizens.js            NPCs, vehicles, drones
│   ├── systems.js             Day/night, weather, events, Web Audio engine
│   ├── activities.js          Collectibles, curiosities, terminals, races, photos, save/load
│   ├── progression.js         Economy, achievements, quests, kittens, wisps, shrine, completion
│   ├── meta.js                XP/levels, Fever, challenges, bonus events, supply capsules
│   ├── render.js              Canvas renderer
│   ├── ui.js                  HUD, journal, shop, teleport, hacking, photo UI, minimap
│   └── main.js                Input, boot, title screen, game loop
├── report/
│   ├── index.html             Web project report (references report-assets/)
│   ├── PawPaw-World-Report.html  Self-contained report (media inlined as base64)
│   └── report-assets/         In-game screenshots (.jpg) + gameplay clips (.webm)
├── docs/
│   ├── DEPLOYMENT.md
│   ├── PROJECT_REPORT.md
│   └── USER_MANUAL.md
├── tools/
│   ├── save_server.py         Receives captured media → report-assets/
│   └── inline_images.py       Builds the self-contained report
├── README.md
└── COMPLETE_PROJECT_REPORT.md  (this document)
```

---

## 7. Quality, Testing & Verification

- **Syntax**: every JS module passes `node --check`.
- **Runtime**: smoke-tested in a browser via a local static server — page load, all controls, the city map and 10 journal tabs, modals, completion rendering, autosave/restore, and no console errors.
- **Gameplay verification**: continuous street traversal across multiple buildings and gaps was confirmed by both collision probes and live walking; per-building drainpipes were verified to reach every rooftop; the underground ladder exit was verified to land the cat back on the street.
- **Media capture**: report screenshots and gameplay video are captured live from the running canvas (world + HUD/modals composited), guaranteeing the report reflects the actual build.

---

## 8. Known Limitations & Future Work

- **Desktop-first**: tuned for keyboard + a ~1280×800 viewport; no touch controls yet.
- **Subtle events in stills**: a few systemic events (the *ghost train*, *cargo-drone malfunction*, *hologram glitch*) are intentionally faint, fast, per-frame effects and read better in motion than in a screenshot.
- **Self-contained report size**: inlining all media as base64 makes `PawPaw-World-Report.html` large (tens of MB); the linked `report/index.html` version is lighter.
- **Possible future additions**: gamepad/touch input, more districts, additional race courses, and brighter rendering of the faint events.

---

## 9. Changelog Highlights

- **Walkable street promenade** — opened a ground-floor corridor under every building and added a climbable drainpipe per building, turning a series of dead-end gaps into one continuous, fully-traversable street with rooftop access everywhere.
- **Three fully-interactive zones** — road, rooftops, and underground, each seeded with curiosities (24 total).
- **Cinematic opening scene** — a clean, letterboxed title with a lone cat on a rainy rooftop and the live city behind (HUD hidden, chromatic-glitch wordmark).
- **Double jump from the start**, plus a new expressive **scratch** action.
- **Richer audio** — speed-scaled footsteps, ladder ticks, and a resting purr added to the adaptive music engine.
- **Project report** — a self-contained HTML report with a full live-screenshot gallery, NPC/missions/progress/situations sections, and an embedded gameplay video, generated by the capture tooling.

---

*Generated as the complete technical & functional report for PawPaw World. For the visual showcase with live screenshots and gameplay video, see `report/PawPaw-World-Report.html` or the live site at https://mah-era.github.io/pawpaw-world/report/.*
