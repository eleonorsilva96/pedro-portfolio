import CardGallery from "@/app/ui/card-gallery";
import clsx from "clsx";

// add props to receive fetching data 
export default function Gallery({
    hasTitle,
    removeBtn
}: {
    hasTitle?: boolean,
    removeBtn?:boolean,
}) {
  return (
    <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 lg:flex-row lg:flex-wrap lg:gap-6 w-full h-auto items-center">
            <CardGallery width={2784} height={1320} hasRadius={!hasTitle} title={hasTitle ? 'Web Design' : undefined} imgUrl="/home.avif"/>
            <CardGallery width={2784} height={1320} hasRadius={!hasTitle} title={hasTitle ? 'Web Design' : undefined} imgUrl="/home.avif"/>
            <CardGallery width={2784} height={1320} hasRadius={!hasTitle} title={hasTitle ? 'Web Design' : undefined} imgUrl="/home.avif"/>
            <CardGallery width={2784} height={1320} hasRadius={!hasTitle} title={hasTitle ? 'Web Design' : undefined} imgUrl="/home.avif"/>
            <CardGallery width={2784} height={1320} hasRadius={!hasTitle} title={hasTitle ? 'Web Design' : undefined} imgUrl="/home.avif"/>
            <CardGallery width={2784} height={1320} hasRadius={!hasTitle} title={hasTitle ? 'Web Design' : undefined} imgUrl="/home.avif"/>
        </div>
        <button
            className={clsx(
                {
                    'hidden' : removeBtn === true,
                },
            )}
        >Ver Mais</button>
    </div>
  );
}
