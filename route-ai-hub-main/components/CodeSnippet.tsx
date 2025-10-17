"use client";
import { useState } from "react";
import { Button } from "./ui/button";
import { Copy, Check } from "lucide-react";
import { Card, CardContent } from "./ui/card";

export default function CodeSnippet() {
  const [copied, setCopied] = useState(false);
  const code = `POST /fhir/ServiceRequest
{
  "resourceType": "ServiceRequest",
  "code": { "text": "MRI Brain" },
  "subject": { "reference": "Patient/P001" }
}

// Response
{
  "route_to": "facility/002",
  "confidence": 0.92,
  "reason": "Closest MRI center; 3 prior visits"
}`;

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {}
  };

  return (
    <Card className="bg-black/40">
      <CardContent className="relative p-4">
        <pre className="overflow-auto rounded-lg bg-black/30 p-4 text-sm leading-relaxed text-white/90" aria-label="API example code">
{code}
        </pre>
        <Button
          aria-label="Copy snippet"
          onClick={onCopy}
          className="absolute right-3 top-3 h-9 px-3"
          variant="secondary"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </Button>
      </CardContent>
    </Card>
  );
}


