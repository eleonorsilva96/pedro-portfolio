import { quicksand, openSans, lemon, mulish, specialElite } from "@/app/(my-app)/ui/fonts";
import "./globals.css";
import Header from '@/app/(my-app)/ui/header';
import Footer from "@/app/(my-app)/ui/footer";
import WhatsAppButton from "./ui/whatsapp-button";
import { getPayload } from "payload";
import config from '@payload-config';
import { unstable_cache } from "next/cache";
import { SiteSettingsContext } from "./context/SiteSettingsContext";
import { Metadata } from "next";

async function getSiteSettingsData() {
  const payload = await getPayload({ config });

  const result = await payload.findGlobal({
    slug: 'site-settings',
    depth: 4, 
  });

  return result || null;
}

export const getCachedSiteSettings = unstable_cache(
  // function with the request
  async () => getSiteSettingsData(),
  // key array to facilitate the finding of the cached data
  ['site-settings-cache'], 
  // tag name to eventually clear it when data changes on the db
  {
    tags: ['global_site_settings'], 
    revalidate: 86400, // auto-revalidate every 24 hours
  }
);

export async function generateMetadata(): Promise<Metadata> {
  const siteSettings = await getCachedSiteSettings();
  const favicon = typeof siteSettings.favicon === 'object' ? siteSettings.favicon : null;

  return {
    title: {
      template: `%s ${siteSettings.titleSuffix}`,
      default: siteSettings.titleSuffix.replace('- ', ''),
    },
    icons: {
      icon: favicon?.url || 'app/favicon.ico',
    }
  }

}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const siteSettingsData = (await getCachedSiteSettings());

  return (
    <html lang="en">
      <body
        className={`${quicksand.variable} ${openSans.variable} ${lemon.variable} ${mulish.variable} ${specialElite.variable} antialiased flex flex-col !min-h-screen`}
      >
        <Header data={siteSettingsData.header} />
        <main className="font-quick flex-grow">
          {/* wrap all components with context provider to have access to the site settings contact info if needed */}
          <SiteSettingsContext value={siteSettingsData.contactSection}>
            {children}
          </SiteSettingsContext>
        </main>
        <Footer data={siteSettingsData.footer}/>
        <WhatsAppButton />
      </body>
    </html>
  );
}
