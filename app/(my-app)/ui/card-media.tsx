import Image from "next/image";

export default function CardMedia({
  imgUrl,
}: {
  imgUrl: string;
}) {
  return (
    <>
      <Image
        src={imgUrl}
        className="w-full h-[500px] lg:h-[600px] object-cover object-[35%_0] md:object-center"
        width={2784}
        height={1320}
        alt="Picture of the author"
      />
    </>
  );
}
