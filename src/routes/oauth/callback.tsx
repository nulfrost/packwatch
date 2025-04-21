import { createFileRoute, redirect } from "@tanstack/react-router";
import { finalizeAuthorization } from "@atcute/oauth-browser-client";

export const Route = createFileRoute("/oauth/callback")({
  loader: async ({ location }) => {
    const params = new URLSearchParams(location.hash);
    history.replaceState(null, "", location.pathname + "");
    const session = await finalizeAuthorization(params);
    await new Promise((resolve) => setTimeout(resolve, 3000));
    // @ts-ignore
    throw redirect({ to: "/", state: { session } });
  },
  pendingComponent: RouteComponent,
});

function RouteComponent() {
  return <div>redirecting...</div>;
}
