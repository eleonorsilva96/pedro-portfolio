import Gallery from "@/app/ui/gallery";

export default async function ServicesPage({ params } : {
  params: Promise<{ category: string }>;
}) {
  // inside the route props we can get the dynamic url from the route using params
  const { category } = await params;
  console.log(category);

  return (
    <div className="flex min-h-screen min-w-screen items-center justify-center font-sans">
      <main className="flex min-h-screen w-full flex-col items-center bg-white sm:items-start">
        <h1>{category}</h1>
        {/* <Gallery galleryItems={CardGallery.galleryItems}/> */}
      </main>
    </div>
  );
}
