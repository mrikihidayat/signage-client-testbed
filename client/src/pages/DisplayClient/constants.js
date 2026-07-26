export const RECONNECT_BASE_DELAY = 1500;
export const RECONNECT_MAX_DELAY = 15000;
export const CROSSFADE_DURATION = 700;
export const CONTROLS_IDLE_DELAY = 3500;

export function contentKey(content) {
  if (!content) return 'empty';
  return `${content.id}-${content.tipe}-${content.payload_url}`;
}
