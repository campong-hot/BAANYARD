import { DemoChrome } from "./components/DemoChrome";
import { AdminApp } from "./features/admin/AdminApp";
import { GuestApp } from "./features/guest/GuestApp";
import { HostApp } from "./features/host/HostApp";
import { PitchDeck } from "./features/pitch/PitchDeck";
import { PrivacyCenter } from "./features/privacy/PrivacyCenter";
import { useAppState } from "./state/AppState";

export default function App() {
  const { mode, lane, privacyOpen, closePrivacy, sessionUser, setGuestScreen } = useAppState();

  if (mode === "pitch") {
    return (
      <div className="app-root">
        <PitchDeck />
      </div>
    );
  }

  return (
    <div className="app-root demo-root">
      <DemoChrome />
      <main className="demo-main">
        {privacyOpen ? (
          <PrivacyCenter
            onBack={() => {
              closePrivacy();
              setGuestScreen(sessionUser ? "explore" : "splash");
            }}
          />
        ) : null}
        {!privacyOpen && lane === "guest" ? <GuestApp /> : null}
        {!privacyOpen && lane === "host" ? <HostApp /> : null}
        {!privacyOpen && lane === "admin" ? <AdminApp /> : null}
      </main>
    </div>
  );
}
