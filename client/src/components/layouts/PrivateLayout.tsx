import { Outlet } from "react-router-dom";
import Nav from "./Nav";
import { LanguageProvider } from "../lang/LanguageProvider";

const PrivateLayout = () => {
  return (
    <LanguageProvider>
      <div className="flex flex-col w-full flex-grow ">
        <Nav />
        <Outlet />
      </div>
    </LanguageProvider>
  );
};

export default PrivateLayout;
