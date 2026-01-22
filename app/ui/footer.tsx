'use client'

import Link from "next/link";
import VimeoIcon from "./icons/vimeo-icon";
import FacebookIcon from "./icons/facebook-icon";
import LinkedInIcon from "./icons/linkedin-icon";
import YoutubeIcon from "./icons/youtube-icon";
import InstagramIcon from "./icons/instagram-icon";
import { GlobalData } from "../lib/definitions";

export default function Footer({
  data,
}: {
  data: {
    number: GlobalData["global"]["footerPhoneNumber"];
    email: GlobalData["global"]["footerEmail"];
    mediaLinks: GlobalData["global"]["footerSocialMediaLinks"];
    complaintsLink: GlobalData["global"]["complaintsBookLink"];
    privacyLink: GlobalData["global"]["privacyPolicyLink"];
    copy: GlobalData["global"]["copyright"];
  };
}) {
  const cleanNumber = data.number.replace(/\s+/g, "");
  const currentYear = new Date().getFullYear().toString();

  const ICON_MAP = {
    vimeo: VimeoIcon,
    youtube: YoutubeIcon,
    facebook: FacebookIcon,
    instagram: InstagramIcon,
    linkedin: LinkedInIcon,
  };

  const mediaLink = data.mediaLinks.map((link) => {
    
    const IconComponent = ICON_MAP[link.icon as keyof typeof ICON_MAP]; // tell ts that link.icon matches the keys inside ICOM_MAP object

    if (!IconComponent) return null;

    return <a key={link.id} href={link.link} target="_blank" rel="noopener noreferrer"> 
      <IconComponent className="w-8 h-8 text-neutral-900" />
    </a>;
  });

  return (
    <footer className="font-quick flex w-full h-80 lg:h-64 bg-neutral-200 justify-center">
      <div className="w-full lg:w-1/2 h-full flex flex-col gap-8 justify-center items-center">
        <div className="flex flex-col w-full items-center lg:flex-row lg:justify-between gap-6">
          <div className="flex flex-col items-center lg:items-start gap-2">
            <a href={`tel:${cleanNumber}`} className="underline">
              {data.number}
            </a>
            <a href={`mailto:${data.email}`}>{data.email}</a>
          </div>
          <div className="flex flex-col gap-2">
            <a
              href={data.complaintsLink}
              className="underline"
              target="_blank"
              rel="noopener noreferrer" // prevents tabnabbing and ensures the new link doesn't know where it came from
            >
              Livro de reclamações
            </a>
            <Link href={`/${data.privacyLink?.slug}`} className="underline">
              {data.privacyLink?.title}
            </Link>
          </div>
        </div>
        <div className="flex flex-col w-full lg:flex-row lg:justify-between items-center lg:items-start gap-4">
          <div className="flex gap-2 items-center">
            <span>Segue-me:</span>
            <div className="flex gap-4">
              {mediaLink}
            </div>
          </div>
          <div className="flex gap-4">
            {/* add year dynamically*/}
            <span>&copy; {currentYear} {data.copy}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
