/* eslint-disable @typescript-eslint/no-explicit-any */
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import { useEffect, useState } from "react";
import { FileUploaderProps } from "../types";
import { servePath } from "../utils";

registerPlugin(FilePondPluginImagePreview);

const FileUploader: React.FC<FileUploaderProps> = ({
  file,
  filePath,
  setFile,
  initialImage,
}) => {
  const [filePondFiles, setFilePondFiles] = useState<any[]>([]);

  const fetchFileAsBlob = async (url: string): Promise<File> => {
    const servedUrl = servePath(url);
    const response = await fetch(servedUrl!);
    const blob = await response.blob();
    const filename = url.split("/").pop() || "file";
    return new File([blob], filename, { type: blob.type });
  };

  useEffect(() => {
    if (filePath && !file) {
      fetchFileAsBlob(filePath)
        .then((blobFile) => {
          setFilePondFiles([
            {
              source: blobFile,
              options: {
                type: "local",
              },
            },
          ]);
        })
        .catch((error) => {
          console.error("Error fetching file from URL:", error);
        });
    } else {
      setFilePondFiles([]);
    }
  }, [filePath, file, setFile]);

  return (
    <div className="flex flex-col gap-2">
      {initialImage && <div className="mb-2"></div>}
      <FilePond
        files={file ? [file] : filePondFiles}
        allowMultiple={false}
        onupdatefiles={(fileItems) => {
          setFile((fileItems[0]?.file as File) || null);
        }}
      />
    </div>
  );
};

export default FileUploader;
