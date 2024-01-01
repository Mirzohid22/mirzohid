import React from "react";
import Link from "next/link";
import Image from "next/image";
import github from "../../public/brands/github.svg";
import telegram from "../../public/brands/telegram.svg";
import x from "../../public/brands/x.svg";
import linkedin from "../../public/brands/linkedinLigth.svg";
import cv from "../../public/brands/cv.svg";

const Details: React.FC = () => {
  return (
    <div className="flex items-center mt-4">
      <Link
        href="https://t.me/mirzohid22me"
        target="_blank"
        className="text-white hover:scale-110 transform transition-all duration-500"
      >
        <Image src={cv} width={50} height={50} alt="CV" />
      </Link>
      <Link
        href="https://t.me/mirzohid22me"
        target="_blank"
        className="text-white hover:scale-110 transform transition-all duration-500"
      >
        <Image src={telegram} width={50} height={50} alt="Telegram" />
      </Link>
      <Link
        href="https://github.com/Mirzohid22"
        target="_blank"
        className="text-white hover:scale-110 transform transition-all duration-500"
      >
        <Image src={github} width={50} height={50} alt="Github" />
      </Link>
      <Link
        href="https://www.linkedin.com/in/mirzohid-salimov/"
        target="_blank"
        className="text-white hover:scale-110 transform transition-all duration-500"
      >
        <Image src={linkedin} width={50} height={50} alt="Linkedin" />
      </Link>
      <Link
        href="https://twitter.com/SalimovMir15987"
        target="_blank"
        className="text-white hover:scale-110 transform transition-all duration-500"
      >
        <Image src={x} width={50} height={50} alt="X" />
      </Link>
    </div>
  );
};

export default Details;
