'use client';

import {useSearchParams, useRouter } from "next/navigation";
import CloseIcon from "./icons/close-icon";
import clsx from "clsx";

export default function Close({
    projectId,
    isProject
} : {
    projectId: string;
    isProject: boolean;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleClick = (id: string) => {
      const params = new URLSearchParams(searchParams);

      if (id) {
        if (params.get("id") === id) {
            params.delete("id");
        }
      }

      // to prevent jump to the top of the page and preserve scroll position
      router.back()

  }


  return (
    <div className="mt-4 mr-4 absolute top-0 right-0 cursor-pointer z-10" onClick={() => handleClick(projectId)}>
      <CloseIcon className={clsx(
        {
          'text-neutral-800' : isProject,
          'text-neutral-100' : !isProject
        }
      )} />
    </div>
  );  
}
