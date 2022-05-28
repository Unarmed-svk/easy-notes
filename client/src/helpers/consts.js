export const FILTER_TYPES = Object.freeze({
  NEWEST: "newest",
  OLDEST: "oldest",
  CLOSEST: "closest",
  FARTHEST: "farthest",
  ACTIVE: "active",
  COMPLETED: "completed",
  DELETED: "deleted",
});

export const transitions = {
  easeInOut: [0.4, 0, 0.2, 1],
  easeOut: [0.0, 0, 0.2, 1],
  easeIn: [0.4, 0, 0.6, 1],
};
