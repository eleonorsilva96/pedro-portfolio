import { performRequest } from "@/app/lib/datocms";
import { ProjectData } from "@/app/lib/definitions";
import SectionItem from "@/app/ui/section-item";
import ModalContent from "@/app/ui/modal-content";
import clsx from "clsx";

const PAGE_CONTENT_QUERY = `
  query SectionProject($project: String!) {
  # get a single project by the slug wrapped in a object 
    project(filter: { project: { eq: $project } }) {
        title
        content {
            ... on SectionProjectRecord {
                __typename
                id
                description
                section {
                    ... on CardGalleryRecord {
                    __typename
                    id
                    title
                    galleryItems {
                        ... on ExternalVideoTitleRecord {
                        __typename
                        id
                        slug
                        title
                        link {
                            url
                            title
                            width
                            height
                            provider
                            providerUid
                            thumbnailUrl
                        }

                        }
                        ... on GalleryItemRecord {
                        __typename
                        id
                        slug
                        title
                        asset {
                            url
                            width
                            height
                            alt
                        }
                        }
                    }
                    }
                }
            }
        }
    }
  }
`;

export default async function Watch({
  params,
  searchParams,
}: {
  params: Promise<{ category: string; project: string }>;
  searchParams: Promise<{ id: string }>;
}) {
  const { category, project } = await params;
  // if query param id is empty return a empty object
  const { id } = (await searchParams) ?? Promise.resolve({});
  let modal = null;

  console.log(id);

  const response = (await performRequest(PAGE_CONTENT_QUERY, {
    variables: {
      project: project,
    },
  })) as ProjectData;

  const { title, content } = response.project;

  console.log("content from watch", content);

  // add transparent div to create a button to open the modal
  const section = content.section.map((section, index) => (
    <div key={section.id} className="w-full flex flex-col items-center">
      <h3>{section.title}</h3>
      <div
        className={clsx(
          "w-full max-w-[100vw] flex overflow-x-auto overflow-y-hidden snap-x scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] xl:overflow-x-hidden xl:flex-wrap xl:justify-center gap-4 px-4",
          {
            "md:justify-center": index === content.section.length - 1,
          },
        )}
      >
        {section.galleryItems.map((item) => (
          <SectionItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  ));

  if (id) {
    // return the section object when opens a item
    const itemsGallery = content.section.find((section) =>
      section.galleryItems.find(
        (i) =>
          (i.__typename === "ExternalVideoTitleRecord" ||
            i.__typename === "GalleryItemRecord") &&
          i.slug === id,
      ),
    );
    
    modal = (
      <ModalContent
        galleryList={itemsGallery?.galleryItems || []}
        projectId={id}
        category={category}
        project={project}
      />
    );
  }

  return (
    <div className="flex flex-col w-full items-start bg-white md:items-center">
      <div className="w-full flex flex-col items-center py-10 bg-neutral-800 text-neutral-50 px-4 gap-5">
        <h3 className="w-full text-center text-3xl">{title}</h3>
        <p className="w-full md:w-2xl whitespace-pre-line text-center">
          {content.description}
        </p>{" "}
        {/* remove indentation but preserves the line breaks */}
      </div>
      {section}
      {modal}
    </div>
  );
}
