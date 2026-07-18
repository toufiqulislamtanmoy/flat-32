export interface IconOption {
  emoji: string;
  label: string;
}

export const iconOptions: IconOption[] = [
  { emoji: "🏠", label: "Home" },
  { emoji: "👨‍👩‍👧", label: "Family" },
  { emoji: "🍽️", label: "Meal" },
  { emoji: "🏢", label: "Office" },
  { emoji: "✈️", label: "Trip" },
  { emoji: "🏕️", label: "Friends" },
];

export const defaultPreview = {
  name: "Bachelor House",
  icon: "🏠",
  members: 1,
  balance: "৳0",
  transactions: 0,
  startDate: new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }),
};

export const infoItems = [
  "You'll become the owner of this plan.",
  "You can invite members later.",
  "Members can contribute money.",
  "Members can record expenses.",
  "Reports will be generated automatically.",
];
