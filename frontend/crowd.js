const crowdBeachData = [
  {
    id: 1,
    name: "Grand Haven State Park Beach",
    city: "Grand Haven",
    lake: "Lake Michigan",
    currentOccupancy: 28,
    forecastOccupancy: 52,
    updated: "Updated 12 min ago",
    peakHours: "1:00 PM - 4:00 PM",
    parking: "available",
    lifeguard: "Yes",
    restrooms: "Yes",
    food: "Yes"
  },
  {
    id: 2,
    name: "Muskegon State Park Beach",
    city: "Muskegon",
    lake: "Lake Michigan",
    currentOccupancy: 58,
    forecastOccupancy: 72,
    updated: "Updated 10 min ago",
    peakHours: "12:00 PM - 4:00 PM",
    parking: "available",
    lifeguard: "Yes",
    restrooms: "Yes",
    food: "No"
  },
  {
    id: 3,
    name: "Sleeping Bear Dunes Beach",
    city: "Empire",
    lake: "Lake Michigan",
    currentOccupancy: 82,
    forecastOccupancy: 91,
    updated: "Updated 7 min ago",
    peakHours: "2:00 PM - 6:00 PM",
    parking: "limited",
    lifeguard: "No",
    restrooms: "Yes",
    food: "No"
  },
  {
    id: 4,
    name: "Mackinaw City Beach",
    city: "Mackinaw City",
    lake: "Lake Huron",
    currentOccupancy: 24,
    forecastOccupancy: 39,
    updated: "Updated 18 min ago",
    peakHours: "11:00 AM - 2:00 PM",
    parking: "available",
    lifeguard: "Yes",
    restrooms: "Yes",
    food: "Yes"
  },
  {
    id: 5,
    name: "Lake St Clair Metropark Beach",
    city: "Harrison Township",
    lake: "Lake St Clair",
    currentOccupancy: 66,
    forecastOccupancy: 78,
    updated: "Updated 9 min ago",
    peakHours: "1:00 PM - 5:00 PM",
    parking: "limited",
    lifeguard: "Yes",
    restrooms: "Yes",
    food: "Yes"
  },
  {
    id: 6,
    name: "Sterling State Park Beach",
    city: "Monroe",
    lake: "Lake Erie",
    currentOccupancy: 91,
    forecastOccupancy: 96,
    updated: "Updated 5 min ago",
    peakHours: "2:00 PM - 6:00 PM",
    parking: "full",
    lifeguard: "Yes",
    restrooms: "Yes",
    food: "Yes"
  },
  {
    id: 7,
    name: "Tawas Point State Park Beach",
    city: "East Tawas",
    lake: "Lake Huron",
    currentOccupancy: 47,
    forecastOccupancy: 61,
    updated: "Updated 14 min ago",
    peakHours: "12:00 PM - 3:00 PM",
    parking: "available",
    lifeguard: "No",
    restrooms: "Yes",
    food: "No"
  }
];

let crowdViewMode = "current";

const crowdBeachSelect = document.getElementById("crowdBeachSelect");
const crowdBeachContainer = document.getElementById("crowdBeachContainer");
const crowdCurrentBtn = document.getElementById("crowdCurrentBtn");
const crowdForecastBtn = document.getElementById("crowdForecastBtn");

const crowdLowCount = document.getElementById("crowdLowCount");
const crowdModerateCount = document.getElementById("crowdModerateCount");
const crowdHighCount = document.getElementById("crowdHighCount");
const crowdVeryHighCount = document.getElementById("crowdVeryHighCount");

function crowdPopulateDropdown() {
  crowdBeachData.forEach((beach) => {
    const option = document.createElement("option");
    option.value = beach.id;
    option.textContent = beach.name;
    crowdBeachSelect.appendChild(option);
  });
}

function crowdGetOccupancy(beach) {
  return crowdViewMode === "current" ? beach.currentOccupancy : beach.forecastOccupancy;
}

function crowdGetLevel(occupancy) {
  if (occupancy <= 30) {
    return "low";
  } else if (occupancy <= 60) {
    return "moderate";
  } else if (occupancy <= 85) {
    return "high";
  } else {
    return "very-high";
  }
}

function crowdGetEmoji(level) {
  if (level === "low") return "😊";
  if (level === "moderate") return "🙂";
  if (level === "high") return "😬";
  return "😰";
}

function crowdGetPillClass(level) {
  if (level === "low") return "crowd-pill-low";
  if (level === "moderate") return "crowd-pill-moderate";
  if (level === "high") return "crowd-pill-high";
  return "crowd-pill-very-high";
}

