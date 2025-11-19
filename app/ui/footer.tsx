
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full h-64 bg-gray-400">
      <div className="h-full flex flex-col justify-around items-center lg:flex-row lg:items-between">
        <div className="flex flex-col gap-6">
            <div className="flex flex-col">
                <Link href="/">phone number</Link>
                <Link href="/">email</Link>
            </div>
            <div className="flex gap-4">
                <span>Segue-me:</span>
                <div className="flex gap-2">
                    <Link href="/">
                        <Image
                            src="/file.svg"
                            className="w-6 h-6"
                            width={24}
                            height={24}
                            alt="Social Media" 
                        />
                    </Link>
                </div>
            </div>
        </div>
        <div className="flex flex-col gap-6">
            <div className="flex flex-col">
                <Link href="/">livro reclamacoes</Link>
                <Link href="/">politica privacidade</Link>
            </div>
            <div className="flex gap-4">
                <span>&copy; 2025 by Pedro A. Martins</span>
            </div>
        </div>
      </div>
    </footer>
  )
}