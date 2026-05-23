/* ============================================================
   #Sorria — scan page styles
   handles onboarding flow + wearer dashboard
   ============================================================ */

.scan-body {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* on the scan page the shirt number is essential — always show it */
.scan-body .nav__via { display: inline !important; }

/* ============================================================
   shared view scaffolding
   ============================================================ */
.view {
  flex: 1;
  display: flex;
  padding: clamp(20px, 5vw, 40px) var(--gutter);
}

.view[hidden] { display: none; }

.view__inner {
  max-width: 560px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
}

/* ============================================================
   onboarding steps
   ============================================================ */
.step {
  display: none;
  flex-direction: column;
  flex: 1;
  position: relative;
  animation: step-in 500ms cubic-bezier(0.2, 0.7, 0.2, 1);
}

.step--active { display: flex; }

.step__eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ink-quiet);
  margin-bottom: 28px;
}

.step__headline {
  font-family: var(--display);
  font-weight: 500;
  font-size: clamp(36px, 8vw, 56px);
  line-height: 1.02;
  letter-spacing: -0.025em;
  color: var(--ink);
  margin-bottom: 28px;
}

.step__headline em {
  color: var(--smile-deep);
  font-style: italic;
}

.step__headline--mid {
  font-size: clamp(28px, 6vw, 40px);
}

.step__headline--small {
  font-size: clamp(22px, 4.5vw, 30px);
  margin-bottom: 0;
}

.code-display {
  font-style: normal;
  font-weight: 500;
  color: var(--smile-deep);
  font-family: var(--mono);
  font-size: 0.85em;
  letter-spacing: 0.02em;
}

.step__body {
  font-size: 16px;
  color: var(--ink-soft);
  margin-bottom: 36px;
}

.step__body p { margin-bottom: 8px; }
.step__body strong { color: var(--ink); }

.step__lede {
  font-family: var(--display);
  font-size: clamp(18px, 3vw, 22px);
  color: var(--ink);
  margin-bottom: 6px;
}

.step__lede strong {
  color: var(--smile-deep);
  font-weight: 600;
}

.step__sub {
  font-size: 15px;
  color: var(--ink-soft);
}

.step__smiley {
  position: absolute;
  top: 40px;
  right: -20px;
  width: clamp(100px, 18vw, 160px);
  height: clamp(100px, 18vw, 160px);
  color: var(--ink);
  opacity: 0.06;
  z-index: -1;
  animation: smiley-tilt 1200ms cubic-bezier(0.2, 0.8, 0.2, 1) 200ms both;
}

.step__actions {
  margin-top: auto;
  padding-top: 36px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* ============================================================
   form fields
   ============================================================ */
.field {
  margin-bottom: 20px;
}

.field__label {
  display: block;
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ink-quiet);
  margin-bottom: 8px;
}

.field__input {
  width: 100%;
  height: 44px;
  padding: 0 14px;
  border: 0.5px solid var(--line);
  border-radius: 6px;
  background: white;
  color: var(--ink);
  font-family: var(--body);
  font-size: 15px;
  -webkit-appearance: none;
  appearance: none;
  transition: border-color 160ms ease;
}

.field__input:focus {
  outline: none;
  border-color: var(--smile);
}

.field__input--text {
  height: auto;
  min-height: 80px;
  padding: 12px 14px;
  resize: vertical;
  font-family: var(--body);
  line-height: 1.45;
}

.field__hint {
  font-size: 11px;
  color: var(--ink-quiet);
  margin-top: 6px;
}

/* native select arrow fix */
select.field__input {
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'><path d='M1 1 L6 6 L11 1' fill='none' stroke='%238A857D' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/></svg>");
  background-repeat: no-repeat;
  background-position: right 14px center;
  padding-right: 36px;
}

/* ============================================================
   btn full-width variant
   ============================================================ */
.btn--full {
  width: 100%;
  min-width: 0;
}

.btn__icon {
  display: inline-block;
  margin-right: 6px;
  font-size: 18px;
  vertical-align: -1px;
}

/* ============================================================
   confirm icon
   ============================================================ */
.confirm__icon {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: var(--smile);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 28px;
  animation: pop-in 600ms cubic-bezier(0.2, 1.4, 0.4, 1);
}

.confirm__icon svg {
  width: 40px;
  height: 40px;
}

/* ============================================================
   shirt card (used on confirm + dashboard)
   ============================================================ */
.shirt-card {
  background: white;
  border: 0.5px solid var(--line);
  border-radius: 8px;
  padding: 18px 20px;
  margin-bottom: 8px;
}

.shirt-card__tag {
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ink-quiet);
  margin-bottom: 10px;
}

.shirt-card__row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.shirt-card__label {
  font-size: 14px;
  color: var(--ink-soft);
}

.shirt-card__num {
  font-size: 28px;
  font-weight: 500;
  color: var(--smile-deep);
}

/* ============================================================
   dashboard view
   ============================================================ */
.dash__header {
  margin-bottom: 32px;
}

