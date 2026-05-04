import Filter from "@/app/(my-app)/ui/filter";
import GalleryPortfolio from "@/app/(my-app)/ui/gallery-portfolio";
import CardTextMedia from "@/app/(my-app)/ui/card-text-media";
import { Suspense } from "react";
import { getPayload } from "payload";
import config from "@payload-config";
import { unstable_cache } from "next/cache";
import { Category, Project, Tag } from "@/payload-types";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { Metadata } from "next";
import { notFound } from "next/navigation";

import Modal from "../../ui/modal";

// returns a single Category object or null if it doesn't exists
async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const payload = await getPayload({ config });

  const result = await payload.find({
    collection: "categories",
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
    depth: 1,
  });

  return result.docs[0] || null;
}
// returns an array of Projects (can be empty)
async function getProjectsByCategorySlug(slug: string): Promise<Project[]> {
  const payload = await getPayload({ config });

  const result = await payload.find({
    collection: "projects",
    sort: "_order",
    where: {
      // look for slug inside categories
      "category.slug": {
        equals: slug,
      },
    },
    depth: 2,
  });

  return result.docs;
}

export const getCachedCategoryBySlug = unstable_cache(
  // function with the request
  async (slug: string) => getCategoryBySlug(slug),
  // key array to facilitate the finding of the cached data
  ["category-by-slug-cache"],
  // tag name to eventually clear it when data changes on the db
  {
    tags: ["collection_categories"],
    revalidate: 86400, // auto-revalidate every 24 hours
  },
);

export const getCachedProjectsByCategorySlug = unstable_cache(
  // function with the request
  async (slug: string) => getProjectsByCategorySlug(slug),
  // key array to facilitate the finding of the cached data
  ["projects-by-category-slug-cache"],
  // tag name to eventually clear it when data changes on the db
  {
    tags: ["collection_projects"],
    revalidate: 86400, // auto-revalidate every 24 hours
  },
);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const category = await getCachedCategoryBySlug(slug);

  if (!category) {
    return { title: "Project Not Found" };
  }

  return {
    title: category.meta?.title || category.title,
    description: category.meta?.description,
    openGraph: {
      title: category.meta?.title || category.title,
      // add condition to omit description if it doesn't exist
      ...(category.meta?.description && {
        description: category.meta.description,
      }),
      images:
        typeof category.meta?.image === "object" && category.meta?.image?.url
          ? [{ url: category.meta.image.url }]
          : [],
    },
  };
}

export default async function PortfolioPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ filter: string; id: string }>;
}) {
  // inside the route props we can get the dynamic url from the route using params
  const { slug } = await params;

  const { filter, id } = (await searchParams) ?? {}; // search params are empty return a empty object

  // get both queries data at the same time using Promise.all
  const [category, projects] = await Promise.all([
    getCachedCategoryBySlug(slug),
    getCachedProjectsByCategorySlug(slug),
  ]);

  if (!category) {
    notFound();
  }

  const allTags: (string | Tag)[] = [];
  for (const project of projects) {
    if (project.tag) {
      for (const tagItem of project.tag) {
        // avoid duplicated filter tags for each project object
        if (
          typeof tagItem === "object" &&
          !allTags.some(
            (tag) => typeof tag === "object" && tag.id === tagItem.id,
          )
        ) {
          allTags.push(tagItem);
        }
      }
    }
  }

  const getVisibleProjects = projects.filter(
    (project) => project.hideProject === false,
  );

  // if a filter is selected filter projects by tag
  const projectsData = filter
    ? getVisibleProjects.filter((project) =>
        project.tag?.find(
          (tagItem) => typeof tagItem === "object" && tagItem.slug === filter, // array is included in the object category
        ),
      )
    : getVisibleProjects;

  const isModal =
    category?.slug && category.slug === "imagem-digital" ? true : false;

  const isMusicCategory =
    category?.slug && category.slug === "musica" ? true : false;

  const musicBlogList =
    isMusicCategory &&
    category?.blogGroup?.blogList?.map((item, index) => {
      const isMediaRight = index % 2 === 0 ? true : undefined;
      return (
        <CardTextMedia
          key={item.id}
          title={item.title}
          desc={item.description}
          media={item.link ? item.link[0] : null}
          isMediaRight={isMediaRight}
        />
      );
    });

  const musicCTA = isMusicCategory && category?.blogGroup?.cta;

  const mainContent = !isMusicCategory ? (
    <div className="flex flex-col w-full my-6 px-6">
      {allTags.length > 0 ? (
        <Suspense fallback={null}>
          <Filter tags={allTags} />
        </Suspense>
      ) : (
        ""
      )}

      {/* wrap in a suspense component that will check for url params (query params) */}
      <Suspense fallback={null}>
        <GalleryPortfolio data={projectsData} isModal={isModal} />
      </Suspense>
    </div>
  ) : (
    <>
      {musicBlogList}
      <div className="flex justify-center w-full mt-8 py-14 bg-neutral-400/50 ">
        {/* use Payload rich text renderer to render the lexical rich text object */}
        {musicCTA && (
          <RichText data={musicCTA} className="rich-text text-4xl" />
        )}
      </div>
    </>
  );

  const modalGallery = isModal && id ? projectsData : null;
  const modalContent =
    isModal && id ? projectsData.find((project) => project.id === id) : null;

  return (
    <div className="flex flex-col w-full items-center">
      <h1 className="text-5xl mb-4 mt-8 px-4">{category?.title}</h1>
      {category?.description ? (
        // change p to div because of RichText
        <div className="text-center w-full md:w-2xl lg:w-3xl text-lg px-4 min-w-0 break-words">
          {/* use Payload rich text renderer to render the lexical rich text object */}
          {category?.description && (
            <RichText data={category.description} className="rich-text" />
          )}
        </div>
      ) : (
        ""
      )}
      {mainContent}
      {modalGallery && modalContent ? (
        <Modal
          modalContent={modalContent}
          modalGallery={modalGallery}
          modalId={id}
          category={category?.slug || null}
          projectModal
        />
      ) : (
        ""
      )}
    </div>
  );
}
