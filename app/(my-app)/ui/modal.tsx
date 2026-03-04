import { Suspense } from "react";
import ModalContent from "./modal-content";
import { ContentBlock, PortfolioGalleryType } from "../lib/definitions";

export default function Modal({
  content,
  modalId,
  category,
  projectSlug,
}: {
  content: (PortfolioGalleryType | ContentBlock)[];
  modalId: string;
  category: string;
  projectSlug?: string;
}) {
  if (!modalId) return null;

  if (!content) return null;

  return (
    <Suspense fallback={null}>
      <ModalContent
        galleryList={content || []}
        projectId={modalId}
        category={category}
        project={projectSlug}
        isModal
      />
    </Suspense>
  );
}
