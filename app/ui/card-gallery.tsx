import Image from "next/image";
import clsx from 'clsx';

// add boolean for the border and shadow
export default function CardGallery({
    width,
    height,
    hasRadius,
    hasShadow,
    title,
    imgUrl, // add also link url
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
      'w-full max-w-[500px] h-auto overflow-hidden', // hide the content that overflows the container
        {
            'flex flex-col items-center gap-3': title,
        },
        {
            'rounded-lg': hasRadius === true,
            'shadow-lg': hasShadow === true,
        },
    )}>
          <Image
            src={imgUrl}
            className={clsx(
              // 'w-full',
              {
                'w-full h-auto' : !title,
                'aspect-square object-cover' : title,
              }
            )}
            width={width}
            height={height}
            alt={alt}
          />
          <h3 className={clsx(
            'text-xl lg:text-2xl',
            {
                'hidden': !title,
            },
          )}>{title}</h3>
    </div>
  );
}

