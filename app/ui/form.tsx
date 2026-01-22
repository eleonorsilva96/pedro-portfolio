"use client";

import { sendEmail, State } from "@/app/lib/actions";
import { useActionState } from "react";

export default function Form() {
  const initialState: State = { errors: {}, message: null, success: undefined, inputs: {} };
  const [state, formAction] = useActionState(sendEmail, initialState);
  let globalMessage = null;

  // show input validation errors
  const nameError = state.errors?.firstName ? <p className="text-red-600">{state.errors.firstName}</p> : null;
  const emailError = state.errors?.email ? <p className="text-red-600">{state.errors.email[0]}</p> : null;
  const messageError = state.errors?.message ? <p className="text-red-600">{state.errors.message}</p> : null;

  // show global message
  if (state.success) {
    globalMessage = <p className="text-green-600">{state.message}</p>;
  } 

  return (
    <form id="contact" action={formAction} className="w-full max-w-md" noValidate>
      <div className="grid grid-cols-1">
        <div className="col-span-full mt-4">
          <label
            htmlFor="name"
            className="block text-sm/6 font-medium text-gray-900"
          >
            Nome
          </label>
          <div className="mt-2">
            <input
              id="name"
              type="text"
              name="name"
              className="block w-full bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-neutral-900 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-primary-500 sm:text-sm/6"
              aria-required="true"
              defaultValue={state.inputs?.firstName || ""}
            />
          </div>
          {nameError}
        </div>
        <div className="col-span-full mt-4">
          <label
            htmlFor="email"
            className="block text-sm/6 font-medium text-gray-900"
          >
            Email
          </label>
          <div className="mt-2">
            <input
              id="email"
              type="email"
              name="email"
              className="block w-full bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-neutral-900 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-primary-500 sm:text-sm/6"
              aria-required="true"
              defaultValue={state.inputs?.email || ""}
            />
          </div>
          {emailError}
        </div>
        <div className="col-span-full mt-4">
          <label
            htmlFor="message"
            className="block text-sm/6 font-medium text-gray-900"
          >
            Deixe sua mensagem
          </label>
          <div className="mt-2">
            <textarea
              id="message"
              name="message"
              rows={3}
              className="block w-full bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-neutral-900 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-primary-500 sm:text-sm/6"
              aria-required="true"
              defaultValue={state.inputs?.message || ""}
            ></textarea>
          </div>
          {/* <p className="mt-3 text-sm/6 text-gray-600">Write a few sentences about yourself.</p> */}
          {messageError}
        </div>
        {globalMessage}
        <button type="submit" className="w-full rounded-full h-12 bg-primary-500 hover:bg-primary-600 cursor-pointer text-white mt-8">
          Submeter
        </button>
      </div>
    </form>
  );
}
