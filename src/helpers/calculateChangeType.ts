type ChangeType = "positive" | "negative" | "neutral";

export const calculateChangeType = (
  current: number,
  previous: number,
): { change: string; changeType: ChangeType } => {
  if (previous === 0 && current === 0) {
    return { change: "No change", changeType: "neutral" };
  }

  if (previous === 0 && current > 0) {
    return { change: `+${current} this month`, changeType: "positive" };
  }

  const diff = current - previous;
  const percentage = (diff / previous) * 100;

  if (diff > 0) {
    return {
      change: `+${percentage.toFixed(1)}% this month`,
      changeType: "positive",
    };
  }

  if (diff < 0) {
    return {
      change: `${percentage.toFixed(1)}% this month`,
      changeType: "negative",
    };
  }

  return { change: "No change", changeType: "neutral" };
};
