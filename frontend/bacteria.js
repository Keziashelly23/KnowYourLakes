const dropdown = document.getElementById("lakeSelect");
const list = document.getElementById("beachList");

const safeCount = document.getElementById("safeCount");
const advCount = document.getElementById("advCount");
const closedCount = document.getElementById("closedCount");

function getStatusClass(status) {
  if (status === "Safe") return "safe-card";
  if (status === "Advisory") return "advisory-card";
  return "closed-card";
}

function getBadgeClass(status) {
  if (status === "Safe") return "badge-safe";
  if (status === "Advisory") return "badge-advisory";
  return "badge-closed";
}

function getSeverity(status) {
  if (status === "Safe") return "Low";
  if (status === "Advisory") return "Moderate";
  return "High";
}

function getRecommendation(status) {
  if (status === "Safe") return "Safe for swimming";
  if (status === "Advisory") return "Swim with caution";
  return "Do not swim";
}

async function loadData() {
  const lake = dropdown.value;

  const url =
    lake === "all"
      ? "http://localhost:5000/api/bacteria"
      : `http://localhost:5000/api/bacteria?lake=${encodeURIComponent(lake)}`;

  const res = await fetch(url);
  const data = await res.json();

  list.innerHTML = "";

  let safe = 0;
  let adv = 0;
  let closed = 0;

  data.forEach((beach) => {
    const status = beach.bacteria.status;

    if (status === "Safe") safe++;
    else if (status === "Advisory") adv++;
    else if (status === "Closed") closed++;

    const div = document.createElement("div");
    div.className = `card ${getStatusClass(status)}`;

    div.innerHTML = `
      <div class="status-badge ${getBadgeClass(status)}">${status.toUpperCase()}</div>
      <div class="beach-name">Lake ${beach.lake} - ${beach.name}</div>
      <div class="beach-meta">${beach.city}, Michigan</div>

      <div class="row">
        <div class="row-label">E. Coli Level:</div>
        <div class="row-value">${beach.bacteria.ecoli} CFU/100ml</div>
      </div>

      <div class="row">
        <div class="row-label">Status:</div>
        <div class="row-value">${getSeverity(status)}</div>
      </div>

      <div class="message-title">Recommendation:</div>
      <div class="message-text">${getRecommendation(status)}</div>
      <div class="message-text" style="margin-top:10px;">${beach.bacteria.message}</div>
      <div class="message-text" style="margin-top:14px; color:#64748b;">📅 Last tested: March 28, 2026</div>
    `;

    list.appendChild(div);
  });

  safeCount.textContent = safe;
  advCount.textContent = adv;
  closedCount.textContent = closed;

  if (data.length === 0) {
    list.innerHTML = `<div class="empty-state">No beaches found for this lake.</div>`;
  }
}

dropdown.addEventListener("change", loadData);
loadData();