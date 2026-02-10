import type { Metadata } from "next";
import { quicksand, openSans, lemon, mulish, specialElite } from "@/app/ui/fonts";
import "./globals.css";
import Header from '@/app/ui/header';
import Footer from "@/app/ui/footer";
import { GlobalData, GlobalSeoData } from "@/app/lib/definitions";
import { performRequest } from "./lib/datocms";
import WhatsAppButton from "./ui/whatsapp-button";

const GLOBAL_SEO_QUERY = `
  query GlobalSeo {
    _site {
      globalSeo {
        siteName
        titleSuffix
        fallbackSeo {
          description
          title
          image {
            url
            width
            height
          }
        }
      }
      favicon {
        url
      }
    }
  }
`; 

const PAGE_CONTENT_QUERY = `
  query Global {
    global {
      headerLogo
      headerNavigation {
        ... on NavItemRecord {
          id
          singleLink {
          # to get the page name (for the url) check only for the models type
            __typename 
          }
          categoryLinks {
            ... on LinkRecord { # Nested Modular Content
              id
              name
              link {
                # check for the type to get the prefix (/services/...)
                __typename
                # ask the specific models for their slug
                ... on PortfolioCategoryRecord { 
                  slug
                }
                ... on ServiceRecord { 
                  slug
                }
              }
            }
          }
        }
      }
      footerPhoneNumber
      footerEmail
      footerSocialMediaLinks { # modular content list that could contain different types of blocks
        ... on SocialMediaLinkRecord {
          __typename
          id
          link
          icon
        }
      }
      complaintsBookLink
      privacyPolicyLink {
        ... on PrivacyPolicyRecord {
          title
          slug
        }
      }
      copyright
    }
  }`;

export async function generateMetadata(): Promise<Metadata> {
  const data = await performRequest(GLOBAL_SEO_QUERY) as GlobalSeoData;

  // to avoid 500 error
  if (!data?._site?.globalSeo) {
    return {
      title: "Pedro A. Martins Portfolio",
      description: "Videógrafo e Fotógrafo",
    };
  }

  const { globalSeo, favicon } = data._site;

  console.log("global seo", globalSeo);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  return {
    metadataBase: new URL(siteUrl),

    // site title
    title: {
      default: globalSeo.fallbackSeo.title,
      template: `%s ${globalSeo.titleSuffix}`, // Ex: "About Me | Client Portfolio"
    },
    
    // description for google
    description: globalSeo.fallbackSeo.description,
    
    // favicon 
    icons: {
      icon: favicon.url,
    },

    // how it shows in google/social media
    openGraph: {
      title: globalSeo.fallbackSeo.title,
      description: globalSeo.fallbackSeo.description,
      siteName: globalSeo.siteName,
      locale: 'pt_PT',
      type: 'website',
      images: [
        {
          url: globalSeo.fallbackSeo.image.url,
          width: globalSeo.fallbackSeo.image.width,
          height: globalSeo.fallbackSeo.image.height,
          alt: globalSeo.siteName,
        },
      ],
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  // run the query and treat the result as HomeData
  const { global } = await performRequest(PAGE_CONTENT_QUERY) as GlobalData;
  
  if(!global) return null;

  const FOOTER = {
    number: global.footerPhoneNumber,
    email: global.footerEmail,
    mediaLinks: global.footerSocialMediaLinks,
    complaintsLink: global.complaintsBookLink,
    privacyLink: global.privacyPolicyLink,
    copy: global.copyright,
  } 

  console.log("global", global);

  return (
    <html lang="en">
      <body
        className={`${quicksand.variable} ${openSans.variable} ${lemon.variable} ${mulish.variable} ${specialElite.variable} antialiased flex flex-col !min-h-screen`}
      >
        <Header logo={global.headerLogo} navLinks={global.headerNavigation} />
        <main className="font-quick flex-grow">
          {children}
        </main>
        <Footer data={FOOTER}/>
        <WhatsAppButton />
      </body>
    </html>
  );
}
