import { useEffect, useState } from "react";
import { validateRegex } from "../../../../../utils";

const RegexPatternPreview: React.FC<{
  regxPattern: string;
  isRequired: boolean;
  placeholder?: string;
  errorMessage: string;
  savedResponse?: string;
  onResponseChange: (value: string) => void;
}> = ({
  regxPattern,
  isRequired,
  placeholder,
  errorMessage,
  savedResponse,
  onResponseChange,
}) => {
  const [text, setText] = useState<string>(savedResponse ?? "");
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (savedResponse !== text) {
      setText(savedResponse ?? "");
      setLocalError(null); 
    }
  }, [savedResponse, text]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setText(value); 
    onResponseChange(value);

    const validationResult = validateRegex(value, regxPattern);

    if (validationResult) {
      setLocalError(errorMessage);
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
        disabled={!regxPattern}
        placeholder={placeholder ?? ""}
        className={`bg-transparent input_border mt-4 p-2 rounded ${
          localError && errorMessage ? "input_error_border" : ""
        }`}
        value={text}
      />
      {localError && errorMessage && (
        <p className="text-[#ff484f] font-semibold bg-[#4f000a] w-full mt-2 py-1 px-2 rounded-md">
          {localError}
        </p>
      )}
    </div>
  );
};

export default RegexPatternPreview;
