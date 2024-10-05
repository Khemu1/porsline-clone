import { Link } from "react-router-dom";

const Nav = () => {
  return (
    <nav>
      <Link
        to={"/profile"}
        className="p-[1px] cursor-pointer transition-all hover:bg-[#6272a4] rounded-md"
      >
        <img
          src="/assets/icons/profile.svg"
          alt="Profile"
          className="w-[20px]"
        />
      </Link>
    </nav>
  );
};

export default Nav;
