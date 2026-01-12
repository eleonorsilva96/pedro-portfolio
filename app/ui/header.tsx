'use client';

import Link from "next/link";
import clsx from "clsx";
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import Image from "next/image";
import { HeaderNavigation } from "@/app/lib/definitions";

export default function Header({
  logo,
  navLinks,
}: {
  logo: string;
  navLinks: HeaderNavigation[];
}) {
  const [show, setShow] = useState(false);
  const [showCategories, setCategories] = useState<string | null>(null);
  // const [showItemsPortfolio, setItemsPortfolio] = useState(false);
  // const [showItemsServices, setItemsServices] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null); // initializes empty box that will contain a div element
  const btnRef = useRef<HTMLButtonElement>(null);

  // when component mounts
  useEffect(() => {
    // hide menu when user clicks on the viewport
    const handleClick = (event: MouseEvent) => {
      // don't hide menu when clicking inside the list and on the btn
      if (
        !menuRef.current?.contains(event.target as Node) &&
        !btnRef.current?.contains(event.target as Node)
      ) {
        // accepts HTML block
        setShow(false);
      }
    };

    // attach event listener on the viewport only when the menu is open
    if (show) document.addEventListener("mousedown", handleClick);

    // remove event listener to avoid being always active
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [show]); // watch list run this every time show changes

  return (
    <header className="sticky w-full h-20 bg-neutral-200 items-center justify-between px-4 z-50">
      <nav className="relative flex h-full items-center justify-between">
        <div id="logo" className="active:text-red-400">
          <Link href="/">{logo}</Link>
        </div>
        <div
          id="links"
          className="hidden lg:flex items-center justify-around gap-10 font-open uppercase font-bold text-neutral-500"
        >
          {navLinks.map((link) => {
            // has more than one link
            if (link.categoryLinks.length > 0) {
              return (
                <div
                  key={link.id}
                  className="relative p-2"
                  onMouseEnter={() => setCategories(link.id)}
                  onMouseLeave={() => setCategories(null)}
                >
                  <span>
                    {link.categoryLinks[0].link.__typename === "ServiceRecord" // check only the first element to know the category
                      ? "Serviços"
                      : "Portfólio"}
                  </span>
                  <div
                    className={clsx(
                      "absolute top-full -left-5 bg-gray-100 w-[120px] lg:w-fit flex flex-col gap-3 p-2",
                      {
                        // when hover the category show the corresponded links and hide the other one
                        hidden: showCategories !== link.id,
                        block: showCategories === link.id,
                      }
                    )}
                  >
                    {link.categoryLinks.map((categoryLink) => {
                      return (
                        <a
                          key={categoryLink.id}
                          className="whitespace-nowrap hover:text-primary-600"
                          href={`/${
                            link.categoryLinks[0].link.__typename ===
                            "ServiceRecord"
                              ? "services"
                              : "portfolio"
                          }/${categoryLink.link.slug}`}
                        >
                          {categoryLink.name}
                        </a>
                      );
                    })}
                  </div>
                </div>
              );
            } else {
              return (
                <Link
                  key={link.id}
                  href={`/${
                    link.singleLink?.__typename === "AboutMeRecord"
                      ? "about"
                      : "contact"
                  }`}
                  className="p-2"
                >
                  {link.singleLink?.__typename === "AboutMeRecord"
                    ? "Sobre mim"
                    : "Contacto"}
                </Link>
              );
            }
          })}
        </div>
        {/* mobile */}
        <button
          ref={btnRef}
          type="button"
          onClick={() => setShow(!show)}
          className="lg:hidden inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-body rounded-base hover:bg-neutral-tertiary hover:text-heading focus:outline-none focus:ring-2 focus:ring-neutral-tertiary"
        >
          <Image src="/burger.svg" width={24} height={24} alt="Burger Icon" />
        </button>
        {/* mobile */}
        <div
          ref={menuRef}
          className={clsx(
            'bg-neutral-200 absolute text-lg z-50 top-full -top-4 -left-4 flex flex-col w-screen lg:hidden',
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
          {navLinks.map((link) => {
            if (link.categoryLinks.length > 0) {
              return (
                <div
                  key={link.id}
                  id="category-menu"
                  className="flex flex-col"
                  onClick={() =>
                    showCategories !== link.id
                      ? setCategories(link.id)
                      : setCategories(null)
                  }
                >
                  <div
                    id="category-label"
                    className="w-full py-2 px-3 flex justify-between text-heading active:bg-gray-300"
                  >
                    <span>
                      {link.categoryLinks[0].link.__typename === "ServiceRecord" // check only the first element to know the category
                        ? "Serviços"
                        : "Portfólio"}
                    </span>

                    <Image
                      src="/arrow-down.svg"
                      width={24}
                      height={24}
                      alt="Arrow down"
                    />
                  </div>
                  <div
                    id="category-items"
                    className={clsx(
                      "flex flex-col bg-neutral-300 rounded my-3 mx-3",
                      {
                        hidden: showCategories !== link.id,
                        block: showCategories === link.id,
                      }
                    )}
                  >
                    {link.categoryLinks.map((categoryLink) => (
                      <a
                        key={categoryLink.id}
                        href={`/${
                          link.categoryLinks[0].link.__typename ===
                          "ServiceRecord"
                            ? "services"
                            : "portfolio"
                        }/${categoryLink.link.slug}`}
                        onClick={() => setShow(false)}
                        className="w-full py-2 pl-4 text-heading rounded hover:bg-primary-300 active:bg-gray-300"
                      >
                        {categoryLink.name}
                      </a>
                    ))}
                  </div>
                </div>
              );
            } else {
              return (
                <Link
                  key={link.id}
                  href={`/${
                    link.singleLink?.__typename === "AboutMeRecord"
                      ? "about"
                      : "contact"
                  }`}
                  onClick={() => setShow(false)}
                  className="w-full py-2 px-3 text-heading rounded hover:bg-gray-300 active:bg-gray-300"
                >
                  {link.singleLink?.__typename === "AboutMeRecord"
                    ? "Sobre mim"
                    : "Contacto"}
                </Link>
              );
            }
          })}
        </div>
      </nav>
    </header>
  );
}
