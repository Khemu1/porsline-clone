import { useEffect } from "react";
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
  const currentWorkspace = useSelector(
    (state: RootState) => state.currentWorkspace.currentWorkspace
  );

  useEffect(() => {
    if (workspaces.length > 0 && !currentWorkspace) {
      const initialWorkspace = workspaces[0];
      dispatch(setCurrentWorkspace(initialWorkspace));
      dispatch(setSurveys(initialWorkspace.surveys || []));
    }
  }, [workspaces, currentWorkspace, dispatch]);

  const handleWorkspaceSelect = (workspace: WorkSpaceModel) => {
    dispatch(setCurrentWorkspace(workspace));
    dispatch(setSurveys(workspace.surveys || []));
  };

  return (
    <div className="flex flex-col w-full gap-2">
      {workspaces.map((workspace) => (
        <Workspace
          key={workspace.id}
          selected={currentWorkspace?.id === workspace.id}
          workspace={workspace}
          length={workspace.surveys.length}
          onSelect={handleWorkspaceSelect}
        />
      ))}
    </div>
  );
};

export default Workspaces;
