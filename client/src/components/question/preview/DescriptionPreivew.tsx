const DescriptionPreivew: React.FC<{ description: string }> = ({
  description,
}) => {
  return (
    <div
      className="custom-preview" // Add your custom class here
      dangerouslySetInnerHTML={{ __html: description }}
    ></div>
  );
};

export default DescriptionPreivew;
