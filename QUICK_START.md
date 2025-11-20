# 🚀 Handoff - Quick Start Guide

## ✅ Current Status: FULLY INTEGRATED

Both frontend and backend are **already running**:
- **Frontend**: http://localhost:3000 ✅
- **Backend**: http://localhost:8000 ✅

---

## 🎯 Test It Immediately

### Option 1: Use the Web UI (Recommended)
1. Open browser: http://localhost:3000/submit
2. Fill in the form:
   ```
   Patient ID: patient-00001
   Request Type: MRI
   Department: Radiology
   Urgency: routine
   Notes: (optional)
   ```
3. Click "Submit Request"
4. See the routing result with facility name and confidence

### Option 2: Use curl (Terminal)
```bash
curl -X POST http://localhost:8000/route \
  -H "Content-Type: application/json" \
  -H "x-api-key: dev-local" \
  -d '{
    "patient_id": "patient-00001",
    "request_type": "MRI",
    "department": "Radiology",
    "urgency": "routine"
  }' | python3 -m json.tool
```

---

## 📊 Check System Health

### Backend Health
```bash
curl http://localhost:8000/health \
  -H "x-api-key: dev-local" | python3 -m json.tool
```

**Expected Response**:
```json
{
  "status": "ok",
  "db": true,
  "llm": true,
  "sse_clients": 0,
  "auth_required": true,
  "api_key_len": 9
}
```

### Backend Metrics
```bash
curl http://localhost:8000/metrics \
  -H "x-api-key: dev-local" | python3 -m json.tool
```

---

## 🔄 Restart Services (If Needed)

### Restart Backend
```bash
# Kill existing process
pkill -f "uvicorn app.main:app"

# Restart
cd /Users/gersonestrada/Desktop/Handoff/route-ai-hub-main/backend
source .venv/bin/activate
uvicorn app.main:app --reload
```

### Restart Frontend
```bash
# Kill existing process
pkill -f "next dev"

# Restart
cd /Users/gersonestrada/Desktop/Handoff/route-ai-hub-main
npm run dev
```

---

## 📝 Test Patient IDs

Available patient IDs (seeded in database):
- `patient-00000` through `patient-00099` (100 Los Angeles patients)

Example test sequence:
```bash
for i in {0..4}; do
  patient_id=$(printf "patient-%05d" $i)
  curl -s -X POST http://localhost:8000/route \
    -H "Content-Type: application/json" \
    -H "x-api-key: dev-local" \
    -d "{\"patient_id\":\"$patient_id\",\"request_type\":\"MRI\",\"department\":\"Radiology\"}" | \
    python3 -c "import sys,json; r=json.load(sys.stdin); print(f\"$patient_id → {r.get('facility_name','Unknown')} ({r.get('confidence',0):.0%})\")"
done
```

---

## 🛠️ Development

### View Real-time Logs
```bash
# Backend logs
tail -f /tmp/backend.log

# Frontend logs (in browser console - F12)
```

### Database
- **Location**: `/Users/gersonestrada/Desktop/Handoff/route-ai-hub-main/backend/app.db`
- **Type**: SQLite
- **Tables**: patients, facilities, events
- View with: `sqlite3 backend/app.db ".tables"`

### API Documentation
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
- OpenAPI: http://localhost:8000/openapi.json

---

## 🔐 API Key

Current configuration: `API_KEY=dev-local`

To change, edit `/backend/.env`:
```env
API_KEY=your-new-key-here
```

Then restart backend.

---

## 🐛 Troubleshooting

### "Connection refused" to backend
- Check if backend is running: `ps aux | grep uvicorn`
- Check port 8000 is free: `lsof -i :8000`
- Restart with provided commands above

### "Cannot GET /submit" on frontend
- Check if frontend is running: `ps aux | grep "next dev"`
- Check port 3000 is free: `lsof -i :3000`
- Clear Next cache: `rm -rf .next && npm run dev`

### "API key mismatch" errors
- Verify `.env` has `API_KEY=dev-local`
- Verify frontend is sending header: `-H "x-api-key: dev-local"`
- Check backend health endpoint

### Database errors
- Database auto-seeds on backend startup
- If schema issues, delete: `rm backend/app.db`
- Restart backend to reseed

---

## 📚 Documentation

See full documentation:
- **Integration Status**: `INTEGRATION_STATUS.md`
- **Backend README**: `backend/README.md`
- **API Spec**: `backend/app/docs/openapi.yaml`

---

## 🎓 Next: Try the Dashboard

When ready to add more features:
1. Implement `/dashboard` page with metrics
2. Connect SSE for real-time events
3. Add facility management
4. Build event history viewer

See `INTEGRATION_STATUS.md` for next steps.

---

**Status**: ✅ Ready to Use
**Last Updated**: October 17, 2025
