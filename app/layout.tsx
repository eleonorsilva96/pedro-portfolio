import type { Metadata } from "next";
import { quicksand, openSans } from "@/app/ui/fonts";
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
      footerSocialMediaLinks {
        ... on SocialMediaLinkRecord {
          __typename
          id
          link
          icon {
            url
            width
            height
            alt
          }
        }
      }
      complaintsBookLink
      privacyPolicyLink {
        __typename
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

  if(!global) return null

  return (
    <html lang="en">
      <body
        className={`${quicksand.variable} ${openSans.variable} antialiased`}
      >
        <Header logo={global.headerLogo} navLinks={global.headerNavigation} />
        {children}
        <Footer />
      </body>
    </html>
  );
}
