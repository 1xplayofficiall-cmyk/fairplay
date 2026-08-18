/* ============================================================================
   INTRO HANDSHAKE
   ----------------------------------------------------------------------------
   Preloader is disabled; resolves immediately so text renders without delay.
   ========================================================================== */

export const intro = Promise.resolve();

export function finishIntro() {}

export function introReady() {
  return Promise.resolve();
}

