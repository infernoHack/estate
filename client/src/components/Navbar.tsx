import { useState } from "react";
import { Link } from "react-router-dom";
import { RiMenu3Fill } from "react-icons/ri";
import { PiChatCenteredDotsLight } from "react-icons/pi";

import ButtonLink from "./ButtonLink";
import Modal from "./Modal";
import { useAppSelector } from "../redux/store";

function Navbar() {
  const [openMenu, setOpenMenu] = useState<boolean>(false);

  const user = useAppSelector((state) => state.user.currentUser);

  const messageCount = 2;

  return (
    <nav className="fixed left-0 right-0 top-0 z-10 h-28 w-full bg-white">
      <div className="mx-auto flex h-full max-w-[1380px] items-center justify-between px-12">
        <ul className="flex w-3/5 items-center gap-x-10 py-8">
          <Link to="/" className="flex items-center gap-x-2">
            <img src="/logo.png" className="size-7" alt="logo" />
            <h2 className="text-lg font-semibold tracking-wider md:hidden lg:block">
              EliteEstate
            </h2>
          </Link>
          <Link
            to="/"
            className="hidden transition-all hover:font-semibold md:block"
          >
            Home
          </Link>
          <Link
            to="/"
            className="hidden transition-all hover:font-semibold md:block"
          >
            About
          </Link>
          <Link
            to="/"
            className="hidden transition-all hover:font-semibold md:block"
          >
            Contact
          </Link>
          <Link
            to="/"
            className="hidden transition-all hover:font-semibold md:block"
          >
            Agents
          </Link>
        </ul>
        <div className="relative flex h-full w-2/5 items-center justify-end py-8 pl-6 font-semibold lg:bg-orange-50 lg:px-6">
          <div
            className="fixed right-6 z-20 md:hidden"
            onClick={() => setOpenMenu((state) => !state)}
          >
            <RiMenu3Fill
              style={{
                height: "36px",
                width: "36px",
                color: `${openMenu ? "white" : "black"}`,
              }}
            />
          </div>
          {user && (
            <Modal.Button name="chat-modal">
              <div className="fixed right-20 z-20 md:hidden">
                <div className="relative">
                  <PiChatCenteredDotsLight
                    style={{
                      height: "36px",
                      width: "36px",
                      color: `${openMenu ? "white" : "black"}`,
                    }}
                  />
                  <span className="absolute -right-2 -top-2 rounded-full bg-red-500 px-2 py-1 text-xs text-white">
                    {messageCount}
                  </span>
                </div>
              </div>
            </Modal.Button>
          )}
          <ul
            className={`fixed ${openMenu ? "right-0 " : "-right-1/2"} top-0 flex h-dvh w-1/2 flex-col items-center justify-center gap-y-5 bg-black text-lg text-white transition-all duration-700 md:hidden`}
          >
            <Link to="/" className="hover:text-neutral-200">
              Home
            </Link>
            <Link to="/" className="hover:text-neutral-200">
              About
            </Link>
            <Link to="/" className="hover:text-neutral-200">
              Contact
            </Link>
            <Link to="/" className="hover:text-neutral-200">
              Agents
            </Link>
            {user ? (
              <Link to="/profile" className="hover:text-neutral-200">
                Profile
              </Link>
            ) : (
              <>
                <Link to="/login" className="hover:text-neutral-200">
                  Login
                </Link>
                <Link to="/register" className="hover:text-neutral-200">
                  Sign Up
                </Link>
              </>
            )}
          </ul>

          <div
            className={`hidden items-center md:flex ${user ? "md:gap-4 lg:gap-2" : "md:gap-3"} `}
          >
            {user ? (
              <>
                <div className="h-full w-full">
                  <img
                    src={user.avatar?.url || "/noavatar.jpg"}
                    className="size-9 rounded-full object-cover"
                    alt="user-img"
                  />
                </div>
                <div className="hidden whitespace-nowrap px-4 py-2 text-yellow-500 transition-all hover:border-yellow-600 hover:text-yellow-600 lg:block">
                  {user.fullname}
                </div>
                <div className="relative">
                  <ButtonLink to="/profile">Profile</ButtonLink>
                  <span className="absolute -right-2 -top-2 rounded-full bg-red-500 px-2 py-1 text-xs text-white">
                    {messageCount}
                  </span>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/register"
                  className="border border-yellow-500 px-6 py-2 text-yellow-500 transition-all hover:border-yellow-600 hover:text-yellow-600 md:inline-block"
                >
                  Sign Up
                </Link>
                <ButtonLink to="/login">Login</ButtonLink>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
