import { Editor as TinyMCEEditor } from "@tinymce/tinymce-react";
import React from "react";
import { useDispatch } from "react-redux";
import { setDescription, setLabel } from "../../store/slices/sharedFormSlice";

export type EditorInstance = {
  setContent: (content: string) => void;
  getContent: () => string;
};

export interface EditorComponentProps {
  editorRef: React.MutableRefObject<EditorInstance | null>;
  id: string;
  value?: string;
}

const EditorComponent: React.FC<EditorComponentProps> = ({
  editorRef,
  id,
  value = "<p>This is the initial content of the editor.</p>",
}) => {
  const dispatch = useDispatch();

  const handleEditorChange = (content: string) => {
    if (id.toLowerCase().includes("description-")) {
      dispatch(setDescription(content));
    }
    if (id.toLowerCase().includes("label-")) {
      dispatch(setLabel(content));
    }
  };

  return (
    <div className="flex flex-col gap-5 mt-3">
      <TinyMCEEditor
        id={id}
        apiKey={import.meta.env.VITE_EDITOR_KEY} // Use Vite's env variables
        onInit={(_, editor) => {
          editorRef.current = editor as EditorInstance;
          editor.setContent(value); // Set initial content when the editor is initialized
        }}
        value={value} // Use value prop instead of initialValue
        init={{
          height: 500,
          menubar: false,
          skin: "oxide-dark",
          content_css: "dark",
          plugins: [
            "advlist",
            "autolink",
            "lists",
            "link",
            "image",
            "charmap",
            "preview",
            "anchor",
            "searchreplace",
            "visualblocks",
            "code",
            "fullscreen",
            "insertdatetime",
            "media",
            "table",
            "help",
            "wordcount",
          ],
          toolbar:
            "undo redo | blocks | " +
            "bold italic forecolor | alignleft aligncenter " +
            "alignright alignjustify | bullist numlist outdent indent | " +
            "removeformat | help",
        }}
        onEditorChange={handleEditorChange} // Attach the change handler
      />
    </div>
  );
};

export default EditorComponent;
