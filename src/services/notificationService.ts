import { PriceAlert, TokenCandidate } from '../types';

const ALERTS_STORAGE_KEY = 'tokenradar_price_alerts';

// Web Audio API chime synthesizer (two-tone Android style chime)
export function playAlertChime() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    // First tone (880 Hz / A5)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(880, ctx.currentTime);
    gain1.gain.setValueAtTime(0.15, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.25);

    // Second tone (1320 Hz / E6)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1320, ctx.currentTime + 0.12);
    gain2.gain.setValueAtTime(0.2, ctx.currentTime + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(ctx.currentTime + 0.12);
    osc2.stop(ctx.currentTime + 0.45);
  } catch (e) {
    console.warn('Audio chime playback omitted or unsupported:', e);
  }
}

// Android haptic vibration
export function triggerHaptic() {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate([100, 60, 180]);
    } catch {
      // ignore
    }
  }
}

// Request permission for Web Push notifications
export async function requestPushPermission(): Promise<'granted' | 'denied' | 'default' | 'unsupported'> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }
  if (Notification.permission === 'granted') {
    return 'granted';
  }
  try {
    const perm = await Notification.requestPermission();
    return perm;
  } catch {
    return 'denied';
  }
}

// Send native Web Push notification
export function sendPushNotification(title: string, body: string, tokenTicker: string) {
  // Always play audio & haptic
  playAlertChime();
  triggerHaptic();

  if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
    try {
      const notif = new Notification(title, {
        body,
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        tag: `price-alert-${tokenTicker}-${Date.now()}`,
        requireInteraction: true,
      });

      notif.onclick = () => {
        window.focus();
        notif.close();
      };
    } catch (err) {
      console.warn('Native notification failed:', err);
    }
  }
}

// Load alerts from localStorage
export function loadAlerts(): PriceAlert[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(ALERTS_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

// Save alerts to localStorage
export function saveAlerts(alerts: PriceAlert[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(alerts));
  } catch (e) {
    console.error('Error saving price alerts:', e);
  }
}

// Add or update an alert
export function addPriceAlert(newAlert: PriceAlert): PriceAlert[] {
  const current = loadAlerts();
  // Filter out any active alert for this candidate if replacing
  const updated = [newAlert, ...current.filter((a) => a.id !== newAlert.id)];
  saveAlerts(updated);
  return updated;
}

// Remove an alert
export function removePriceAlert(alertId: string): PriceAlert[] {
  const current = loadAlerts();
  const updated = current.filter((a) => a.id !== alertId);
  saveAlerts(updated);
  return updated;
}

// Mark alert as triggered
export function markAlertTriggered(alertId: string, currentPrice: number): PriceAlert[] {
  const current = loadAlerts();
  const now = new Date();
  const watFormatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Africa/Lagos',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const updated = current.map((a) => {
    if (a.id === alertId) {
      return {
        ...a,
        status: 'TRIGGERED' as const,
        triggeredAt: watFormatter.format(now) + ' WAT',
        triggeredPrice: currentPrice,
      };
    }
    return a;
  });
  saveAlerts(updated);
  return updated;
}
