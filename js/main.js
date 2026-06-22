// ============ PAWPAW WORLD — INPUT & GAME LOOP ============
"use strict";

(function () {
  // ---------- input ----------
  const map = {
    ArrowLeft: "left", KeyA: "left",
    ArrowRight: "right", KeyD: "right",
    KeyW: "up",
    ArrowDown: "down", KeyS: "down",
    Space: "sprint", ShiftLeft: "sprint", ShiftRight: "sprint",
    ArrowUp: "jump", KeyW: "up",
    KeyX: "dash", KeyK: "dash",
  };

  window.addEventListener("keydown", e => {
    if (e.code === "Space" || e.code.startsWith("Arrow")) e.preventDefault();
    const k = map[e.code];
    if (k && !e.repeat) {
      if (k === "jump") G.keys.jumpP = true;
      if (k === "dash") G.keys.dashP = true;
      if ((k === "up") && !G.keys.up) G.keys.jumpP = G.player && G.player.climbing ? G.keys.jumpP : G.keys.jumpP; // up is climb, not jump
    }
    if (k) G.keys[k] = true;
    if (e.repeat || !G.state.started) return;

    if (e.code === "Escape") { if (G.state.modal) G.ui.closeModal(); else if (G.state.photoMode) G.ui.setPhotoMode(false); }
    if (G.state.modal === "dialog" && (e.code === "KeyE" || e.code === "Enter")) { G.ui.closeDialog(); return; }
    if (e.code === "KeyM" && (G.state.modal === "map" || !G.state.modal)) { G.ui.toggleCityMap(); return; }
    if (e.code === "KeyJ" && (G.state.modal === "journal" || !G.state.modal)) { G.ui.toggleJournal(); return; }
    if (G.state.modal) return;

    if (e.code === "KeyE") G.doInteract();
    if (e.code === "KeyC") G.keys.scratchP = true;
    if (e.code === "KeyP") G.ui.setPhotoMode(!G.state.photoMode);
    if (e.code === "Enter" && G.state.photoMode) G.takePhoto();
  });
  window.addEventListener("keyup", e => { const k = map[e.code]; if (k) G.keys[k] = false; });
  window.addEventListener("blur", () => { for (const k in G.keys) G.keys[k] = false; });

  // ---------- boot ----------
  function boot() {
    G.buildWorld();
    G.initPlayer();
    G.initCitizens();
    G.initSystems();
    G.initActivities();
    G.initRender();
    G.ui.init();

    const had = G.loadGame();

    // cinematic title backdrop: a lone cat on a rainy rooftop, neon city beyond
    G.time.t = 0.9; // deep dusk
    G.weather.cur = "lightRain"; G.weather.next = null; G.weather.blend = 1; G.weather.rainAmt = 0.5; G.weather.wet = 0.62;
    // perch PawPaw on a market rooftop, sitting, gazing over the skyline
    G.player.x = 4990; G.player.y = 1736; G.player.facing = 1; G.player.idleT = 9; G.player.onGround = true;
    G.cam.x = 5320; G.cam.y = 1928;

    const note = document.getElementById("save-note");
    const btnResume = document.getElementById("btn-resume");
    const btnNew = document.getElementById("btn-new");

    if (had) {
      note.textContent = "◉ SAVE FOUND — your city remembers you";
      btnResume.classList.remove("hidden");
      G.ui.refreshAbilities();
    } else {
      note.textContent = "◉ NEW WANDER — progress saves automatically";
    }

    function enterCity(isNew) {
      if (isNew && had) {
        localStorage.removeItem("pawpaw-save");
        G.resetState();
        G.buildWorld();
        G.initPlayer();
        G.initCitizens();
        G.initActivities();
        G.initRender();
        G.ui.init();
      }
      G.audio.init();
      if (G.audio.ctx && G.audio.ctx.state === "suspended") G.audio.ctx.resume();
      document.getElementById("title-screen").style.display = "none";
      document.body.classList.add("playing");
      G.state.started = true;
      setTimeout(() => {
        if (isNew) G.ui.guide(G.GUIDE.intro, 10);
        else G.earn(25, "welcome back, PawPaw");
      }, 1200);
    }

    btnResume.addEventListener("click", () => enterCity(false));
    btnNew.addEventListener("click", () => {
      if (had && !confirm("Start fresh? Your current save will be erased.")) return;
      enterCity(true);
    });

    requestAnimationFrame(loop);
  }

  // ---------- loop ----------
  let last = performance.now(), saveT = 0;
  function loop(now) {
    requestAnimationFrame(loop);
    let dt = (now - last) / 1000;
    last = now;
    if (dt > 0.05) dt = 0.05; // clamp tab-switch spikes

    if (G.state.started) {
      G.updateSystems(dt);
      G.updateCitizens(dt);
      G.updatePlayer(dt);
      if (!G.state.modal) { G.updateActivities(dt); G.updateProgression(dt); G.updateMeta(dt); }
      G.ui.update(dt);
      G.ui.updatePhotoTarget();
      saveT += dt;
      if (saveT > 8) { saveT = 0; G.saveGame(); }
    } else {
      // idle world simulation behind the title screen
      G.updateSystems(dt);
      G.updateCitizens(dt);
    }
    G.render(dt);
  }

  window.addEventListener("DOMContentLoaded", boot);
})();
