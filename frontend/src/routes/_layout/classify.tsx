import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/classify")({
  component: Classify,
});

function Classify() {
  return <div>Hello "/_layout/classify"!</div>
}
