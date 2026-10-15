/** Secure-context + local camera/mic helpers for demo video preview. */

export type CallMediaError = "insecure" | "unsupported" | "denied" | "failed";

export function isSecureContext(): boolean {
  return typeof window !== "undefined" && window.isSecureContext === true;
}

export function stopMediaStream(stream: MediaStream | null | undefined): void {
  if (!stream) return;
  for (const track of stream.getTracks()) {
    try {
      track.stop();
    } catch {
      /* ignore */
    }
  }
}

export function callErrorMessage(lang: "en" | "th", code: CallMediaError): string {
  const th: Record<CallMediaError, string> = {
    insecure:
      "ต้องเปิดผ่าน HTTPS จึงใช้กล้องได้ (เช่น https://campong.co.th) — Camera requires a secure context (HTTPS).",
    unsupported:
      "เบราว์เซอร์หรืออุปกรณ์ไม่รองรับกล้อง/ไมค์ — Camera/microphone not available in this browser.",
    denied:
      "ไม่ได้รับอนุญาตใช้กล้อง/ไมค์ — กรุณาอนุญาตในเบราว์เซอร์แล้วลองใหม่ / Permission denied.",
    failed:
      "เปิดกล้องไม่สำเร็จ — ลองใหม่หรือตรวจสอบว่าไม่มีแอปอื่นใช้กล้องอยู่ / Could not start camera.",
  };
  const en: Record<CallMediaError, string> = {
    insecure:
      "Camera requires HTTPS (secure context), e.g. https://campong.co.th — ต้องเปิดผ่าน HTTPS จึงใช้กล้องได้",
    unsupported: "Camera/microphone not available in this browser. / อุปกรณ์ไม่รองรับกล้องหรือไมค์",
    denied: "Camera/microphone permission denied. Allow access and try again. / ไม่ได้รับอนุญาต",
    failed: "Could not start camera. Close other apps using the camera and retry. / เปิดกล้องไม่สำเร็จ",
  };
  return (lang === "th" ? th : en)[code];
}

export async function requestCallMedia(): Promise<{ stream: MediaStream | null; error: CallMediaError | null }> {
  if (!isSecureContext()) {
    return { stream: null, error: "insecure" };
  }
  const devices = navigator.mediaDevices;
  if (!devices || typeof devices.getUserMedia !== "function") {
    return { stream: null, error: "unsupported" };
  }
  try {
    const stream = await devices.getUserMedia({ video: true, audio: true });
    return { stream, error: null };
  } catch (err) {
    const name = err && typeof err === "object" && "name" in err ? String((err as { name: string }).name) : "";
    if (name === "NotAllowedError" || name === "PermissionDeniedError") {
      return { stream: null, error: "denied" };
    }
    if (name === "NotFoundError" || name === "DevicesNotFoundError") {
      return { stream: null, error: "unsupported" };
    }
    return { stream: null, error: "failed" };
  }
}
