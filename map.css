/* ============================================================
   #Sorria — map page styles
   ============================================================ */

/* ------------------------------------------------------------
   hero
   ------------------------------------------------------------ */
.map-hero {
  padding: clamp(48px, 10vw, 96px) var(--gutter) clamp(32px, 6vw, 56px);
  max-width: var(--max);
  margin: 0 auto;
  position: relative;
}

.map-hero__inner { position: relative; }

.map-hero__headline {
  font-family: var(--display);
  font-weight: 500;
  font-size: clamp(36px, 8vw, 56px);
  line-height: 1.02;
  letter-spacing: -0.025em;
  color: var(--ink);
  margin: 12px 0 20px;
}

.map-hero__headline em {
  color: var(--smile-deep);
  font-style: italic;
}

.map-hero__sub {
  font-size: 15px;
  color: var(--ink-soft);
  max-width: 420px;
  margin-bottom: 32px;
}

/* live stats inline row */
.map-stats {
  display: flex;
  align-items: baseline;
  gap: 12px;
  flex-wrap: wrap;
}

.map-stat {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.map-stat__num {
  font-size: clamp(22px, 4vw, 28px);
  font-weight: 500;
  color: var(--ink);
  letter-spacing: -0.01em;
}

.map-stat__label {
  font-size: 12px;
  color: var(--ink-quiet);
}

.map-stat__sep {
  color: var(--ink-quiet);
  font-size: 18px;
  user-select: none;
}

/* ------------------------------------------------------------
   map container
   ------------------------------------------------------------ */
.map-section {
  position: relative;
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 var(--gutter);
}

#map {
  width: 100%;
  height: clamp(420px, 60vh, 640px);
  background: var(--paper-soft);
  border-radius: 4px;
  border: 0.5px solid var(--line);
  cursor: grab;
  position: relative;
  z-index: 1;
}

#map:active { cursor: grabbing; }

/* tweak leaflet's default attribution to fit the editorial style */
.leaflet-control-attribution {
  background: rgba(250, 248, 243, 0.85) !important;
  font-family: var(--body) !important;
  font-size: 9px !important;
  color: var(--ink-quiet) !important;
  padding: 2px 6px !important;
}
.leaflet-control-attribution a { color: var(--ink-soft) !important; }

/* style leaflet's zoom controls to match brand */
.leaflet-control-zoom {
  border: 0.5px solid var(--line) !important;
  border-radius: 4px !important;
  box-shadow: none !important;
  overflow: hidden;
}
.leaflet-control-zoom a {
  background: var(--paper) !important;
  color: var(--ink) !important;
  font-family: var(--body) !important;
  font-weight: 400 !important;
  border-bottom: 0.5px solid var(--line) !important;
  width: 32px !important;
  height: 32px !important;
  line-height: 32px !important;
}
.leaflet-control-zoom a:hover { background: var(--paper-soft) !important; }
.leaflet-control-zoom a:last-child { border-bottom: none !important; }

/* desaturate the map tiles to fit the editorial vibe */
.leaflet-tile-pane {
  filter: saturate(0.5) brightness(1.04) contrast(0.92);
}

/* dot markers (custom div icons) */
.smile-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #B58450;
  border: 1.5px solid var(--paper);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
  transform: translate(-50%, -50%);
  transition: transform 160ms cubic-bezier(0.2, 0.7, 0.2, 1);
}

.smile-dot--yours {
  background: var(--smile);
  width: 14px;
  height: 14px;
  box-shadow: 0 0 0 4px rgba(239, 159, 39, 0.18), 0 1px 3px rgba(0, 0, 0, 0.2);
}

.smile-dot--recent {
  animation: dot-pulse 2.4s ease-in-out infinite;
}

.leaflet-marker-icon:hover .smile-dot {
  transform: translate(-50%, -50%) scale(1.4);
}

/* popup styling — make Leaflet's popup feel editorial */
.leaflet-popup-content-wrapper {
  background: var(--paper) !important;
  color: var(--ink) !important;
  border-radius: 6px !important;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.12) !important;
  border: 0.5px solid var(--line) !important;
  padding: 0 !important;
}

