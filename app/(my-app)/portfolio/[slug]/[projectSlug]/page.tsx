import ProjectContentView from "@/app/(my-app)/ui/project-content-view";
import { Metadata } from "next";
import { getPayload } from "payload";
import config from "@payload-config";
import { unstable_cache } from "next/cache";
import { Project } from "@/payload-types";
import Modal from "@/app/(my-app)/ui/modal";
import { notFound } from 'next/navigation';


async function getProjectBySlug(projectSlug: string): Promise<Project | null> {
  const payload = await getPayload({ config });

  const result = await payload.find({
    collection: "projects",
    where: {
      slug: {
        equals: projectSlug,
      },
    },
    limit: 1, // stop searching the second it finds a match
    depth: 3, // the number of nested fields/relationships I want to retrieve (relationships will be populated objects)
  });

  return result.docs[0] || null; // returns always a paginated response even if it's only one document
}

async function getProjects(slug: string): Promise<Project[]> {
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
    depth: 1, // the number of nested fields/relationships I want to retrieve (relationships will be populated objects)
  });

  return result.docs;
}

export const getCachedProjectBySlug = 
unstable_cache(
  // function with the request
  async (projectSlug: string) => getProjectBySlug(projectSlug),
  // key array to facilitate the finding of the cached data
  ["project-by-slug-cache"],
  // tag name to eventually clear it when data changes on the db
  {
    tags: ["collection_projects"],
    revalidate: 86400, // auto-revalidate every 24 hours
  },
);

export const getCachedProjects = unstable_cache(
  // function with the request
  async (slug: string) => getProjects(slug),
  // key array to facilitate the finding of the cached data
  ["projects-cache"],
  // tag name to eventually clear it when data changes on the db
  {
    tags: ["collection_projects"],
    revalidate: 86400, // auto-revalidate every 24 hours
  },
);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ projectSlug: string }>;
}): Promise<Metadata> {
  const { projectSlug } = await params;

  const project = await getCachedProjectBySlug(projectSlug);

  if (!project) {
    return { title: 'Project Not Found' }
  }
  
  return {
    title: project.meta?.title || project.title,
    description: project.meta?.description,
    openGraph: {
      title: project.meta?.title || project.title,
      // add condition to omit description if it doesn't exist
      ...(project.meta?.description && { description: project.meta.description }), 
      images: typeof project.meta?.image === 'object' && project.meta?.image?.url ? [{ url: project.meta.image.url }] : [],
    },
  }
}

export default async function ProjectPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string; projectSlug: string }>;
  searchParams: Promise<{ id: string }>;
}) {
  const { slug, projectSlug } = await params;

  const { id } = (await searchParams) ?? {};

  // get both queries data at the same time using Promise.all
  const [project, projects] = await Promise.all([
    getCachedProjectBySlug(projectSlug),
    getCachedProjects(slug),
  ]);

  if (!project) {
    notFound();
  }

  const visibleProjects = projects.filter(
    (project) => project.hideProject === false,
  );

  console.log("Project By Id Data");
  console.log(project);
  console.log("Projects");
  console.log(visibleProjects);

  const sectionsBlock = project?.multipleContent?.find((block) => block.blockType === "SectionsBlock");
  const sectionLinkBlock = sectionsBlock?.sections?.find((section) => section.sectionContent?.find((block) => block.blockType === 'externalLinkTitleBlock' && block.id === id))
  const sectionImageBlock = sectionsBlock?.sections?.find((section) => section.sectionContent?.find((block) => block.blockType === 'imageTitleBlock' && block.id === id))
    
  const sectionLink = sectionLinkBlock?.sectionContent?.find((block) => block.id === id);
  const sectionsLink = sectionLinkBlock?.sectionContent;
  
  const sectionImage = sectionImageBlock?.sectionContent?.find((block) => block.id === id);
  const sectionsImage = sectionImageBlock?.sectionContent;
 
  const imagesBlock = project?.multipleContent?.find((block) => block.blockType === "ImagesBlock");
  const imageModal = imagesBlock?.images?.find((image) => image.id === id);
  const imagesModal = imagesBlock?.images;

  return (
    <div className="flex justify-center w-full my-4">
      <ProjectContentView
        projects={visibleProjects}
        project={project}
        category={slug}
      />
      {id && (
        <Modal
          modalContent={imageModal || sectionLink || sectionImage || null}
          modalGallery={imagesModal || sectionsLink || sectionsImage || []}
          modalId={id}
          category={slug}
          project={projectSlug}
        />
      )}
    </div>
  );
}
