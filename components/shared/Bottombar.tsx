import { sidebarLinks } from "@/constants";
import SidebarLinks from "./SidebarLinks";

const BottomBar = () => {
  return (
    <div className="bottombar">
      <div className="bottombar_container">
        <SidebarLinks
          type="bottombar_link"
          text_class="text-subtle-medium text-light-1 max-sm:hidden"
        />
      </div>
    </div>
  );
};

export default BottomBar;
