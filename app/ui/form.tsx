"use client";

import { sendEmail, State } from "@/app/lib/actions";
import clsx from "clsx";
import { RefObject, useActionState, useState } from "react";

export default function Form({ 
  hasBgWhite,
  innerRef
}: { 
  hasBgWhite?: boolean;
  innerRef: RefObject<HTMLDivElement | null>;
}) {
  const initialState: State = {
    errors: {},
    message: null,
    success: undefined,
    inputs: {},
  };
  const [state, formAction] = useActionState(sendEmail, initialState);
  // create a state object to know which error input was touched that will receive property names with a boolean value
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  let globalMessage = null;

  // access the current state, copy added properties and add new property
  const handleFocus = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // show input validation errors
  const nameError =
    state.errors?.firstName && !touched?.firstName ? (
      <p className="text-red-600">{state.errors.firstName}</p>
    ) : null;
  const emailError =
    state.errors?.email && !touched?.email ? (
      <p className="text-red-600">{state.errors.email[0]}</p>
    ) : null;
  const messageError =
    state.errors?.message && !touched?.message ? (
      <p className="text-red-600">{state.errors.message}</p>
    ) : null;

  // show global message
  if (state.success) {
    globalMessage = <p className="text-green-600">{state.message}</p>;
  }

  return (
    <div
      id="contact"
      ref={innerRef}
      className={clsx(
        "flex flex-col w-full h-auto items-center py-16 px-5 lg:px-[56px]",
        {
          "bg-white" : !hasBgWhite,
          "bg-neutral-200" : hasBgWhite
        }
      )}
    >
      <h1 className="text-4xl lg:text-[44px] text-center">Pede um orçamento gratis</h1>
      <div className="w-7 h-[3px] bg-foreground mx-auto my-5"></div>
      <form
        onSubmit={() => setTouched({})}
        id="contact"
        action={formAction}
        className={clsx("w-full", {
          "max-w-md": !hasBgWhite,
          "max-w-lg": hasBgWhite,
        })}
        noValidate
      >
        <div
          className={clsx("grid grid-cols-1", {
            "p-8 bg-white": hasBgWhite,
          })}
        >
          <div className="col-span-full mt-4">
            <label
              htmlFor="name"
              className="after:content-['*'] after:ml-0.5 block text-sm/6 font-medium text-gray-900"
            >
              Nome
            </label>
            <div className="mt-2">
              <input
                id="name"
                type="text"
                className={clsx(
                  "block w-full bg-white px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 sm:text-sm/6 border-neutral-900 outline-none",
                  {
                    "border focus:ring-2 focus:ring-primary-500 focus:border-transparent":
                      !hasBgWhite,
                    "border-b-2 focus:border-primary-500": hasBgWhite,
                    "ring-2 ring-red-600 border-transparent":
                      nameError && !hasBgWhite,
                    "border-red-600": nameError && hasBgWhite,
                  },
                )}
                onFocus={() => handleFocus("firstName")}
                name="name"
                aria-required="true"
                defaultValue={state.inputs?.firstName || ""}
              />
            </div>
            {nameError}
          </div>
          <div className="col-span-full mt-4">
            <label
              htmlFor="email"
              className="after:content-['*'] after:ml-0.5 block text-sm/6 font-medium text-gray-900"
            >
              Email
            </label>
            <div className="mt-2">
              <input
                id="email"
                type="email"
                name="email"
                className={clsx(
                  "block w-full bg-white px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 sm:text-sm/6 border-neutral-900 outline-none",
                  {
                    "border focus:ring-2 focus:ring-primary-500 focus:border-transparent":
                      !hasBgWhite,
                    "border-b-2 focus:border-primary-500": hasBgWhite,
                    "ring-2 ring-red-600 border-transparent":
                      emailError && !hasBgWhite,
                    "border-red-600": emailError && hasBgWhite,
                  },
                )}
                onFocus={() => handleFocus("email")}
                aria-required="true"
                defaultValue={state.inputs?.email || ""}
              />
            </div>
            {emailError}
          </div>
          <div className="col-span-full mt-4">
            <label
              htmlFor="message"
              className="after:content-['*'] after:ml-0.5 block text-sm/6 font-medium text-gray-900"
            >
              Deixe sua mensagem
            </label>
            <div className="mt-2">
              <textarea
                id="message"
                name="message"
                rows={3}
                className={clsx(
                  "block w-full bg-white px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 sm:text-sm/6 border-neutral-900 outline-none",
                  {
                    "border focus:ring-2 focus:ring-primary-500 focus:border-transparent":
                      !hasBgWhite,
                    "border-b-2 focus:border-primary-500": hasBgWhite,
                    "ring-2 ring-red-600 border-transparent":
                      messageError && !hasBgWhite,
                    "border-red-600": messageError && hasBgWhite,
                  },
                )}
                onFocus={() => handleFocus("message")}
                aria-required="true"
                defaultValue={state.inputs?.message || ""}
              ></textarea>
            </div>
            {messageError}
          </div>
          {globalMessage}
          <button
            type="submit"
            className="font-mulish font-medium w-full rounded-full h-12 bg-primary-500 hover:bg-primary-600 cursor-pointer text-white mt-8"
          >
            Submeter
          </button>
        </div>
      </form>
    </div>
  );
}
