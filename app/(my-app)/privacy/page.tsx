import { getPayload } from "payload";
import config from "@payload-config";
import { RichText } from "@payloadcms/richtext-lexical/react";

async function getPrivacyData() {
  const payload = await getPayload({ config });

  const result = await payload.findGlobal({
    slug: "privacy",
    depth: 1,
  });

  return result || null;
}

export default async function PrivacyPage() {
  const privacyData = await getPrivacyData();

  return (
    <div className="w-full flex flex-col items-center bg-white gap-6 py-8 px-4">
      <h1 className="text-3xl lg:text-4xl">{privacyData.title}</h1>
      {/* add prose class from tailwind typography plugin to better format the document */}
      {privacyData.content && (
        <RichText
          data={privacyData.content}
          className="text-lg prose prose-li:marker:text-stone-700 prose-h1:mb-0 rich-text"
        />
      )}
    </div>
  );
}