.leaflet-popup-content {
  margin: 14px 18px !important;
  font-family: var(--body) !important;
  font-size: 13px !important;
  line-height: 1.4 !important;
  color: var(--ink) !important;
  min-width: 180px;
}

.leaflet-popup-tip {
  background: var(--paper) !important;
  border: 0.5px solid var(--line) !important;
}

.leaflet-popup-close-button {
  color: var(--ink-quiet) !important;
  font-size: 18px !important;
  padding: 4px 6px 0 0 !important;
}

.popup__where {
  font-family: var(--display);
  font-size: 15px;
  font-weight: 500;
  letter-spacing: -0.01em;
  margin-bottom: 4px;
}

.popup__story {
  font-family: var(--display);
  font-style: italic;
  color: var(--ink-soft);
  font-size: 13px;
  margin: 4px 0 8px;
  line-height: 1.4;
}

.popup__meta {
  font-family: var(--mono);
  font-size: 10px;
  color: var(--ink-quiet);
  letter-spacing: 0.02em;
  padding-top: 6px;
  border-top: 0.5px solid var(--line);
}

.popup__meta--yours {
  color: var(--smile-deep);
  font-weight: 500;
}

/* ------------------------------------------------------------
   legend
   ------------------------------------------------------------ */
.map-legend {
  position: absolute;
  bottom: 14px;
  left: calc(var(--gutter) + 14px);
  background: rgba(250, 248, 243, 0.95);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  border: 0.5px solid var(--line);
  border-radius: 4px;
  padding: 10px 14px;
  font-size: 11px;
  color: var(--ink-soft);
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 5px;
  pointer-events: none;
}

.map-legend__row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.map-legend__dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #B58450;
  border: 1px solid var(--paper);
}

.map-legend__dot--yours {
  background: var(--smile);
  width: 11px;
  height: 11px;
  box-shadow: 0 0 0 2.5px rgba(239, 159, 39, 0.2);
}

/* ------------------------------------------------------------
   recent stories feed
   ------------------------------------------------------------ */
.stories {
  padding: clamp(48px, 9vw, 80px) var(--gutter);
  max-width: var(--max);
  margin: 0 auto;
}

.stories__list {
  list-style: none;
  padding: 0;
  margin-top: 18px;
}

.story-item {
  padding: 18px 0;
  border-bottom: 0.5px solid var(--line);
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.story-item:last-child { border-bottom: none; }

.story-item__dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #B58450;
  margin-top: 8px;
  flex-shrink: 0;
}

.story-item__dot--yours {
  background: var(--smile);
  box-shadow: 0 0 0 3px rgba(239, 159, 39, 0.18);
}

.story-item__body { flex: 1; min-width: 0; }

.story-item__where {
  font-family: var(--display);
  font-size: 17px;
  font-weight: 500;
  letter-spacing: -0.01em;
  color: var(--ink);
  line-height: 1.3;
}

.story-item__where--yours::after {
  content: " · you";
  color: var(--smile-deep);
  font-weight: 400;
  font-size: 13px;
  font-style: italic;
}

.story-item__story {
  font-family: var(--display);
  font-style: italic;
  font-size: 14px;
  color: var(--ink-soft);
  margin-top: 3px;
  line-height: 1.4;
}

.story-item__meta {
  font-family: var(--mono);
  font-size: 11px;
  color: var(--ink-quiet);
  margin-top: 5px;
}

.stories__empty {
  font-family: var(--display);
  font-style: italic;
  color: var(--ink-quiet);
  font-size: 15px;
  padding: 24px 0;
  text-align: center;
}

/* ------------------------------------------------------------
   animations
   ------------------------------------------------------------ */
@keyframes dot-pulse {
  0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
  50% { transform: translate(-50%, -50%) scale(1.25); opacity: 0.85; }
}

@media (prefers-reduced-motion: reduce) {
  .smile-dot--recent { animation: none; }
}

/* ------------------------------------------------------------
   responsive tweaks
   ------------------------------------------------------------ */
@media (max-width: 540px) {
  .map-legend {
    bottom: 10px;
    left: calc(var(--gutter) + 10px);
    font-size: 10px;
    padding: 8px 10px;
  }
  .map-stat__sep { display: none; }
  .map-stats { gap: 16px; }
}
