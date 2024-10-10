import React from "react";

const EnterRedirectLink: React.FC<{
  label: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}> = ({ label, onChange }) => {
  return (
    <div className="flex flex-col px-4 gap-2 main_text">
      <label htmlFor="">{label}</label>
      <textarea
        placeholder="https://"
        className="h-[100px] resize-none p-2"
        onChange={(e) => onChange(e)}
      />
    </div>
  );
};

export default EnterRedirectLink;
