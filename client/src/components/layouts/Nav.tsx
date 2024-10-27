import { Link, useLocation } from "react-router-dom";
import { RootState } from "../../store/store";
import { useSelector } from "react-redux";

const Nav = () => {
  const location = useLocation();
  const isSurveyBuilderPath = /^\/survey\/[0-9]+\/\/[0-9]+\/build$/.test(
    location.pathname
  );
  const isProfilePath = location.pathname === "/profile";
  const currentWorkspace = useSelector(
    (state: RootState) => state.currentWorkspace.currentWorkspace
  );
  return (
    <nav
      className={`  ${
        isSurveyBuilderPath || isProfilePath ? "justify-between" : "justify-end"
      }`}
    >
      {location.pathname === "/profile" && (
        <Link
          to={`/`}
          className="flex items-center justify-center rounded-md main_text text-sm transition-all  gap-1"
        >
          <img
            src="/assets/icons/back-arrow.svg"
            alt="Profile"
            className="w-[25px] rotate-180 transition-all rounded-md hover:bg-[#4d4c4c6f]"
          />
          <span>Surveys</span>
        </Link>
      )}
      {isSurveyBuilderPath && (
        <div className="flex flex-grow">
          <Link to={`/`}>{currentWorkspace?.title ?? "Go back"}</Link>

          <div className="flex justify-center flex-grow ">
            <button>
              Create
              <span className="mx-2">{">"}</span>
            </button>
            <button>Share {}</button>
          </div>
        </div>
      )}
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
