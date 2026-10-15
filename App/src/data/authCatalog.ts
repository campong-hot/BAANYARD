import type { AuthProviderConfig } from "./types";

export const defaultAuthProviders: AuthProviderConfig[] = [
  { id: "google", label: "Google", enabled: true, clientIdPlaceholder: "demo-google-client" },
  { id: "apple", label: "Apple ID", enabled: true, clientIdPlaceholder: "demo-apple-client" },
  { id: "whatsapp", label: "WhatsApp", enabled: true, clientIdPlaceholder: "demo-whatsapp" },
  { id: "alipay", label: "Alipay", enabled: true, clientIdPlaceholder: "demo-alipay" },
  { id: "line", label: "LINE", enabled: true, clientIdPlaceholder: "demo-line" },
];
