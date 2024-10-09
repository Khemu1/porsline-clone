import React, { useState } from "react";
import { useLanguage } from "../../lang/LanguageProvider";
import { validateMinMaxPreview } from "../../../utils";

const MaxMinPreview: React.FC<{
  max: number;
  min: number;
  isRequired: boolean;
}> = ({ max, min, isRequired }) => {
  const { t } = useLanguage();
  const [localError, setLocalError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    const validationResult = validateMinMaxPreview(min, max, value, t);

    if (validationResult?.minMax) {
      setLocalError(validationResult?.minMax);
    } else {
      setLocalError(null);
    }
  };

  return (
    <div className="flex flex-col w-[300px]">
      <input
        type="text"
        onChange={handleChange}
        required={isRequired}
        disabled={max < min}
        className={`bg-transparent input_border mt-4 p-2 rounded ${
          localError ? "input_error_border" : ""
        }`}
        maxLength={max}
        minLength={min}
      />
      {localError && (
        <p className="text-[#ff484f] font-semibold bg-[#4f000a] max-w-[350px] mt-2 py-1 px-2 rounded-md">
          {localError}
        </p>
      )}
    </div>
  );
};

export default MaxMinPreview;
