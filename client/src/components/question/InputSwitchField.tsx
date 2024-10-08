import React from "react";
import { Switch } from "@headlessui/react";
import { InputSwitchFieldProps } from "../../types";

const InputSwitchField: React.FC<InputSwitchFieldProps> = ({
  label,
  value,
  onChange,
  switchChecked,
  onSwitchChange,
  placeholder,
  isSubmitting,
  required,
  hasSwitch,
  errorMessage,
  type,
  border,
}) => {
  return (
    <div
      className={`w-full p-4  ${
        border ? " border-b border-b-[#85808025]" : ""
      } main_text`}
    >
      <div className="flex items-center justify-between">
        <label
          className={`${
            label.toLowerCase() !== "Pattern(RegEx validation)".toLowerCase() ||
            label.toLowerCase() !== "Example".toLowerCase() ||
            label.toLowerCase() !==
              "Message to display when answer does not pass RegEx".toLowerCase()
              ? "main_text"
              : "main_text_bold"
          }`}
        >
          {label}
        </label>
        {hasSwitch && (
          <Switch
            checked={switchChecked}
            onChange={onSwitchChange}
            className={`${
              switchChecked ? "bg-blue-600" : "bg-gray-500"
            } relative inline-flex h-6 w-11 items-center rounded-full`}
          >
            <span
              className={`${
                switchChecked ? "translate-x-6" : "translate-x-1"
              } inline-block h-4 w-4 transform rounded-full bg-white transition`}
            />
          </Switch>
        )}
      </div>
      {switchChecked && (
        <>
          {type === "text" && (
            <input
              type="text"
              value={value}
              onChange={onChange}
              className={`w-full bg-[#2a2a2a] text-white p-2 rounded-sm mt-2 ${
                errorMessage ? "input_error_border" : "input_border"
              }`}
              placeholder={placeholder}
              disabled={isSubmitting}
              required={required}
            />
          )}
          {type === "textarea" && (
            <textarea
              value={value}
              onChange={onChange}
              className={`w-full bg-[#2a2a2a] text-white p-2 rounded-sm mt-2 ${
                errorMessage ? "input_error_border" : "input_border"
              }`}
              placeholder={placeholder}
              disabled={isSubmitting}
              required={required}
              rows={5} // Add a default rows size for textarea
            />
          )}
          {type === "number" && (
            <input
              type="number"
              value={value}
              onChange={onChange}
              className={`bg-[#2a2a2a] text-white p-2 rounded-sm mt-2 w-[100px] ${
                errorMessage ? "input_error_border" : "input_border"
              }`}
              placeholder={placeholder}
              disabled={isSubmitting}
              required={required}
            />
          )}
          {errorMessage && (
            <p className="text-[#ff484f] font-semibold bg-[#4f000a] mt-2 py-1 px-2 rounded-md">
              {errorMessage}
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default InputSwitchField;
