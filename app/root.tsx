import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  useCatch,
  useLoaderData,
} from "@remix-run/react";
import React from "react";
import Navbar from "./components/Navbar";
import styles from "./styles/tailwind.css";
import { getUser } from "./utils/session.server";

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export const loader = async ({ request }) => {
  const user = await getUser(request);
  const data = {
    user,
  };
  return data;
};

function Document({
  children,
  title = `Remix Starter`,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <html lang="en">
      <head>
        <Meta />
        <title>{title}</title>
        <Links />
      </head>
      <body>
        {children}
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <Document>
      <Layout>
        <Outlet />
      </Layout>
    </Document>
  );
}

export function CatchBoundary() {
  const caught = useCatch();

  return (
    <Document title={`${caught.status} ${caught.statusText}`}>
      <div className="error-container">
        <h1>
          {caught.status} {caught.statusText}
        </h1>
      </div>
    </Document>
  );
}

type LayoutProps = {
  children: JSX.Element;
};

function Layout({ children }: LayoutProps) {
  const data = useLoaderData<typeof loader>();
  return (
    <>
      <Navbar props={data} />
      {children}
    </>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return (
    <Document title="Uh-oh!">
      <div className="error-container">
        <h1>App Error</h1>
        <pre>{error.message}</pre>
      </div>
    </Document>
  );
}
