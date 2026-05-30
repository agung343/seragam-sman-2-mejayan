"use client";
import { useActionState } from "react";
import { updateCicilan } from "@/lib/action/sale";

interface Props {
  studentId: string;
}

const initState = {
  success: false,
  errorMsg: "",
};

export default function CicilanForm({ studentId }: Props) {
  const cicilanAction = updateCicilan.bind(null, studentId);
  const [state, formAction, isPending] = useActionState(
    cicilanAction,
    initState
  );

  return (
    <form action={formAction} className="flex flex-col gap-2.5 md:gap-4">
      <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
        <label htmlFor="paid" className="md:text-lg">
          Bayar
        </label>
        <input
          id="paid"
          name="paid"
          className="py-1.5 md:py-2 px-2 md:px-4 border rounded-md bg:neutral-100 text-neutral-800 text-sm md:text-lg w-3/4 md:w-1/4"
        />
      </div>
      <div className="flex justify-center">
        <button className="bg-sky-400 p-2 rounded-md md:text-lg text-neutral-100 disabled::bg-neutral-500">
          {isPending ? "Updating..." : "Update"}
        </button>
      </div>
      {state.errorMsg && (
        <span className="text-[10px] md:text-sm font-light">
          {state.errorMsg}
        </span>
      )}
    </form>
  );
}
