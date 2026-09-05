(async function PartyFullscreenPro() {
    // Warten auf Spotify-Kernfunktionen
    while (!Spicetify?.Player || !Spicetify?.Topbar || !Spicetify?.Queue || !Spicetify?.Menu) {
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    const { Player, Queue, CosmosAsync } = Spicetify;

    let isPartyFsEnabled = localStorage.getItem("party_fs_enabled") !== "false";
    let lyricsEnabled = localStorage.getItem("party_fs_lyrics") !== "false";
    let ambientEnabled = localStorage.getItem("party_fs_ambient") !== "false";
    let isKaraokeEnabled = localStorage.getItem("party_fs_karaoke") === "true";
    let isLyricsSynced = true;

    
    const menuItem = new Spicetify.Menu.Item(
        "Party Fullscreen",
        isPartyFsEnabled,
        () => {
            isPartyFsEnabled = !isPartyFsEnabled;
            localStorage.setItem("party_fs_enabled", isPartyFsEnabled.toString());
            menuItem.isEnabled = isPartyFsEnabled;
        }
    );
    menuItem.register();



    const Icons = {
        ambient: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/><circle cx="12" cy="12" r="4"/></svg>`,
        shuffle: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/><line x1="4" y1="4" x2="9" y2="9"/></svg>`,
        prev: `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none"><rect x="4" y="5" width="3" height="14" rx="1.5"/><path d="M19.5 5.5v13c0 1.2-1.3 2-2.4 1.3l-9-6.5c-1-.8-1-2.4 0-3.2l9-6.5c1.1-.7 2.4 0 2.4 1.3z"/></svg>`,
        play: `<svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M6.5 4.5v15c0 1.5 1.5 2.5 2.8 1.8l11-7.5c1.2-.8 1.2-2.8 0-3.6l-11-7.5C8 2 6.5 3 6.5 4.5z"/></svg>`,
        pause: `<svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" stroke="none"><rect x="6" y="5" width="4" height="14" rx="2"/><rect x="14" y="5" width="4" height="14" rx="2"/></svg>`,
        next: `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M4.5 5.5v13c0 1.2 1.3 2 2.4 1.3l9-6.5c1-.8 1-2.4 0-3.2l-9-6.5c-1.1-.7-2.4 0-2.4 1.3z"/><rect x="17" y="5" width="3" height="14" rx="1.5"/></svg>`,
        repeat: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>`,
        repeatOne: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/><text x="12" y="16" font-size="10" stroke="none" fill="currentColor" text-anchor="middle" font-weight="bold">1</text></svg>`,
        karaoke: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 8-9.04 9.06a2.82 2.82 0 1 0 3.98 3.98L16 12"/><circle cx="17" cy="7" r="5"/></svg>`,
        lyrics: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>`,
        volHigh: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>`,
        volLow: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>`,
        volMute: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>`
    };

    const lyricsOffHTML = `Lyrics aus`;
    const noLyricsHTML = `Keine Lyrics vorhanden`;

    if (typeof window.__partyFsCleanup === "function") {
        try { window.__partyFsCleanup(); } catch (e) { console.error("PartyFullscreen cleanup:", e); }
    }

    let queueObserver = null;

    const existingOverlay = document.getElementById("party-fs-overlay");
    if (existingOverlay) {
        existingOverlay.remove();
    }
    const existingStyle = document.getElementById("party-fs-styles");
    if (existingStyle) {
        existingStyle.remove();
    }

    const overlay = document.createElement("div");
    overlay.id = "party-fs-overlay";
    document.body.appendChild(overlay);

    const style = document.createElement("style");
    style.id = "party-fs-styles";
    style.innerHTML = `
        :root {
            --party-primary: #1db954;
            --party-primary-rgb: 29, 185, 84;
            --party-primary-10: rgba(29, 185, 84, 0.10);
            --party-primary-15: rgba(29, 185, 84, 0.15);
            --party-primary-20: rgba(29, 185, 84, 0.20);
            --party-primary-40: rgba(29, 185, 84, 0.40);
            --party-primary-60: rgba(29, 185, 84, 0.60);
            --party-primary-80: rgba(29, 185, 84, 0.80);
        }
        #party-fs-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: radial-gradient(circle at 25% 40%, rgba(var(--party-primary-rgb), 0.18) 0%, transparent 60%), radial-gradient(circle at 80% 60%, rgba(var(--party-primary-rgb), 0.10) 0%, transparent 55%), #060608;
            z-index: 999999 !important;
            display: grid;
            grid-template-columns: 2fr 2.2fr 1.3fr;
            color: white;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            box-sizing: border-box;
            overflow: hidden;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.4s ease, visibility 0.4s, grid-template-columns 0.9s cubic-bezier(0.16, 1, 0.3, 1);
        }
        #party-fs-overlay.active {
            opacity: 1 !important;
            visibility: visible !important;
        }

        /* --- AMBIENTE BELEUCHTUNG (OPTIMIERT) --- */
        .party-fs-bg {
            position: absolute;
            top: -20%; 
            left: -20%; 
            width: 140%; 
            height: 140%;
            background-size: cover;
            background-position: center;
            filter: blur(85px) brightness(var(--bg-brightness, 0.45)) saturate(1.6);
            z-index: 0;
            opacity: 0;
            transition: opacity 1.8s cubic-bezier(0.16, 1, 0.3, 1);
            pointer-events: none;
            will-change: transform, opacity;
            transform: translate3d(0, 0, 0);
        }
        .party-fs-bg.active-bg {
            opacity: 0.55;
        }
        #party-fs-overlay.ambient-off .party-fs-bg {
            opacity: 0 !important;
        }

        /* --- AUTO-HIDE INACTIVITY CONTROLS --- */
        #party-fs-overlay.idle-hidden {
            cursor: none;
        }
        #party-fs-overlay.idle-hidden #fs-close-btn,
        #party-fs-overlay.idle-hidden .party-clock,
        #party-fs-overlay.idle-hidden .ambient-btn-container,
        #party-fs-overlay.idle-hidden .party-controls,
        #party-fs-overlay.idle-hidden .progress-container,
        #party-fs-overlay.idle-hidden .volume-container {
            opacity: 0 !important;
            pointer-events: none !important;
            transition: opacity 0.75s ease;
        }
        #party-fs-overlay.idle-hidden .party-meta {
            transform: scale(1.18);
            margin-bottom: 35px;
        }
        #party-fs-overlay.idle-hidden .party-title {
            font-size: 2.85rem;
            text-shadow: 0 6px 30px rgba(0,0,0,0.9);
        }
        #party-fs-overlay.idle-hidden .party-artist {
            font-size: 1.65rem;
            color: rgba(255, 255, 255, 0.85);
            margin-top: 8px;
        }

        .party-queue-duration {
            font-size: 0.85rem;
            color: rgba(255, 255, 255, 0.4);
            margin-left: auto;
            padding-left: 8px;
            flex-shrink: 0;
            font-variant-numeric: tabular-nums;
        }
        
        /* --- ADAPTIVES 2-SPALTEN / 3-SPALTEN GRID --- */
        #party-fs-overlay.lyrics-collapsed,
        #party-fs-overlay.lyrics-off,
        #party-fs-overlay.no-lyrics {
            grid-template-columns: 1.2fr 0px 1fr !important;
        }
        /* Step 1: fade out content first before grid collapses */
        #party-fs-overlay.lyrics-hiding .col-lyrics {
            opacity: 0 !important;
            pointer-events: none !important;
        }
        /* Step 2: fully hidden after grid collapse */
        #party-fs-overlay.lyrics-collapsed .col-lyrics,
        #party-fs-overlay.lyrics-off .col-lyrics,
        #party-fs-overlay.no-lyrics .col-lyrics {
            opacity: 0 !important;
            visibility: hidden !important;
            pointer-events: none !important;
            padding: 0 !important;
            border-right: none !important;
        }
        .col-lyrics {
            transition: opacity 0.45s ease, visibility 0.5s ease, padding 0.6s ease !important;
        }

        /* --- AMBIENT & KARAOKE TOGGLE BUTTONS --- */
        .ambient-btn-container {
            display: flex;
            justify-content: center;
            align-items: center;
            background: rgba(18, 18, 24, 0.65);
            border-radius: 36px;
            padding: 4px;
            border: 1px solid rgba(255, 255, 255, 0.09);
            backdrop-filter: blur(20px) saturate(180%);
            -webkit-backdrop-filter: blur(20px) saturate(180%);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.45), inset 0 1px 1px rgba(255, 255, 255, 0.15);
            gap: 4px;
            margin-bottom: 25px;
            z-index: 10;
        }
        .btn-ambient-top {
            background: transparent;
            border: none;
            color: #b3b3b3;
            cursor: pointer;
            width: 42px;
            height: 42px;
            border-radius: 21px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
            outline: none;
            box-shadow: none;
            flex-shrink: 0;
            padding: 0;
        }
        #btn-ambient-toggle {
            border-radius: 21px 4px 4px 21px;
            transition: all 0.2s ease, border-radius 0.3s ease;
        }
        #btn-karaoke-toggle {
            border-radius: 4px 21px 21px 4px;
            transition: all 0.4s ease;
            overflow: hidden;
        }
        .btn-ambient-top svg {
            width: 20px !important;
            height: 20px !important;
        }
        .btn-ambient-top:hover {
            color: white;
            transform: scale(1.08);
            background: rgba(255, 255, 255, 0.1);
        }
        .btn-ambient-top.btn-active {
            color: var(--party-primary) !important;
            background: var(--party-primary-15) !important;
            box-shadow: 0 0 12px var(--party-primary-20);
            transition: all 0.2s ease, color 1s ease, background-color 1s ease !important;
        }

        /* --- CLOSE BUTTON & CLOCK --- */
        #fs-close-btn {
            position: absolute;
            top: 45px;
            left: 45px;
            z-index: 1000000;
            background: rgba(18, 18, 24, 0.65);
            border: 1px solid rgba(255, 255, 255, 0.09);
            border-radius: 50%;
            width: 48px;
            height: 48px;
            display: flex;
            align-items: center;
            justify-content: center;
            backdrop-filter: blur(20px) saturate(180%);
            -webkit-backdrop-filter: blur(20px) saturate(180%);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.45), inset 0 1px 1px rgba(255, 255, 255, 0.15);
            cursor: pointer;
            color: rgba(255, 255, 255, 0.85);
            transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        #fs-close-btn:hover {
            transform: scale(1.1) rotate(90deg);
            color: white;
            background: rgba(255, 255, 255, 0.15);
            border-color: rgba(255, 255, 255, 0.2);
            box-shadow: 0 12px 36px rgba(0, 0, 0, 0.6);
        }
        #fs-close-btn svg {
            width: 22px;
            height: 22px;
        }
        .party-clock {
            position: absolute;
            top: 45px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 2.1rem;
            font-weight: 700;
            letter-spacing: 2px;
            color: rgba(255, 255, 255, 0.9);
            text-shadow: 0 4px 18px rgba(0, 0, 0, 0.6);
            z-index: 1000000;
            pointer-events: none;
            user-select: none;
            background: rgba(18, 18, 24, 0.65);
            padding: 8px 28px;
            border-radius: 999px;
            backdrop-filter: blur(20px) saturate(180%);
            -webkit-backdrop-filter: blur(20px) saturate(180%);
            border: 1px solid rgba(255, 255, 255, 0.09);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.45), inset 0 1px 1px rgba(255, 255, 255, 0.15);
            font-variant-numeric: tabular-nums;
        }

        .col-player, .col-lyrics, .col-queue {
            min-width: 0; 
            max-width: 100%;
            position: relative;
            z-index: 1;
        }

        /* --- PLAYER SPALTE --- */
        .col-player {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 40px;
            border-right: 1px solid rgba(255, 255, 255, 0.06);
            background: rgba(255, 255, 255, 0.005);
            transition: all 0.5s ease !important;
        }

        .party-cover-wrapper {
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            perspective: 1000px;
            margin-bottom: 25px;
        }
        .party-cover-wrapper::after {
            content: '';
            position: absolute;
            bottom: -22px;
            width: 78%;
            height: 28px;
            border-radius: 50%;
            background: var(--party-primary);
            filter: blur(30px);
            opacity: 0.5;
            z-index: -1;
            transition: background 1s ease, opacity 0.4s ease;
        }
        .party-cover {
            width: 40vh;
            height: 40vh;
            max-width: 380px;
            max-height: 380px;
            min-width: 200px;
            min-height: 200px;
            border-radius: 20px;
            box-shadow: 0 28px 60px rgba(0,0,0,0.8), 0 0 35px var(--party-primary-20);
            border: 1px solid rgba(255, 255, 255, 0.12);
            object-fit: cover;
            transition: transform 0.25s ease-out, box-shadow 0.4s ease, max-width 0.5s ease, max-height 0.5s ease !important;
            will-change: transform;
        }

        .party-cover:hover {
            transform: scale(1.025);
            box-shadow: 0 32px 70px rgba(0,0,0,0.9), 0 0 45px var(--party-primary-40);
        }
        #party-fs-overlay.lyrics-collapsed .party-cover,
        #party-fs-overlay.lyrics-off .party-cover,
        #party-fs-overlay.no-lyrics .party-cover {
            max-width: 48vh;
            max-height: 48vh;
        }
        
        .party-meta {
            text-align: center;
            width: 100%;
            max-width: 85%;
            margin-bottom: 24px;
            display: flex;
            flex-direction: column;
            align-items: center;
            transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), margin-bottom 0.6s ease;
        }

        /* --- MARQUEE SCROLL EFFEKT --- */
        .scroll-wrap {
            width: 100%;
            overflow: hidden;
            display: flex;
            justify-content: center;
        }
        .scroll-wrap.is-scrolling {
            justify-content: flex-start;
            mask-image: linear-gradient(to right, black 85%, transparent 100%);
            -webkit-mask-image: linear-gradient(to right, black 85%, transparent 100%);
        }
        .party-title {
            font-size: 2.3rem;
            font-weight: 800;
            white-space: nowrap;
            letter-spacing: -0.02em;
            text-shadow: 0 4px 24px rgba(0,0,0,0.8);
            box-sizing: border-box;
            display: inline-flex;
            align-items: center;
            transition: font-size 0.6s cubic-bezier(0.16, 1, 0.3, 1), text-shadow 0.6s ease;
        }
        .party-artist {
            font-size: 1.35rem;
            font-weight: 600;
            color: rgba(255, 255, 255, 0.7);
            margin-top: 6px;
            white-space: nowrap;
            letter-spacing: -0.01em;
            text-shadow: 0 2px 12px rgba(0,0,0,0.6);
            box-sizing: border-box;
            transition: font-size 0.6s cubic-bezier(0.16, 1, 0.3, 1), color 0.6s ease, margin-top 0.6s ease;
        }
        .artist-link {
            cursor: pointer;
            transition: color 0.2s ease;
        }
        .artist-link:hover {
            color: white !important;
            text-decoration: underline;
        }

        /* Live Title Equalizer */
        .party-title-eq {
            display: inline-flex;
            align-items: flex-end;
            gap: 3px;
            height: 18px;
            margin-left: 14px;
            flex-shrink: 0;
            vertical-align: middle;
        }
        .party-title-eq span {
            width: 3.5px;
            border-radius: 2px;
            background: var(--party-primary);
            box-shadow: 0 0 8px var(--party-primary);
            transition: background 1s ease;
        }
        .party-title-eq span:nth-child(1) { height: 100%; animation: eqAnim1 0.85s ease-in-out infinite alternate; }
        .party-title-eq span:nth-child(2) { height: 60%; animation: eqAnim2 0.65s ease-in-out infinite alternate 0.2s; }
        .party-title-eq span:nth-child(3) { height: 85%; animation: eqAnim3 0.75s ease-in-out infinite alternate 0.35s; }
        .party-title-eq.paused span {
            animation: none !important;
            height: 30% !important;
            opacity: 0.45;
        }
        
        .is-scrolling #p-title, 
        .is-scrolling #p-artist {
            animation: scrollLinearMarquee var(--scroll-dur, 6s) linear infinite alternate;
        }
        @keyframes scrollLinearMarquee {
            0%, 10% { transform: translateX(0); }
            90%, 100% { transform: translateX(var(--scroll-dist)); }
        }
        
        .progress-container {
            width: 85%;
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 22px;
            color: rgba(255, 255, 255, 0.7);
            font-size: 0.9rem;
            font-weight: 600;
            font-variant-numeric: tabular-nums;
            user-select: none;
        }
        .progress-bar-bg {
            flex-grow: 1;
            height: 6px;
            background: rgba(255, 255, 255, 0.15);
            border-radius: 999px;
            cursor: pointer;
            position: relative;
            transition: height 0.15s ease;
        }
        .progress-bar-bg:hover, .progress-bar-bg.dragging {
            height: 8px;
        }
        .progress-tooltip {
            position: absolute;
            top: -34px;
            transform: translateX(-50%);
            background: rgba(18, 18, 24, 0.9);
            border: 1px solid var(--party-primary);
            padding: 3px 8px;
            border-radius: 6px;
            font-size: 0.8rem;
            color: white;
            font-weight: 700;
            font-variant-numeric: tabular-nums;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.15s ease;
            box-shadow: 0 4px 12px rgba(0,0,0,0.6);
            backdrop-filter: blur(8px);
        }
        .progress-bar-bg:hover .progress-tooltip {
            opacity: 1;
        }
        .progress-bar-fill {
            height: 100%;
            width: 100%;
            transform-origin: left;
            transform: scaleX(0);
            background: var(--party-primary);
            box-shadow: 0 0 14px var(--party-primary-80);
            border-radius: 999px;
            transition: transform 0.1s linear, background 1s ease;
            position: relative;
        }
        .progress-bar-fill::after {
            content: '';
            position: absolute;
            right: -6px;
            top: 50%;
            transform: translateY(-50%) scale(0);
            width: 14px;
            height: 14px;
            background: #fff;
            border-radius: 50%;
            box-shadow: 0 2px 8px rgba(0,0,0,0.6);
            transition: transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .progress-bar-bg:hover .progress-bar-fill::after, .progress-bar-bg.dragging .progress-bar-fill::after {
            transform: translateY(-50%) scale(1);
        }
        .progress-bar-bg.dragging .progress-bar-fill {
            transition: none !important;
        }

        /* --- FLOATING CONTROLS ISLAND --- */
        .party-controls {
            display: flex;
            gap: 12px;
            align-items: center;
            justify-content: center;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.08);
            backdrop-filter: blur(20px) saturate(180%);
            -webkit-backdrop-filter: blur(20px) saturate(180%);
            padding: 8px 22px;
            border-radius: 40px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.15);
            margin-bottom: 20px;
        }
        .btn-icon {
            background: transparent;
            border: none;
            color: #b3b3b3;
            cursor: pointer;
            width: 44px;
            height: 44px;
            border-radius: 50%;
            transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            padding: 0;
            outline: none;
        }
        .btn-icon:hover {
            color: white;
            background: rgba(255, 255, 255, 0.12);
            transform: scale(1.12);
        }
        .btn-icon:active {
            transform: scale(0.92);
        }
        .btn-main {
            background: #ffffff !important;
            color: #121212 !important;
            width: 54px !important;
            height: 54px !important;
            border-radius: 50% !important;
            box-shadow: 0 4px 20px rgba(255, 255, 255, 0.35), 0 2px 8px rgba(0, 0, 0, 0.5);
            margin: 0 6px;
        }
        .btn-main:hover {
            transform: scale(1.08) !important;
            box-shadow: 0 6px 28px rgba(255, 255, 255, 0.55) !important;
        }
        .btn-main svg {
            width: 26px !important;
            height: 26px !important;
            fill: #121212 !important;
        }
        .btn-active {
            color: var(--party-primary) !important;
            background: var(--party-primary-15) !important;
            box-shadow: 0 0 12px var(--party-primary-20) !important;
            transition: all 0.15s ease, color 1s ease, background-color 1s ease !important;
        }
        .btn-icon.btn-active::after {
            content: '';
            position: absolute;
            bottom: 3px;
            left: 50%;
            transform: translateX(-50%);
            width: 4px;
            height: 4px;
            background: var(--party-primary);
            border-radius: 50%;
            box-shadow: 0 0 6px var(--party-primary);
        }

        /* --- LAUTSTÄRKE REGELER --- */
        .volume-container {
            width: 60%;
            display: flex;
            align-items: center;
            gap: 14px;
            color: rgba(255, 255, 255, 0.7);
            user-select: none;
        }
        .volume-bar-bg {
            flex-grow: 1;
            height: 6px;
            background: rgba(255, 255, 255, 0.15);
            border-radius: 999px;
            cursor: pointer;
            position: relative;
            transition: height 0.15s ease;
        }
        .volume-bar-bg:hover, .volume-bar-bg.dragging {
            height: 8px;
        }
        .volume-bar-fill {
            height: 100%;
            width: 100%;
            transform-origin: left;
            transform: scaleX(0.5);
            background: var(--party-primary);
            box-shadow: 0 0 10px var(--party-primary-60);
            border-radius: 999px;
            transition: background 1s ease;
            position: relative;
        }
        .volume-bar-fill::after {
            content: '';
            position: absolute;
            right: -6px;
            top: 50%;
            transform: translateY(-50%) scale(0);
            width: 13px;
            height: 13px;
            background: #fff;
            border-radius: 50%;
            box-shadow: 0 2px 8px rgba(0,0,0,0.6);
            transition: transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .volume-bar-bg:hover .volume-bar-fill::after, .volume-bar-bg.dragging .volume-bar-fill::after {
            transform: translateY(-50%) scale(1);
        }
        .vol-icon {
            cursor: pointer;
            transition: color 0.2s, transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
            width: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            user-select: none;
        }
        .vol-icon:hover {
            color: white;
            transform: scale(1.15);
        }
        .volume-tooltip {
            position: absolute;
            top: -35px;
            transform: translateX(-50%);
            background: rgba(18, 18, 24, 0.9);
            border: 1px solid var(--party-primary);
            padding: 4px 8px;
            border-radius: 6px;
            font-size: 0.8rem;
            color: white;
            font-weight: 700;
            font-variant-numeric: tabular-nums;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.15s ease, background 1s ease;
            box-shadow: 0 4px 12px rgba(0,0,0,0.6);
            backdrop-filter: blur(8px);
        }
        .volume-tooltip::after {
            content: '';
            position: absolute;
            top: 100%;
            left: 50%;
            margin-left: -5px;
            border-width: 5px;
            border-style: solid;
            border-color: var(--party-primary) transparent transparent transparent;
            transition: border-color 1s ease;
        }
        .volume-bar-bg:hover .volume-tooltip { opacity: 1; }

        /* --- LYRICS SPALTE --- */
        .col-lyrics {
            position: relative;
            padding: 0;
            border-right: 1px solid rgba(255, 255, 255, 0.06);
            background: rgba(0, 0, 0, 0.25);
            overflow: hidden;
            mask-image: linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%);
            -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%);
        }
        .lyrics-scroll-container {
            position: absolute;
            top: 0;
            width: 100%;
            padding: 50vh 50px; 
            box-sizing: border-box;
            transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) !important;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 32px;
        }
        .lyrics-scroll-container.unsynced-linear {
            transition: transform 1s linear !important;
        }
        .lyric-line {
            font-size: 2rem;
            font-weight: 700;
            line-height: 1.4;
            text-align: center;
            opacity: 0.25;
            transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.4s ease, filter 0.4s ease !important;
            transform: scale(0.9);
            filter: blur(1.5px);
            cursor: pointer;
            transform-origin: center;
        }
        .lyric-line.next-up {
            opacity: 0.65;
            transform: scale(0.98);
            filter: blur(0.2px);
            transition: all 0.4s ease !important;
        }
        .lyric-word {
            background: linear-gradient(to right, #fff var(--word-fill, 0%), #999999 var(--word-fill, 0%));
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
            color: transparent !important;
            display: inline-block;
        }
        .lyric-line.past {
            opacity: 0.4;
            transform: scale(0.92);
            filter: blur(0.5px);
        }
        .lyric-line.past .lyric-word {
            --word-fill: 100% !important;
        }
        .lyric-line:not(.active):not(.past) .lyric-word {
            --word-fill: 0% !important;
        }
        .lyric-line.active {
            opacity: 1;
            transform: scale(1.1);
            font-weight: 800;
            filter: blur(0) drop-shadow(0 0 22px var(--party-primary-80)) drop-shadow(0 4px 14px rgba(0,0,0,0.6));
            transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.4s ease, filter 1s ease !important;
        }
        .lyric-line.unsynced-style {
            opacity: 1;
            filter: none !important;
            transform: scale(1) !important;
        }
        .lyric-line.unsynced-style .lyric-word {
            background: none !important;
            -webkit-text-fill-color: #ffffff !important;
            color: #ffffff !important;
        }
        .no-lyrics-hint {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(180deg);
            writing-mode: vertical-rl;
            color: rgba(255, 255, 255, 0.3);
            font-size: 1.5rem;
            font-weight: 600;
            letter-spacing: 2px;
            white-space: nowrap;
            transition: all 0.3s ease, color 1s ease;
        }
        
        .instrumental-break-pill {
            position: absolute;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(16, 16, 22, 0.85);
            border: 1px solid var(--party-primary-60);
            box-shadow: 0 0 24px var(--party-primary-40);
            padding: 8px 22px;
            border-radius: 999px;
            font-size: 0.95rem;
            font-weight: 700;
            color: var(--party-primary);
            backdrop-filter: blur(16px);
            z-index: 100;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.4s ease, transform 0.4s ease;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .instrumental-break-pill.active {
            opacity: 1;
            transform: translateX(-50%) translateY(-5px);
        }

        /* --- QUEUE SPALTE --- */
        .col-queue {
            position: relative;
            display: flex;
            flex-direction: column;
            padding: 0 20px;
            background: rgba(8, 8, 12, 0.55);
            backdrop-filter: blur(28px) saturate(190%);
            -webkit-backdrop-filter: blur(28px) saturate(190%);
            border-left: 1px solid rgba(255, 255, 255, 0.06);
            overflow-y: auto;
            scrollbar-width: none;
            scroll-behavior: auto;
        }
        .col-queue::-webkit-scrollbar {
            display: none;
        }
        
        .party-queue-wrapper { background: transparent; border-radius: 16px; padding: 24px; box-shadow: none; margin-top: 71px; }
        .party-queue-item { display: flex; align-items: center; gap: 16px; padding: 0; margin-bottom: 32px; border: none; background: transparent; flex-shrink: 0; position: relative; transition: background 0.2s ease, transform 0.25s ease !important; --glow-color: red; --next-glow-color: red; --mix-color: red; }
        .party-queue-item:first-child { margin-top: 15px; }
        .party-queue-item.clickable:hover { background: rgba(255, 255, 255, 0.06); border: 1px solid rgba(255, 255, 255, 0.08); transform: translateX(6px) !important; border-radius: 14px; padding: 6px 12px; }
        .party-queue-item.clickable:hover .party-queue-info { opacity: 0.8; }
        .party-queue-item.slide-up { transform: translateY(-80px) !important; transition: transform 0.38s cubic-bezier(0.25, 1, 0.5, 1) !important; }
        .party-queue-item.slide-out { animation: queueItemOut 0.38s cubic-bezier(0.25, 1, 0.5, 1) forwards !important; }
        @keyframes queueItemOut { 0% { transform: translateX(0) scale(1); opacity: 1; } 100% { transform: translateX(-50px) scale(0.95); opacity: 0; } }
        .glow-wrap { position: relative; width: 48px; height: 48px; z-index: 2; display: flex; justify-content: center; align-items: center; transition: transform 0.2s ease !important; }
        .glow-bg { position: absolute; width: 48px; height: 48px; border-radius: 6px; box-shadow: 0 0 20px 4px var(--glow-color); opacity: 0; z-index: 1; transition: opacity 0.3s ease, box-shadow 0.3s ease !important; pointer-events: none; }
        .party-queue-cover { width: 48px; height: 48px; border-radius: 6px; object-fit: cover; position: relative; z-index: 10; border: 1px solid rgba(255,255,255,0.1); }
        .party-queue-info { display: flex; flex-direction: column; justify-content: center; min-height: 48px; flex-grow: 1; overflow: hidden; transition: transform 0.2s ease !important; transform-origin: left center; }
        .particles-container { position: absolute; top: 50%; left: 50%; pointer-events: none; z-index: 0; overflow: visible; }
        .bridge-particles { position: absolute; top: 100%; left: 50%; pointer-events: none; z-index: 100; overflow: visible; }
        .party-queue-item:hover .glow-wrap { transform: scale(1.05); }
        .party-queue-item:hover .glow-bg { opacity: 0.9 !important; box-shadow: 0 0 25px 6px var(--glow-color); }
        .party-queue-item:hover .party-queue-info { transform: scale(1.02); }
        .particle { position: absolute; background: var(--glow-color); border-radius: 50%; }
        .party-queue-item:not(.in-view) .particles-container, .party-queue-item:not(.in-view) .bridge-particles { visibility: hidden !important; animation: none !important; }
        @keyframes wobble { 0% { transform: translate3d(0, 0, 0); opacity: 0.2; } 50% { opacity: 0.8; } 100% { transform: translate3d(var(--dx), var(--dy), 0); opacity: 0.2; } }
        @keyframes flowDown { 0% { transform: translate3d(var(--sx), 0, 0); opacity: 0; background: var(--glow-color); } 10% { opacity: 0.8; background: var(--glow-color); } 50% { transform: translate3d(0, 20px, 0); opacity: 0.8; background: var(--mix-color); } 90% { transform: translate3d(var(--ex), 36px, 0); opacity: 0.8; background: var(--next-glow-color); } 100% { transform: translate3d(var(--ex), 40px, 0); opacity: 0; background: var(--next-glow-color); } }

        .party-queue-item.current .eq-bars {
            display: flex;
            align-items: flex-end;
            gap: 3px;
            height: 16px;
            margin-left: 8px;
            flex-shrink: 0;
        }
        .party-queue-item.current .eq-bars .bar {
            width: 3.5px;
            background: var(--party-primary);
            border-radius: 2px;
            box-shadow: 0 0 8px var(--party-primary-80);
        }
        .party-queue-item.current .eq-bars .bar1 { animation: eqAnim1 var(--eq-dur1, 1.1s) ease-in-out infinite alternate; }
        .party-queue-item.current .eq-bars .bar2 { animation: eqAnim2 var(--eq-dur2, 1.5s) ease-in-out infinite alternate; }
        .party-queue-item.current .eq-bars .bar3 { animation: eqAnim3 var(--eq-dur3, 1.3s) ease-in-out infinite alternate; }
        @keyframes eqAnim1 {
            0%   { height: 20%; }
            100% { height: 90%; }
        }
        @keyframes eqAnim2 {
            0%   { height: 85%; }
            100% { height: 20%; }
        }
        @keyframes eqAnim3 {
            0%   { height: 45%; }
            100% { height: 95%; }
        }

        .party-queue-track {
            font-weight: 600;
            font-size: 1.05rem;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .party-queue-item.current::before {
            content: '';
            position: absolute;
            left: -12px;
            top: 50%;
            transform: translateY(-50%);
            width: 4px;
            height: 28px;
            background: var(--party-primary);
            border-radius: 2px;
            box-shadow: 0 0 10px var(--party-primary-80);
            animation: currentSongGlow 2s infinite ease-in-out;
            transition: background 1s ease, box-shadow 1s ease;
        }
        .party-queue-item.current .party-queue-track {
            color: var(--party-primary);
            transition: color 1s ease;
        }
        @keyframes currentSongGlow {
            0% { opacity: 0.6; box-shadow: 0 0 6px var(--party-primary-60); }
            50% { opacity: 1; box-shadow: 0 0 14px var(--party-primary-80); }
            100% { opacity: 0.6; box-shadow: 0 0 6px var(--party-primary-60); }
        }
        .party-queue-artist {
            color: #b3b3b3;
            font-size: 0.95rem;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        /* --- AMBIENT FLOAT ANIMATION (HARDWARE ACCELERATED) --- */
        .party-fs-bg {
            animation: ambientFloat 32s ease-in-out infinite alternate;
        }
        @keyframes ambientFloat {
            0%   { transform: scale(1.05) translate3d(0%, 0%, 0); }
            33%  { transform: scale(1.14) translate3d(2%, -1.5%, 0); }
            66%  { transform: scale(1.08) translate3d(-1.5%, 1%, 0); }
            100% { transform: scale(1.12) translate3d(1%, 2%, 0); }
        }
        @keyframes burstParticle {
            0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
            100% { transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) scale(0); opacity: 0; }
        }
        
        .btn-icon {
            filter: drop-shadow(0 2px 5px rgba(0,0,0,0.5));
        }
        .party-title, .party-artist, .progress-container, .volume-container, #fs-clock {
            text-shadow: 0 2px 10px rgba(0,0,0,0.5);
        }

        /* --- RESPONSIVE LAYOUT --- */
        @media (max-width: 1100px) {
            #party-fs-overlay {
                grid-template-columns: 1.4fr 1.8fr 1fr;
            }
            .party-cover {
                width: 34vh;
                height: 34vh;
            }
        }
        @media (max-width: 860px) {
            #party-fs-overlay {
                grid-template-columns: 1.2fr 1fr !important;
            }
            #party-fs-overlay.lyrics-collapsed,
            #party-fs-overlay.lyrics-off,
            #party-fs-overlay.no-lyrics {
                grid-template-columns: 1fr 0px !important;
            }
            .col-queue { display: none; }
            .party-clock { font-size: 1.6rem; top: 30px; }
            #fs-close-btn { top: 25px; left: 25px; width: 42px; height: 42px; }
        }
        @media (max-width: 560px) {
            #party-fs-overlay {
                grid-template-columns: 1fr !important;
            }
            .col-lyrics { display: none; }
            .col-player { border-right: none; }
        }

        /* --- REDUCED MOTION (accessibility / weak GPUs) --- */
        @media (prefers-reduced-motion: reduce) {
            .party-fs-bg,
            .party-fs-bg.active-bg {
                animation: none !important;
                transition: opacity 0.3s ease !important;
                filter: blur(150px) brightness(var(--bg-brightness, 0.4)) saturate(1.4);
            }
            .particle,
            .bridge-particles .particle {
                animation: none !important;
                opacity: 0.35 !important;
            }
            .sparkle-burst-container { display: none !important; }
            .lyrics-scroll-container { transition-duration: 0.01ms !important; }
            .lyric-line { transition-duration: 0.01ms !important; filter: none !important; }
            .progress-bar-fill, .volume-bar-fill { transition: background 1s ease !important; }
            .glow-wrap, .party-queue-item, .party-queue-info { animation: none !important; }
            .party-queue-item.current .eq-bars .bar {
                animation: none !important;
                height: 60% !important;
            }
            @keyframes currentSongGlow {
                0%, 100% { opacity: 1; box-shadow: none; }
            }
        }
    `;
    document.head.appendChild(style);

    overlay.innerHTML = `
        <button id="fs-close-btn" title="Schließen"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>
        <div id="party-fs-bg1" class="party-fs-bg active-bg"></div>
        <div id="party-fs-bg2" class="party-fs-bg"></div>
        <div class="party-clock" id="fs-clock">00:00</div>
        <div class="col-player" id="p-col"></div>
        <div class="col-lyrics" id="l-col">
            <div class="no-lyrics-hint" id="no-lyric-msg">Lade Lyrics...</div>
            <div class="lyrics-scroll-container" id="lyrics-box"></div>
            <div class="instrumental-break-pill" id="instrumental-pill"><span>🎤</span><span id="instrumental-text">Gesangspause: 5s</span></div>
        </div>
        <div class="col-queue" id="q-col"></div>
    `;

    document.getElementById("fs-close-btn").addEventListener("click", () => {
        if (typeof toggleFullscreen === "function") {
            toggleFullscreen();
        } else {
            overlay.classList.remove("active");
        }
    });

    const pCol = document.getElementById("p-col");
    const qCol = document.getElementById("q-col");
    const lCol = document.getElementById("l-col");
    const lyricsBox = document.getElementById("lyrics-box");
    const noLyricMsg = document.getElementById("no-lyric-msg");
    const fsClock = document.getElementById("fs-clock");
    const instrumentalPillEl = document.getElementById("instrumental-pill");
    const instrumentalTextEl = document.getElementById("instrumental-text");
    
    let activeBgIndex = 1;
    function updateBackground(coverUrl) {
        const bg1 = document.getElementById("party-fs-bg1");
        const bg2 = document.getElementById("party-fs-bg2");
        if (!bg1 || !bg2) return;
        
        const img = new Image();
        img.onload = () => {
            if (activeBgIndex === 1) {
                bg2.style.backgroundImage = `url("${coverUrl}")`;
                bg2.classList.add("active-bg");
                bg1.classList.remove("active-bg");
                activeBgIndex = 2;
            } else {
                bg1.style.backgroundImage = `url("${coverUrl}")`;
                bg1.classList.add("active-bg");
                bg2.classList.remove("active-bg");
                activeBgIndex = 1;
            }
        };
        img.src = coverUrl;
    }

    // Smoothly collapses the lyrics column: fades content first, then collapses the grid
    function collapseToNoLyrics(reason = "no-lyrics") {
        overlay.classList.add("lyrics-hiding");
        setTimeout(() => {
            overlay.classList.remove("lyrics-hiding");
            if (reason === "off") {
                overlay.classList.add("lyrics-off");
            } else {
                overlay.classList.add("lyrics-collapsed");
                overlay.classList.add("no-lyrics");
            }
            overlay.classList.remove("lyrics-off" === reason ? "lyrics-collapsed" : "lyrics-off");
        }, 450);
    }

    function updateKaraokeBtnVisibility() {
        const btn = document.getElementById("btn-karaoke-toggle");
        const ambientBtn = document.getElementById("btn-ambient-toggle");
        if (btn) {
            const show = lyricsEnabled && isLyricsSynced;
            btn.style.opacity = show ? "1" : "0";
            btn.style.pointerEvents = show ? "auto" : "none";
            btn.style.transform = show ? "scale(1)" : "scale(0.8)";
            btn.style.maxWidth = show ? "44px" : "0px";
            if (ambientBtn) {
                ambientBtn.style.borderRadius = show ? "22px 4px 4px 22px" : "22px";
            }
        }
    } 
    let currentLyricsLines = [];
    let lastActiveLyricIndex = -1;
    let activeWordEls = [];
    let lastTimeStr = "";
    let currentTrackURI = null;
    let currentCoverUrl = null;
    let lastQueueHash = "";
    
    let isSkipping = false;
    let isDraggingVolume = false; 
    let isDraggingProgress = false; 
    let dragProgressPercentage = 0;
    let lockProgressUpdate = false; 
    let lastSeekMs = -1;
    let lastSeekTimestamp = 0;
    let autoScrollTimeout;
    let lastVolume = 0.5;
    let idleTimer = null;
    let lastInstrumentalSec = -1;
    
    let uiEls = {};

    let clockTimer, queueTimer, animationHandle;

    function resetIdleTimer() {
        if (!overlay.classList.contains("active")) return;
        overlay.classList.remove("idle-hidden");
        clearTimeout(idleTimer);
        idleTimer = setTimeout(() => {
            if (overlay.classList.contains("active") && !isDraggingProgress && !isDraggingVolume) {
                overlay.classList.add("idle-hidden");
            }
        }, 3500);
    }

    const onPlayerStateChange = () => syncControlStates();
    const onSongChange = () => {
        syncControlStates();
        syncQueuePoller();
    };

    function startTimers() {
        if (!clockTimer) clockTimer = setInterval(updateClock, 1000);
        if (!queueTimer) queueTimer = setInterval(syncQueuePoller, 2500);
        if (!animationHandle) animationLoop();
        resetIdleTimer();
        
        if (Spicetify.Player) {
            Spicetify.Player.addEventListener("onplaypause", onPlayerStateChange);
            Spicetify.Player.addEventListener("songchange", onSongChange);
        }
    }

    function stopTimers() {
        if (clockTimer) clearInterval(clockTimer);
        if (queueTimer) clearInterval(queueTimer);
        if (animationHandle) cancelAnimationFrame(animationHandle);
        clearTimeout(idleTimer);
        overlay.classList.remove("idle-hidden");
        clockTimer = queueTimer = animationHandle = null;
        
        if (Spicetify.Player) {
            Spicetify.Player.removeEventListener("onplaypause", onPlayerStateChange);
            Spicetify.Player.removeEventListener("songchange", onSongChange);
        }
    }

    function escapeHtml(unsafe) {
        return (unsafe || "").toString()
             .replace(/&/g, "&amp;")
             .replace(/</g, "&lt;")
             .replace(/>/g, "&gt;")
             .replace(/"/g, "&quot;")
             .replace(/'/g, "&#039;");
    }

    function formatTime(ms) {
        ms = Math.max(0, Math.floor(ms || 0));
        const s = Math.floor((ms / 1000) % 60);
        const m = Math.floor(ms / 60000);
        if (m >= 60) {
            const h = Math.floor(m / 60);
            return `${h}:${String(m % 60).padStart(2, "0")}:${s < 10 ? "0" : ""}${s}`;
        }
        return `${m}:${s < 10 ? "0" : ""}${s}`;
    }

    function getTrackInfo() {
        if (!Player.data?.item && !Player.data?.track) return null;
        
        const item = Player.data?.item;
        const track = Player.data?.track;

        if (item && item.name) {
            const artists = item.artists ? item.artists.map(a => ({ name: a.name, uri: a.uri || "" })) : [];
            return {
                title: item.name,
                artists: artists,
                cover: item.album?.images?.[0]?.url || "",
                uri: item.uri,
                albumUri: item.album?.uri || ""
            };
        } else if (track && track.metadata) {
            let artists = [];
            if (track.artists && track.artists.length > 0) {
                artists = track.artists.map(a => ({ name: a.name || a.title || "Unbekannt", uri: a.uri || "" }));
            } else if (track.metadata?.artist_name) {
                artists = [{ name: track.metadata.artist_name, uri: track.metadata.artist_uri || "" }];
            }
            return {
                title: track.metadata.title || track.name || "Unbekannt",
                artists: artists,
                cover: track.metadata.image_url || getQueueCover(track) || "",
                uri: track.uri || track.id || "",
                albumUri: track.metadata.album_uri || track.album?.uri || ""
            };
        }
        return null;
    }

    function initCoverTilt() {
        const wrap = document.getElementById("cover-wrap");
        const cover = document.getElementById("p-cover");
        if (!wrap || !cover) return;

        wrap.onmousemove = (e) => {
            const rect = wrap.getBoundingClientRect();
            const x = e.clientX - rect.left - (rect.width / 2);
            const y = e.clientY - rect.top - (rect.height / 2);
            const tiltX = (y / (rect.height / 2)) * -8;
            const tiltY = (x / (rect.width / 2)) * 8;
            cover.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.025)`;
        };

        wrap.onmouseleave = () => {
            cover.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)`;
        };
    }

    function triggerSparkleBurst() {
        const wrap = document.getElementById("cover-wrap");
        if (!wrap) return;

        const burst = document.createElement("div");
        burst.className = "sparkle-burst-container";
        burst.style.cssText = "position:absolute; width:100%; height:100%; pointer-events:none; z-index:20;";

        for (let i = 0; i < 20; i++) {
            const p = document.createElement("div");
            const angle = (i / 20) * Math.PI * 2;
            const dist = Math.random() * 110 + 90;
            const tx = Math.cos(angle) * dist;
            const ty = Math.sin(angle) * dist;
            const size = Math.random() * 5 + 3;
            
            p.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                width: ${size}px;
                height: ${size}px;
                border-radius: 50%;
                background: var(--party-primary);
                box-shadow: 0 0 10px var(--party-primary);
                transform: translate(-50%, -50%);
                animation: burstParticle 0.85s ease-out forwards;
                --tx: ${tx}px;
                --ty: ${ty}px;
            `;
            burst.appendChild(p);
        }
        wrap.appendChild(burst);
        setTimeout(() => burst.remove(), 900);
    }

    function buildPlayerUI() {
        const trackInfo = getTrackInfo();
        if (!trackInfo) return;

        updateBackground(trackInfo.cover);

        const isPlayingNow = typeof Player.isPlaying === "function" ? Player.isPlaying() : !Player.data?.isPaused;

        pCol.innerHTML = `
            <div class="ambient-btn-container">
                <button class="btn-ambient-top ${ambientEnabled ? 'btn-active' : ''}" id="btn-ambient-toggle" title="Ambiente Glow" style="border-radius: ${lyricsEnabled && isLyricsSynced ? '22px 4px 4px 22px' : '22px'};">${Icons.ambient}</button>
                <button class="btn-ambient-top ${isKaraokeEnabled ? 'btn-active' : ''}" id="btn-karaoke-toggle" title="Karaoke Modus" style="transition: all 0.4s ease; overflow: hidden; opacity: ${lyricsEnabled && isLyricsSynced ? 1 : 0}; pointer-events: ${lyricsEnabled && isLyricsSynced ? 'auto' : 'none'}; transform: scale(${lyricsEnabled && isLyricsSynced ? 1 : 0.8}); max-width: ${lyricsEnabled && isLyricsSynced ? '44px' : '0px'};">${Icons.karaoke}</button>
            </div>

            <div class="party-cover-wrapper" id="cover-wrap">
                <img class="party-cover ${isPlayingNow ? 'is-playing' : ''}" id="p-cover" src="${trackInfo.cover}" alt="Cover">
            </div>
            
            <div class="party-meta">
                <div class="scroll-wrap">
                    <div class="party-title" id="p-title" onclick="Spicetify.Platform.History.push('${(trackInfo.albumUri || trackInfo.uri).replace('spotify:', '/').replace(/:/g, '/')}'); document.getElementById('party-fs-overlay').classList.remove('active');" style="cursor: pointer;" title="Zum Album gehen">${escapeHtml(trackInfo.title)}<div class="party-title-eq ${isPlayingNow ? '' : 'paused'}" id="p-title-eq"><span></span><span></span><span></span></div></div>
                </div>
                <div class="scroll-wrap">
                    <div class="party-artist" id="p-artist">
                        ${trackInfo.artists && trackInfo.artists.length > 0 
                            ? trackInfo.artists.map((a, idx) => {
                                const separator = idx < trackInfo.artists.length - 1 ? '<span style="color: rgba(255,255,255,0.6); pointer-events: none;">, </span>' : '';
                                return `<span class="artist-link" onclick="if('${a.uri}') { Spicetify.Platform.History.push('${a.uri}'.replace('spotify:', '/').replace(/:/g, '/')); document.getElementById('party-fs-overlay').classList.remove('active'); }" title="Zum Künstler gehen">${escapeHtml(a.name)}</span>${separator}`;
                            }).join("")
                            : "Unbekannt"
                        }
                    </div>
                </div>
            </div>
            
            <div class="progress-container">
                <span id="p-current-time">0:00</span>
                <div class="progress-bar-bg" id="p-bar">
                    <div class="progress-tooltip" id="p-tooltip">0:00</div>
                    <div class="progress-bar-fill" id="p-fill"></div>
                </div>
                <span id="p-total-time">${formatTime(Player.getDuration())}</span>
            </div>
            
            <div class="party-controls">
                <button class="btn-icon" id="btn-shuffle">${Icons.shuffle}</button>
                <button class="btn-icon" id="btn-prev">${Icons.prev}</button>
                <button class="btn-icon btn-main" id="btn-play">${Icons.play}</button>
                <button class="btn-icon" id="btn-next">${Icons.next}</button>
                <button class="btn-icon" id="btn-repeat">${Icons.repeat}</button>
                <button class="btn-icon ${lyricsEnabled ? 'btn-active' : ''}" id="btn-lyric-toggle" title="Lyrics Toggle">${Icons.lyrics}</button>
            </div>
            
            <div class="volume-container">
                <span class="vol-icon" id="btn-mute" style="display:flex;align-items:center;justify-content:center;">${Icons.volHigh}</span>
                <div class="volume-bar-bg" id="v-bar">
                    <div class="volume-tooltip" id="v-tooltip">0%</div>
                    <div class="volume-bar-fill" id="v-fill"></div>
                </div>
            </div>
        `;

        initCoverTilt();

        setTimeout(() => {
            ["p-title", "p-artist"].forEach(id => {
                const el = document.getElementById(id);
                if (el) {
                    const wrap = el.parentElement;
                    if (el.scrollWidth > wrap.clientWidth) {
                        wrap.classList.add("is-scrolling");
                        const dist = (el.scrollWidth - wrap.clientWidth) + Math.round(wrap.clientWidth * 0.15);
                        const duration = dist / 35;
                        el.style.setProperty("--scroll-dist", `-${dist}px`);
                        el.style.setProperty("--scroll-dur", `${duration}s`);
                    }
                }
            });
        }, 50);

        document.getElementById("btn-shuffle").onclick = () => { 
            Player.toggleShuffle(); 
            setTimeout(syncControlStates, 50); 
            // Spotify needs varying time to re-sort the queue after shuffle toggle
            setTimeout(() => { lastQueueHash = ""; syncQueuePoller(); }, 250);
            setTimeout(() => { lastQueueHash = ""; syncQueuePoller(); }, 600);
            setTimeout(() => { lastQueueHash = ""; syncQueuePoller(); }, 1200);
            setTimeout(() => { lastQueueHash = ""; buildQueueUI(); }, 2000);
        };
        
        document.getElementById("btn-prev").onclick = () => {
            if (typeof Player.back === "function") Player.back(); 
            else Player.previous();
        };
        
        document.getElementById("btn-next").onclick = () => Player.next();
        document.getElementById("btn-play").onclick = () => { 
            const btnPlay = document.getElementById("btn-play");
            if (btnPlay && btnPlay.dataset.toggling === "true") return;
            
            const isPaused = typeof Player.isPlaying === "function" ? !Player.isPlaying() : Player.data?.isPaused;
            if (btnPlay) {
                btnPlay.innerHTML = isPaused ? Icons.pause : Icons.play; 
                btnPlay.dataset.toggling = "true";
            }
            Player.togglePlay(); 
            setTimeout(() => {
                if (btnPlay) btnPlay.dataset.toggling = "false";
                syncControlStates();
            }, 800); 
        };
        document.getElementById("btn-repeat").onclick = () => { Player.toggleRepeat(); setTimeout(syncControlStates, 50); };
        
        document.getElementById("btn-lyric-toggle").onclick = () => {
            lyricsEnabled = !lyricsEnabled;
            localStorage.setItem("party_fs_lyrics", lyricsEnabled.toString());
            document.getElementById("btn-lyric-toggle").classList.toggle("btn-active", lyricsEnabled);
            updateKaraokeBtnVisibility();
            if (!lyricsEnabled) {
                overlay.classList.add("lyrics-collapsed");
                overlay.classList.add("lyrics-off");
                overlay.classList.remove("no-lyrics");
                noLyricMsg.innerHTML = lyricsOffHTML;
            } else {
                fetchAndRenderLyrics();
            }
        };

        document.getElementById("btn-ambient-toggle").onclick = () => {
            ambientEnabled = !ambientEnabled;
            localStorage.setItem("party_fs_ambient", ambientEnabled.toString());
            document.getElementById("btn-ambient-toggle").classList.toggle("btn-active", ambientEnabled);
            overlay.classList.toggle("ambient-off", !ambientEnabled);
        };
        const kBtn = document.getElementById("btn-karaoke-toggle");
        if (kBtn) {
            kBtn.onclick = () => {
                isKaraokeEnabled = !isKaraokeEnabled;
                localStorage.setItem("party_fs_karaoke", isKaraokeEnabled.toString());
                kBtn.classList.toggle("btn-active", isKaraokeEnabled);
            };
        }

        const pBar = document.getElementById("p-bar");
        
        pBar.onmousemove = (e) => {
            const rect = pBar.getBoundingClientRect();
            let percentage = (e.clientX - rect.left) / rect.width;
            percentage = Math.max(0, Math.min(1, percentage));
            const targetMs = percentage * Player.getDuration();
            const pTooltip = document.getElementById("p-tooltip");
            if (pTooltip) {
                pTooltip.innerText = formatTime(targetMs);
                pTooltip.style.left = `${percentage * 100}%`;
            }
        };

        pBar.onmousedown = (e) => {
            isDraggingProgress = true;
            pBar.classList.add("dragging");
            lockProgressUpdate = true; 
            resetIdleTimer();
            
            const rect = pBar.getBoundingClientRect();
            let percentage = (e.clientX - rect.left) / rect.width;
            percentage = Math.max(0, Math.min(1, percentage));
            dragProgressPercentage = percentage;
            
            const fill = document.getElementById("p-fill");
            const curTimeText = document.getElementById("p-current-time");
            if (fill) fill.style.transform = `scaleX(${percentage})`;
            if (curTimeText) curTimeText.innerText = formatTime(percentage * Player.getDuration());
        };

        const vBar = document.getElementById("v-bar");
        vBar.onmousedown = (e) => {
            isDraggingVolume = true;
            resetIdleTimer();
            const vTooltip = document.getElementById("v-tooltip");
            if (vTooltip) vTooltip.style.opacity = "1"; 
            
            const rect = vBar.getBoundingClientRect();
            let percentage = (e.clientX - rect.left) / rect.width;
            percentage = Math.max(0, Math.min(1, percentage));
            Player.setVolume(percentage);
            
            const vFill = document.getElementById("v-fill");
            if (vFill) vFill.style.transform = `scaleX(${percentage})`;
            if (vTooltip) {
                vTooltip.innerText = `${Math.round(percentage * 100)}%`;
                vTooltip.style.left = `${percentage * 100}%`;
            }
            setTimeout(syncControlStates, 10);
        };

        document.getElementById("btn-mute").onclick = () => {
            const currentVol = Player.getVolume();
            if (currentVol > 0) {
                lastVolume = currentVol;
                Player.setVolume(0);
            } else {
                Player.setVolume(lastVolume > 0 ? lastVolume : 0.5);
            }
            setTimeout(syncControlStates, 50);
        };

        uiEls = {
            btnPlay: document.getElementById("btn-play"),
            btnShuffle: document.getElementById("btn-shuffle"),
            btnRepeat: document.getElementById("btn-repeat"),
            vFill: document.getElementById("v-fill"),
            vIcon: document.getElementById("btn-mute"),
            vTooltip: document.getElementById("v-tooltip"),
            pFill: document.getElementById("p-fill"),
            pTime: document.getElementById("p-current-time"),
            pBar: document.getElementById("p-bar"),
            vBar: document.getElementById("v-bar"),
            pCover: document.getElementById("p-cover")
        };

        syncControlStates();
    }

    function updateMarquee() {
        if (!overlay.classList.contains("active")) return;
        ["p-title", "p-artist"].forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                const wrap = el.parentElement;
                if (wrap.dataset.checked !== el.innerText) {
                    wrap.classList.remove("is-scrolling");
                    el.style.animation = 'none';
                    
                    void el.offsetWidth;
                    
                    if (el.scrollWidth > wrap.clientWidth) {
                        wrap.classList.add("is-scrolling");
                        const dist = (el.scrollWidth - wrap.clientWidth) + Math.round(wrap.clientWidth * 0.15);
                        const duration = dist / 35;
                        
                        el.style.setProperty("--scroll-dist", `-${dist}px`);
                        el.style.setProperty("--scroll-dur", `${duration}s`);
                        el.style.animation = '';
                    }
                    wrap.dataset.checked = el.innerText;
                }
            }
        });
    }

    function renderLyrics(lines) {
        if (!lines || lines.length === 0) {
            noLyricMsg.innerHTML = noLyricsHTML;
            overlay.classList.add("lyrics-collapsed");
            overlay.classList.add("no-lyrics");
            overlay.classList.remove("lyrics-off");
            return;
        }

        currentLyricsLines = lines.map((line, index) => {
            const startMs = parseInt(line.startTimeMs || line.time, 10) || 0;
            let endMs = parseInt(line.endTimeMs, 10);
            if (!endMs || isNaN(endMs)) {
                if (index + 1 < lines.length) {
                    endMs = parseInt(lines[index + 1].startTimeMs || lines[index + 1].time, 10) || (startMs + 4000);
                } else {
                    endMs = startMs + 4000;
                }
            }
            return { ...line, startMs, endMs };
        });
        const hasTimestamps = currentLyricsLines.some(line => line.startMs > 0);
        isLyricsSynced = hasTimestamps;
        updateKaraokeBtnVisibility();

        let html = "";
        lines.forEach((line, index) => {
            const words = (line.words || line.text || "").trim();
            if (words) {
                const styleClass = !isLyricsSynced ? "lyric-line unsynced-style" : "lyric-line";
                const ms = parseInt(line.startTimeMs, 10) || parseInt(line.time, 10) || 0;
                const wordSpans = words.split(" ").map(w => `<span class="lyric-word">${w}</span>`).join(" ");
                html += `<div class="${styleClass}" id="lyric-${index}" data-ms="${ms}">${wordSpans}</div>`;
            }
        });

        if (html !== "") {
            lyricsBox.innerHTML = html;
            lyricsBox.style.transform = "translateY(0px)";
            // Fade in the new lyrics
            lyricsBox.style.opacity = "0";
            lyricsBox.style.transition = "opacity 0.35s ease";
            requestAnimationFrame(() => {
                lyricsBox.style.opacity = "1";
                setTimeout(() => { lyricsBox.style.transition = ""; }, 400);
            });
            noLyricMsg.style.display = "none";
            overlay.classList.remove("lyrics-collapsed");
            overlay.classList.remove("no-lyrics");
            overlay.classList.remove("lyrics-off");

            if (isLyricsSynced) {
                lyricsBox.querySelectorAll(".lyric-line").forEach((el) => {
                    el.onclick = () => {
                        const targetMs = parseInt(el.getAttribute("data-ms"), 10);
                        Player.seek(targetMs);
                        lastSeekMs = targetMs;
                        lastSeekTimestamp = Date.now();
                        lockProgressUpdate = true;
                    };
                });
            } else {
                lyricsBox.classList.add("unsynced-linear");
            }
        } else {
            lyricsBox.style.opacity = "";
            lyricsBox.style.transition = "";
            noLyricMsg.innerHTML = noLyricsHTML;
            overlay.classList.add("no-lyrics");
        }
    }

    async function fetchAndRenderLyrics() {
        if (!lyricsEnabled) {
            overlay.classList.add("lyrics-off");
            noLyricMsg.innerHTML = lyricsOffHTML;
            updateKaraokeBtnVisibility();
            return;
        }

        // Mark the old lyrics as "loading" by fading them out subtly
        // but keep them visible until new ones arrive
        lyricsBox.style.transition = "opacity 0.3s ease";
        lyricsBox.style.opacity = "0.3";
        noLyricMsg.style.display = "none";

        currentLyricsLines = [];
        lastActiveLyricIndex = -1;
        activeWordEls = [];
        isLyricsSynced = false;
        lyricsBox.classList.remove("unsynced-linear");
        // Do NOT collapse or clear yet – keep old lyrics dimmed during load

        const trackInfo = getTrackInfo();
        if (!trackInfo || !trackInfo.uri) {
            lyricsBox.innerHTML = "";
            lyricsBox.style.opacity = "";
            lyricsBox.style.transition = "";
            collapseToNoLyrics();
            noLyricMsg.innerHTML = noLyricsHTML;
            noLyricMsg.style.display = "block";
            return;
        }

        // Try Platform LyricsAPI first
        try {
            if (Spicetify.Platform?.LyricsAPI) {
                const data = await Spicetify.Platform.LyricsAPI.getLyrics(trackInfo.uri);
                const lines = data?.lyrics?.lines || data?.lines || [];
                if (lines.length > 0) {
                    renderLyrics(lines);
                    return;
                }
            }
        } catch (e) {
            console.warn("Platform LyricsAPI failed, trying Cosmos color-lyrics fallback...", e);
        }

        // Fallback to Cosmos color-lyrics API
        try {
            const trackId = trackInfo.uri.split(":")[2];
            if (Spicetify.CosmosAsync) {
                const lyricsData = await Spicetify.CosmosAsync.get(`https://spclient.wg.spotify.com/color-lyrics/v2/track/${trackId}?format=json&vocalRemoval=false`);
                const lines = lyricsData?.lyrics?.lines || [];
                if (lines.length > 0) {
                    renderLyrics(lines);
                    return;
                }
            }
        } catch (e) {
            console.error("Cosmos color-lyrics fallback failed", e);
        }

        // No lyrics found
        lyricsBox.innerHTML = "";
        lyricsBox.style.opacity = "";
        lyricsBox.style.transition = "";
        noLyricMsg.innerHTML = noLyricsHTML;
        noLyricMsg.style.display = "block";
        collapseToNoLyrics();
        updateKaraokeBtnVisibility();
    }

    function getQueueCover(track) {
        return track?.contextTrack?.metadata?.image_url || 
               track?.metadata?.image_url || 
               track?.metadata?.image_xlarge_url || 
               track?.imageUri ||
               "https://i.scdn.co/image/ab67616d00001e028157053e8eb5bce5071d2b78";
    }

    async function removeQueueItem(uri, uid, queueIndex) {
        try {
            // Resolve the REAL uid from Spotify's queue – our "queue-item-N"
            // ids are DOM placeholders and are rejected by removeFromQueue.
            let realUid = uid && !String(uid).startsWith('queue-item-') ? uid : undefined;
            const q = Spicetify.Queue?.getQueue?.();
            const t = queueIndex > 0 ? q?.nextTracks?.[queueIndex - 1] : null;
            if (t?.uid) realUid = t.uid;
            await Spicetify.removeFromQueue([{ uri: uri, uid: realUid }]);
            setTimeout(buildQueueUI, 300);
        } catch(e) { console.error(e); }
    }

    function parseColorToRgb(colorStr) {
        if (!colorStr) return [200, 200, 200];
        if (colorStr.startsWith('#')) {
            const hex = colorStr.replace('#', '');
            const num = parseInt(hex, 16);
            return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
        }
        if (colorStr.startsWith('rgb')) {
            const matches = colorStr.match(/\d+/g);
            if (matches && matches.length >= 3) {
                return [parseInt(matches[0]), parseInt(matches[1]), parseInt(matches[2])];
            }
        }
        return [200, 200, 200];
    }

    function applyPrimaryColor(rawRgb) {
        const finalRgb = enforceMinimumBrightness(rawRgb);
        
        overlay.style.setProperty('--party-primary', `rgb(${finalRgb[0]}, ${finalRgb[1]}, ${finalRgb[2]})`);
        overlay.style.setProperty('--party-primary-10', `rgba(${finalRgb[0]}, ${finalRgb[1]}, ${finalRgb[2]}, 0.10)`);
        overlay.style.setProperty('--party-primary-15', `rgba(${finalRgb[0]}, ${finalRgb[1]}, ${finalRgb[2]}, 0.15)`);
        overlay.style.setProperty('--party-primary-20', `rgba(${finalRgb[0]}, ${finalRgb[1]}, ${finalRgb[2]}, 0.20)`);
        overlay.style.setProperty('--party-primary-40', `rgba(${finalRgb[0]}, ${finalRgb[1]}, ${finalRgb[2]}, 0.40)`);
        overlay.style.setProperty('--party-primary-60', `rgba(${finalRgb[0]}, ${finalRgb[1]}, ${finalRgb[2]}, 0.60)`);
        overlay.style.setProperty('--party-primary-80', `rgba(${finalRgb[0]}, ${finalRgb[1]}, ${finalRgb[2]}, 0.80)`);
        overlay.style.setProperty('--party-primary-rgb', `${finalRgb[0]}, ${finalRgb[1]}, ${finalRgb[2]}`);
    }

    function rgbToHsl(r, g, b) {
        r /= 255; g /= 255; b /= 255;
        let max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        if (max === min) { h = s = 0; }
        else {
            let d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        return [h * 360, s, l];
    }
    
    function hslToRgb(h, s, l) {
        let r, g, b;
        h /= 360;
        if (s === 0) { r = g = b = l; } 
        else {
            const hue2rgb = (p, q, t) => {
                if(t < 0) t += 1; if(t > 1) t -= 1;
                if(t < 1/6) return p + (q - p) * 6 * t;
                if(t < 1/2) return q;
                if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            };
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }
        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }

    // === NEW ROBUST QUEUE ANIMATION & COLOR EXTRACTION ===
    const queueColorCacheV4 = new Map();
    const MAX_CACHE_SIZE = 100;

    async function extractQueueCoverColor(imgSrc) {
        const fallbackColor = (() => {
            const curPrimary = overlay.style.getPropertyValue('--party-primary-rgb');
            if (curPrimary) {
                const parts = curPrimary.split(',').map(n => parseInt(n.trim(), 10));
                if (parts.length === 3 && !parts.some(isNaN)) return parts;
            }
            return [29, 185, 84];
        })();

        if (!imgSrc) return fallbackColor;
        if (queueColorCacheV4.has(imgSrc)) return queueColorCacheV4.get(imgSrc);

        let fetchSrc = imgSrc;
        if (fetchSrc.startsWith('spotify:image:')) fetchSrc = fetchSrc.replace('spotify:image:', 'https://i.scdn.co/image/');
        else if (fetchSrc.startsWith('spotify:mosaic:')) return fallbackColor;

        return new Promise((resolve) => {
            const timeout = setTimeout(() => resolve(fallbackColor), 2000);
            const img = new Image();
            img.crossOrigin = "Anonymous";
            img.onload = () => {
                const canvas = document.createElement("canvas");
                canvas.width = 50; canvas.height = 50;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, 50, 50);
                let data;
                try {
                    data = ctx.getImageData(0, 0, 50, 50).data;
                } catch (e) {
                    clearTimeout(timeout);
                    return resolve(fallbackColor);
                }
                
                let sumR = 0, sumG = 0, sumB = 0, validCount = 0;
                let fallbackR = 0, fallbackG = 0, fallbackB = 0, fallbackCount = 0;
                
                for (let i = 0; i < data.length; i += 4) {
                    const r = data[i], g = data[i+1], b = data[i+2];
                    if (r < 15 && g < 15 && b < 15) continue; // skip almost pure black
                    if (r > 240 && g > 240 && b > 240) continue; // skip almost pure white
                    
                    const max = Math.max(r, g, b);
                    const min = Math.min(r, g, b);
                    const chroma = max - min;
                    
                    // Simple average tracking as fallback
                    fallbackR += r; fallbackG += g; fallbackB += b;
                    fallbackCount++;
                    
                    // Ignore neutral grey/metallic background pixels entirely
                    // Only count pixels that are clearly colorful
                    if (chroma > 35) {
                        sumR += r;
                        sumG += g;
                        sumB += b;
                        validCount++;
                    }
                }
                
                let bestRgb;
                if (validCount > 0) {
                    bestRgb = [
                        Math.round(sumR / validCount),
                        Math.round(sumG / validCount),
                        Math.round(sumB / validCount)
                    ];
                } else if (fallbackCount > 0) {
                    bestRgb = [
                        Math.round(fallbackR / fallbackCount),
                        Math.round(fallbackG / fallbackCount),
                        Math.round(fallbackB / fallbackCount)
                    ];
                } else {
                    bestRgb = fallbackColor;
                }
                
                if (queueColorCacheV4.size >= MAX_CACHE_SIZE) {
                    const firstKey = queueColorCacheV4.keys().next().value;
                    queueColorCacheV4.delete(firstKey);
                }
                queueColorCacheV4.set(imgSrc, bestRgb);
                clearTimeout(timeout);
                resolve(bestRgb);
            };
            img.onerror = () => {
                clearTimeout(timeout);
                resolve(fallbackColor);
            };
            img.src = fetchSrc;
        });
    }

    async function applyQueueColor(uid, cover, nextCover, albumUri, nextAlbumUri) {
        const el = document.querySelector(`.party-queue-item[data-uid="${uid}"]`);
        if (!el) return;
        
        el.style.setProperty('--glow-color', 'transparent');
        el.style.setProperty('--next-glow-color', 'transparent');
        el.style.setProperty('--mix-color', 'transparent');
        
        if (!cover) return;
        
        try {
            let rgb = null;
            let nextRgbRaw = null;

            // Try native colorExtractor first to avoid CORS issues
            if (typeof Spicetify.colorExtractor === "function" && albumUri && albumUri.startsWith("spotify:")) {
                try {
                    const colors = await Spicetify.colorExtractor(albumUri);
                    const hex = colors?.VIBRANT || colors?.PROMINENT || colors?.LIGHT_VIBRANT;
                    if (hex) rgb = parseColorToRgb(hex);
                } catch (e) {
                    console.error("Spicetify colorExtractor failed", e);
                }
            }

            if (typeof Spicetify.colorExtractor === "function" && nextAlbumUri && nextAlbumUri.startsWith("spotify:")) {
                try {
                    const colors = await Spicetify.colorExtractor(nextAlbumUri);
                    const hex = colors?.VIBRANT || colors?.PROMINENT || colors?.LIGHT_VIBRANT;
                    if (hex) nextRgbRaw = parseColorToRgb(hex);
                } catch (e) {
                    console.error("Spicetify colorExtractor failed for next track", e);
                }
            }

            // Fallback to custom canvas extraction
            if (!rgb) rgb = await extractQueueCoverColor(cover);
            if (!nextRgbRaw) nextRgbRaw = nextCover ? await extractQueueCoverColor(nextCover) : rgb;
            
            const finalRgb = enforceMinimumBrightness(rgb);
            const finalNextRgb = enforceMinimumBrightness(nextRgbRaw);
            const mixRgb = enforceMinimumBrightness(getMixedColor(finalRgb, finalNextRgb));
            
            el.style.setProperty('--glow-color', `rgb(${finalRgb[0]}, ${finalRgb[1]}, ${finalRgb[2]})`);
            el.style.setProperty('--next-glow-color', `rgb(${finalNextRgb[0]}, ${finalNextRgb[1]}, ${finalNextRgb[2]})`);
            el.style.setProperty('--mix-color', `rgb(${mixRgb[0]}, ${mixRgb[1]}, ${mixRgb[2]})`);
            const glowbg = el.querySelector('.glow-bg');
            if (glowbg) glowbg.style.opacity = '0.75';
        } catch (e) {
            el.style.setProperty('--glow-color', 'transparent');
            el.style.setProperty('--next-glow-color', 'transparent');
            el.style.setProperty('--mix-color', 'transparent');
        }
    }    function getParticleHTML(isLast) {
        let html = '<div class="particles-container">';
        // Orbit particles (just existing around the cover)
        for(let i=0; i<15; i++) {
            const size = Math.random() * 4 + 1; // Zufällige Größe zwischen 1 und 5 Pixel
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * 20 + 28; // Größerer Radius (28 bis 48 Pixel)
            const startX = Math.cos(angle) * radius;
            const startY = Math.sin(angle) * radius;
            const dx = (Math.random() - 0.5) * 16; // Weiteres Driften (±8 Pixel)
            const dy = (Math.random() - 0.5) * 16; 
            const duration = Math.random() * 4 + 3;
            const delay = -(Math.random() * 5);
            html += `<div class="particle" style="width:${size}px;height:${size}px;left:50%;top:50%;margin-left:${startX}px;margin-top:${startY}px;--dx:${dx}px;--dy:${dy}px;animation: wobble ${duration}s infinite ${delay}s alternate ease-in-out;"></div>`;
        }
        html += '</div>';

        if (!isLast) {
            html += '<div class="bridge-particles">';
            // Connection particles flowing down
            for(let i=0; i<5; i++) {
                const size = Math.random() * 4 + 1; // Zufällige Größe zwischen 1 und 5 Pixel
                const sx = (Math.random() - 0.5) * 28;
                const ex = (Math.random() - 0.5) * 16;
                const duration = Math.random() * 2 + 1.5;
                const delay = -(Math.random() * 3);
                html += `<div class="particle" style="width:${size}px;height:${size}px;left:50%;top:0;margin-left:${sx}px;--sx:${sx}px;--ex:${ex}px;animation: flowDown ${duration}s infinite ${delay}s linear;"></div>`;
            }
            html += '</div>';
        }
        return html;    }

    function getMixedColor(rgb1, rgb2) {
        let hsl1 = rgbToHsl(...rgb1);
        let hsl2 = rgbToHsl(...rgb2);
        
        let mixH = (hsl1[0] + hsl2[0]) / 2;
        if (Math.abs(hsl1[0] - hsl2[0]) > 180) {
            mixH = (mixH + 180) % 360;
        }
        if (hsl1[1] < 0.15) mixH = hsl2[0];
        else if (hsl2[1] < 0.15) mixH = hsl1[0];

        let mixS = (hsl1[1] + hsl2[1]) / 2; 
        let mixL = Math.max(0.65, (hsl1[2] + hsl2[2]) / 2);
        
        return hslToRgb(mixH, mixS, mixL);
    }

    function enforceMinimumBrightness(rgb) {
        let hsl = rgbToHsl(...rgb);
        // Schwarz-Weiß / Monochrom Covers (Sättigung < 0.15) -> KEINE künstliche Farbe erzwingen!
        if (hsl[1] < 0.08) {
            hsl[1] = 0; // Reine Silber-Weiß Partikel
            if (hsl[2] < 0.7) hsl[2] = 0.75; // Helligkeit für gute Sichtbarkeit auf dunklem BG
        } else {
            // Farbige Covers: Mindesthelligkeit für Sichtbarkeit
            if (hsl[2] < 0.6) hsl[2] = 0.6;
        }
        return hslToRgb(hsl[0], hsl[1], hsl[2]);
    }    function buildQueueItemNode(track, offsetIndex, isCurrent, isLast) {
        if (!track) return "";
        const title = track.title || track.contextTrack?.metadata?.title || track.metadata?.title || track.name || "Unbekannt";
        const artist = track.artist || track.contextTrack?.metadata?.artist_name || track.metadata?.artist_name || track.artists?.[0]?.name || "Unbekannt";
        const cover = track.cover || getQueueCover(track);
        const uri = track.uri || track.contextTrack?.uri || track.id || "";
        const albumUri = track.albumUri || track.album?.uri || track.contextTrack?.metadata?.album_uri || track.metadata?.album_uri || uri;
        const uid = `queue-item-${offsetIndex}`;
        const realUid = track.uid || track.contextTrack?.uid || "";
        const durationMs = track.durationMs || track.duration?.milliseconds || (track.metadata?.duration ? parseInt(track.metadata.duration, 10) : 0) || track.contextTrack?.metadata?.duration;
        const durationHtml = durationMs ? `<span class="party-queue-duration">${formatTime(durationMs)}</span>` : '';
        
        return `
            <div class="party-queue-item ${isCurrent ? 'current' : 'clickable'}" data-index="${offsetIndex}" data-uri="${uri}" data-uid="${uid}" data-track-uid="${realUid}" data-cover-url="${cover}" data-album-uri="${albumUri}">
                <div class="queue-chain-graphics">
                    <div class="glow-wrap">
                        <div class="glow-bg"></div>
                        ${getParticleHTML(isLast)}
                        <img class="party-queue-cover" src="${cover}">
                    </div>
                </div>
                <div class="party-queue-info">
                    <div style="display:flex; align-items:center;">
                        <div class="party-queue-track">${escapeHtml(title)}</div>
                        ${isCurrent ? (() => {
                            const d1 = (0.9  + Math.random() * 0.5).toFixed(2);
                            const d2 = (1.2  + Math.random() * 0.6).toFixed(2);
                            const d3 = (1.05 + Math.random() * 0.55).toFixed(2);
                            return `<div class="eq-bars" title="Spielt jetzt" style="--eq-dur1:${d1}s;--eq-dur2:${d2}s;--eq-dur3:${d3}s"><span class="bar bar1"></span><span class="bar bar2"></span><span class="bar bar3"></span></div>`;
                        })() : ''}
                        ${durationHtml}
                    </div>
                    <div class="party-queue-artist">${escapeHtml(artist)}</div>
                </div>
            </div>`;
    }

    function showQueueContextMenu(e, uri, uid, offsetIndex, realUid) {
        e.preventDefault();
        let menu = document.getElementById('queue-context-menu');
        if (!menu) {
            menu = document.createElement('div');
            menu.id = 'queue-context-menu';
            menu.style.position = 'fixed';
            menu.style.background = '#282828';
            menu.style.border = '1px solid #404040';
            menu.style.borderRadius = '4px';
            menu.style.padding = '4px';
            menu.style.zIndex = '1000001';
            menu.style.minWidth = '150px';
            menu.style.boxShadow = '0 4px 12px rgba(0,0,0,0.5)';
            
            document.body.appendChild(menu);

            document.addEventListener('click', (ev) => {
                if (ev.target.closest('#queue-context-menu')) return;
                if (menu) menu.style.display = 'none';
            });
            document.addEventListener('contextmenu', (ev) => {
                if (!ev.target.closest('.party-queue-item')) {
                    if (menu) menu.style.display = 'none';
                }
            });
        }
        
        menu.innerHTML = '';
        
        const createBtn = (text, onClick) => {
            const btn = document.createElement('div');
            btn.innerText = text;
            btn.style.padding = '8px 12px';
            btn.style.cursor = 'pointer';
            btn.style.color = '#fff';
            btn.style.fontSize = '0.9rem';
            btn.style.borderRadius = '2px';
            btn.onmouseover = () => btn.style.background = 'rgba(255,255,255,0.1)';
            btn.onmouseout = () => btn.style.background = 'transparent';
            btn.onclick = () => {
                menu.style.display = 'none';
                onClick();
            };
            menu.appendChild(btn);
        };
        
        createBtn('Aus Queue entfernen', () => {
            if (!realUid) {
                if (Spicetify.showNotification) {
                    Spicetify.showNotification("Titel aus Playlists können nicht aus der Warteschlange gelöscht werden.");
                }
                return;
            }
            removeQueueItem(uri, realUid, offsetIndex);
        });
        
        createBtn('Allein auf Repeat spielen', async () => {
            try {
                if (Spicetify.Platform?.PlayerAPI?.play) {
                    await Spicetify.Platform.PlayerAPI.play({ uri: uri }, {}, {});
                }
                Spicetify.Player.setRepeat(2);
            } catch(err) { console.error(err); }
        });
        
        menu.style.left = `calc(${e.clientX}px - 160px)`;
        menu.style.top = `${e.clientY}px`;
        menu.style.display = 'block';
    }

    function buildQueueUI() {
        const trackInfo = getTrackInfo();
        const nextTracksRaw = Spicetify.Queue?.getQueue?.().nextTracks || Spicetify.Queue?.nextTracks || [];
        let html = '<div class="party-queue-wrapper">';
        
        const nextTracksFiltered = nextTracksRaw.filter(track => {
            const title = (track.title || track.name || track.contextTrack?.metadata?.title || track.metadata?.title || "").trim().toLowerCase();
            const artist = (track.artist || track.contextTrack?.metadata?.artist_name || track.metadata?.artist_name || (track.artists && track.artists[0]?.name) || "").trim().toLowerCase();
            return title !== "unbekannt" && artist !== "unbekannt" && title !== "" && artist !== "";
        });

        const nextFifty = nextTracksFiltered.slice(0, 25);
        
        if (trackInfo) html += buildQueueItemNode(trackInfo, 0, true, nextFifty.length === 0);

        nextFifty.forEach((track, index) => {
            const offset = index + 1;
            const isLast = (index === nextFifty.length - 1);
            html += buildQueueItemNode(track, offset, false, isLast);
        });
        
        html += '</div>';
        qCol.innerHTML = html;
        
        // Pre-load the first 10 songs for maximum speed
        if (trackInfo) {
            applyQueueColor(`queue-item-0`, trackInfo.cover || getQueueCover(trackInfo), nextFifty.length > 0 ? (nextFifty[0].cover || getQueueCover(nextFifty[0])) : null, trackInfo.albumUri || trackInfo.uri, nextFifty.length > 0 ? (nextFifty[0].albumUri || nextFifty[0].uri) : null);
            const firstItemEl = qCol.querySelector('.party-queue-item[data-uid="queue-item-0"]');
            if (firstItemEl) firstItemEl.setAttribute('data-color-loaded', 'true');
        }
        
        for (let index = 0; index < Math.min(10, nextFifty.length); index++) {
            const track = nextFifty[index];
            const isLast = (index === nextFifty.length - 1);
            const cover = track.cover || getQueueCover(track);
            const nextCover = isLast ? null : (nextFifty[index+1].cover || getQueueCover(nextFifty[index+1]));
            const uid = `queue-item-${index+1}`;
            applyQueueColor(uid, cover, nextCover, track.albumUri || track.uri, isLast ? null : (nextFifty[index+1].albumUri || nextFifty[index+1].uri));
            
            const itemEl = qCol.querySelector(`.party-queue-item[data-uid="${uid}"]`);
            if (itemEl) itemEl.setAttribute('data-color-loaded', 'true');
        }
        
        if (!queueObserver) {
            queueObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('in-view');
                        // Lazy-load colors when item becomes visible to prevent 50 simultaneous network requests
                        if (entry.target.getAttribute('data-color-loaded') !== 'true') {
                            entry.target.setAttribute('data-color-loaded', 'true');
                            const uid = entry.target.getAttribute('data-uid');
                            const cover = entry.target.getAttribute('data-cover-url');
                            const albumUri = entry.target.getAttribute('data-album-uri');
                            
                            // Look ahead for next cover (we can just select the next sibling in DOM)
                            const nextItem = entry.target.nextElementSibling;
                            const nextCover = nextItem ? nextItem.getAttribute('data-cover-url') : null;
                            const nextAlbumUri = nextItem ? nextItem.getAttribute('data-album-uri') : null;
                            
                            applyQueueColor(uid, cover, nextCover, albumUri, nextAlbumUri);
                        }
                    } else {
                        entry.target.classList.remove('in-view');
                    }
                });
            }, { root: null, rootMargin: "100px 0px" });
        } else {
            queueObserver.disconnect();
        }

        qCol.querySelectorAll('.party-queue-item').forEach(item => {
            queueObserver.observe(item);
            const isClickable = item.classList.contains('clickable');
            
            // Track / Artist Clicks disabled in queue as per user request
            
            // Context Menu
            item.oncontextmenu = (e) => {
                const offset = parseInt(item.getAttribute("data-index"), 10);
                showQueueContextMenu(e, item.getAttribute('data-uri'), item.getAttribute('data-uid'), offset, item.getAttribute('data-track-uid'));
            };

            item.onclick = async (e) => {
                if (e.target.tagName === 'BUTTON') return;
                if (isSkipping) return;
                resetIdleTimer();
                const offset = parseInt(item.getAttribute("data-index"), 10);
                if (isNaN(offset) || offset === 0) return;

                isSkipping = true;
                item.classList.add('slide-out');
                let prev = item.previousElementSibling;
                while (prev) {
                    prev.classList.add('slide-out');
                    prev = prev.previousElementSibling;
                }
                qCol.style.pointerEvents = "none";

                try {
                    const targetUri = item.getAttribute('data-uri');
                    const activeContext = Player.data?.context?.uri;
                    let directSuccess = false;

                    if (Spicetify.Platform?.PlayerAPI?.play && targetUri) {
                        try {
                            if (activeContext) {
                                await Spicetify.Platform.PlayerAPI.play({ uri: activeContext }, {}, { skipTo: { uri: targetUri } });
                            } else {
                                await Spicetify.Platform.PlayerAPI.play({ uri: targetUri }, {}, {});
                            }
                            directSuccess = true;
                        } catch (directErr) {
                            console.warn("Direct queue jump failed, using step fallback", directErr);
                        }
                    }

                    if (!directSuccess) {
                        for(let i = 0; i < offset; i++) {
                            Player.next();
                            if (offset > 1) await new Promise(r => setTimeout(r, 110));
                        }
                    }
                } finally {
                    qCol.style.pointerEvents = "auto";
                    isSkipping = false;
                }
            };

            // Context menu logic was moved up
        });
    }

    function centerCurrentQueueItem(smooth = false) {
        const currentEl = qCol.querySelector('.party-queue-item.current');
        if (currentEl) {
            const containerHeight = qCol.clientHeight;
            const elementOffset = currentEl.offsetTop;
            const elementHeight = currentEl.offsetHeight;
            const scrollPos = elementOffset - (containerHeight / 2) + (elementHeight / 2);

            if (smooth) {
                qCol.scrollTo({ top: scrollPos, behavior: 'smooth' });
            } else {
                qCol.scrollTop = scrollPos;
            }
        }
    }

    function syncControlStates() {
        if (!overlay.classList.contains("active")) return;
        
        const isPaused = typeof Player.isPlaying === "function" ? !Player.isPlaying() : Player.data?.isPaused;
        const shuffleActive = typeof Player.getShuffle === "function" ? Player.getShuffle() : Player.data?.shuffle;
        const repeatActive = typeof Player.getRepeat === "function" ? Player.getRepeat() : Player.data?.repeat;

        if (uiEls.btnPlay && uiEls.btnPlay.dataset.toggling !== "true") {
            const newIcon = isPaused ? Icons.play : Icons.pause;
            if (uiEls.btnPlay.innerHTML !== newIcon) uiEls.btnPlay.innerHTML = newIcon;
        }

        const titleEq = document.getElementById("p-title-eq");
        if (titleEq) {
            titleEq.classList.toggle("paused", isPaused);
        }

        if (uiEls.btnShuffle) {
            if (shuffleActive !== uiEls.btnShuffle.classList.contains("btn-active")) {
                uiEls.btnShuffle.classList.toggle("btn-active", shuffleActive);
            }
        }

        if (uiEls.btnRepeat) {
            const shouldBeActive = repeatActive > 0;
            if (shouldBeActive !== uiEls.btnRepeat.classList.contains("btn-active")) {
                uiEls.btnRepeat.classList.toggle("btn-active", shouldBeActive);
            }
            const newRepeat = repeatActive === 2 ? Icons.repeatOne : Icons.repeat;
            if (uiEls.btnRepeat.innerHTML !== newRepeat) uiEls.btnRepeat.innerHTML = newRepeat;
        }

        const currentVol = typeof Player.getVolume === "function" ? Player.getVolume() : 0.5;
        
        if (uiEls.vFill) {
            const newScale = `scaleX(${currentVol})`;
            if (uiEls.vFill.style.transform !== newScale) uiEls.vFill.style.transform = newScale;
        }
        
        if (uiEls.vTooltip && !isDraggingVolume) {
            const tooltipText = `${Math.round(currentVol * 100)}%`;
            if (uiEls.vTooltip.innerText !== tooltipText) uiEls.vTooltip.innerText = tooltipText;
            const tooltipLeft = `${currentVol * 100}%`;
            if (uiEls.vTooltip.style.left !== tooltipLeft) uiEls.vTooltip.style.left = tooltipLeft;
        }
        if (uiEls.vIcon) {
            let newVIcon = Icons.volHigh;
            if (currentVol === 0) newVIcon = Icons.volMute;
            else if (currentVol < 0.5) newVIcon = Icons.volLow;
            if (uiEls.vIcon.innerHTML !== newVIcon) uiEls.vIcon.innerHTML = newVIcon;
        }
        
        updateMarquee();
    }

    function fastTick() {
        if (!overlay.classList.contains("active")) return;
        
        let currentMs = Player.getProgress();
        const duration = Player.getDuration();
        
        if (lastSeekMs !== -1) {
            const isPaused = typeof Player.isPlaying === "function" ? !Player.isPlaying() : Player.data?.isPaused;
            const timeSinceSeek = Date.now() - lastSeekTimestamp;
            
            // If Spotify has caught up (reported progress is close to seek position), or 1.2s safety timeout passed
            if (Math.abs(currentMs - lastSeekMs) < 1000 || timeSinceSeek > 1200) {
                lastSeekMs = -1;
                lockProgressUpdate = false;
            } else {
                // Predict current progress
                currentMs = lastSeekMs + (isPaused ? 0 : timeSinceSeek);
                currentMs = Math.max(0, Math.min(duration, currentMs));
            }
        }
              if (!isDraggingProgress) {
            if (uiEls.pFill && uiEls.pTime && duration > 0) {
                const newScale = `scaleX(${currentMs / duration})`;
                if (uiEls.pFill.style.transform !== newScale) uiEls.pFill.style.transform = newScale;
                
                const newTime = formatTime(currentMs);
                if (lastTimeStr !== newTime) {
                    uiEls.pTime.innerText = newTime;
                    lastTimeStr = newTime;
                }
            }
        }

        if (currentLyricsLines.length > 0 && lyricsEnabled && !overlay.classList.contains("no-lyrics") && !overlay.classList.contains("lyrics-off")) {
            
            if (!isLyricsSynced) {
                const totalHeight = lyricsBox.scrollHeight;
                const viewHeight = lCol.clientHeight || window.innerHeight;
                
                if (duration > 0 && totalHeight > viewHeight) {
                    const scrollableDistance = totalHeight - (viewHeight / 2);
                    const currentProgressRatio = Math.max(0, Math.min(1, currentMs / duration));
                        
                    const calculatedOffset = scrollableDistance * currentProgressRatio;
                    lyricsBox.style.transform = `translateY(-${calculatedOffset}px)`;
                }
                return;
            }

            let activeIndex = lastActiveLyricIndex >= 0 ? lastActiveLyricIndex : 0;
            while (activeIndex + 1 < currentLyricsLines.length && currentMs >= currentLyricsLines[activeIndex + 1].startMs) {
                activeIndex++;
            }
            while (activeIndex >= 0 && currentMs < currentLyricsLines[activeIndex].startMs) {
                activeIndex--;
            }

            if (activeIndex !== -1 && activeIndex !== lastActiveLyricIndex) {
                const nextLineIndex = activeIndex + 1;
                for (let i = 0; i < currentLyricsLines.length; i++) {
                    const el = document.getElementById(`lyric-${i}`);
                    if (el) {
                        if (i < activeIndex) {
                            el.classList.add("past");
                            el.classList.remove("active", "next-up");
                        } else if (i === activeIndex) {
                            el.classList.add("active");
                            el.classList.remove("past", "next-up");
                        } else if (i === nextLineIndex) {
                            el.classList.add("next-up");
                            el.classList.remove("active", "past");
                        } else {
                            el.classList.remove("active", "past", "next-up");
                        }
                    }
                }

                const newActive = document.getElementById(`lyric-${activeIndex}`);
                if (newActive) {
                    activeWordEls = Array.from(newActive.querySelectorAll('.lyric-word'));
                    if (lCol) {
                        const lColHeight = lCol.clientHeight || window.innerHeight;
                        const offset = newActive.offsetTop + (newActive.offsetHeight / 2) - (lColHeight / 2);
                        lyricsBox.style.transform = `translateY(-${offset}px)`;
                    }
                } else {
                    activeWordEls = [];
                }
                lastActiveLyricIndex = activeIndex;
            }

            const instrumentalPill = instrumentalPillEl;
            const instrumentalText = instrumentalTextEl;
            if (activeIndex !== -1 && activeIndex + 1 < currentLyricsLines.length && isLyricsSynced) {
                const currentEnd = currentLyricsLines[activeIndex].endMs;
                const nextStart = currentLyricsLines[activeIndex + 1].startMs;
                const gap = nextStart - currentEnd;
                if (gap >= 5000 && currentMs > currentEnd && currentMs < nextStart) {
                    const remainSec = Math.ceil((nextStart - currentMs) / 1000);
                    if (remainSec !== lastInstrumentalSec) {
                        lastInstrumentalSec = remainSec;
                        if (instrumentalText) instrumentalText.innerText = `Gesangspause: ${remainSec}s`;
                    }
                    if (instrumentalPill) instrumentalPill.classList.add("active");
                } else {
                    lastInstrumentalSec = -1;
                    if (instrumentalPill) instrumentalPill.classList.remove("active");
                }
            } else {
                lastInstrumentalSec = -1;
                if (instrumentalPill) instrumentalPill.classList.remove("active");
            }
            
            if (activeIndex !== -1) {
                const currentLine = currentLyricsLines[activeIndex];
                const startTime = currentLine.startMs;
                const endTime = currentLine.endMs;
                
                if (endTime > startTime && isKaraokeEnabled) {
                    let fillPercent = (currentMs - startTime) / (endTime - startTime);
                    fillPercent = Math.max(0, Math.min(1, fillPercent));
                    
                    const totalWords = activeWordEls.length;
                    if (totalWords > 0) {
                        activeWordEls.forEach((wordEl, i) => {
                            const wordStart = i / totalWords;
                            const wordEnd = (i + 1) / totalWords;
                            let wordFill = 0;
                            if (fillPercent >= wordEnd) {
                                wordFill = 1;
                            } else if (fillPercent > wordStart) {
                                wordFill = (fillPercent - wordStart) / (wordEnd - wordStart);
                            }
                            const newFill = `${Math.round(wordFill * 100)}%`;
                            if (wordEl.dataset.fill !== newFill) {
                                wordEl.style.setProperty('--word-fill', newFill);
                                wordEl.dataset.fill = newFill;
                            }
                        });
                    }
                } else {
                    activeWordEls.forEach(w => {
                        if (w.dataset.fill !== '100%') {
                            w.style.setProperty('--word-fill', '100%');
                            w.dataset.fill = '100%';
                        }
                    });
                }
            }
        }

        const coverEl = uiEls.pCover || document.getElementById("p-cover");
        if (coverEl) {
            const isPlayingNow = typeof Player.isPlaying === "function" ? Player.isPlaying() : !Player.data?.isPaused;
            coverEl.classList.toggle("is-playing", isPlayingNow);
            const titleEq = document.getElementById("p-title-eq");
            if (titleEq) titleEq.classList.toggle("paused", !isPlayingNow);
        }
    }

    function syncQueuePoller() {
        if (isSkipping) return;
        
        const trackInfo = getTrackInfo();
        const currentUri = trackInfo?.uri || "";
        const nextTracks = Spicetify.Queue?.getQueue?.().nextTracks || Spicetify.Queue?.nextTracks || [];
        const nextUris = nextTracks.slice(0, 10).map(t => t.uri || t.id).join("");
        const newHash = currentUri + nextUris + (trackInfo?.cover || "");

        if (newHash !== lastQueueHash) {
            lastQueueHash = newHash;

            const activeContext = Player.data?.context?.uri || null;
            let isSongChange = false;
            let isCoverChange = false;
            
            if (trackInfo?.cover && trackInfo.cover !== currentCoverUrl) {
                isCoverChange = true;
            }
            
            if ((currentUri && currentUri !== currentTrackURI) || isCoverChange) {
                if (currentUri && currentUri !== currentTrackURI) {
                    isSongChange = true;
                }
                
                currentTrackURI = currentUri;
                currentCoverUrl = trackInfo?.cover;
                
                if (currentCoverUrl) {
                    const executeColorExtraction = async () => {
                        let rawRgb = null;
                        // Try Spicetify native colorExtractor first
                        const albumUri = trackInfo?.albumUri || '';
                        if (typeof Spicetify.colorExtractor === 'function' && albumUri && albumUri.startsWith('spotify:')) {
                            try {
                                const colors = await Spicetify.colorExtractor(albumUri);
                                const hex = colors?.VIBRANT || colors?.LIGHT_VIBRANT || colors?.PROMINENT;
                                if (hex) rawRgb = parseColorToRgb(hex);
                            } catch (e) {
                                console.error('colorExtractor failed for primary', e);
                            }
                        }
                        // Fallback to canvas extraction
                        if (!rawRgb) {
                            rawRgb = await extractQueueCoverColor(currentCoverUrl);
                        }
                        applyPrimaryColor(rawRgb);
                    };

                    executeColorExtraction();
                }

                if (overlay.classList.contains("active")) {
                    if (isSongChange) {
                        buildPlayerUI();
                        fetchAndRenderLyrics();
                        triggerSparkleBurst();
                    } else if (isCoverChange) {
                        const coverEl = document.querySelector(".party-cover");
                        if (coverEl) coverEl.src = trackInfo.cover;
                        updateBackground(trackInfo.cover);
                    }
                }
            }

            if (overlay.classList.contains("active")) {
                const firstItem = qCol.querySelector('.party-queue-item:first-child');
                if (isSongChange && firstItem) {
                    firstItem.classList.add('slide-out');
                    const siblings = Array.from(qCol.querySelectorAll('.party-queue-item')).slice(1);
                    siblings.forEach(el => el.classList.add('slide-up'));
                    setTimeout(() => {
                        buildQueueUI();
                        centerCurrentQueueItem(false);
                    }, 420);
                } else {
                    buildQueueUI();
                    centerCurrentQueueItem(false);
                }
            }
        }
    }

    function toggleFullscreen() {
        overlay.classList.toggle("active");
        if (overlay.classList.contains("active")) {
            const trackInfo = getTrackInfo();
            buildPlayerUI();
            buildQueueUI();
            fetchAndRenderLyrics();
            syncControlStates();
            updateClock();
            setTimeout(() => centerCurrentQueueItem(false), 50);
            startTimers();
            syncQueuePoller();
            resetIdleTimer();
        } else {
            stopTimers();
            clearTimeout(idleTimer);
            overlay.classList.remove("idle-hidden");
            // If the native route is still parked on the fullscreen page,
            // go back so Spotify doesn't sit on a dead route behind us.
            const p = Spicetify.Platform?.History?.location?.pathname || "";
            if (p.includes("/fullscreen") || p.includes("/npv")) {
                try { Spicetify.Platform.History.goBack(); } catch (_) { /* noop */ }
            }
        }
    }

    const onMouseMove = (e) => {
        if (overlay.classList.contains("active")) {
            resetIdleTimer();
        }

        if (isDraggingProgress) {
            if (uiEls.pBar) {
                const rect = uiEls.pBar.getBoundingClientRect();
                let percentage = (e.clientX - rect.left) / rect.width;
                percentage = Math.max(0, Math.min(1, percentage));
                dragProgressPercentage = percentage;
                
                if (uiEls.pFill) uiEls.pFill.style.transform = `scaleX(${percentage})`;
                if (uiEls.pTime) uiEls.pTime.innerText = formatTime(percentage * Player.getDuration());
            }
        }
        
        if (isDraggingVolume) {
            if (!uiEls.vBar || !uiEls.vFill || !uiEls.vTooltip) return;

            const rect = uiEls.vBar.getBoundingClientRect();
            let percentage = (e.clientX - rect.left) / rect.width;
            percentage = Math.max(0, Math.min(1, percentage));
            Player.setVolume(percentage);

            uiEls.vFill.style.transform = `scaleX(${percentage})`;
            uiEls.vTooltip.innerText = `${Math.round(percentage * 100)}%`;
            uiEls.vTooltip.style.left = `${percentage * 100}%`;
        }
    };

    const onMouseUp = () => {
        if (isDraggingProgress) {
            isDraggingProgress = false;
            if (uiEls.pBar) {
                uiEls.pBar.classList.remove("dragging");
                const duration = Player.getDuration();
                const targetMs = Math.max(0, Math.min(duration, dragProgressPercentage * duration));
                if (!isNaN(targetMs)) {
                    Player.seek(targetMs);
                    lastSeekMs = targetMs;
                    lastSeekTimestamp = Date.now();
                }
            }
        }
        
        if (isDraggingVolume) {
            isDraggingVolume = false;
            if (uiEls.vTooltip) uiEls.vTooltip.style.opacity = ""; 
        }
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);

    qCol.addEventListener("scroll", () => {
        resetIdleTimer();
        clearTimeout(autoScrollTimeout);
        autoScrollTimeout = setTimeout(() => {
            if (overlay.classList.contains("active") && !isSkipping) {
                centerCurrentQueueItem(true);
            }
        }, 6000); 
    });

    function updateClock() {
        const now = new Date();
        const newClock = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        if (fsClock && fsClock.innerText !== newClock) fsClock.innerText = newClock;
    }

    function animationLoop() {
        if (!overlay.classList.contains("active")) { animationHandle = null; return; }
        try {
            fastTick();
        } catch (err) {
            console.error("PartyFullscreen: fastTick error", err);
        }
        animationHandle = requestAnimationFrame(animationLoop);
    }

    window.PartyFullscreenToggle = toggleFullscreen;

    function isFsTarget(el) {
        if (!el) return false;
        const btn = el.closest("button, [data-testid*='fullscreen'], [aria-label*='Vollbild'], [aria-label*='Fullscreen'], [title*='Vollbild'], [title*='Fullscreen'], .main-nowPlayingWidget-fullscreenButton");
        if (!btn) return false;
        const targetBtn = btn.closest("button") || btn;
        const testId = (targetBtn.getAttribute("data-testid") || "").toLowerCase();
        const aria = (targetBtn.getAttribute("aria-label") || "").toLowerCase();
        const title = (targetBtn.getAttribute("title") || "").toLowerCase();
        const cls = (targetBtn.getAttribute("class") || "").toLowerCase();
        return testId.includes("fullscreen") || aria.includes("fullscreen") || aria.includes("vollbild") || title.includes("fullscreen") || title.includes("vollbild") || cls.includes("fullscreen") || cls.includes("npv");
    }

    const interceptFsEvent = (e) => {
        if (isFsTarget(e.target) && isPartyFsEnabled) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            if (e.type === "click") {
                toggleFullscreen();
            }
        }
    };

    document.addEventListener("click", interceptFsEvent, true);
    document.addEventListener("mousedown", interceptFsEvent, true);
    document.addEventListener("pointerdown", interceptFsEvent, true);

    let unlistenHistory = null;
    if (Spicetify.Platform?.History?.listen) {
        unlistenHistory = Spicetify.Platform.History.listen((location) => {
            if (location.pathname.includes("/fullscreen") || location.pathname.includes("/npv")) {
                if (isPartyFsEnabled && !overlay.classList.contains("active")) {
                    toggleFullscreen();
                }
            }
        });
    }

    const onFullscreenChange = () => {
        if (document.fullscreenElement && isPartyFsEnabled && !overlay.classList.contains("active")) {
            toggleFullscreen();
        }
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);

    const onKeyDown = (e) => {
        if (!overlay.classList.contains("active")) return;
        resetIdleTimer();

        if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;

        switch (e.key) {
            case "Escape":
                e.preventDefault();
                toggleFullscreen();
                break;
            case " ":
                e.preventDefault();
                Player.togglePlay();
                break;
            case "ArrowLeft":
                e.preventDefault();
                if (e.shiftKey) {
                    if (typeof Player.back === "function") Player.back();
                    else Player.previous();
                } else {
                    Player.seek(Math.max(0, Player.getProgress() - 5000));
                }
                break;
            case "ArrowRight":
                e.preventDefault();
                if (e.shiftKey) {
                    Player.next();
                } else {
                    Player.seek(Math.min(Player.getDuration(), Player.getProgress() + 5000));
                }
                break;
            case "ArrowUp":
                e.preventDefault();
                Player.setVolume(Math.min(1, Player.getVolume() + 0.05));
                break;
            case "ArrowDown":
                e.preventDefault();
                Player.setVolume(Math.max(0, Player.getVolume() - 0.05));
                break;
            case "m":
            case "M":
                e.preventDefault();
                document.getElementById("btn-mute")?.click();
                break;
            case "l":
            case "L":
                e.preventDefault();
                document.getElementById("btn-lyric-toggle")?.click();
                break;
            case "a":
            case "A":
                e.preventDefault();
                document.getElementById("btn-ambient-toggle")?.click();
                break;
            case "k":
            case "K":
                e.preventDefault();
                document.getElementById("btn-karaoke-toggle")?.click();
                break;
            case "s":
            case "S":
                e.preventDefault();
                document.getElementById("btn-shuffle")?.click();
                break;
            case "r":
            case "R":
                e.preventDefault();
                document.getElementById("btn-repeat")?.click();
                break;
        }
    };
    window.addEventListener("keydown", onKeyDown);

    window.__partyFsCleanup = () => {
        stopTimers();
        if (queueObserver) queueObserver.disconnect();
        document.removeEventListener("click", interceptFsEvent, true);
        document.removeEventListener("mousedown", interceptFsEvent, true);
        document.removeEventListener("pointerdown", interceptFsEvent, true);
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
        document.removeEventListener("fullscreenchange", onFullscreenChange);
        window.removeEventListener("keydown", onKeyDown);
        if (typeof unlistenHistory === "function") unlistenHistory();
        const el = document.getElementById("party-fs-overlay");
        if (el) el.remove();
        const styleEl = document.getElementById("party-fs-styles");
        if (styleEl) styleEl.remove();
    };
})();

