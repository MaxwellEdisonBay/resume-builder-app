export const handleIgnoreEnter = (
  e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
) => {
  e.key === "Enter" && e.preventDefault();
};

export const bulletColors = [
  "bg-emerald-400 hover:bg-emerald-400",
  "bg-teal-400 hover:bg-teal-400",
  "bg-cyan-400 hover:bg-cyan-400",
  "bg-sky-400 hover:bg-sky-400",
  "bg-indigo-400 hover:bg-indigo-400",
  "bg-purple-400 hover:bg-purple-400",
  "bg-fuchsia-400 hover:bg-fuchsia-400",
] as const;

export const chipsColorSet = [
    "#fb923c",
    "#fbbf24",
    "#a3e635",
    "#34d399",
    "#2dd4bf",
    "#22d3ee",
    "#38bdf8",
    "#60a5fa",
    "#818cf8",
    "#c084fc",
    "#e879f9",
    "#a78bfa"
  ] as const;

export const getRndColorFromString = (title?: string) => {
    let test = 0;
    if (title) {
      for (let i = 0; i < title.length; i++) {
        test += title.charCodeAt(i);
      }
      test %= chipsColorSet.length;
    }
    return chipsColorSet[test]
  };
