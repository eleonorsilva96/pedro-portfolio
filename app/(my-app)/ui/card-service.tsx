import Image from "next/image";
import clsx from 'clsx';
import { Service } from "@/payload-types";

// add boolean for the border and shadow
export default function CardService({
    data
} : {
    data: null | Service,
}) {
  if (!data) return null;

  return (
    <div className={clsx( // add hover here and link to the corresponded page
      'w-full h-auto overflow-hidden flex flex-col items-center gap-3', // hide the content that overflows the container
    )}
    >
      <div className="overflow-hidden">
          <Image
            src={typeof data.image === 'object' && data.image.url || ''}
            className={clsx(
              'w-full aspect-square object-cover transition-all duration-500 group-hover:scale-105',
            )}
            width={typeof data.image === 'object' && data.image.width || undefined}
            height={typeof data.image === 'object' && data.image.height || undefined}
            alt={typeof data.image === 'object' && data.image.alt || data.title}
          />
      </div>
          <h3 className={clsx(
            'font-medium text-xl lg:text-2xl',
          )}>{data.title}</h3>
    </div>
  );
}

