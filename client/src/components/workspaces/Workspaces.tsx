import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentWorkspace } from "../../store/slices/currentWorkspaceSlice";
import { RootState } from "../../store/store";
import Workspace from "./Workspace";
import { WorkSpaceModel } from "../../types";
import { setSurveys } from "../../store/slices/surveySlice";

const Workspaces = () => {
  const dispatch = useDispatch();
  const [allWorkspaces, setAllWorkspaces] = useState<WorkSpaceModel[]>([]);

  const workspaces = useSelector(
    (state: RootState) => state.workspace.workspaces
  );

  const currentWorkspace = useSelector(
    (state: RootState) => state.currentWorkspace.currentWorkspace
  );

  const [selectedWorkspace, setSelectedWorkspace] =
    useState<WorkSpaceModel | null>(currentWorkspace);

  // Update allWorkspaces whenever workspaces change
  useEffect(() => {
    setAllWorkspaces(workspaces);

    // Automatically select the first workspace if none is selected
    if (workspaces.length > 0 && !selectedWorkspace) {
      const initialWorkspace = workspaces[0];
      setSelectedWorkspace(initialWorkspace);
      dispatch(setCurrentWorkspace(initialWorkspace));
      dispatch(setSurveys(initialWorkspace?.surveys || []));
    }
  }, [workspaces, dispatch, selectedWorkspace]);

  const handleWorkspaceSelect = (workspace: WorkSpaceModel) => {
    setSelectedWorkspace(workspace);
    dispatch(setCurrentWorkspace(workspace));
    dispatch(setSurveys(workspace.surveys || []));
  };

  return (
    <div className="flex flex-col w-full gap-2">
      {allWorkspaces.map((workspace) => (
        <Workspace
          key={workspace.id}
          selected={selectedWorkspace?.id === workspace.id}
          workspace={workspace}
          length={workspace.surveys.length}
          onSelect={handleWorkspaceSelect}
        />
      ))}
    </div>
  );
};

export default Workspaces;
