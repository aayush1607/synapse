export function triggerHaptic() {
  if ('vibrate' in navigator) {
    // Double-thump: two short bursts mimicking a heartbeat
    navigator.vibrate([40, 60, 80])
  }
}
