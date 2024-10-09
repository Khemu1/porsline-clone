const LabelPreivew: React.FC<{ label: string }> = ({ label }) => {
  return (
    <div
      className="custom-preview" // Add your custom class here
      dangerouslySetInnerHTML={{ __html: label }}
    ></div>
  );
};

export default LabelPreivew;
