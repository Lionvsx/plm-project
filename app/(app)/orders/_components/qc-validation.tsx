"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Clock, X } from "lucide-react";

type QCStatus = "not_done" | "in_progress" | "done";

interface QCValidationProps {
  show: boolean;
}

export function QCValidation({ show }: QCValidationProps) {
  const [status, setStatus] = useState<QCStatus>("not_done");

  if (!show) return null;

  const steps = [
    {
      id: "not_done" as const,
      label: "Not Done",
      icon: X,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
    },
    {
      id: "in_progress" as const,
      label: "In Progress",
      icon: Clock,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
    {
      id: "done" as const,
      label: "Done",
      icon: Check,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Quality Control Validation
          <Badge
            variant={
              status === "done"
                ? "success"
                : status === "in_progress"
                ? "warning"
                : "destructive"
            }
          >
            {steps.find((s) => s.id === status)?.label}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4">
          {steps.map((step) => (
            <button
              key={step.id}
              onClick={() => setStatus(step.id)}
              className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-lg border transition-colors ${
                status === step.id
                  ? `${step.bgColor} border-${step.color}`
                  : "hover:bg-muted"
              }`}
            >
              <step.icon
                className={`h-5 w-5 ${status === step.id ? step.color : ""}`}
              />
              <span className={status === step.id ? step.color : ""}>
                {step.label}
              </span>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
