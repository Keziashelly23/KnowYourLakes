import json
import os
import urllib.request
from datetime import datetime, timezone
from pathlib import Path


PLACES_API_URL = "https://places.googleapis.com/v1/places:searchText"
OUTPUT_PATH = Path(__file__).resolve().parents[1] / "frontend" / "beach-accessibility.json"

LAKES = [
    {
        "id": "superior",
        "lakeName": "Lake Superior",
        "region": "Upper Peninsula",
        "query": "McCarty's Cove beach Marquette Michigan",
    },
    {
        "id": "michigan",
        "lakeName": "Lake Michigan",
        "region": "West Michigan",
        "query": "Pere Marquette Park beach Muskegon Michigan",
    },
    {
        "id": "huron",
        "lakeName": "Lake Huron",
        "region": "Eastern Michigan",
        "query": "Caseville County Park beach Caseville Michigan",
    },
    {
        "id": "erie",
        "lakeName": "Lake Erie",
        "region": "Southeast Michigan",
        "query": "Sterling State Park Beach Monroe Michigan",
    },
    {
        "id": "st-clair",
        "lakeName": "Lake St. Clair",
        "region": "Metro Detroit",
        "query": "Metro Beach Harrison Township Michigan",
    },
    {
        "id": "torch",
        "lakeName": "Torch Lake",
        "region": "Northern Lower Peninsula",
        "query": "Torch Lake Day Park Kewadin Michigan",
    },
    {
        "id": "muskegon",
        "lakeName": "Muskegon Lake",
        "region": "West Michigan inland lake",
        "query": "Muskegon State Park Channel Beach Michigan",
    },
]

FIELD_MASK = ",".join(
    [
        "places.displayName",
        "places.formattedAddress",
        "places.googleMapsUri",
        "places.accessibilityOptions",
        "places.parkingOptions",
        "places.restroom",
    ]
)


def load_api_key() -> str:
    api_key = os.getenv("GOOGLE_PLACES_API_KEY")
    if not api_key:
        raise RuntimeError("Set GOOGLE_PLACES_API_KEY before running this script.")
    return api_key


def fetch_place(query: str, api_key: str) -> dict:
    payload = json.dumps({"textQuery": query, "pageSize": 1}).encode("utf-8")
    request = urllib.request.Request(
        PLACES_API_URL,
        data=payload,
        method="POST",
        headers={
            "Content-Type": "application/json",
            "X-Goog-Api-Key": api_key,
            "X-Goog-FieldMask": FIELD_MASK,
        },
    )

    with urllib.request.urlopen(request, timeout=30) as response:
        data = json.load(response)

    places = data.get("places", [])
    if not places:
        raise RuntimeError(f"No place found for query: {query}")
    return places[0]


def summarize_parking(parking_options: dict) -> str:
    if not parking_options:
        return "No parking details available from Google Places."

    labels = []
    mapping = {
        "freeParkingLot": "free parking lot",
        "paidParkingLot": "paid parking lot",
        "freeStreetParking": "free street parking",
        "paidStreetParking": "paid street parking",
        "freeGarageParking": "free garage parking",
        "paidGarageParking": "paid garage parking",
        "valetParking": "valet parking",
    }
    for key, label in mapping.items():
        if parking_options.get(key) is True:
            labels.append(label)

    return ", ".join(labels) if labels else "No specific parking option listed."


def summarize_accessibility(accessibility: dict) -> tuple[str, str]:
    known_true = sum(
        1
        for key in [
            "wheelchairAccessibleEntrance",
            "wheelchairAccessibleParking",
            "wheelchairAccessibleRestroom",
            "wheelchairAccessibleSeating",
        ]
        if accessibility.get(key) is True
    )
    if known_true >= 3:
        return "Strong accessibility coverage listed", "strong"
    if known_true >= 1:
        return "Some accessible features listed", ""
    return "Accessibility details are limited", ""


def build_note(place: dict) -> str:
    accessibility = place.get("accessibilityOptions", {})
    notes = []

    if accessibility.get("wheelchairAccessibleEntrance") is True:
        notes.append("wheelchair entrance listed")
    if accessibility.get("wheelchairAccessibleParking") is True:
        notes.append("accessible parking listed")
    if accessibility.get("wheelchairAccessibleRestroom") is True:
        notes.append("accessible restroom listed")
    if place.get("restroom") is True and accessibility.get("wheelchairAccessibleRestroom") is not True:
        notes.append("restroom listed but wheelchair restroom not confirmed")

    if not notes:
        return "Google Places returned only limited accessibility information for this beach."

    return "Google Places reports " + ", ".join(notes) + "."


def transform_record(lake: dict, api_key: str) -> dict:
    place = fetch_place(lake["query"], api_key)
    accessibility = place.get("accessibilityOptions", {})
    parking_options = place.get("parkingOptions", {})
    score, level = summarize_accessibility(accessibility)

    return {
        "id": lake["id"],
        "lakeName": lake["lakeName"],
        "region": lake["region"],
        "beachName": place.get("displayName", {}).get("text", lake["query"]),
        "accessibilityScore": score,
        "accessibilityLevel": level,
        "wheelchairAccessibleEntrance": accessibility.get("wheelchairAccessibleEntrance"),
        "wheelchairAccessibleParking": accessibility.get("wheelchairAccessibleParking"),
        "wheelchairAccessibleRestroom": accessibility.get("wheelchairAccessibleRestroom"),
        "wheelchairAccessibleSeating": accessibility.get("wheelchairAccessibleSeating"),
        "parkingOptionsText": summarize_parking(parking_options),
        "formattedAddress": place.get("formattedAddress"),
        "googleMapsUri": place.get("googleMapsUri"),
        "note": build_note(place),
        "updatedAt": datetime.now(timezone.utc).isoformat(),
    }


def main() -> None:
    api_key = load_api_key()
    lakes = [transform_record(lake, api_key) for lake in LAKES]
    payload = {
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "source": "Google Places API (New)",
        "lakes": lakes,
    }
    OUTPUT_PATH.write_text(json.dumps(payload, indent=2), encoding="utf-8")
    print(f"Wrote {OUTPUT_PATH}")


if __name__ == "__main__":
    main()