import Image from "next/image";
import Header from "@/components/header";
import Details from "@/components/details";
import mirzohid from "../../public/mirzohid.jpg";
export default function Home() {
  return (
    <main className="h-auto min-w-screen">
      <Header />
      <div className="w-full h-full flex justify-center items-center flex-col">
        <Image
          src={mirzohid}
          width={200}
          height={200}
          className="rounded-full mt-20"
          alt="Image of me"
        />
        <div className="mt-2">
          <h1 className="text-2xl">
            <span className="font-bold">Mirzohid</span> - Software Engineer
          </h1>
        </div>
        <div className="mx-auto mt-2 w-1/2">
          <p className="text-xl text-center">
            I&apos;m a software engineer based in Tashkent, Uzbekistan
            specializing in building (and occasionally designing) exceptional
            websites, applications, and everything in between.
          </p>
        </div>
        <Details />
      </div>
    </main>
  );
}
