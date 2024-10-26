const DescriptionPreivew: React.FC<{
  description: string;
  preview?: boolean;
}> = ({ description, preview }) => {
  return (
    <div
      className={`custom-preview  ${preview ? "text-2xl" : ""}`} // Add your custom class here
      dangerouslySetInnerHTML={{ __html: description }}
    ></div>
  );
};

export default DescriptionPreivew;
