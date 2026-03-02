# Judge0 API Setup (Hosted - No Docker)

## 1. Get Judge0 API Key

**Option A: Judge0 CE (ce.judge0.com)**
- Visit [Judge0](https://judge0.com) and sign up
- Get your API key from the dashboard

**Option B: RapidAPI**
- Visit [RapidAPI Judge0 CE](https://rapidapi.com/judge0-official/api/judge0-ce)
- Subscribe to the free Basic Plan
- Copy your RapidAPI key

## 2. Configure Backend

Add to `intelliplace-backend/.env`:

**For Judge0 CE (ce.judge0.com):**
```env
JUDGE0_API_URL=https://ce.judge0.com
JUDGE0_AUTH_TOKEN=your-judge0-api-key
```

**For RapidAPI:**
```env
JUDGE0_API_URL=https://judge0-ce.p.rapidapi.com
JUDGE0_API_KEY=your-rapidapi-key
# X-RapidAPI-Host is auto-set to judge0-ce.p.rapidapi.com
```

## 3. Restart Backend

```bash
node server.js
```

## Supported Languages

| Language | App ID |
|----------|--------|
| C        | 50     |
| C++      | 54     |
| Python   | 92     |
| Java     | 91     |
