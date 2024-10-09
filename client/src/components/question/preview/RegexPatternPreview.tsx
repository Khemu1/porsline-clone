import { useState } from "react";
import { validateRegex } from "../../../utils";

const RegexPatternPreview: React.FC<{
  regxPattern: string;
  isRequired: boolean;
  placeholder?: string;
  errorMessage: string;
}> = ({ regxPattern, isRequired, placeholder, errorMessage }) => {
  const [localError, setLocalError] = useState<string | null>(null);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

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
