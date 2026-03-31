import sharp from "sharp";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { buildConfig } from "payload";
import path from "path";
import { s3Storage } from '@payloadcms/storage-s3';
import { seoPlugin } from '@payloadcms/plugin-seo';

import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Categories } from "./collections/Categories";
import { Tags } from "./collections/Tags";
import { Services } from "./collections/Services";
import { Homepage } from "./globals/Homepage";
import { AboutMe } from "./globals/AboutMe";
import { Contact } from "./globals/Contact";
import { Privacy } from "./globals/Privacy";
import { SiteSettings } from "./globals/SiteSettings";
import { Projects } from "./collections/Projects";

export default buildConfig({
  editor: lexicalEditor(),
  // Define and configure your collections in this array
  collections: [Users, Media, Projects, Categories, Tags, Services],
  globals: [SiteSettings, Homepage, AboutMe, Contact, Privacy],
  secret: process.env.PAYLOAD_SECRET || "",
  db: mongooseAdapter({
    url: process.env.MONGODB_URI || "",
  }),
  sharp,
  // auto-generate TypeScript interfaces for Collections and Globals
  typescript: {
    outputFile: path.resolve(process.cwd(), "payload-types.ts"),
  },
  cors: "*",
  // send media imports to Cloudflare storage 
  plugins: [
    s3Storage({
      collections: {
        media: {
          prefix: 'uploads', // the uploads will be stored inside a uploads folder
          generateFileURL: ({ filename }) => {
            // intercepts the default Payload URL and replaces it with your Cloudflare store link
            // to tell the frontend exactly where to find the image
            return `${process.env.R2_PUBLIC_URL}/uploads/${filename}`;
          },
        },
      },
      bucket: process.env.R2_BUCKET || '',
      config: {
        credentials: {
          accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
        },
        endpoint: process.env.R2_ENDPOINT || '',
        region: 'auto', 
        forcePathStyle: true, 
      },
    }),
    // generates seo fields on the admin panel where the images can be imported from the media collection
    // the generate functions auto-fill defaults from the document's existing fields 
    // and is possible to preview the content 
    seoPlugin({
      collections: [
        'categories', 'projects', 'services'
      ],
      globals: [
        'about-me', 'contact', 'homepage'
      ],
      uploadsCollection: 'media',
      generateTitle: ({ doc }) => `${doc.title}`,
      generateDescription: ({ doc }) => doc.excerpt,
      generateImage: ({ doc }) => doc?.featuredImage,
    })
  ],
});
