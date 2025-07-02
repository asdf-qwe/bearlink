export const ICON_ORDER = [
  "/free-icon-no-meat-5769766.png", // meat
  "/free-icon-fish-8047799.png", // fish
  "/free-icon-fruit-box-5836745.png", // box
  "/free-icon-beehive-9421133.png", // beehive
  "/free-icon-wood-12479254.png", // wood
] as const;

export const getCategoryIcon = (index: number): string => {
  return ICON_ORDER[index % ICON_ORDER.length];
};
