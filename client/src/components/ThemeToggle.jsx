import { useEffect, useState } from 'react';
import { Sun, Moon } from "lucide-react";

const ThemeToggle = ({ isExpanded = false }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
        root.classList.add("dark");
    } else {
        root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === "dark" ? "light" : "dark"));
  };

  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      className={`flex items-center w-full p-2 rounded-xl shadow-md transition-all duration-300 
        bg-light-card dark:bg-dark-card hover:opacity-80
        ${isExpanded ? 'justify-start gap-3' : 'justify-center'}`}
      aria-label="Toggle Theme"
    >
      <div
        className={`relative ${isExpanded ? 'w-10' : 'w-7'} h-4 bg-gray-300 dark:bg-gray-600 
          rounded-full transition-all duration-300`}
      >
        <div
          className={`absolute w-4 h-4 bg-white rounded-full shadow-md flex items-center justify-center
            transform transition-transform duration-300
            ${isDark ? (isExpanded ? "translate-x-6" : "translate-x-[11px]") : "translate-x-0"}`}
        >
          {isDark ? (
            <Moon className="w-3.5 h-3.5 text-gray-800" />
          ) : (
            <Sun className="w-3.5 h-3.5 text-yellow-500" />
          )}
        </div>
      </div>

      {isExpanded && (
        <span className="text-sm font-medium ml-3">
          {isDark ? "Dark Mode" : "Light Mode"}
        </span>
      )}
    </button>
  );
};

export default ThemeToggle;
