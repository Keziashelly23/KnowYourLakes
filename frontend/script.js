const fallbackLakes = [
  {
    id: "superior",
    lakeName: "Lake Superior",
    region: "Upper Peninsula",
    beachName: "McCarty's Cove",
    accessibilityScore: "Some accessible features listed",
    accessibilityLevel: "strong",
    wheelchairAccessibleEntrance: true,
    wheelchairAccessibleParking: true,
    wheelchairAccessibleRestroom: false,
    wheelchairAccessibleSeating: null,
    parkingOptionsText: "Parking details not loaded yet",
    formattedAddress: "Marquette, MI",
    googleMapsUri: "https://maps.google.com/",
    note: "Run the Google Places sync to replace this fallback record with live accessibility data.",
    updatedAt: null
  },
  {
    id: "michigan",
    lakeName: "Lake Michigan",
    region: "West Michigan",
    beachName: "Pere Marquette Park",
    accessibilityScore: "Some accessible features listed",
    accessibilityLevel: "strong",
    wheelchairAccessibleEntrance: true,
    wheelchairAccessibleParking: true,
    wheelchairAccessibleRestroom: true,
    wheelchairAccessibleSeating: null,
    parkingOptionsText: "Parking details not loaded yet",
    formattedAddress: "Muskegon, MI",
    googleMapsUri: "https://maps.google.com/",
    note: "Run the Google Places sync to replace this fallback record with live accessibility data.",
    updatedAt: null
  },
  {
    id: "huron",
    lakeName: "Lake Huron",
    region: "Eastern Michigan",
    beachName: "Caseville County Park",
    accessibilityScore: "Partial accessibility data",
    accessibilityLevel: "",
    wheelchairAccessibleEntrance: true,
    wheelchairAccessibleParking: null,
    wheelchairAccessibleRestroom: null,
    wheelchairAccessibleSeating: null,
    parkingOptionsText: "Parking details not loaded yet",
    formattedAddress: "Caseville, MI",
    googleMapsUri: "https://maps.google.com/",
    note: "Run the Google Places sync to replace this fallback record with live accessibility data.",
    updatedAt: null
  },
  {
    id: "erie",
    lakeName: "Lake Erie",
    region: "Southeast Michigan",
    beachName: "Sterling State Park Beach",
    accessibilityScore: "Some accessible features listed",
    accessibilityLevel: "strong",
    wheelchairAccessibleEntrance: true,
    wheelchairAccessibleParking: true,
    wheelchairAccessibleRestroom: true,
    wheelchairAccessibleSeating: null,
    parkingOptionsText: "Parking details not loaded yet",
    formattedAddress: "Monroe, MI",
    googleMapsUri: "https://maps.google.com/",
    note: "Run the Google Places sync to replace this fallback record with live accessibility data.",
    updatedAt: null
  },
  {
    id: "st-clair",
    lakeName: "Lake St. Clair",
    region: "Metro Detroit",
    beachName: "Metro Beach",
    accessibilityScore: "Some accessible features listed",
    accessibilityLevel: "strong",
    wheelchairAccessibleEntrance: true,
    wheelchairAccessibleParking: true,
    wheelchairAccessibleRestroom: true,
    wheelchairAccessibleSeating: null,
    parkingOptionsText: "Parking details not loaded yet",
    formattedAddress: "Harrison Township, MI",
    googleMapsUri: "https://maps.google.com/",
    note: "Run the Google Places sync to replace this fallback record with live accessibility data.",
    updatedAt: null
  },
  {
    id: "torch",
    lakeName: "Torch Lake",
    region: "Northern Lower Peninsula",
    beachName: "Torch Lake Day Park",
    accessibilityScore: "Partial accessibility data",
    accessibilityLevel: "",
    wheelchairAccessibleEntrance: true,
    wheelchairAccessibleParking: true,
    wheelchairAccessibleRestroom: null,
    wheelchairAccessibleSeating: null,
    parkingOptionsText: "Parking details not loaded yet",
    formattedAddress: "Kewadin, MI",
    googleMapsUri: "https://maps.google.com/",
    note: "Run the Google Places sync to replace this fallback record with live accessibility data.",
    updatedAt: null
  },
  {
    id: "muskegon",
    lakeName: "Muskegon Lake",
    region: "West Michigan inland lake",
    beachName: "Muskegon State Park Channel Beach",
    accessibilityScore: "Partial accessibility data",
    accessibilityLevel: "",
    wheelchairAccessibleEntrance: true,
    wheelchairAccessibleParking: true,
    wheelchairAccessibleRestroom: null,
    wheelchairAccessibleSeating: null,
    parkingOptionsText: "Parking details not loaded yet",
    formattedAddress: "North Muskegon, MI",
    googleMapsUri: "https://maps.google.com/",
    note: "Run the Google Places sync to replace this fallback record with live accessibility data.",
    updatedAt: null
  }
];