function crowdGetProgressClass(level) {
  if (level === "low") return "crowd-progress-low";
  if (level === "moderate") return "crowd-progress-moderate";
  if (level === "high") return "crowd-progress-high";
  return "crowd-progress-very-high";
}

function crowdGetParkingClass(parkingValue) {
  const parking = parkingValue.toLowerCase();

  if (parking === "available") return "crowd-amenity-good";
  if (parking === "limited") return "crowd-amenity-warn";
  return "crowd-amenity-bad";
}

function crowdGetYesNoClass(value) {
  return value === "Yes" ? "crowd-amenity-good" : "crowd-amenity-bad";
}

function crowdRenderSummary(beachesToShow) {
  let low = 0;
  let moderate = 0;
  let high = 0;
  let veryHigh = 0;

  beachesToShow.forEach((beach) => {
    const occupancy = crowdGetOccupancy(beach);
    const level = crowdGetLevel(occupancy);

    if (level === "low") low++;
    else if (level === "moderate") moderate++;
    else if (level === "high") high++;
    else veryHigh++;
  });

  crowdLowCount.textContent = low;
  crowdModerateCount.textContent = moderate;
  crowdHighCount.textContent = high;
  crowdVeryHighCount.textContent = veryHigh;
}

function crowdCreateCard(beach) {
  const occupancy = crowdGetOccupancy(beach);
  const level = crowdGetLevel(occupancy);
  const emoji = crowdGetEmoji(level);
  const pillClass = crowdGetPillClass(level);
  const progressClass = crowdGetProgressClass(level);

  return `
    <article class="crowd-card">
      <div class="crowd-card-top">
        <div>
          <h3 class="crowd-card-title">${beach.name}</h3>
          <p class="crowd-card-location">${beach.city}, ${beach.lake}</p>
        </div>
        <div class="crowd-level-pill ${pillClass}">${emoji}</div>
      </div>

      <div class="crowd-occupancy-row">
        <span class="crowd-occupancy-label">${crowdViewMode === "current" ? "Current Occupancy:" : "Forecast Occupancy:"}</span>
        <span class="crowd-occupancy-value">${occupancy}%</span>
      </div>

      <div class="crowd-progress-track">
        <div class="crowd-progress-fill ${progressClass}" style="width: ${occupancy}%;"></div>
      </div>

      <p class="crowd-updated">${beach.updated}</p>

      <div class="crowd-peak-box">
        <div class="crowd-peak-title">Peak Hours:</div>
        <div class="crowd-peak-time">${beach.peakHours}</div>
      </div>

      <div class="crowd-amenities-title">Amenities:</div>
      <div class="crowd-amenities-grid">
        <div class="crowd-amenity-box ${crowdGetParkingClass(beach.parking)}">🅿 Parking: ${beach.parking}</div>
        <div class="crowd-amenity-box ${crowdGetYesNoClass(beach.lifeguard)}">🏖 Lifeguard: ${beach.lifeguard}</div>
        <div class="crowd-amenity-box ${crowdGetYesNoClass(beach.restrooms)}">🚻 Restrooms: ${beach.restrooms}</div>
        <div class="crowd-amenity-box ${crowdGetYesNoClass(beach.food)}">🍔 Food: ${beach.food}</div>
      </div>
    </article>
  `;
}

function crowdGetSelectedBeaches() {
  const selectedValue = crowdBeachSelect.value;

  if (selectedValue === "all") {
    return crowdBeachData;
  }

  return crowdBeachData.filter((beach) => String(beach.id) === selectedValue);
}

function crowdRenderPage() {
  const selectedBeaches = crowdGetSelectedBeaches();

  crowdRenderSummary(selectedBeaches);

  if (selectedBeaches.length === 0) {
    crowdBeachContainer.innerHTML = "<p>No beaches found.</p>";
    return;
  }

  crowdBeachContainer.innerHTML = selectedBeaches.map(crowdCreateCard).join("");
}

function crowdSetViewMode(mode) {
  crowdViewMode = mode;

  if (mode === "current") {
    crowdCurrentBtn.classList.add("crowd-toggle-btn-active");
    crowdForecastBtn.classList.remove("crowd-toggle-btn-active");
  } else {
    crowdForecastBtn.classList.add("crowd-toggle-btn-active");
    crowdCurrentBtn.classList.remove("crowd-toggle-btn-active");
  }

  crowdRenderPage();
}

crowdBeachSelect.addEventListener("change", crowdRenderPage);

crowdCurrentBtn.addEventListener("click", () => {
  crowdSetViewMode("current");
});

crowdForecastBtn.addEventListener("click", () => {
  crowdSetViewMode("forecast");
});

crowdPopulateDropdown();
crowdRenderPage();