.dash__headline {
  font-family: var(--display);
  font-weight: 500;
  font-size: clamp(28px, 6vw, 40px);
  letter-spacing: -0.02em;
  line-height: 1;
  color: var(--ink);
}

.dash__bignum {
  background: var(--ink);
  color: var(--paper);
  padding: 32px 24px;
  border-radius: 8px;
  text-align: center;
  margin-bottom: 16px;
  position: relative;
  overflow: hidden;
}

.dash__bignum::before {
  content: "";
  position: absolute;
  top: -40px; right: -40px;
  width: 140px; height: 140px;
  background: radial-gradient(circle, rgba(239, 159, 39, 0.15), transparent 70%);
  border-radius: 50%;
}

.dash__bignum-num {
  font-size: clamp(56px, 14vw, 88px);
  font-weight: 500;
  line-height: 1;
  letter-spacing: -0.04em;
  color: var(--smile);
  margin-bottom: 6px;
}

.dash__bignum-label {
  font-size: 13px;
  color: rgba(250, 248, 243, 0.6);
}

.dash__bignum-since {
  display: block;
  margin-top: 2px;
  font-size: 11px;
  letter-spacing: 0.05em;
}

/* ============================================================
   dashboard history list
   ============================================================ */
.dash__history {
  margin-top: 40px;
}

.history__list {
  list-style: none;
  padding: 0;
  margin-top: 18px;
}

.history__item {
  display: flex;
  gap: 14px;
  padding: 14px 0;
  border-bottom: 0.5px solid var(--line);
}

.history__item:last-child { border-bottom: none; }

.history__dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  background: var(--smile);
  margin-top: 7px;
  flex-shrink: 0;
}

.history__body { flex: 1; min-width: 0; }

.history__where {
  font-family: var(--display);
  font-size: 16px;
  font-weight: 500;
  color: var(--ink);
  line-height: 1.3;
}

.history__story {
  font-size: 14px;
  color: var(--ink-soft);
  margin-top: 2px;
  font-style: italic;
  font-family: var(--display);
}

.history__meta {
  font-size: 11px;
  color: var(--ink-quiet);
  margin-top: 4px;
  font-family: var(--mono);
}

.history__empty {
  font-size: 14px;
  color: var(--ink-quiet);
  font-style: italic;
  font-family: var(--display);
  text-align: center;
  padding: 24px 0;
}

/* ============================================================
   dashboard footer
   ============================================================ */
.dash__footer {
  margin-top: 40px;
  padding-top: 24px;
  border-top: 0.5px solid var(--line);
}

.dash__reset {
  display: block;
  margin: 20px auto 0;
  background: none;
  border: none;
  font-size: 11px;
  color: var(--ink-quiet);
  letter-spacing: 0.05em;
  cursor: pointer;
  font-family: var(--body);
  text-decoration: underline;
  text-underline-offset: 3px;
}

.dash__reset:hover { color: var(--ink); }

/* ============================================================
   modal
   ============================================================ */
.modal[hidden] { display: none; }

.modal {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

@media (min-width: 600px) {
  .modal { align-items: center; }
}

.modal__backdrop {
  position: absolute;
  inset: 0;
  background: rgba(26, 23, 20, 0.5);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  animation: fade-in 200ms ease;
}

.modal__panel {
  position: relative;
  background: var(--paper);
  border-radius: 16px 16px 0 0;
  padding: 28px 24px 32px;
  width: 100%;
  max-width: 460px;
  max-height: 80vh;
  overflow-y: auto;
  animation: slide-up 300ms cubic-bezier(0.2, 0.7, 0.2, 1);
}

@media (min-width: 600px) {
  .modal__panel { border-radius: 16px; }
}

.modal__close {
  position: absolute;
  top: 12px; right: 16px;
  background: none;
  border: none;
  font-size: 28px;
  color: var(--ink-quiet);
  cursor: pointer;
  width: 32px; height: 32px;
  line-height: 1;
  padding: 0;
}

.modal__close:hover { color: var(--ink); }

/* ============================================================
   toast
   ============================================================ */
.toast {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--ink);
  color: var(--paper);
  padding: 12px 20px;
  border-radius: 999px;
  font-size: 13px;
  z-index: 200;
  animation: toast-in 300ms cubic-bezier(0.2, 0.7, 0.2, 1);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.toast[hidden] { display: none; }

/* ============================================================
   animations
   ============================================================ */
@keyframes step-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes pop-in {
  0% { opacity: 0; transform: scale(0.4); }
  60% { transform: scale(1.1); }
  100% { opacity: 1; transform: scale(1); }
}

@keyframes smiley-tilt {
  from { opacity: 0; transform: rotate(-15deg) scale(0.8); }
  to { opacity: 0.06; transform: rotate(-8deg) scale(1); }
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slide-up {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes toast-in {
  from { opacity: 0; transform: translate(-50%, 20px); }
  to { opacity: 1; transform: translate(-50%, 0); }
}
