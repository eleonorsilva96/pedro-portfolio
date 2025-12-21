'use client';

import {useSearchParams, useRouter, usePathname } from "next/navigation";

export default function Close({
    projectId
} : {
    projectId: string;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleClick = (id: string) => {
      const params = new URLSearchParams(searchParams);

      if (id) {
        if (params.get("projectId") === id) {
            params.delete("projectId");
        }
      }

      replace(`${pathname}?${params.toString()}`);
  }


  return (
    <div
    onClick={() => handleClick(projectId)} 
    className="mt-4 mr-4 absolute top-0 right-0 cursor-pointer z-10">Close</div>
  );  
}