# Testing Frontend-Backend Integration

This guide walks through setting up and testing the Handoff full-stack application with Next.js frontend and FastAPI backend.

## Prerequisites

- Python 3.9+
- Node.js 18+
- Both services running on localhost

## Step 1: Start the FastAPI Backend

### Terminal 1: Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the development server
python -m uvicorn app.main:app --reload --port 8000
```

**Expected Output:**
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete
```

**Verify Backend is Running:**
```bash
# In another terminal, check the API
curl http://127.0.0.1:8000/docs
# Should open Swagger UI documentation
```

## Step 2: Start the Next.js Frontend

### Terminal 2: Frontend Setup

```bash
cd frontend

# Install dependencies (if not already done)
npm install

# Start development server
npm run dev
```

**Expected Output:**
```
▲ Next.js 14.2.33
  Local:        http://localhost:3000
  Ready in 1234ms
```

## Step 3: Smoke Test the Proxy Routes

### Terminal 3: Test the Endpoints

#### Test 1: POST /api/route - Submit a Routing Request

```bash
curl -s -X POST http://localhost:3000/api/route \
  -H "Content-Type: application/json" \
  -d '{"patient_id":"patient-00000","department":"Radiology","free_text":"MRI brain"}' \
| python3 -m json.tool
```

**Expected Response:**
```json
{
  "route_to_facility_id": "FAC001",
  "confidence": 0.92,
  "decision_status": "success",
  "resolved_request_type": "MRI",
  "reason": "Closest facility with MRI capability",
  "explanation": "Patient routed based on proximity, facility capability, and availability",
  "features_used": ["patient_identity", "facility_scoring", "capability_matching"]
}
```

#### Test 2: GET /api/events - Fetch Event Logs

```bash
curl -s http://localhost:3000/api/events | python3 -m json.tool
```

**Expected Response:**
```json
[
  {
    "id": "evt_001",
    "ts": "2024-10-17T10:30:45Z",
    "patient_id": "patient-00000",
    "request_type": "MRI",
    "routed_facility_id": "FAC001",
    "confidence": 0.92,
    "reason": "Closest facility",
    "explanation": "..."
  }
]
```

#### Test 3: GET /api/events/stream - Real-Time Event Streaming

```bash
curl -s http://localhost:3000/api/events/stream
# This will stream events as they occur
# Press Ctrl+C to stop
```

**Expected Output:**
```
data: {"id":"evt_002","ts":"2024-10-17T10:31:15Z",...}
data: {"id":"evt_003","ts":"2024-10-17T10:31:30Z",...}
```

## Step 4: Manual UI Testing

### 4.1 Test Routing Request Form

1. Visit http://localhost:3000
2. Navigate to a form that submits routing requests (if available in the Vite app)
3. Fill in the form with:
   - **Patient ID**: `patient-00000`
   - **Department**: `Radiology`
   - **Request Type**: `MRI`
   - **Free Text**: `MRI brain scan`
4. Click Submit
5. **Expected**: Should show success message with facility ID and confidence score

### 4.2 Test Event Stream Display

1. Visit the dashboard/events page
2. **Expected**: Live event stream should start populating in real-time
3. Submit a new routing request
4. **Expected**: New event should appear at the top of the stream

### 4.3 Test Metrics API

1. Visit http://localhost:3000/dashboard
2. **Expected**: Dashboard should load metrics from `/api/metrics`
3. Charts and KPIs should populate with data

## Step 5: Debugging

### Check Network Requests

1. Open browser DevTools (F12)
2. Go to Network tab
3. Submit a form or navigate to a page
4. Look for requests to:
   - `/api/route` (POST)
   - `/api/events` (GET)
   - `/api/events/stream` (GET EventSource)

### View Request/Response Details

In DevTools Network tab, click on any API request to see:
- **Request Headers**: Should see `Content-Type: application/json`
- **Response**: Should see the JSON response from backend

### Check Backend Logs

In the backend terminal, you should see:
```
INFO:     POST /route HTTP/1.1" 200 OK
INFO:     GET /events HTTP/1.1" 200 OK
INFO:     GET /events/stream HTTP/1.1" 200 OK
```

### Check Frontend Logs

In the frontend terminal, you should see:
```
GET /api/route 200 in 123ms
GET /api/events 200 in 45ms
GET /api/events/stream 200 in 1ms
```

## Step 6: Troubleshooting

### Issue: Backend Returns 500 Error

**Solution**: 
- Check backend logs for errors
- Verify database connection: `backend/app.db` exists
- Try: `python backend/app/db/seed.py` to seed data

### Issue: Frontend Shows 404 on /api routes

**Solution**:
- Restart frontend: `npm run dev`
- Clear cache: `rm -rf frontend/.next && npm run dev`
- Check `.env.local` exists in frontend directory

### Issue: CORS Errors in Browser Console

**Solution**:
- This is expected since we're using a proxy
- The errors should go away once backend CORS is properly configured
- Current setup uses Next.js proxy to bypass CORS

### Issue: EventSource Connection Fails

**Solution**:
- Verify backend is running on port 8000
- Check `BACKEND_BASE_URL` in `frontend/.env.local`
- Look at frontend server logs for proxy errors

### Issue: "Connection reset by peer"

**Solution**:
- Make sure both services are running
- Verify firewall isn't blocking localhost:8000
- Try restarting both services

## Common Test Scenarios

### Scenario 1: Complete Routing Flow

1. Terminal 1: Start backend
2. Terminal 2: Start frontend  
3. Terminal 3: Submit routing request via curl
4. Browser: Check dashboard for new event

### Scenario 2: Real-Time Event Monitoring

1. Start backend and frontend
2. Open `/api/events/stream` in one terminal
3. Submit routing requests in another terminal
4. **Expected**: New events appear in stream in real-time

### Scenario 3: Error Handling

1. Stop backend
2. Try to submit a routing request
3. **Expected**: Should show error message with fallback

## Next Steps

- [ ] Implement error handling in UI
- [ ] Add loading states during API calls
- [ ] Implement request debouncing
- [ ] Add request validation
- [ ] Set up e2e tests with Cypress or Playwright
- [ ] Monitor performance metrics
- [ ] Set up error tracking (Sentry)

## Additional Resources

- [Next.js API Routes Documentation](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [EventSource Documentation](https://developer.mozilla.org/en-US/docs/Web/API/EventSource)
- [FastAPI CORS Documentation](https://fastapi.tiangolo.com/tutorial/cors/)
- [Server-Sent Events Guide](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events)
