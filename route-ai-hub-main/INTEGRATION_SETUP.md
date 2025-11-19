# Handoff Frontend-Backend Integration Setup

## ✅ Completed Setup

The frontend and backend are now ready for integration! Here's what has been set up:

### 1. Next.js Proxy API Routes

Three proxy routes have been created in the `frontend/app/api/` directory to forward requests to the FastAPI backend:

#### `/api/route` - POST Endpoint
- **Location**: `frontend/app/api/route/route.ts`
- **Purpose**: Forwards clinical routing requests to the backend
- **Headers**: Automatically injects `x-api-key` and `Idempotency-Key`
- **Usage**: 
  ```bash
  curl -X POST http://localhost:3000/api/route \
    -H "Content-Type: application/json" \
    -d '{"patient_id":"patient-00000","department":"Radiology","free_text":"MRI brain"}'
  ```

#### `/api/events` - GET Endpoint
- **Location**: `frontend/app/api/events/route.ts`
- **Purpose**: Fetches event logs from the backend
- **Headers**: Automatically injects `x-api-key`
- **Cache**: Disabled (`cache: "no-store"`)
- **Usage**:
  ```bash
  curl -s http://localhost:3000/api/events
  ```

#### `/api/events/stream` - Server-Sent Events Streaming
- **Location**: `frontend/app/api/events/stream/route.ts`
- **Purpose**: Streams real-time events from the backend
- **Runtime**: Edge runtime for optimal performance
- **Headers**: Proper SSE headers for streaming
- **Usage**:
  ```bash
  curl -s http://localhost:3000/api/events/stream
  ```

### 2. Environment Configuration

**File**: `frontend/.env.local`

```
BACKEND_BASE_URL=http://127.0.0.1:8000
BACKEND_API_KEY=dev-local
NEXT_PUBLIC_API_BASE=/api
```

**Environment Variables**:
- `BACKEND_BASE_URL`: FastAPI server URL (defaults to `http://127.0.0.1:8000`)
- `BACKEND_API_KEY`: API authentication key for backend requests
- `NEXT_PUBLIC_API_BASE`: Frontend-accessible API base path

### 3. Project Structure

```
frontend/
├── app/
│   ├── api/
│   │   ├── route/
│   │   │   └── route.ts          # POST /api/route proxy
│   │   ├── events/
│   │   │   ├── route.ts          # GET /api/events proxy
│   │   │   └── stream/
│   │   │       └── route.ts      # GET /api/events/stream (SSE)
│   │   └── metrics/
│   │       └── route.ts          # Existing mock endpoint
│   ├── page.tsx
│   ├── layout.tsx
│   ├── globals.css
│   └── ...
├── .env.local                    # Environment variables
├── package.json
├── tsconfig.json
└── ...
```

## 🚀 Running the Integration

### Step 1: Start the Backend (FastAPI)
```bash
cd backend
python -m venv venv
source venv/bin/activate  # or `venv\Scripts\activate` on Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Step 2: Start the Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:3000
```

### Step 3: Verify Integration
- Visit `http://localhost:3000` to see the landing page
- Visit `http://localhost:3000/dashboard` to see the dashboard
- The dashboard will fetch metrics from `/api/metrics` which proxies to the backend

## 🔗 How It Works

1. **Frontend Request**: Client makes a request to `http://localhost:3000/api/events`
2. **Next.js Proxy**: The API route intercepts and forwards to FastAPI backend
3. **Authentication**: The `x-api-key` header is automatically injected
4. **Response**: Backend response is returned to the client

### Example Flow

```
Frontend Component
    ↓
fetch('/api/events')
    ↓
Next.js Route Handler (/api/events/route.ts)
    ↓
Add x-api-key header
    ↓
Forward to FastAPI (http://127.0.0.1:8000/events)
    ↓
Return response to frontend
```

## 🔧 Modifying Routes

To add new proxy routes:

1. Create a new directory: `frontend/app/api/[endpoint]/`
2. Create `route.ts` with the appropriate handler (GET, POST, etc.)
3. Example for a new POST endpoint:

```typescript
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const res = await fetch(`${process.env.BACKEND_BASE_URL}/your-endpoint`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.BACKEND_API_KEY || "",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  return new NextResponse(await res.text(), {
    status: res.status,
    headers: { "Content-Type": res.headers.get("content-type") || "application/json" },
  });
}
```

## 🐛 Troubleshooting

### Routes Returning 404
- Ensure `npm run dev` is running in the `frontend/` directory
- Try restarting the dev server: `npm run dev`
- Clear `.next` cache: `rm -rf .next && npm run dev`

### Backend Connection Errors
- Verify FastAPI is running: `curl http://127.0.0.1:8000/docs`
- Check `BACKEND_BASE_URL` in `.env.local`
- Ensure the API key in `.env.local` matches the backend

### CORS Issues
- Ensure backend has CORS enabled for `http://localhost:3000`
- Backend should have the frontend origin in CORS allowlist

## 📝 Next Steps

1. **Implement Backend Routes**: Create the corresponding routes in FastAPI
2. **Update Components**: Modify frontend components to call the new proxy routes
3. **Add Authentication**: Implement user authentication in the backend
4. **Database Integration**: Set up persistent data storage
5. **Deployment**: Deploy frontend to Vercel and backend to your hosting provider

## 📚 Resources

- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [CORS in FastAPI](https://fastapi.tiangolo.com/tutorial/cors/)
- [Server-Sent Events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events)
