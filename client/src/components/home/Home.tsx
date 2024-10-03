import Workspaces from "../workspaces/Workspaces";
import Surveys from "../surveys/Surveys";
import { useGetWorkspaces } from "../../hooks/workspace";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { setWorkspaces } from "../../store/slices/workspaceSlice";
import { useLanguage } from "../lang/LanguageProvider";
const Home = () => {
  const { t } = useLanguage();
  const { handleGetWorkspaces, loading, error, data } = useGetWorkspaces();
  const dispatch = useDispatch();

  const currentWorkspace = useSelector(
    (state: RootState) => state.currentWorkspace.currentWorkspace
  );
  const [menuOpen, setMenuOpen] = useState(false);

  const workspaceChangeMenuRef = useRef<HTMLDivElement>(null);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        workspaceChangeMenuRef.current &&
        !workspaceChangeMenuRef.current.contains(event.target as Node) &&
        toggleButtonRef.current &&
        !toggleButtonRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  useEffect(() => {
    handleGetWorkspaces();
  }, [handleGetWorkspaces]);

  useEffect(() => {
    if (Array.isArray(data) && data.length > 0) {
      dispatch(setWorkspaces(data));
    }
  }, [data, dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching workspaces: {error.message}</div>;
  }

  return (
    <div className="home">
      <aside>
        <div className="w-full flex items-end justify-between font-semibold mb-5">
          <p className="p-1">{t("workSpaceTitle")}</p>
          <div className="flex items-center gap-5">
            <button
              className="p-1 cursor-pointer transition-all hover:bg-[#6272a4] rounded-md"
              aria-label="Add Workspace"
            >
              <img
                src="/assets/icons/plus.svg"
                alt="Add Workspace"
                className="w-[20px]"
              />
            </button>
            <button
              className="p-1 cursor-pointer transition-all hover:bg-[#6272a4] rounded-md"
              aria-label="Search Workspaces"
            >
              <img
                src="/assets/icons/search.svg"
                alt="Search Workspaces"
                className="w-[20px]"
              />
            </button>
          </div>
        </div>
        <Workspaces />
      </aside>

      <section>
        <div className="flex items-end gap-5 mb-5 relative">
          <p className="font-extrabold text-gray-300 text-xl">
            {currentWorkspace?.title}
          </p>
          <button
            className="p-[.5px] bg-[#292c2e] cursor-pointer transition-all hover:bg-[#6272a4] rounded-md "
            onClick={toggleMenu}
            ref={toggleButtonRef}
          >
            <img
              src="/assets/icons/dots.svg"
              alt="More Options"
              className="w-[20px]"
            />
          </button>
          {menuOpen && (
            <div
              className="flex flex-col text-left right-0 top-[30px] text-sm absolute  font-semibold  bg-[#0e0e0e] p-2 rounded-md shadow-md z-10"
              ref={workspaceChangeMenuRef}
            >
              <span className="survey_card_buttons">
                {t("renameWorkspace")}
              </span>
              <span className="survey_card_buttons text-red-600">
                t{"deleteWorkspace"}
              </span>
            </div>
          )}
        </div>
        <Surveys />
      </section>
    </div>
  );
};

export default Home;
