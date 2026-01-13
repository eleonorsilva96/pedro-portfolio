import CardGallery from "@/app/ui/card-gallery";
import clsx from "clsx";
import { GalleryItems, PortfolioPhotoImage } from "../lib/definitions";

// add props to receive fetching data 
export default async function Gallery({
    galleryItems,
    hasTitle,
    removeBtn
}: {
    galleryItems: (GalleryItems[] | PortfolioPhotoImage[]),
    hasTitle?: boolean,
    removeBtn?: boolean,
}) {
  console.log("card title", galleryItems)
  const content = galleryItems.map((item) => {
    if (item?.__typename === 'GalleryItemRecord' || item.__typename === 'ImageBlockRecord') {
      return (
        <CardGallery
              key={item.id}
              imgUrl={item.asset?.url}
              width={item.asset?.width}
              height={item.asset?.height}
              alt={item.asset?.alt}
              hasRadius={!hasTitle}
              title={hasTitle && item?.__typename === 'GalleryItemRecord' ? item.title : null}
          />
      );
    }
    return null; 
  });

  return (
    <div className="text-center">
      <div className="grid grid-cols gap-4 lg:flex-row lg:flex-wrap w-full h-auto items-center md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {content}
      </div>
      <button
        className={clsx(
          'py-3 px-8 mt-8 rounded-full bg-primary-500 text-white text-base',
          {
          hidden: removeBtn === true,
        })}
      >
        Ver Mais
      </button>
    </div>
  );
}
