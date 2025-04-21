import { createFileRoute } from "@tanstack/react-router";
import {
  resolveFromIdentity,
  createAuthorizationUrl,
  OAuthUserAgent,
} from "@atcute/oauth-browser-client";
import { useEffect, type FormEvent } from "react";
import { XRPC } from "@atcute/client";

export const Route = createFileRoute("/")({
  component: App,
  loader: async ({ location }) => {
    // @ts-ignore
    const agent = new OAuthUserAgent(location?.state?.session);
    const rpc = new XRPC({ handler: agent });
    const { data } = await rpc.get("com.atproto.repo.listRecords", {
      params: {
        repo: location?.state?.session?.info?.sub,
        collection: "app.bsky.graph.starterpack",
      },
    });

    console.log({ data });
  },
});

function App() {
  async function onFormSubmit(event: FormEvent<HTMLFormElement>) {
    try {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const handle = formData.get("handle") as string;
      if (!handle || typeof handle !== "string") return;
      const { metadata, identity } = await resolveFromIdentity(handle.trim());

      const auth_url = await createAuthorizationUrl({
        metadata,
        identity,
        scope: import.meta.env.VITE_OAUTH_SCOPE,
      });

      window.location.assign(auth_url);
    } catch (error) {
      throw error;
    }
  }

  useEffect(() => {
    async function authorizationListener() {
      await new Promise((_resolve, reject) => {
        const listener = () => {
          reject(new Error(`user aborted the login request`));
        };

        window.addEventListener("pageshow", listener, { once: true });
      });
    }

    authorizationListener();
  }, []);

  return (
    <section>
      <h1>login with bsky</h1>
      <form onSubmit={onFormSubmit}>
        <label htmlFor="handle">handle</label>
        <input
          type="text"
          maxLength={255}
          minLength={10}
          name="handle"
          id="handle"
        />
        <button type="submit">login</button>
      </form>
    </section>
  );
}
