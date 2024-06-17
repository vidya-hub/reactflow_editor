import React from "react";
import EditorPanel from "./editor_panel/editor_panel";
import SettingsPanel from "./settings_panel/settings_panel";

export default function HomeScreen() {
  return (
    <div>
      <div className="w-screen h-screen flex flex-row relative">
        {/*TODO: panel for react flow */}
        <EditorPanel></EditorPanel>

        {/*TODO: panel for Settings */}
        <SettingsPanel></SettingsPanel>
      </div>
    </div>
  );
}
