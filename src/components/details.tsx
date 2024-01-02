import React from "react";
import Link from "next/link";
import Image from "next/image";
import github from "../../public/brands/github.png";
import telegram from "../../public/brands/telegram.png";
import linkedin from "../../public/brands/linkedin.png";
import stackoverflow from "../../public/brands/stackoverflow.png";
import cv from "../../public/brands/pdf.png";
const Details: React.FC = () => {
  return (
    <div className="flex items-center mt-4 gap-1">
      <Link
        href="https://drive.google.com/file/d/1GuhvYUwReGxITLgG6sNyEHltFPZtGVXr/view?usp=sharing"
        target="_blank"
        className=" text-white hover:scale-110 transform transition-all duration-500"
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
        href="https://stackoverflow.com/users/17851958/mirzohid-salimov"
        target="_blank"
        className="text-white hover:scale-110 transform transition-all duration-500"
      >
        <Image src={stackoverflow} width={50} height={50} alt="X" />
      </Link>
    </div>
  );
};

export default Details;
