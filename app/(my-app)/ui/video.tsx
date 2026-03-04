

export default function Video() {
  return (
    <video className="w-full h-[1000px] lg:h-[800px] object-cover" autoPlay muted playsInline loop preload="none">
      <source src="/file.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  )
}