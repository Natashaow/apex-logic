// APEX LOGIC — Root Component
// Full viewport lock (ui-spec.md): header + 3-column grid, 100vh, no page scroll.
// Reference: memory-bank/ACTIVE_CONTEXT.md for the current build step.

import { useState } from "react";
import { AppProvider } from "./components/AppContext";
import IntroScreen from "./components/screens/IntroScreen";
import SystemHeader from "./components/layout/SystemHeader";
import ThreeColumnLayout from "./components/layout/ThreeColumnLayout";

function App() {
  const [showIntro, setShowIntro] = useState(true);

  return (
    <AppProvider>
      {showIntro ? (
        <IntroScreen onEnter={() => setShowIntro(false)} />
      ) : (
        <div className="flex h-screen w-screen flex-col bg-neutral-950">
          <SystemHeader />
          <ThreeColumnLayout />
        </div>
      )}
    </AppProvider>
  )
}

export default App
