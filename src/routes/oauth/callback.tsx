import { createFileRoute } from "@tanstack/react-router";
import {
  OAuthUserAgent,
  finalizeAuthorization,
} from "@atcute/oauth-browser-client";
import { XRPC } from "@atcute/client";

export const Route = createFileRoute("/oauth/callback")({
  component: RouteComponent,
  loader: async ({ location, params }) => {
    console.log({ location, params });
  },
});

function RouteComponent() {
  return <div>Hello "/oauth/callback"!</div>;
}
