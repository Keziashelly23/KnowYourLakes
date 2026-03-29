const fallbackLakes = [
  {
    id: "superior",
    name: "Lake Superior",
    region: "Upper Peninsula",
    current: "Strong longshore current",
    safety: "Use caution",
    waves: "Cold water with rolling surf",
    note: "Open shoreline can shift fast when wind picks up.",
    advice: "Stay near staffed beaches and avoid swimming alone.",
    level: "caution"
  },
  {
    id: "michigan",
    name: "Lake Michigan",
    region: "West Michigan",
    current: "Moderate to strong rip current risk",
    safety: "Not safe for weak swimmers",
    waves: "Choppy near piers",
    note: "Pier areas and sandbars can create dangerous pullback.",
    advice: "Keep away from piers when waves are up and check local flags first.",
    level: "danger"
  },
  {
    id: "huron",
    name: "Lake Huron",
    region: "Eastern Michigan",
    current: "Light shoreline current",
    safety: "Generally safe",
    waves: "Small waves",
    note: "Most beaches are calmer, but winds can build during the afternoon.",
    advice: "Good for casual swimming if you still watch wind and weather.",
    level: "safe"
  },
  {
    id: "erie",
    name: "Lake Erie",
    region: "Southeast Michigan",
    current: "Low current",
    safety: "Safe for most swimmers",
    waves: "Usually mild chop",
    note: "Shallow water warms up faster but can get muddy after storms.",
    advice: "Best conditions are usually in the morning before winds strengthen.",
    level: "safe"
  },
  {
    id: "st-clair",
    name: "Lake St. Clair",
    region: "Metro Detroit",
    current: "Moderate channel movement",
    safety: "Use caution near boat traffic",
    waves: "Light waves with wake activity",
    note: "Conditions can change quickly near channels and marinas.",
    advice: "Swim only in marked areas and stay alert for boats.",
    level: "caution"
  },
  {
    id: "torch",
    name: "Torch Lake",
    region: "Northern Lower Peninsula",
    current: "Minimal surface current",
    safety: "Safe in calm weather",
    waves: "Low wave action",
    note: "Very clear water but sudden drop-offs can surprise swimmers.",
    advice: "Wear a life vest for paddle sports and watch children closely.",
    level: "safe"
  },
  {
    id: "muskegon",
    name: "Muskegon Lake",
    region: "West Michigan inland lake",
    current: "Mild inlet current",
    safety: "Usually safe with caution",
    waves: "Moderate wind chop",
    note: "Open sections are calmer than nearby Lake Michigan beaches.",
    advice: "A good backup when big-lake surf is too rough.",
    level: "caution"
  }
];

const select = document.querySelector("#lake-select");
const report = document.querySelector("#lake-report");
const dataStatus = document.querySelector("#data-status");
const region = document.querySelector("#lake-region");
const nameEl = document.querySelector("#lake-name");
const updated = document.querySelector("#lake-updated");
const badge = document.querySelector("#lake-badge");
const current = document.querySelector("#lake-current");
const safety = document.querySelector("#lake-safety");
const waves = document.querySelector("#lake-waves");
const note = document.querySelector("#lake-note");
const advice = document.querySelector("#lake-advice");
let lakes = [];

function populateDropdown(items) {
  select.length = 1;

  for (const lake of items) {
    const option = document.createElement("option");
    option.value = lake.id;
    option.textContent = lake.name;
    select.appendChild(option);
  }
}

select.addEventListener("change", (event) => {
  const selectedLake = lakes.find((lake) => lake.id === event.target.value);

  if (!selectedLake) {
    report.classList.add("hidden");
    return;
  }

  region.textContent = selectedLake.region;
  nameEl.textContent = selectedLake.name;
  updated.textContent = selectedLake.updatedAt
    ? `Updated: ${new Date(selectedLake.updatedAt).toLocaleString()}`
    : "";
  badge.textContent = selectedLake.safety;
  badge.className = `badge ${selectedLake.level}`;
  current.textContent = selectedLake.current;
  safety.textContent = selectedLake.safety;
  waves.textContent = selectedLake.waves;
  note.textContent = selectedLake.note;
  advice.textContent = selectedLake.advice;

  report.classList.remove("hidden");
});

async function loadLakeData() {
  try {
    const response = await fetch("./lake-data.json", { cache: "no-store" });

    if (!response.ok) {
      throw new Error("lake-data.json not found");
    }

    const payload = await response.json();
    lakes = Array.isArray(payload.lakes) ? payload.lakes : fallbackLakes;
    dataStatus.textContent = payload.generatedAt
      ? `Live data loaded. Generated ${new Date(payload.generatedAt).toLocaleString()}.`
      : "Live data loaded.";
  } catch (error) {
    lakes = fallbackLakes;
    dataStatus.textContent = "Using sample lake data. Run the Python script to load real values.";
  }

  populateDropdown(lakes);
}

loadLakeData();
