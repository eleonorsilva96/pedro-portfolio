// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.

export type ImageAsset = {
  url: string;
  width: number;
  height: number;
  alt: string;
};

type TextBlock = {
  title: string;
};

export type GalleryItems = {
  __typename: 'GalleryItemRecord'; // i think it has another names
  id: string;
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
}

type Video = {
  muxPlaybackId: string;
  title: string;
  width: number;
  height: number;
  blurUpThumb: string;
};

type VideoAsset = {
  url: string;
  alt?: string;
  video: Video;
};

// Video Block Record
type VideoBlock = {
  __typename: "VideoBlockRecord";
  id: string;
  videoAsset: VideoAsset;
};

// Card Text Image Record
type CardTextImg = {
  __typename: "CardTextImgRecord";
  id: string;
  title: string;
  description: string;
  buttonText: string;
  asset: ImageAsset;
};

// Card Gallery Record
type CardGallery = {
  __typename: "CardGalleryRecord";
  id: string;
  title: string;
  galleryItems: GalleryItems[]; // array of image objects
  filters: TextBlock[]; // array of titles
};

type CategoryLinkRef = {
    id: string;
    __typename: 'LinkRecord';
    name: string;
    link: {
        __typename: 'PortfolioCategoryRecord' | 'ServiceRecord';
        slug: string;
    };
};

type SingleLinkRef = {
    __typename: 'AboutMeRecord' | 'ContactRecord';
} | null;

export type HeaderNavigation = {
    __typename: 'NavItemRecord';
    id: string;
    singleLink: SingleLinkRef;
    categoryLinks: CategoryLinkRef[];
}

type SocialMediaLinkRef = {
    __typename: 'SocialMediaLinkRecord';
    id: string;
    link: string;
    icon: ImageAsset;
};

type PrivacyPolicyLink = {
    __typename: 'PrivacyPolicyRecord';
} | null;

// Check for only one of this block shapes
type SectionBlock = VideoBlock | CardTextImg | CardGallery;


// ----- Portfolio -----

export type PortfolioPhotoImage = {
  __typename: 'ImageBlockRecord';
  id: string;
  asset: ImageAsset;
}

type PortfolioCategoryRef = {
  slug: string;
}

export type PortfolioGalleryTag = {
  id: string;
  title: string;
  slug: string;
  categoryRef: PortfolioCategoryRef[];
}

type ExternalVideoBlock = {
  __typename: 'ExternalVideoRecord';
  title: string;
  link: ExternalVideo;
}

type CardGalleryBlock = {
  title: string;
  galleryItems: GalleryItemsProjectBlock[];
}

type GalleryItemsProjectBlock = ExternalVideoBlock | GalleryItems | PortfolioPhotoImage; 

export type SlideProjectBlock = {
  __typename: 'SlideProjectRecord';
  urlVideo: ExternalVideo | null;
  video: VideoAsset | null;
  context: string;
  role: string | null;
  date: string | null;
  additionalLinkText: string | null;
  additionalLink: string | null; // can be null
}

type SectionProjectBlock = {
  __typename: 'SectionProjectRecord';
  description: string;
  section: CardGalleryBlock[];

}

type GalleryProjectBlock = {
  __typename: 'GalleryProjectRecord';
  description: string;
  photosGallery: PortfolioPhotoImage[]; // convert from arr to obj
}

// conditional contentProject
type ContentProject = GalleryProjectBlock | SectionProjectBlock | SlideProjectBlock; 

type ProjectIdBlock = {
  id: string;
  title: string;
  project: string;
  content: ContentProject;
}

export type PortfolioGalleryType = {
  __typename: 'GalleryPortfolioRecord';
  id: string;
  thumbnail: ImageAsset;
  tag: PortfolioGalleryTag[];
  projectId: ProjectIdBlock;
}

export type PortfolioMusicType = {
  __typename: 'MusicPortfolioRecord';
  id: string;
  title: string;
  description: string;
  uploadVideo: VideoAsset;
  externalVideoLink: string;
}

export type CategoryRecord = PortfolioGalleryType | PortfolioMusicType; 

type PortfolioCategoryRecord = {
  title: string;
  description: string;
  slug: string;
  gallery: CategoryRecord[];
  cta: string | null;
}

export type PortfolioData = {
  allPortfolioCategories: PortfolioCategoryRecord[];
  allPortfolioTags: PortfolioGalleryTag[];
};

export type HomeData = {
  homepage: {
    title: string;
    sections: SectionBlock[]; // Array of block shapes
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


