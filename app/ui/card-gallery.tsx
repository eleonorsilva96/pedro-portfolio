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
    title?: string, // optional
    imgUrl: string,
    alt: string,
}) {
  return (
    <div className={clsx( // add hover here and link to the corresponded page
        {
            'flex flex-col items-center gap-3': title,
        },
        'overflow-hidden', // hide the content that overflows the container
        'w-full',
        'max-w-[500px]', // 'max-w-[800px]',
        'h-auto',
        {
            'rounded-lg': hasRadius === true,
            'shadow-lg': hasShadow === true,
        },
    )}>
          <Image
            src={imgUrl}
            className="w-full h-auto"
            width={width}
            height={height}
            alt={alt}
          />
          <h3 className={clsx(
            '',
            {
                'hidden': !title,
            },
          )}>{title}</h3>
    </div>
  );
}


       // 'max-w-[800px]',
