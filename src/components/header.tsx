import React from "react";
import Link from "next/link";

const Header: React.FC = () => {
  return (
    <header className="bg-gray-800 h-16">
      <nav className="container mx-auto flex items-center justify-between p-4">
        <div className="flex items-center">
          <Link href="/" className="text-white text-xl font-bold">
            Mirzohid
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <Link
            href="https://t.me/mirzohid22me"
            target="_blank"
            className="text-gray-300 hover:text-white"
          >
            Contact
          </Link>
          <Link
            href="https://github.com/Mirzohid22"
            target="_blank"
            className="text-gray-300 hover:text-white"
          >
            Github
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
