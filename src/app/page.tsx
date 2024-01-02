import Image from "next/image";
import Header from "@/components/header";
import Details from "@/components/details";
import mirzohid from "../../public/mirzohid.jpg";
export default function Home() {
  return (
    <main className="h-screen min-w-screen">
      <Header />
      <div className="w-full h-9/10 flex justify-center items-center flex-col">
        <Image
          src={mirzohid}
          width={200}
          height={200}
          className="rounded-full mt-20"
          alt="Image of me"
        />
        <div className="mt-2">
          <h1 className="text-2xl">
            <span className="font-bold text-2xl">Mirzohid</span> - Software
            Engineer
          </h1>
        </div>
        <div className="mx-auto mt-2 sm:w-3/5 md:w-2/3 lg:w-1/3 xl:w-1/4 2xl:w-1/6 ">
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
