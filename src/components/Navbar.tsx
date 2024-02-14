import { Inter } from "next/font/google";
import { NextPage } from "next";
import React from "react";
import Image from "next/image";

const inter = Inter({ subsets: ["latin"] });

const HomePage: NextPage = () => {
  const toggleMenu = (): void => {
    const menu = document.querySelector(".menu-links");
    const icon = document.querySelector(".hamburger-icon");
    menu?.classList.toggle("open");
    icon?.classList.toggle("open");
  };

  return (
    <main>
      <nav id="desktop-nav">
        <div className="logo-cont">
          <div className="logo">Doon</div>
          <img src="/icon/icon.png" alt="logo" className="flex" />
        </div>

        <div>
          <ul className="nav-links">
            <li>
              <a href="#try_me">Try Me</a>
            </li>
            <li>
              <a href="#about">About</a>
            </li>
            <li>
              <a href="#team">Team</a>
            </li>
            <li>
              <a href="#contact">Contact</a>
            </li>
          </ul>
        </div>
      </nav>
      <nav id="hamburger-nav">
        <div className="logo-cont">
          <div className="logo">Doon</div>
          <img src="/icon/icon.png" alt="logo" className="flex" />
          {/* <Image
            alt="logo"
            width={40}
            height={40}
            src={"/icon/icon.png"}
            className="block"
          ></Image> */}
        </div>

        <div className="hamburger-menu">
          <div className="hamburger-icon" onClick={toggleMenu}>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div className="menu-links">
            <li>
              <a href="#try_me" onClick={toggleMenu}>
                Try Me
              </a>
            </li>
            <li>
              <a href="#about" onClick={toggleMenu}>
                About
              </a>
            </li>
            <li>
              <a href="#team" onClick={toggleMenu}>
                Team
              </a>
            </li>
            <li>
              <a href="#contact" onClick={toggleMenu}>
                Contact
              </a>
            </li>
          </div>
        </div>
      </nav>
    </main>
  );
};

export default HomePage;