import Gallery from "@/app/ui/gallery";

export default async function ServicesPage({ params } : {
  params: Promise<{ category: string }>;
}) {
  // inside the route props we can get the dynamic url from the route using params
  const { category } = await params;
  console.log(category);

  return (
    <div className="flex flex-col w-full items-center bg-white sm:items-start">
        <h1>{category}</h1>
    </div>
  );
}
