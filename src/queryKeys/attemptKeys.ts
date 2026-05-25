export const attemptKeys = {
  all: ["attempts"] as const,

  lists: () => [...attemptKeys.all, "list"] as const,

  me: () => [...attemptKeys.lists(), "me"] as const,
};
