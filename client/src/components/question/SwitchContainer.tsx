import { Switch } from "@headlessui/react";
import React from "react";

export interface SwitchContainerProps {
  isRequired: boolean;
  setIsRequired: (isRequired: boolean) => void;
  label: string;
  errorMessage?: string;
}

const SwitchContainer: React.FC<SwitchContainerProps> = ({
  isRequired,
  setIsRequired,
  label,
  errorMessage,
}) => {
  return (
    <div className="flex justify-between main_text_bold flex-wrap p-4  border-b border-b-[#85808025]">
      <label>{label}</label>
      <Switch
        checked={isRequired}
        onChange={setIsRequired}
        className={`${
          isRequired ? "bg-blue-600" : "bg-gray-500"
        } relative inline-flex h-6 w-11 items-center rounded-full`}
      >
        <span
          className={`${
            isRequired ? "translate-x-6" : "translate-x-1"
          } inline-block h-4 w-4 transform rounded-full bg-white transition`}
        />
      </Switch>
      {errorMessage && (
        <p className="text-[#ff484f] font-semibold bg-[#4f000a] mt-2 py-1 px-2 rounded-md">
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export default SwitchContainer;
