import Image from "next/image";

export default function CardTextMedia({
  title,
  desc,
  btnLabel,
  bgColor,
  imgUrl,
} : {
title : string,
desc: string,
btnLabel: string,
bgColor: string,
imgUrl: string,
}) {
  return (
    <div className={`flex flex-col lg:flex-row w-full h-auto justify-between items-center ${bgColor}`}>
      <div className="flex flex-col h-[500px] lg:h-0 md:w-full items-center justify-center">
        <h1>{title}</h1>
        <p>{desc}</p>
        <button>{btnLabel}</button>
      </div>
      <div className="w-full">
        <Image
          src={imgUrl}
          className="w-full h-[500px] lg:h-[600px] object-cover object-[35%_0] md:object-center"
          width={2784}
          height={1320}
          alt="Picture of the author"
        />
      </div>
    </div>
  );
}
