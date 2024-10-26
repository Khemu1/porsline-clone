import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { useLanguage } from "../lang/LanguageProvider";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  addWelcomePartF,
  deleteWelcomePartF,
  transformDataIntoFormData,
} from "../../utils";
import { useDeleteWelcomePart } from "../../hooks/welcomePart";
import EditWeclome from "../Dialog/survey/edit/welcome/EditWeclome";
import { WelcomePartModel } from "../../types";
import { useSocket } from "../socket/userSocket";

const WelcomePart: React.FC<{
  setOpenWelcomePage: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ setOpenWelcomePage }) => {
  const dispatch = useDispatch();
  const welcomePartState = useSelector((state: RootState) => state.welcomePart);
  const currentSurvey = useSelector(
    (state: RootState) => state.currentSurvey.currentSurvey
  );
  const { t, getCurrentLanguage, getCurrentLanguageTranslations } =
    useLanguage();
  const { workspaceId, surveyId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const { handleDeleteWelcomePart } = useDeleteWelcomePart();
  const socket = useSocket();

  const [menuOpen, setMenuOpen] = useState<Record<number, boolean>>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);

  // Event listener to close menu when clicking outside
  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(event.target as Node) &&
      toggleButtonRef.current &&
      !toggleButtonRef.current.contains(event.target as Node)
    ) {
      setMenuOpen({});
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const type = searchParams.get("type");
    const id = searchParams.get("id");

    if (type === "welcome" && id) {
      setIsDialogOpen(true);
    }
  }, [location]);

  const handleDelete = (welcomePartId: number) => {
    try {
      const formData = new FormData();
      transformDataIntoFormData({ workspaceId, surveyId }, formData);
      handleDeleteWelcomePart({
        welcomePartId,
        serviceAndWorkspace: formData,
        getCurrentLanguageTranslations,
        currentLang: getCurrentLanguage(),
      });
      toggleMenu(welcomePartId);
    } catch (error) {
      console.error("Error deleting welcome part:", error);
    }
  };

  useEffect(() => {
    const handleSocketEvents = () => {
      socket.on("message", () => console.log("We have a change"));

      socket.on("WELCOME_PART_ADDED", (data) => {
        if (data.welcomePart.surveyId === currentSurvey?.id) {
          addWelcomePartF(data.welcomePart, dispatch);
        }
      });

      socket.on("WELCOME_PART_UPDATED", (data) => {
        if (data.welcomePart.id === welcomePartState?.id) {
          addWelcomePartF(data.welcomePart, dispatch);
        }
      });

      socket.on("WELCOME_PART_DELETED", (data) => {
        if (+data.surveyId === currentSurvey?.id) {
          deleteWelcomePartF(dispatch);
        }
      });
    };

    handleSocketEvents();

    return () => {
      socket.off("message");
      socket.off("WELCOME_PART_ADDED");
      socket.off("WELCOME_PART_UPDATED");
      socket.off("WELCOME_PART_DELETED");
    };
  }, [dispatch, currentSurvey, socket, welcomePartState]);

  const toggleMenu = (id: number) => {
    setMenuOpen((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const onClose = () => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.delete("type");
    searchParams.delete("id");

    navigate({ pathname: location.pathname, search: searchParams.toString() });
    setIsDialogOpen(false);
  };

  return (
    <>
      <div>
        {welcomePartState.id ? (
          <div
            className="flex gap-2 w-full items-center justify-between transition-all hover:bg-[#303033] cursor-pointer hover:text-white rounded-lg py-1 px-3"
            onClick={() =>
              navigate(
                `/survey/${workspaceId}/${surveyId}/build/edit?type=welcome&id=${welcomePartState.id}`
              )
            }
          >
            <div className="flex items-center gap-2">
              <img
                src="/assets/icons/welcome.svg"
                alt="welcome"
                className="w-[30px]"
              />
              <p
                className="text-white font-semibold"
                dangerouslySetInnerHTML={{
                  __html: welcomePartState.label ?? "",
                }}
              />
            </div>
            <button
              className="flex justify-center items-center border w-[50px] h-[30px] border-[#85808025] rounded-lg"
              onClick={(e) => {
                e.stopPropagation();
                toggleMenu(welcomePartState.id!);
              }}
              ref={toggleButtonRef}
            >
              <img
                src="/assets/icons/dots.svg"
                alt="menu"
                className="w-[50px] h-[30px]"
              />
            </button>
            {menuOpen[welcomePartState.id] && (
              <div
                ref={menuRef}
                className="flex flex-col text-left right-0 text-sm absolute top-10 bg-[#0e0e0e] p-2 rounded-md shadow-md z-10"
              >
                <span
                  className="survey_card_buttons text-red-600 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(welcomePartState.id!);
                  }}
                >
                  {t("delete")}
                </span>
              </div>
            )}
          </div>
        ) : (
          <div
            className="welcome_page_style"
            onClick={() => setOpenWelcomePage(true)}
          >
            <img src="/assets/icons/plus.svg" alt="plus" className="w-[20px]" />
            <p>{t("welcomePage")}</p>
          </div>
        )}
      </div>

      {isDialogOpen && (
        <EditWeclome
          welcomePart={welcomePartState as WelcomePartModel}
          isOpen={isDialogOpen}
          onClose={onClose}
        />
      )}
    </>
  );
};

export default WelcomePart;
