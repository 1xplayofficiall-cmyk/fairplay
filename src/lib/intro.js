/* ============================================================================
   INTRO HANDSHAKE
   ----------------------------------------------------------------------------
   The preloader and the motion layer are separate components, but the hero's
   entrance must not play behind the curtain. This module is the one-line
   contract between them: MotionProvider waits on `intro`, Preloader resolves
   it — and resolves it immediately when there is no curtain to lift.
   ========================================================================== */

let release;

export const intro = new Promise((resolve) => {
  release = resolve;
});

export function finishIntro() {
  release?.();
  release = null;
}

/* Never let a missed handshake strand the page: whatever happens, motion
   starts within the timeout. */
export function introReady(timeout = 3000) {
  return Promise.race([intro, new Promise((resolve) => setTimeout(resolve, timeout))]);
}
