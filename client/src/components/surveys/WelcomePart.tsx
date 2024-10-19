import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { useLanguage } from "../lang/LanguageProvider";
import { useParams } from "react-router-dom";
import { transformDataIntoFormData } from "../../utils";
import { useDeleteWelcomePart } from "../../hooks/welcomePart";

const WelcomePart: React.FC<{
  setOpenWelcomePage: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ setOpenWelcomePage }) => {
  const welcomePartState = useSelector((state: RootState) => state.welcomePart);
  const { t, getCurrentLanguage, getCurrentLanguageTranslations } =
    useLanguage();
  const { workspaceId, surveyId } = useParams();

  const { handleDeleteWelcomePart } = useDeleteWelcomePart();

  const [menuOpen, setMenuOpen] = useState<Record<number, boolean>>({});
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);

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
      console.error(error);
    }
  };

  const toggleMenu = (id: number) => {
    setMenuOpen((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="flex w-full">
      {welcomePartState.id ? (
        <div
          className="flex gap-2 w-full items-center justify-between transition-all hover:bg-[#303033] cursor-pointer hover:text-white rounded-lg py-1 px-3"
          onClick={() => setOpenWelcomePage(true)}
        >
          <div className="flex items-center gap-2">
            <div className="survey_builder_icon_welcome_style">
              <img
                src="/assets/icons/welcome.svg"
                alt="welcome"
                className="w-[30px]"
              />
            </div>
            <p
              className="text-white font-semibold"
              dangerouslySetInnerHTML={{
                __html: welcomePartState.label ?? "",
              }}
            ></p>
          </div>
          <button
            className="flex justify-center items-center border w-[50px] h-[30px] border-[#85808025] rounded-lg"
            onClick={(e: React.MouseEvent) => {
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
                className="survey_card_buttons text-red-600"
                onClick={(e: React.MouseEvent) => {
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
          className="welcome_page_style "
          onClick={() => setOpenWelcomePage(true)}
        >
          <img src="/assets/icons/plus.svg" alt="plus" className="w-[20px]" />
          <p>{t("welcomePage")}</p>
        </div>
      )}
    </div>
  );
};

export default WelcomePart;
