# PawPaw World

PawPaw World is a dependency-free browser game about a cyber-cat exploring a
living neon city. Run across streets, rooftops, and underground tunnels; take
courier jobs, race, hack terminals, rescue kittens, discover lore, and chase
100% District Completion.

The game uses vanilla JavaScript, Canvas 2D, WebAudio, and `localStorage`. It
has no build step, backend, package manager, paid systems, or network runtime
dependency.

## Play Online

**Live game:** [https://mah-era.github.io/pawpaw-world/](https://mah-era.github.io/pawpaw-world/)

**Visual report:** [https://mah-era.github.io/pawpaw-world/report/](https://mah-era.github.io/pawpaw-world/report/)

## Play Locally

From the repository root:

```bash
python3 -m http.server 3000
```

Open [http://localhost:3000](http://localhost:3000).

Audio begins after entering the city because browsers require a user gesture
before starting WebAudio. Progress is saved in the current browser's
`localStorage`.

## Controls

| Key | Action |
|---|---|
| Left / Right or A / D | Move |
| Up | Jump |
| W | Climb |
| Space or Shift | Sprint |
| S | Slide or drop through a platform |
| X or K | Dash after unlocking it |
| E | Interact |
| C | Scratch |
| M | City map |
| J | Journal |
| P | Photo mode |
| Enter | Capture a photo |
| Esc | Close the active menu or dialog |

## Highlights

- Three connected playable layers: street, rooftops, and underground.
- Parkour movement with sprinting, climbing, wall movement, dashes, gliding,
  ziplines, and flow combos.
- Adaptive procedural music and synchronized movement, weather, interface, and
  activity sound effects.
- Quests, NPC errands, courier jobs, races, hacking, curiosities, city events,
  photo challenges, secret rooms, and kitten rescues.
- XP, skills, upgrades, cosmetics, achievements, race ghosts, Paw Shrine
  rebuilding, and full completion tracking.
- Automatic local saves with no account or server required.

## Project Layout

```text
.
|-- index.html                  Game entry point
|-- style.css                   Game and interface styling
|-- js/                         Game source modules
|-- docs/
|   |-- USER_MANUAL.md          Player guide
|   |-- PROJECT_REPORT.md       Detailed technical and design report
|   `-- DEPLOYMENT.md           Hosting instructions
|-- report/
|   |-- index.html              Media-backed visual project report
|   |-- PawPaw-World-Report.html  Self-contained visual report
|   `-- report-assets/          Gallery images and gameplay video
`-- tools/
    |-- inline_images.py        Builds the self-contained visual report
    `-- save_server.py          Local report-asset capture receiver
```

The JavaScript modules are intentionally split by responsibility:

- `config.js`: shared state, constants, content definitions, and save schema.
- `world.js`: world geometry, districts, landmarks, traversal paths, and props.
- `player.js`: movement, physics, animation, abilities, and player rendering.
- `citizens.js`: NPCs, vendors, pedestrians, vehicles, and drones.
- `systems.js`: time, weather, city events, and the WebAudio engine.
- `activities.js`: collectibles, interactions, races, delivery work, and saves.
- `progression.js`: quests, economy, achievements, kittens, shrine, and secrets.
- `meta.js`: levels, challenges, fever, bonus events, and supply capsules.
- `render.js`: Canvas city rendering, atmosphere, effects, and activity visuals.
- `ui.js`: HUD, journals, menus, shops, hacking, rhythm, and photo interfaces.
- `main.js`: boot sequence, input handling, title screen, and main loop.

## Reports

- [Deployed visual project report](https://mah-era.github.io/pawpaw-world/report/)
- [Repository visual project report](report/index.html)
- [Self-contained visual report](report/PawPaw-World-Report.html)
- [Player manual](docs/USER_MANUAL.md)
- [Detailed project report](docs/PROJECT_REPORT.md)

To rebuild the self-contained report after changing report media:

```bash
python3 tools/inline_images.py
```

## Validation

Check JavaScript syntax:

```bash
for file in js/*.js; do node --check "$file"; done
```

Then serve the repository and verify the game and report:

```bash
python3 -m http.server 3000
curl -I http://localhost:3000/
curl -I http://localhost:3000/report/
```

## Deployment

This is a static site. GitHub Pages is the simplest recommended host and needs
no build command. After pushing, deploy the `main` branch from the repository
root. See [Deployment](docs/DEPLOYMENT.md) for GitHub Pages, Netlify, and
Cloudflare Pages instructions.

Production URL: [https://mah-era.github.io/pawpaw-world/](https://mah-era.github.io/pawpaw-world/)

## License

No license has been selected. Copyright remains with the project owner unless
a license file is added.
