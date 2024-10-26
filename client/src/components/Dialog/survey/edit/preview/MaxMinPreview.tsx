import React, { useState, useEffect } from "react";
import { validateMinMaxPreview } from "../../../../../utils";
import { useLanguage } from "../../../../lang/LanguageProvider";

const MaxMinPreview: React.FC<{
  max: number;
  min: number;
  isRequired: boolean;
  savedResponse?: string;
  onResponseChange: (value: string) => void;
}> = ({ max, min, isRequired, savedResponse, onResponseChange }) => {
  const { t } = useLanguage();
  const [text, setText] = useState<string>(savedResponse ?? "");
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (savedResponse !== text) {
      setText(savedResponse ?? "");
      setLocalError(null);
    }
  }, [savedResponse]); 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setText(value);
    onResponseChange(value); 

    const validationResult = validateMinMaxPreview(min, max, value, t);

    if (validationResult?.minMax) {
      setLocalError(validationResult.minMax);
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
        value={text}
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
