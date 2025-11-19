import Video from "@/app/ui/video";
import CardTextMedia from "@/app/ui/card-text-media";
import Gallery from "@/app/ui/gallery";
import Form from "@/app/ui/form";

export default function Home() {
  return (
    <div className="flex min-h-screen min-w-screen items-center justify-center font-sans">
      <main className="flex min-h-screen w-full flex-col items-center bg-white sm:items-start">
        <Video />
        <CardTextMedia title="Test" desc="Teste Teste Teste Teste" btnLabel="Solicitar" bgColor="bg-gray-300" imgUrl="/home.avif" />
        <div id="last-works" className="flex flex-col w-full h-auto items-center px-5 lg:px-[56px]">
          <h1>Ultimos trabalhos</h1>
          <Gallery />
        </div>
        <div id="services" className="flex flex-col w-full h-auto items-center px-5 lg:px-[56px]">
          <h1>Os meus serviços</h1>
          <Gallery hasTitle removeBtn />
        </div>
        <div id="contact" className="flex flex-col w-full h-auto items-center px-5 lg:px-[56px]">
          <h1>Pede um orçamento gratis</h1>
          <Form />
        </div>
      </main>
    </div>
  );
}
