'use client'

import Link from "next/link";
import clsx from "clsx";
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import Image from "next/image";

export default function Header() {
    const [ show, setShow ] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null); // initializes empty box that will contain a div element
    const btnRef = useRef<HTMLButtonElement>(null);

    // when component mounts
    useEffect(() => {
        // hide menu when user clicks on the viewport
        const handleClick = (event: MouseEvent) => {
            // don't hide menu when clicking inside the list and on the btn
            if (!menuRef.current?.contains(event.target as Node) && !btnRef.current?.contains(event.target as Node)) { // accepts HTML block
                setShow(false);
            } 
        }

        // attach event listener on the viewport only when the menu is open
        if (show) document.addEventListener('mousedown', handleClick);
        
        // remove event listener to avoid being always active
        return () => {
            document.removeEventListener('mousedown', handleClick);
        }

    }, [show]); // watch list run this every time show changes  
    
  return (
    <header className="sticky w-full h-20 bg-gray-400 items-center justify-between px-4 z-50">
      <nav className="relative flex h-full items-center justify-between">
        <div id="logo" className="active:text-red-400">LOGO</div>
        <div id="links" className="hidden lg:flex items-center justify-around gap-10">
          <Link href="/">Serviços</Link>
          <Link href="/">Portfolio</Link>
          <Link href="/">Sobre Mim</Link>
          <Link href="/">Contacto</Link>
        </div>
        {/* mobile */}
        <button
          ref={btnRef}
          type="button"
          onClick={() => setShow(!show)}
          className="lg:hidden inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-body rounded-base hover:bg-neutral-tertiary hover:text-heading focus:outline-none focus:ring-2 focus:ring-neutral-tertiary"
        >
          <Image 
            src="/burger.svg"
            width={24}
            height={24}
            alt="Burger Icon"
          />
        </button>
        {/* mobile */}
        <div ref={menuRef} className={clsx(
            {
                'hidden' : show === false,
            },
            'bg-gray-400 absolute z-50 top-full -top-4 -left-4 flex flex-col w-screen lg:hidden'
        )}> {/* Pushes the menu 100% down from the top of the relative parent - when you what to align outside the relative parent */} 
          <Link
            href="#"
            onClick={() => setShow(false)}
            className="w-full py-2 px-3 text-white bg-brand rounded md:bg-transparent md:text-fg-brand"
            aria-current="page"
            >
            Home
          </Link>
          <Link
            href="/"
            onClick={() => setShow(false)}
            className="w-full py-2 px-3 text-heading rounded hover:bg-gray-300 active:bg-gray-400 active:scale-[0.98]"
            >
            Services
          </Link>
          <Link
            href="/"
            onClick={() => setShow(false)}
            className="w-full py-2 px-3 text-heading rounded hover:bg-gray-300 active:bg-gray-400 active:scale-[0.98]"
            >
            Pricing
          </Link>
          <Link
            href="/"
            onClick={() => setShow(false)}
            className="w-full py-2 px-3 text-heading rounded hover:bg-gray-300 active:bg-gray-400 active:scale-[0.98]"
          >
            Contact
          </Link>
        </div>
      </nav>
    </header>
  );
}
