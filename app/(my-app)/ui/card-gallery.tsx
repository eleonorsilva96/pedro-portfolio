import Image from "next/image";
import clsx from 'clsx';

// add boolean for the border and shadow
export default function CardGallery({
    width,
    height,
    hasRadius,
    hasShadow,
    title,
    imgUrl,
    alt
} : {
    width: number,
    height: number,
    hasRadius?: boolean, // optional
    hasShadow?: boolean, // optional
    title?: string | null, // optional
    imgUrl: string,
    alt: string,
}) {
  return (
    <div className={clsx( // add hover here and link to the corresponded page
      'w-full h-auto overflow-hidden', // hide the content that overflows the container
        {
            'aspect-[4/2.65]' : !title,
            'flex flex-col items-center gap-3': title,
            'rounded-lg': hasRadius === true,
            'shadow-lg': hasShadow === true,
        }
    )}
    >
      <div className="overflow-hidden">
          <Image
            src={imgUrl}
            className={clsx(
              'transition-all duration-500 group-hover:scale-105',
              {
                'w-full h-auto' : !title,
                'w-full aspect-square object-cover' : title,
              }
            )}
            width={width}
            height={height}
            alt={alt}
          />
      </div>
          <h3 className={clsx(
            'font-medium text-xl lg:text-2xl',
            {
                'hidden': !title,
            },
          )}>{title}</h3>
    </div>
  );
}

