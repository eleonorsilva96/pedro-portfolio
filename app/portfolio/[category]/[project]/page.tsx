import { performRequest } from "@/app/lib/datocms";
import { ProjectData, PortfolioGalleryType } from "@/app/lib/definitions";
import ProjectContentView from "@/app/ui/project-content-view";
import Modal from "@/app/ui/modal";

// send query to DatoCMS
const PAGE_CONTENT_QUERY = `
  query Project($project: String!, $category: String!) {
    # Get a single project by the slug
    project(filter: { project: { eq: $project } }) {
      id
      title
      project
      description
      
      contentType {
        __typename
        ... on MultipleBlockRecord {
          id
          content {
            __typename
            ... on SectionProjectRecord {
              id
              title
              
              # Level 3: Gallery Items
              galleryItems {
                __typename 
                
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

            ... on GalleryProjectRecord {
              id
              asset {
                url
                width
                height
                alt
              }
            }
          }
        }
        ... on SingleBlockRecord {
          id
          content {
            __typename
            ... on SlideProjectRecord {
              id
              context
              role
              date
              videoMedia {
                __typename
                ... on ExternalVideoRecord {
                  externalVideo {
                    url
                    title
                    width
                    height
                    provider
                    providerUid
                    thumbnailUrl
                  }
                }
                ... on VideoBlockRecord {
                  videoAsset {
                    url
                    alt
                    video {
                      muxPlaybackId
                      title
                      width
                      height
                      blurUpThumb
                    }
                  }
                }
              }
              linkBlock {
                __typename
                ... on AdditionalLinkBlockRecord {
                  text
                  link
                }
                ... on RelatedProjectBlockRecord {
                  text
                  link {
                    ... on ProjectRecord {
                      project
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    
    # get gallery by category to handle projects navigation 
    allPortfolioCategories(filter: { slug: { eq: $category } }){
      gallery {
        ... on GalleryPortfolioRecord {
          __typename
          projectId {
            ... on ProjectRecord {
              id
              project 
            }
          }
        }
      }   
    }
  }
`;

// add props to receive fetching data
export default async function PortfolioPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string; project: string }>;
  searchParams: Promise<{ id: string }>;
}) {
  const { category, project } = await params;

  // if URL param id is empty return a empty object
  const { id } = (await searchParams) ?? Promise.resolve({});

  const response = (await performRequest(PAGE_CONTENT_QUERY, {
    variables: {
      project: project,
      category: category,
    },
  })) as ProjectData;
  
  if (!response) return null;

  const { allPortfolioCategories } = response;
  const { contentType } = response.project;
  
  const portfolioGallery = allPortfolioCategories[0].gallery.filter((item) => item.__typename === 'GalleryPortfolioRecord') as PortfolioGalleryType[];

  const multipleContent = contentType.__typename === 'MultipleBlockRecord' ? contentType.content : null;

  return (
    <div className="flex justify-center w-full my-4">
      <ProjectContentView allProjects={portfolioGallery} project={response.project} category={category}/>
      <Modal content={multipleContent || []} modalId={id} category={category} projectSlug={project} />
    </div>
  );
}

