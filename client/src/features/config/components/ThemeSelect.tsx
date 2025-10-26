import { useTheme } from "../../../contexts/ThemeContext";

const lightThemes = [
  "light",
  "cupcake",
  "bumblebee",
  "emerald",
  "corporate",
  "valentine",
  "garden",
  "retro",
  "lofi",
  "pastel",
  "fantasy",
  "cmyk",
  "acid",
  "wireframe",
  "autumn",
  "lemonade",
  "winter",
];

const darkThemes = [
  "dark",
  "synthwave",
  "halloween",
  "forest",
  "black",
  "luxury",
  "business",
  "dracula",
  "aqua",
  "night",
  "coffee",
];

export default function ThemeSelect() {
  const { prefs, setPrefs } = useTheme();

  return (
    <div className="flex gap-4">
      <div>
        <label className="label">
          <span className="label-text">Light mode theme</span>
        </label>
        <select
          className="select select-bordered select-sm"
          value={prefs.light}
          onChange={(e) => setPrefs({ ...prefs, light: e.target.value })}
        >
          {lightThemes.map((t) => (
            <option key={t} value={t}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="label">
          <span className="label-text">Dark mode theme</span>
        </label>
        <select
          className="select select-bordered select-sm"
          value={prefs.dark}
          onChange={(e) => setPrefs({ ...prefs, dark: e.target.value })}
        >
          {darkThemes.map((t) => (
            <option key={t} value={t}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
