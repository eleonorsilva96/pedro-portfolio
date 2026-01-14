import { performRequest } from "@/app/lib/datocms";
import { ProjectData } from "@/app/lib/definitions";
import SectionItem from "@/app/ui/section-item";
import ModalContent from "@/app/ui/modal-content";

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
  const section = content.section.map((section) => (
    <div key={section.id} className="flex flex-col items-center">
      <h3>{section.title}</h3>
      <div className="flex gap-4">
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
            i.slug === id
        )
      );
    // returns the item details
      const itemContent = content.section.flatMap((section) =>
        // collect all gallery lists from all sections into one single array 
        section.galleryItems).find(
          (i) =>
            (i.__typename === "ExternalVideoTitleRecord" ||
              i.__typename === "GalleryItemRecord") &&
            i.slug === id
        );

    modal = (
    <ModalContent
      galleryList={itemsGallery?.galleryItems || []}
      sliderContent={itemContent || null}
      projectId={id}
      category={category}
      project={project}
      />
    );
  }

  //   console.log(title);
  //   console.log(content);

  return (
    <div className="flex flex-col w-full items-start bg-white md:items-center">
      <div className="w-full flex flex-col items-center py-10 bg-neutral-800 text-neutral-50 gap-5">
        <h3 className="text-3xl">{title}</h3>
        <p className="w-2xl whitespace-pre-line text-center">
          {content.description}
        </p>{" "}
        {/* remove indentation but preserves the line breaks */}
      </div>
      {section}
      {modal}
    </div>
  );
}
