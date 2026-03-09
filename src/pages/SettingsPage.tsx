export function SettingsPage({ data, updateSettings, resetAll }: any) {
  return (
    <section>
      <h2>Settings</h2>
      <label className="check-row">
        <input type="checkbox" checked={data.settings.soundEnabled} onChange={(e) => updateSettings({ soundEnabled: e.target.checked })} />
        Sound enabled
      </label>
      <label>
        Animation speed: {data.settings.animationSpeed.toFixed(1)}x
        <input
          type="range"
          min={0.5}
          max={2}
          step={0.1}
          value={data.settings.animationSpeed}
          onChange={(e) => updateSettings({ animationSpeed: Number(e.target.value) })}
        />
      </label>
      <button onClick={resetAll}>Reset all data</button>
    </section>
  );
}
