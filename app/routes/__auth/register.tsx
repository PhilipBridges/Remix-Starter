import { LockClosedIcon } from "@heroicons/react/20/solid";
import { ActionArgs } from "@remix-run/node";
import { Form, useActionData, useSearchParams } from "@remix-run/react";
import { db } from "~/utils/db.server";
import { badRequest } from "~/utils/request.server";
import { createUserSession, registerUser } from "~/utils/session.server";

export const action = async ({ request }: ActionArgs) => {
  const form = await request.formData();
  const username = form.get("username");
  const password = form.get("password");
  if (typeof username !== "string" || typeof password !== "string") {
    return badRequest({
      fieldErrors: null,
      fields: null,
      formError: `Form not submitted correctly.`,
    });
  }

  const userExists = await db.user.findFirst({
    where: { username },
  });
  if (userExists) {
    return badRequest({
      fieldErrors: null,
      formError: `User with username ${username} already exists`,
    });
  }
  const user = await registerUser({ username, password });
  if (!user) {
    return badRequest({
      fieldErrors: null,
      formError: `Something went wrong trying to create a new user.`,
    });
  }
  return createUserSession(user.id, "/");
};

export default function RegisterRoute() {
  return (
    <>
      <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div>
            <img
              className="mx-auto h-12 w-auto"
              src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
              alt="Your Company"
            />
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              Create your account
            </h2>
          </div>
          <Form className="mt-8 space-y-6" method="post">
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="-space-y-px rounded-md shadow-sm">
              <div>
                <label htmlFor="username" className="sr-only">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="text"
                  required
                  className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  placeholder="Username"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  placeholder="Password"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <LockClosedIcon
                    className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                    aria-hidden="true"
                  />
                </span>
                Register
              </button>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
}
