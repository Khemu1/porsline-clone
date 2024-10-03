// Workspace.jsx
import React from "react";
import { WorkspaceProps } from "../../types";

const Workspace: React.FC<WorkspaceProps> = ({
  selected,
  workspace,
  onSelect,
}) => {
  return (
    <div
      className={`workspace flex  ${selected ? "workspace_selected" : ""}`}
      onClick={() => onSelect(workspace)}
    >
      <div className="flex items-center gap-2">
        <div>
          <img
            src="/assets/icons/folder.svg"
            alt="Folder icon"
            className="w-[20px]"
          />
        </div>
        <p className="font-semibold">{workspace.title}</p>
      </div>

      <div>
        <p>{workspace.surveys.length}</p>
      </div>
    </div>
  );
};

export default Workspace;
