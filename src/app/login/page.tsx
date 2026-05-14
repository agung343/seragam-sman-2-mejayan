"use client";
import { useActionState } from "react";
import { loginAction } from "@/lib/action/auth";

const initState = {
  success: false,
  errorMsg: undefined as string | undefined,
};

export default function LoginPage() {
  const [state, action, isPending] = useActionState(loginAction, initState);
  return (<>
    <main className="min-h-screen h-3/4">
    <form
      className="flex flex-col justify-center gap-4 md:max-w-md md:mx-auto p-4 dark:text-neutral-100"
      action={action}
    >
      <div className="flex justify-center">
        <h1 className="text-2xl font-bold dark:text-neutral-100">Login</h1>
      </div>
      <div className="p-4 border rounded-md flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="username"
            className="text-lg font-semibold text-neutral-800/50 dark:text-neutral-100"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            className="py-1.5 px-2.5 rounded-md bg-neutral-500/50 text-neutral-800 dark:text-neutral-100"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label
            htmlFor="password"
            className="text-lg font-semibold text-neutral-800/50 dark:text-neutral-100"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="py-1.5 px-2.5 rounded-md bg-neutral-500/50 text-neutral-800 dark:text-neutral-100"
          />
        </div>
        <div className="flex justify-center my-4">
          <button className="bg-blue-500 disabled:bg-gray-500 py-2 px-4 text-neutral-100 rounded-md font-semibold text-lg" disabled={isPending}>
            {isPending ? "Logging In" : "Login"}
          </button>
        </div>
        {state.errorMsg && (
          <span className="text-sm font-light text-red-500">
            {state.errorMsg}
          </span>
        )}
      </div>
    </form>
    </main>
  </>);
}
