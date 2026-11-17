import React from "react";
import Header from "./Header";
import SideBar from "./SideBar";
import { DEALER_LINKS } from "../../constants/Links";

// Page frame shared by every dealer page: header, sidebar and a centred content column.
const DealerLayout = ({ children, title = "Dealer Control Center", width = "max-w-7xl" }) => (
  <div className="bg-mist font-sans min-h-screen flex flex-col text-ink">
    <Header title={title} />
    <div className="flex flex-1 min-h-[calc(100vh-4rem)]">
      <SideBar links={DEALER_LINKS} />
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
        <div className={`${width} mx-auto`}>{children}</div>
      </main>
    </div>
  </div>
);

export default DealerLayout;
