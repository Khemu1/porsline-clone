import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import { FileUploaderProps } from "../types";
// Register plugins
registerPlugin(FilePondPluginImagePreview);

const FileUploader: React.FC<FileUploaderProps> = ({
  file,
  setFile,
  initialImage,
}) => {
  return (
    <div className="flex flex-col gap-2">
      {initialImage && <div className="mb-2"></div>}
      <FilePond
        files={file ? [file] : []}
        allowMultiple={false}
        onupdatefiles={(fileItems) => {
          setFile((fileItems[0]?.file as File) || null);
        }}
      />
    </div>
  );
};

export default FileUploader;
