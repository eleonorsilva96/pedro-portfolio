"use client";

import Link from "next/link";
import clsx from "clsx";
import { useState } from "react";
import { useEffect } from "react";
import Image from "next/image";
import { SiteSetting } from "@/payload-types";

export default function Header({ data }: { data: SiteSetting["header"] }) {
  const [show, setShow] = useState(false);
  const [showDropdown, setDropdown] = useState<string | null>(null);

  // when component mounts
  useEffect(() => {
    // remove scrollbar when mobile menu appears
    if (show) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    }

    // when component unmounts and menu is not open reset overflow style
    return () => {
      document.documentElement.style.overflow = "unset";
      document.body.style.overflow = "unset";
    };
  }, [show]); // run/watch this every time state show changes

  return (
    <header className="font-open sticky w-full h-20 bg-neutral-200 items-center justify-between px-4 z-50">
      <nav className="relative flex h-full items-center justify-between">
        <div id="logo" className="font-lemon text-xl text-primary-500">
          <Link href="/">{data.logo}</Link>
        </div>
        <div
          id="links"
          className="hidden lg:flex items-center justify-around gap-10 uppercase font-bold text-neutral-500"
        >
          {/* services */}
          <div
            className="relative p-2"
            onMouseEnter={() => setDropdown(data.serviceGroup.title)}
            onMouseLeave={() => setDropdown(null)}
          >
            <span>{data.serviceGroup.title}</span>
            <div
              className={clsx(
                "absolute top-full -left-5 bg-gray-100 w-[120px] lg:w-fit flex flex-col gap-3 p-2",
                {
                  // when hover the category show the corresponded links and hide the other one
                  hidden: showDropdown !== data.serviceGroup.title,
                  block: showDropdown === data.serviceGroup.title,
                },
              )}
            >
              {data.serviceGroup.navServices?.map((link) => {
                const title =
                  typeof link.service === "object" ? link.service.title : null;
                const url =
                  typeof link.service === "object" && link.service.slug
                    ? link.service.slug
                    : null;

                return (
                  <Link
                    key={link.id}
                    className="whitespace-nowrap hover:text-primary-600"
                    href={`/services/${url}`}
                  >
                    {title}
                  </Link>
                );
              })}
            </div>
          </div>
          {/* categories */}
          <div
            className="relative p-2"
            onMouseEnter={() => setDropdown(data.categoryGroup.title)}
            onMouseLeave={() => setDropdown(null)}
          >
            <span>{data.categoryGroup.title}</span>
            <div
              className={clsx(
                "absolute top-full -left-5 bg-gray-100 w-[120px] lg:w-fit flex flex-col gap-3 p-2",
                {
                  // when hover the category show the corresponded links and hide the other one
                  hidden: showDropdown !== data.categoryGroup.title,
                  block: showDropdown === data.categoryGroup.title,
                },
              )}
            >
              {data.categoryGroup.navCategories?.map((link) => {
                const title =
                  typeof link.category === "object"
                    ? link.category.title
                    : null;
                const url =
                  typeof link.category === "object" && link.category.slug
                    ? link.category.slug
                    : null;

                return (
                  <Link
                    key={link.id}
                    className="whitespace-nowrap hover:text-primary-600"
                    href={`/portfolio/${url}`}
                  >
                    {title}
                  </Link>
                );
              })}
            </div>
          </div>
          {/* about me */}
          <div className="relative p-2">
            <Link
              href={`${data.aboutMeGroup.url ? data.aboutMeGroup.url : null}`}
            >
              {data.aboutMeGroup.title}
            </Link>
          </div>
          {/* contact */}
          <div className="relative p-2">
            <Link
              href={`${data.contactGroup.url ? data.contactGroup.url : null}`}
            >
              {data.contactGroup.title}
            </Link>
          </div>
        </div>
        {/* mobile */}
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="lg:hidden inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-body rounded-base hover:bg-neutral-tertiary hover:text-heading focus:outline-none focus:ring-2 focus:ring-neutral-tertiary"
        >
          <Image src="/burger.svg" width={24} height={24} alt="Burger Icon" />
        </button>
        {/* mobile */}
        <div
          className={clsx(
            "bg-neutral-200 absolute text-lg z-50 top-full -top-4 -left-4 flex flex-col h-screen w-screen lg:hidden",
            {
              hidden: show === false,
            },
          )}
        >
          <Link
            href="/"
            onClick={() => setShow(false)}
            className="w-full py-2 px-3 bg-brand rounded"
            aria-current="page"
          >
            Home
          </Link>
          {/* services */}
          {/* menu */}
          <div
            className="flex flex-col"
            // if the menu is not open set the state to the related menu if it's open close it
            onClick={() =>
              showDropdown !== data.serviceGroup.title
                ? setDropdown(data.serviceGroup.title)
                : setDropdown(null)
            }
          >
            <div
              id="category-label"
              className="w-full py-2 px-3 flex justify-between text-heading active:bg-gray-300"
            >
              <span>{data.serviceGroup.title}</span>

              <Image
                src="/arrow-down.svg"
                width={24}
                height={24}
                alt="Arrow down"
              />
            </div>
            {/* list */}
            <div
              id="category-items"
              className={clsx(
                "flex flex-col bg-neutral-300 rounded my-3 mx-3",
                {
                  // if the clicked menu is not the current hide it 
                  hidden: showDropdown !== data.serviceGroup.title,
                  block: showDropdown === data.serviceGroup.title,
                },
              )}
            >
              {data.serviceGroup.navServices?.map((link) => {
                const title =
                  typeof link.service === "object"
                    ? link.service.title
                    : null;
                const url =
                  typeof link.service === "object" && link.service.slug
                    ? link.service.slug
                    : null;

                return (
                  <Link
                    key={link.id}
                    href={`/services/${url}`}
                    onClick={() => setShow(false)}
                    className="w-full py-2 pl-4 text-heading rounded hover:bg-primary-300 active:bg-gray-300"
                  >
                    {title}
                  </Link>
                );
              })}
            </div>
          </div>
          {/* categories */}
          {/* menu */}
          <div
            className="flex flex-col"
            // if the menu is not open set the state to the related menu if it's open close it
            onClick={() =>
              showDropdown !== data.categoryGroup.title
                ? setDropdown(data.categoryGroup.title)
                : setDropdown(null)
            }
          >
            <div
              id="category-label"
              className="w-full py-2 px-3 flex justify-between text-heading active:bg-gray-300"
            >
              <span>{data.categoryGroup.title}</span>

              <Image
                src="/arrow-down.svg"
                width={24}
                height={24}
                alt="Arrow down"
              />
            </div>
            {/* list */}
            <div
              id="category-items"
              className={clsx(
                "flex flex-col bg-neutral-300 rounded my-3 mx-3",
                {
                  hidden: showDropdown !== data.categoryGroup.title,
                  block: showDropdown === data.categoryGroup.title,
                },
              )}
            >
              {data.categoryGroup.navCategories?.map((link) => {
                const title =
                  typeof link.category === "object"
                    ? link.category.title
                    : null;
                const url =
                  typeof link.category === "object" && link.category.slug
                    ? link.category.slug
                    : null;

                return (
                  <Link
                    key={link.id}
                    href={`/portfolio/${url}`}
                    onClick={() => setShow(false)}
                    className="w-full py-2 pl-4 text-heading rounded hover:bg-primary-300 active:bg-gray-300"
                  >
                    {title}
                  </Link>
                );
              })}
            </div>
          </div>
          {/* about me */}
          <Link
            href={`${data.aboutMeGroup.url ? data.aboutMeGroup.url : null}`}
            onClick={() => setShow(false)}
            className="w-full py-2 px-3 text-heading rounded hover:bg-gray-300 active:bg-gray-300"
          >
            {data.aboutMeGroup.title}
          </Link>
          {/* contact */}
          <Link
            href={`${data.contactGroup.url ? data.contactGroup.url : null}`}
            onClick={() => setShow(false)}
            className="w-full py-2 px-3 text-heading rounded hover:bg-gray-300 active:bg-gray-300"
          >
            {data.contactGroup.title}
          </Link>
        </div>
      </nav>
    </header>
  );
}
