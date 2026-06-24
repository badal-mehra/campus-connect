import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/tutors/$id")({
  component: () => <Outlet />,
});