const select = document.querySelector("#lake-select");
const statusEl = document.querySelector("#status");
const reportEl = document.querySelector("#report");
const lakeRegionEl = document.querySelector("#lake-region");
const lakeNameEl = document.querySelector("#lake-name");
const beachNameEl = document.querySelector("#beach-name");
const updatedAtEl = document.querySelector("#updated-at");
const badgeEl = document.querySelector("#access-badge");
const entranceEl = document.querySelector("#entrance");
const parkingEl = document.querySelector("#parking");
const restroomEl = document.querySelector("#restroom");
const seatingEl = document.querySelector("#seating");
const parkingOptionsEl = document.querySelector("#parking-options");
const addressEl = document.querySelector("#address");
const mapsLinkEl = document.querySelector("#maps-link");
const noteEl = document.querySelector("#note");

let lakes = [];

function yesNoUnknown(value) {
  if (value === true) return "Yes";
  if (value === false) return "No";
  return "Unknown";
}

function populateDropdown(items) {
  select.length = 1;
  for (const lake of items) {
    const option = document.createElement("option");
    option.value = lake.id;
    option.textContent = lake.lakeName;
    select.appendChild(option);
  }
}

function renderLake(lake) {
  lakeRegionEl.textContent = lake.region;
  lakeNameEl.textContent = lake.lakeName;
  beachNameEl.textContent = `Featured beach: ${lake.beachName}`;
  updatedAtEl.textContent = lake.updatedAt
    ? `Updated: ${new Date(lake.updatedAt).toLocaleString()}`
    : "Showing local fallback data";
  badgeEl.textContent = lake.accessibilityScore;
  badgeEl.className = `badge ${lake.accessibilityLevel || ""}`.trim();
  entranceEl.textContent = yesNoUnknown(lake.wheelchairAccessibleEntrance);
  parkingEl.textContent = yesNoUnknown(lake.wheelchairAccessibleParking);
  restroomEl.textContent = yesNoUnknown(lake.wheelchairAccessibleRestroom);
  seatingEl.textContent = yesNoUnknown(lake.wheelchairAccessibleSeating);
  parkingOptionsEl.textContent = lake.parkingOptionsText;
  addressEl.textContent = lake.formattedAddress || "Address unavailable";
  mapsLinkEl.href = lake.googleMapsUri || "https://maps.google.com/";
  noteEl.textContent = lake.note;
  reportEl.classList.remove("hidden");
}

select.addEventListener("change", (event) => {
  const lake = lakes.find((entry) => entry.id === event.target.value);
  if (!lake) {
    reportEl.classList.add("hidden");
    return;
  }

  renderLake(lake);
});

async function loadLakeData() {
  try {
    const response = await fetch("./beach-accessibility.json", { cache: "no-store" });
    if (!response.ok) {
      throw new Error("Beach accessibility file not found");
    }

    const payload = await response.json();
    lakes = Array.isArray(payload.lakes) ? payload.lakes : fallbackLakes;
    statusEl.textContent = payload.generatedAt
      ? `Live Google Places data loaded. Generated ${new Date(payload.generatedAt).toLocaleString()}.`
      : "Live Google Places data loaded.";
  } catch (error) {
    lakes = fallbackLakes;
    statusEl.textContent = "Using fallback data. Run the Python Google Places script to load real accessibility details.";
  }

  populateDropdown(lakes);
}

loadLakeData();
