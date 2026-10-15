/** Local camera/mic preview helpers (secure context required). */

import { isSecureContext } from "./utils.js";

export { isSecureContext };

/** @type {MediaStream | null} */
let activeStream = null;
/** @type {"insecure" | "unsupported" | "denied" | "failed" | null} */
let lastError = null;
let busy = false;

export function getCallStream() {
  return activeStream;
}

export function getCallError() {
  return lastError;
}

export function isCallBusy() {
  return busy;
}

export function clearCallError() {
  lastError = null;
}

export function stopCallMedia() {
  if (activeStream) {
    for (const track of activeStream.getTracks()) {
      try {
        track.stop();
      } catch {
        /* ignore */
      }
    }
    activeStream = null;
  }
  busy = false;
}

/**
 * Request camera + mic. Does not throw — sets lastError on failure.
 * @returns {Promise<MediaStream | null>}
 */
export async function startCallMedia() {
  lastError = null;

  if (!isSecureContext()) {
    lastError = "insecure";
    return null;
  }

  const devices = navigator.mediaDevices;
  if (!devices || typeof devices.getUserMedia !== "function") {
    lastError = "unsupported";
    return null;
  }

  if (activeStream) {
    stopCallMedia();
  }

  busy = true;
  try {
    const stream = await devices.getUserMedia({ video: true, audio: true });
    activeStream = stream;
    busy = false;
    return stream;
  } catch (err) {
    busy = false;
    const name = err && typeof err === "object" && "name" in err ? String(err.name) : "";
    if (name === "NotAllowedError" || name === "PermissionDeniedError") {
      lastError = "denied";
    } else if (name === "NotFoundError" || name === "DevicesNotFoundError") {
      lastError = "unsupported";
    } else {
      lastError = "failed";
    }
    return null;
  }
}

export function callErrorMessage(lang, code) {
  const th = {
    insecure:
      "ต้องเปิดผ่าน HTTPS จึงใช้กล้องได้ (เช่น https://campong.co.th) — Camera requires a secure context (HTTPS).",
    unsupported:
      "เบราว์เซอร์หรืออุปกรณ์ไม่รองรับกล้อง/ไมค์ — Camera/microphone not available in this browser.",
    denied:
      "ไม่ได้รับอนุญาตใช้กล้อง/ไมค์ — กรุณาอนุญาตในเบราว์เซอร์แล้วลองใหม่ / Permission denied.",
    failed:
      "เปิดกล้องไม่สำเร็จ — ลองใหม่หรือตรวจสอบว่าไม่มีแอปอื่นใช้กล้องอยู่ / Could not start camera.",
  };
  const en = {
    insecure:
      "Camera requires HTTPS (secure context), e.g. https://campong.co.th — ต้องเปิดผ่าน HTTPS จึงใช้กล้องได้",
    unsupported: "Camera/microphone not available in this browser. / อุปกรณ์ไม่รองรับกล้องหรือไมค์",
    denied: "Camera/microphone permission denied. Allow access and try again. / ไม่ได้รับอนุญาต",
    failed: "Could not start camera. Close other apps using the camera and retry. / เปิดกล้องไม่สำเร็จ",
  };
  const table = lang === "th" ? th : en;
  return table[code] || table.failed;
}
