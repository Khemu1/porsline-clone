const LabelPreivew: React.FC<{ label: string; preview?: boolean }> = ({
  label,
  preview,
}) => {
  return (
    <div
      className={`custom-preview  ${preview ? "text-2xl" : ""}`} // Add your custom class here
      dangerouslySetInnerHTML={{ __html: label }}
    ></div>
  );
};

export default LabelPreivew;
