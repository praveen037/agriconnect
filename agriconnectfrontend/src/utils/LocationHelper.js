// utils/locationHelper.js
export const getLocationString = (locationId, locationsList) => {
  const loc = locationsList.find((l) => l.id === locationId);
  if (!loc) return "Unknown Location";
  return `${loc.state}, ${loc.district}, ${loc.subLocation || ""}`;
};
