// Workspaces.jsx
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentWorkspace } from "../../store/slices/currentWorkspaceSlice";
import { RootState } from "../../store/store";
import Workspace from "./Workspace";
import { WorkSpaceModel } from "../../types";
import { setSurveys } from "../../store/slices/surveySlice";

const Workspaces = () => {
  const dispatch = useDispatch();
  const workspaces = useSelector(
    (state: RootState) => state.workspace.workspaces
  );
  const [selectedWorkspace, setSelectedWorkspace] =
    useState<WorkSpaceModel | null>(null);

  useEffect(() => {
    if (workspaces && workspaces.length > 0) {
      setSelectedWorkspace(workspaces[0]);
      dispatch(setCurrentWorkspace(workspaces[0]));
      dispatch(setSurveys(workspaces[0]?.surveys || []));
    }
  }, [workspaces, dispatch]);

  const handleWorkspaceSelect = (workspace: WorkSpaceModel) => {
    setSelectedWorkspace(workspace);
    dispatch(setCurrentWorkspace(workspace));
    dispatch(setSurveys(workspace.surveys || []));
  };

  return (
    <div className="flex flex-col w-full gap-2">
      {workspaces?.map((workspace) => (
        <Workspace
          key={workspace.id}
          selected={selectedWorkspace?.id === workspace.id}
          workspace={workspace}
          onSelect={handleWorkspaceSelect}
        />
      ))}
    </div>
  );
};

export default Workspaces;
