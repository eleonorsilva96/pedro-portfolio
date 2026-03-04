import sharp from "sharp";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { buildConfig } from "payload";
import path from "path";

import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Projects } from "./collections/Projects";
import { Categories } from "./collections/Categories";
import { Tags } from "./collections/Tags";
import { Services } from "./collections/Services";
import { Homepage } from "./globals/Homepage";
import { AboutMe } from "./globals/AboutMe";
import { Contact } from "./globals/Contact";
import { Header } from "./globals/Header";
import { Footer } from "./globals/Footer";
import { Privacy } from "./globals/Privacy";

export default buildConfig({
  editor: lexicalEditor(),
  // Define and configure your collections in this array
  collections: [Users, Media, Projects, Categories, Tags, Services],
  globals: [Header, Footer, Homepage, AboutMe, Contact, Privacy],
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
});
