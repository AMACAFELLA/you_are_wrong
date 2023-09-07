import LogoutComponent from "./LogoutComponent";
import SidebarLinks from "./SidebarLinks";

const LeftSidebar = () => {
  return (
    <section className="custom-scrollbar leftsidebar">
      <div className="flex w-full flex-1 flex-col gap-4 px-4">
        <SidebarLinks
          type="leftsidebar_link"
          text_class="text-light-1 max-lg:hidden"
        />
      </div>
      <div className="mt-10 px-4">
        <LogoutComponent styles="gap-4 p-4">
          <p className="text-light-2 max-lg:hidden gap-4">Logout</p>
        </LogoutComponent>
      </div>
    </section>
  );
};

export default LeftSidebar;
