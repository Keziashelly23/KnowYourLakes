Set a Google Places API key in your shell, then run:

```powershell
$env:GOOGLE_PLACES_API_KEY="your-key"
python backend/google_places_accessibility.py
```

That script writes `frontend/beach-accessibility.json`, and the frontend page reads it automatically.
