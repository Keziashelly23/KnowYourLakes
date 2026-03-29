import json
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path


LAKES = [
    {
        "id": "superior",
        "name": "Lake Superior",
        "region": "Upper Peninsula",
        "latitude": 46.7600,
        "longitude": -84.9500,
    },
    {
        "id": "michigan",
        "name": "Lake Michigan",
        "region": "West Michigan",
        "latitude": 43.6380,
        "longitude": -86.5000,
    },
    {
        "id": "huron",
        "name": "Lake Huron",
        "region": "Eastern Michigan",
        "latitude": 44.8000,
        "longitude": -82.4000,
    },
    {
        "id": "erie",
        "name": "Lake Erie",
        "region": "Southeast Michigan",
        "latitude": 41.9600,
        "longitude": -83.2700,
    },
    {
        "id": "st-clair",
        "name": "Lake St. Clair",
        "region": "Metro Detroit",
        "latitude": 42.4700,
        "longitude": -82.8000,
    },
    {
        "id": "torch",
        "name": "Torch Lake",
        "region": "Northern Lower Peninsula",
        "latitude": 44.9400,
        "longitude": -85.3100,
    },
    {
        "id": "muskegon",
        "name": "Muskegon Lake",
        "region": "West Michigan inland lake",
        "latitude": 43.2420,
        "longitude": -86.2800,
    },
]

API_URL = "https://marine-api.open-meteo.com/v1/marine"
OUTPUT_PATH = Path(__file__).resolve().parents[1] / "frontend" / "lake-data.json"


def fetch_json(url: str) -> dict:
    with urllib.request.urlopen(url, timeout=30) as response:
        return json.load(response)


def build_url(latitude: float, longitude: float) -> str:
    params = {
        "latitude": latitude,
        "longitude": longitude,
        "current": "wave_height,wind_wave_height,wind_wave_direction",
        "timezone": "America/New_York",
    }
    return f"{API_URL}?{urllib.parse.urlencode(params)}"


def classify_safety(wave_height: float) -> tuple[str, str]:
    if wave_height >= 1.2:
        return "Not safe for most swimmers", "danger"
    if wave_height >= 0.6:
        return "Use caution", "caution"
    return "Generally safe", "safe"


def direction_label(direction: float) -> str:
    compass = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"]
    index = round(direction / 45) % len(compass)
    return compass[index]


def build_note(wave_height: float, wind_wave_height: float) -> str:
    if wave_height >= 1.2:
        return "Higher waves can create stronger pullback and rougher swimming near shore."
    if wind_wave_height >= 0.5:
        return "Wind-driven chop may build through the day, especially in exposed areas."
    return "Conditions look relatively calm, but shoreline weather can still change quickly."


def build_advice(safety: str, lake_name: str) -> str:
    if safety == "Not safe for most swimmers":
        return f"Avoid open-water swimming at {lake_name} until wave heights drop."
    if safety == "Use caution":
        return f"Swim near populated beach areas at {lake_name} and keep a close eye on conditions."
    return f"{lake_name} looks calmer right now, but keep watching wind and local beach warnings."


def transform_lake(lake: dict) -> dict:
    payload = fetch_json(build_url(lake["latitude"], lake["longitude"]))
    current = payload.get("current", {})

    wave_height = float(current.get("wave_height") or 0)
    wind_wave_height = float(current.get("wind_wave_height") or 0)
    wind_wave_direction = float(current.get("wind_wave_direction") or 0)
    safety, level = classify_safety(wave_height)
    current_text = (
        f"{wave_height:.1f} m waves, wind chop {wind_wave_height:.1f} m, moving {direction_label(wind_wave_direction)}"
    )
    waves_text = (
        "Low wave action"
        if wave_height < 0.6
        else "Moderate waves"
        if wave_height < 1.2
        else "High waves"
    )

    return {
        "id": lake["id"],
        "name": lake["name"],
        "region": lake["region"],
        "current": current_text,
        "safety": safety,
        "waves": waves_text,
        "note": build_note(wave_height, wind_wave_height),
        "advice": build_advice(safety, lake["name"]),
        "level": level,
        "updatedAt": current.get("time", datetime.now(timezone.utc).isoformat()),
        "raw": {
            "waveHeightMeters": wave_height,
            "windWaveHeightMeters": wind_wave_height,
            "windWaveDirectionDegrees": wind_wave_direction,
        },
    }


def main() -> None:
    results = [transform_lake(lake) for lake in LAKES]
    output = {
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "source": "Open-Meteo Marine API",
        "lakes": results,
    }
    OUTPUT_PATH.write_text(json.dumps(output, indent=2), encoding="utf-8")
    print(f"Wrote lake data to {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
