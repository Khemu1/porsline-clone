import React, { useEffect } from "react";

const EnterRedirectLink: React.FC<{
  label: string;
  value?: string;
  border?: boolean;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  bold?: boolean;
  errorMessage?: string;
}> = ({ label, onChange, border, bold, errorMessage, value }) => {
  const [text, setText] = React.useState("");
  useEffect(() => {
    setText(value ?? "");
  }, [value]);
  return (
    <div
      className={`pb-4 ${
        border ? "border-b border-[#42484b]" : ""
      } flex flex-col px-4 gap-2 main_text`}
    >
      <label className={`${bold ? "main_text_bold" : ""} `}>{label}</label>
      <textarea
        placeholder="https://"
        className="h-[100px] resize-none p-2 bg-transparent focus-visible:outline-none rounded-md border border-[#42484b] w-full hover:border-[#3b368e]"
        onChange={(e) => {
          onChange(e);
          setText(e.target.value);
        }}
        value={text}
      />
      {errorMessage && (
        <p className="text-[#ff484f] font-semibold bg-[#4f000a] mt-2 py-1 px-2 rounded-md">
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export default EnterRedirectLink;
