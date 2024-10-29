import { useEffect, useState } from "react";
import { RootState } from "../../store/store";
import { useSelector } from "react-redux";
import { useLanguage } from "../lang/LanguageProvider";
import { useAddGroupMember, useRemoveGroupMember } from "../../hooks/userGroup";

const UserGroup = () => {
  const { t, getCurrentLanguage, getCurrentLanguageTranslations } =
    useLanguage();
  const groupState = useSelector((state: RootState) => state.userGroup);
  const { handleRemoveMember, errorState: removeErrorState } =
    useRemoveGroupMember();
  const { handleAddMember, errorState, isSuccess } = useAddGroupMember();

  const [text, setText] = useState("");

  const addMember = async () => {
    if (!text.trim()) return;
    await handleAddMember({
      username: text,
      groupId: groupState.id,
      groupName: groupState.name,
      getCurrentLanguageTranslations,
      currentLang: getCurrentLanguage(),
    });
  };

  const removeMember = async (memberId: number) => {
    await handleRemoveMember({
      memberId,
      groupId: groupState.id,
      getCurrentLanguageTranslations,
      currentLang: getCurrentLanguage(),
    });
  };

  useEffect(() => {
    if (isSuccess) {
      setText("");
    }
  }, [isSuccess]);

  return (
    <div className="flex flex-col gap-3 p-6 bg-[#1e1e1e] text-white rounded-md shadow-md max-w-[600px]">
      <h3 className="text-2xl font-bold mb-2 text-[#e4e4e4]">
        {t("yourGroup")}
      </h3>

      <div className="flex flex-col items-center gap-1">
        <div className="flex items-center gap-5">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t("enterUserId")}
            className="w-[350px] px-4 py-2 bg-[#2b2b2b] text-[#d1d1d1] rounded-md border border-[#3d3d3d] focus:outline-none focus:border-[#4b6ef5] transition-all"
          />
          <button
            className="bg-[#4b6ef5] px-4 py-2 rounded-md text-sm font-semibold transition-all hover:bg-[#3d37a9]"
            onClick={addMember}
          >
            {t("add")}
          </button>
        </div>
        {errorState && errorState.message && (
          <span className="text font-semibold text-red-600 text-center">
            {errorState.message}
          </span>
        )}
      </div>

      <h4 className="font-semibold mt-4 mb-2 text-[#e4e4e4]">
        {t("members")}:
      </h4>
      {removeErrorState && removeErrorState.message && (
        <span className="text mx-auto font-semibold text-red-600 text-center">
          {removeErrorState.message}
        </span>
      )}
      <ul className="space-y-2 ">
        {groupState.members.map((member) => (
          <li
            key={member.userId}
            className="flex justify-between px-3 items-center p-2 bg-[#2b2b2b] rounded-md"
          >
            <span>{member.username}</span>
            <button
              onClick={() => removeMember(member.userId)}
              className="text-red-400 hover:text-red-500 transition-all"
            >
              {t("remove")}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserGroup;
