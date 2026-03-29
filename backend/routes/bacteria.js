const express = require("express");
const router = express.Router();
const beaches = require("../data/michigan_beaches.json");
const axios = require("axios");

// ==============================
// MAIN ROUTE (your bacteria data)
// ==============================
router.get("/", (req, res) => {
  const selectedLake = req.query.lake;

  if (!selectedLake || selectedLake.toLowerCase() === "all") {
    return res.json(beaches);
  }

  const filteredBeaches = beaches.filter(
    (beach) => beach.lake.toLowerCase() === selectedLake.toLowerCase()
  );

  if (filteredBeaches.length === 0) {
    return res.status(404).json({ error: "No beaches found for this lake" });
  }

  return res.json(filteredBeaches);
});

// ==============================
// REAL BEACHES (clean 7 only)
// ==============================
router.get("/real-beaches", async (req, res) => {
  try {
    const response = await axios.get(
      "https://gisagoegle.state.mi.us/arcgis/rest/services/EGLE/AUID2024OpenData/MapServer/0/query",
      {
        params: {
          where: "1=1",
          outFields: "WaterbodyName,Description,Latitude,Longitude,BeachGuardLink",
          returnGeometry: false,
          f: "json"
        }
      }
    );

    const features = response.data.features || [];

    // EXACT matches (not fuzzy anymore)
    const selected = [];

    for (let f of features) {
      const name = (f.attributes.Description || "").toLowerCase();

      if (name.includes("grand haven state park")) {
        selected.push({
          name: "Grand Haven State Park Beach",
          lake: "Michigan",
          lat: f.attributes.Latitude,
          lon: f.attributes.Longitude
        });
      }

      if (name.includes("muskegon state park")) {
        selected.push({
          name: "Muskegon State Park Beach",
          lake: "Michigan",
          lat: f.attributes.Latitude,
          lon: f.attributes.Longitude
        });
      }

      if (name.includes("sleeping bear dunes")) {
        selected.push({
          name: "Sleeping Bear Dunes Beach",
          lake: "Michigan",
          lat: f.attributes.Latitude,
          lon: f.attributes.Longitude
        });
      }

      if (name.includes("mackinaw city")) {
        selected.push({
          name: "Mackinaw City Beach",
          lake: "Huron",
          lat: f.attributes.Latitude,
          lon: f.attributes.Longitude
        });
      }

      if (name.includes("metropark")) {
        selected.push({
          name: "Lake St Clair Metropark Beach",
          lake: "St Clair",
          lat: f.attributes.Latitude,
          lon: f.attributes.Longitude
        });
      }

      if (name.includes("sterling state park")) {
        selected.push({
          name: "Sterling State Park Beach",
          lake: "Erie",
          lat: f.attributes.Latitude,
          lon: f.attributes.Longitude
        });
      }

      if (name.includes("tawas point")) {
        selected.push({
          name: "Tawas Point State Park Beach",
          lake: "Huron",
          lat: f.attributes.Latitude,
          lon: f.attributes.Longitude
        });
      }
    }

    // remove duplicates
    const unique = [];
    const seen = new Set();

    for (let b of selected) {
      if (!seen.has(b.name)) {
        seen.add(b.name);
        unique.push(b);
      }
    }

    return res.json(unique);
  } catch (error) {
    return res.status(500).json({
      error: "Failed to fetch real Michigan beach data",
      details: error.message
    });
  }
});

module.exports = router;