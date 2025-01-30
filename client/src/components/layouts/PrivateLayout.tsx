import { Outlet } from "react-router-dom";
import Nav from "./Nav";
import { useAuthUser } from "../../hooks/auth";
const PrivateLayout = () => {
  const { handleSignIn } = useAuthUser();
  handleSignIn();

  return (
    <div className="flex flex-col w-full flex-grow ">
      <Nav />
      <Outlet />
    </div>
  );
};

export default PrivateLayout;
