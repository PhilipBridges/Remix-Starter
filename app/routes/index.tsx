import { json, LoaderArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getUser } from "~/utils/session.server";

export const meta: MetaFunction = () => ({
  title: "Remix Starter",
  description: "Let's get started!",
});

export default function IndexRoute() {
  return (
    <>
      <div className="container">
        <div className="content">
          <h1>YO!</h1>
          <ul>
            <li>TEST</li>
          </ul>
        </div>
      </div>
    </>
  );
}
