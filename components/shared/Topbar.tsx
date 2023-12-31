import Link from "next/link";
import Image from "next/image";
import LogoutComponent from "./LogoutComponent";
import Logo from "./Logo";
import { Button } from "../ui/button";
const TopBar = async ({ withLogout = true }: { withLogout?: boolean }) => {
  return (
    <nav className="topbar">
      <Link href="/" className="flex flex-row items-center gap-4">
        <Logo />
        <p className="header-gradient text-[27px] font-bold pb-0.5">You're Wrong</p>
      </Link>
      <div className="flex flex-row items-center gap-1">
        <div className="block md:hidden">
          {withLogout ? <LogoutComponent /> : <></>}
        </div>
        <a href="https://www.buymeacoffee.com/angusmacapm" target="_blank" rel="noopener noreferrer" className="header-gradient font-bold">
          Donate
        </a>
      </div>
    </nav>
  );
};

export default TopBar;


