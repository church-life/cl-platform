import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/plans/")({
  component: PlanIndexComponent,
});

function PlanIndexComponent() {
  return <div>Select a plan.</div>;
}
