'use client';

import { usePathname, useRouter } from "next/navigation";
import CloseIcon from "./icons/close-icon";
import clsx from "clsx";

export default function Close({
    isProject
} : {
    isProject: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();
  // const currentScroll = window.scrollY;
  // console.log("current scroll close", currentScroll);

  const handleClose = () => {
    const savedPosition = sessionStorage.getItem("projectScrollPos");
    // remove url param to close Modal
    router.replace(pathname, { scroll: false });

    // set to current position to avoid shifting to the top of the page after react re-renders and dom is ready 
    if (savedPosition) {
      const yPos = parseInt(savedPosition, 10);
      
      requestAnimationFrame(() => {
        window.scrollTo(0, yPos);
        // Optional: Clear it so it doesn't interfere with other pages
        sessionStorage.removeItem("galleryScrollPos"); 
      });
    }
  };

  return (
    <div 
    onClick={handleClose}
    className="mt-4 mr-4 absolute top-0 right-0 cursor-pointer z-10">
      <CloseIcon className={clsx(
        {
          'text-neutral-800' : isProject,
          'text-neutral-100' : !isProject
        }
      )} />
    </div>
  );  
}
