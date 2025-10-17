**Handoff** – AI-Powered Smart Request Routing for Healthcare
Team Members

Gerson Estrada – Backend Engineer (FastAPI, Claude Integration)

Toshi Nagai – Frontend Engineer (Next.js, Dashboard Design)

Project Title:
Handoff: Intelligent Clinical Request Routing Engine

**Summary**
**The Problem**

Hospitals lose millions each year due to misrouted or delayed clinical requests.
Examples include:

Imaging orders sent to the wrong facility
Referrals that never reach specialists
Lab samples shipped to the wrong campus
These issues occur because of inconsistent patient identifiers, legacy EHR formats, and manual routing processes. The result is slower turnaround times, increased administrative work, and fragmented patient records.

**The Solution**

Handoff automates clinical request routing using AI.
It receives a clinical request, classifies it, and routes it to the most appropriate facility based on data such as proximity, capacity, and patient history.

**How it works:**

Ingest Request: Accepts structured or unstructured requests.

Classify with AI: Interprets free-text orders like “non-contrast MRI abdomen.”

Score Facilities: Evaluates facilities by capability, distance, capacity, and historical patient visits.

Explain Decisions: Generates clear, clinician-friendly explanations for routing choices.

Visualize in Real Time: The frontend dashboard displays live routing events and AI explanations.

This creates an explainable and efficient routing system for healthcare operations.

**How AI Is Used**

Request Classification (Claude 3.5 Haiku):
Converts unstructured text into standardized request types such as imaging, lab, or referral.

Decision Explanation (Claude 3.5 Haiku):
Produces clinician-readable rationales for routing decisions.

Confidence Scoring (Optional):
Combines AI outputs with heuristic facility metrics to calculate a confidence level for each routing decision.

**Tech Stack**

Backend: FastAPI, SQLite, SQLAlchemy, Pydantic, Anthropic Claude
Frontend: Next.js (Vite), TailwindCSS, TypeScript
AI: Anthropic Claude 3.5 Haiku (classification and explanation)
Data Layer: Mock Verato-style patient and facility data

**Example API Call

POST /route**

{
  "patient_id": "patient-00000",
  "department": "Radiology",
  "free_text": "MRI brain"
}


**Response**

{
  "route_to_facility_id": "facility-004",
  "confidence": 0.38,
  "reason": "Routed to Facility 004 based on capability, proximity, and prior visits.",
  "explanation": "Patient has prior imaging at this location; routing ensures continuity and reduced turnaround time.",
  "resolved_request_type": "imaging"
}

**Key Backend Files**
File	Description
app/api/route_router.py	Core routing endpoint logic
app/services/llm_classifier.py	AI-based request classification
app/services/llm_explainer.py	AI-generated decision explanations
app/main.py	FastAPI entry point
openapi.json	Backend API contract for frontend integration
Integration

The frontend communicates with /api/route via a proxy that injects the x-api-key.

Live routing decisions stream to the dashboard using Server-Sent Events (SSE).

All data used for routing is mock data representative of real hospital systems.

**Impact**

Handoff reduces routing errors, saves time, and improves coordination between healthcare facilities.
By combining structured scoring with explainable AI, it delivers a transparent, auditable solution to one of the most persistent inefficiencies in clinical operations.

**Key Files for Review**

If the repository is not fully polished, focus on:

backend/app/api/route_router.py – Core backend logic

backend/app/services/llm_classifier.py – AI request classification

backend/app/services/llm_explainer.py – AI explanation generation

backend/openapi.json – API contract used by frontend

frontend/ – Dashboard visualization and integration layer
