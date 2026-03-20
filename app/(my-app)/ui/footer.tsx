"use client";

import Link from "next/link";
import Image from "next/image";
import { SiteSetting } from "@/payload-types";

export default function Footer({ data }: { data: SiteSetting["footer"] }) {
  const currentYear = new Date().getFullYear().toString();

  return (
    <footer className="font-quick flex w-full h-80 lg:h-64 bg-neutral-200 justify-center">
      <div className="w-full lg:w-1/2 h-full flex flex-col gap-8 justify-center items-center">
        <div className="flex flex-col w-full items-center lg:flex-row lg:justify-between gap-6">
          <div className="flex flex-col items-center lg:items-start gap-2">
            <a
              href={`tel:${data.columnLeft.phoneNumber}`}
              className="underline"
            >
              {data.columnLeft.phoneNumber}
            </a>
            <a href={`mailto:${data.columnLeft.email}`}>
              {data.columnLeft.email}
            </a>
          </div>
          <div className="flex flex-col gap-2">
            <a
              href={`${data.columnRight.complaintsBookLink}`}
              className="underline"
              target="_blank"
              rel="noopener noreferrer" // prevents tabnabbing and ensures the new link doesn't know where it came from
            >
              {data.columnRight.complaintsBookName}
            </a>
            <Link
              href={`${data.columnRight.privacyPageLink}`}
              className="underline"
            >
              {data.columnRight.privacyPageName}
            </Link>
          </div>
        </div>
        <div className="flex flex-col w-full lg:flex-row lg:justify-between items-center lg:items-start gap-4">
          <div className="flex gap-2 items-center">
            <span>{data.columnLeft.socialMediaLabel}</span>
            <div className="flex gap-4">
              {data.columnLeft.socialMediaList?.map((link) => {
                const icon = typeof link.image === "object" ? link.image : null;

                if (!icon || !icon.url || !icon.width || !icon.height) return null;

                return (
                  <a
                    key={link.id}
                    href={link.externalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Image
                      src={icon.url}
                      className="w-8 h-8 text-neutral-900"
                      width={icon.width}
                      height={icon.height}
                      alt={icon.alt ?? ''}
                    />
                  </a>
                );
              })}
            </div>
          </div>
          <div className="flex gap-4">
            <span>
              &copy; {currentYear} {data.columnRight.copyright}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
