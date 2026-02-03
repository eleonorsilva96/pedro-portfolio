import type { Metadata } from "next";
import { quicksand, openSans, lemon, mulish, specialElite } from "@/app/ui/fonts";
import "./globals.css";
import Header from '@/app/ui/header';
import Footer from "@/app/ui/footer";
import { GlobalData } from "@/app/lib/definitions";
import { performRequest } from "./lib/datocms";

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

export const metadata: Metadata = {
  title: "Pedro Martins | Videógrafo e fotógrafo | Aveiro",
  description: "Olá, o meu nome é Pedro Martins, sou videógrafo e fotógrafo freelancer de Aveiro. Faço gravação, edição de vídeo, motion-graphics, registo de fotos, edição de fotos e gravação com drone.",
};

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
      </body>
    </html>
  );
}
