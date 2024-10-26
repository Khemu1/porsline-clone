import { Outlet } from "react-router-dom";
import Nav from "./Nav";

const PrivateLayout = () => {
  return (
    <div className="flex flex-col w-full flex-grow ">
      <Nav />
      <Outlet />
    </div>
  );
};

export default PrivateLayout;
