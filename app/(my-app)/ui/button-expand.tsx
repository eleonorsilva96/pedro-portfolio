"use client";
import ExpandIcon from "./icons/expand";
import MinimizeIcon from "./icons/minimize";

export default function ButtonExpand({ isExpand }: { isExpand: boolean }) {
    const expandIconHandler = isExpand ? <ExpandIcon className="text-gray-950" /> : <MinimizeIcon className="text-gray-950" />;

  return (
    <div // add on a client component to work
      className="absolute top-0 left-0 ml-4 mt-4"
      onClick={() => !isExpand}
    >
      {expandIconHandler}
    </div>
  );
}
