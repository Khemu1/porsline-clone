import React from "react";
import { FileUploaderProps } from "../../types"; // Adjust the path according to your file structure
import { Switch } from "@headlessui/react";
import FileUploader from "../FileUploader";

interface ImageUploadFieldProps extends FileUploaderProps {
  label: string;
  switchChecked: boolean;
  onSwitchChange: (checked: boolean) => void;
  errorMessage?: string;
}

const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  file,
  setFile,
  filePath,
  title,
  label,
  switchChecked,
  onSwitchChange,
  errorMessage,
}) => {
  return (
    <div className="flex flex-col gap-3 p-4 border-b border-b-[#85808025] main_text">
      <div className="flex items-center justify-between">
        <label className="main_text_bold">{label}</label>
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
      </div>

      {switchChecked && (
        <div className="flex flex-col gap-3">
          <FileUploader file={file} filePath={filePath} setFile={setFile} title={title} />
          {errorMessage && (
            <p className="text-[#ff484f] font-semibold bg-[#4f000a] mt-2 py-1 px-2 rounded-md">
              {errorMessage}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUploadField;
