// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.

export type ImageAsset = {
  url: string;
  width: number;
  height: number;
  alt: string;
};

export type GalleryItems = {
  __typename: "GalleryItemRecord";
  id: string;
  slug: string;
  title: string;
  asset: ImageAsset;
};

type ExternalVideo = {
  url: string;
  title: string;
  width: number;
  height: number;
  provider: string;
  providerUid: string;
  thumbnailUrl: string;
};

type Video = {
  muxPlaybackId: string;
  title: string;
  width: number;
  height: number;
  blurUpThumb: string;
};

export type VideoAsset = {
  url: string;
  alt?: string;
  video: Video;
};

type VideoBlock = {
  __typename: "VideoBlockRecord";
  id: string;
  videoAsset: VideoAsset;
};

type CardTextImg = {
  __typename: "CardTextImgRecord";
  id: string;
  title: string;
  description: string;
  buttonText: string;
  asset: ImageAsset;
};

export type GalleryRelatedProjects = {
  __typename: "RelatedProjectsBlockRecord";
  project: {
    id: string;
    title: string;
    project: string;
    portfolioCategory: {
      slug: string;
    };
    thumbnail: ImageAsset;
  };
};

export type GalleryRelatedServices = {
  __typename: "RelatedServicesBlockRecord";
  service: {
    id: string;
    title: string;
    slug: string;
    thumbnailImage: ImageAsset;
  };
};

export type GalleryItemsType = GalleryRelatedProjects | GalleryRelatedServices;

type CategoryLinkRef = {
  id: string;
  __typename: "LinkRecord";
  name: string;
  link: {
    __typename: "PortfolioCategoryRecord" | "ServiceRecord";
    slug: string;
  };
};

type SingleLinkRef = {
  __typename: "AboutRecord" | "ContactRecord";
} | null;

export type HeaderNavigation = {
  __typename: "NavItemRecord";
  id: string;
  singleLink: SingleLinkRef;
  categoryLinks: CategoryLinkRef[];
};

type SocialMediaLinkRef = {
  __typename: "SocialMediaLinkRecord";
  id: string;
  link: string;
  icon: string;
};

type PrivacyPolicyLink = {
  title: string;
  slug: string;
} | null;

type AdditionalLinkBlock = {
  __typename: "AdditionalLinkBlockRecord";
  text: string | null;
  link: string | null;
};

type RelatedLinkBlock = {
  __typename: "RelatedProjectBlockRecord";
  text: string | null;
  link: {
    project: string;
  };
};

type LinkBlock = AdditionalLinkBlock | RelatedLinkBlock;

type PortfolioCategoryRef = {
  slug: string;
};

export type PortfolioGalleryTag = {
  id: string;
  title: string;
  slug: string;
  categoryRef: PortfolioCategoryRef[];
};

export type ExternalVideoBlock = {
  __typename: "ExternalVideoTitleRecord";
  id: string;
  slug: string;
  title: string;
  link: ExternalVideo;
};

export type GalleryItemsProjectBlock =
  | ExternalVideoBlock
  | GalleryItems

export type SlideProjectBlock = {
  __typename: "SlideProjectRecord";
  id: string;
  videoMedia: {
    externalVideo: ExternalVideo | null;
    videoAsset: VideoAsset | null;
  };
  context: string;
  role: string | null;
  date: string | null;
  linkBlock: LinkBlock | null;
};

export type SectionProjectBlock = {
  __typename: "SectionProjectRecord";
  id: string;
  title: string;
  galleryItems: (ExternalVideoBlock | GalleryItems)[];
};

export type GalleryProjectBlock = {
  __typename: "GalleryProjectRecord";
  id: string;
  asset: ImageAsset;
};

// conditional contentProject
export type ContentProject =
  | GalleryProjectBlock
  | SectionProjectBlock
  | SlideProjectBlock;

export type ProjectIdBlock = {
  __typename: "ProjectIdRecord";
  id: string;
  title: string;
  description: string;
  thumbnail: ImageAsset;
  project: string;
  contentType: SingleBlock;
};

export type PortfolioGalleryType = {
  __typename: "GalleryPortfolioRecord";
  id: string;
  tag: PortfolioGalleryTag[];
  projectId: ProjectIdBlock;
};

export type PortfolioMusicType = {
  __typename: "MusicPortfolioRecord";
  id: string;
  title: string;
  description: string;
  video: {
    videoAsset: VideoAsset;
    externalVideoLink: string;
  };
};

export type CategoryRecord = PortfolioGalleryType | PortfolioMusicType;

type PortfolioCategoryRecord = {
  title: string;
  description: string;
  slug: string;
  gallery: CategoryRecord[];
  cta: string | null;
};

export type allProjectsGalleryBlock = {
  __typename: 'GalleryPortfolioRecord';
  projectId: {
    id: string;
    project: string;
  }
}

export type allProjectsBlock = {
  gallery: allProjectsGalleryBlock[];
}

export type MoreDetailsProjectData = {
  project: {
    title: string;
    description: string;
    contentType: ContentTypeBlock;
  }
}

export type ProjectDataBlock = {
  id: string;
  title: string;
  project: string;
  description: string;
  contentType: ContentTypeBlock;
}

export type ProjectData = {
  project: ProjectDataBlock;
  allPortfolioCategories: allProjectsBlock[];
};

export type PortfolioData = {
  allPortfolioCategories: PortfolioCategoryRecord[];
  allPortfolioTags: PortfolioGalleryTag[];
};

export type ServiceDataBlock = {
  __typename: 'ServiceRecord';
  slug: string;
  thumbnailImage: ImageAsset;
  title: string;
  description: string;
  buttonText: string;
};

export type ServiceData = {
  service: ServiceDataBlock;
};


export type MultipleBlock = {
  __typename: "MultipleBlockRecord";
  content: ContentBlock[];
}

export type SingleBlock = {
  __typename: "SingleBlockRecord";
  content: ContentBlock;
}

export type ContentTypeBlock = SingleBlock | MultipleBlock; 

export type HomeData = {
  homepage: {
    title: string;
    contentType: MultipleBlock;
  };
};

export type GlobalData = {
  global: {
    headerLogo: string;
    headerNavigation: HeaderNavigation[];
    footerPhoneNumber: string;
    footerEmail: string;
    footerSocialMediaLinks: SocialMediaLinkRef[];
    complaintsBookLink: string;
    privacyPolicyLink: PrivacyPolicyLink;
    copyright: string;
  };
};

export type AboutDataBlock = {
  __typename: "AboutRecord";
  title: string;
  coverImage: ImageAsset;
  description: string;
};

export type AboutData = {
  about: AboutDataBlock;
};

export type ContactDataBlock = {
  __typename: "ContactRecord";
  title: string;
  coverImage: ImageAsset;
  phoneNumber: string;
  email: string;
};

export type ContactData = {
  contact: ContactDataBlock;
};

// Check for only one of this block shapes
export type ContentBlock = VideoBlock | CardTextImg | ContentProject;
export type GalleryItemsBlock = GalleryRelatedProjects | GalleryRelatedServices | ExternalVideoBlock | GalleryItems; // PortfolioPhotoImage