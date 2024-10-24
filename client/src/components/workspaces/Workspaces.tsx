import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentWorkspace } from "../../store/slices/currentWorkspaceSlice";
import { RootState } from "../../store/store";
import Workspace from "./Workspace";
import { WorkSpaceModel } from "../../types";
import { setSurveys } from "../../store/slices/surveySlice";
import { useSocket } from "../socket/userSocket";
import {
  addNewWorkspaceF,
  deleteWorkspaceF,
  updateWorkspaceF,
} from "../../utils";

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
      if (initialWorkspace.surveys && initialWorkspace.surveys.length > 0) {
        dispatch(setSurveys(initialWorkspace.surveys));
      } else {
        dispatch(setSurveys([]));
      }
    }
  }, [workspaces, currentWorkspace, dispatch]);

  const handleWorkspaceSelect = (workspace: WorkSpaceModel) => {
    dispatch(setCurrentWorkspace(workspace));
    dispatch(setSurveys(workspace.surveys || []));
  };

  const socket = useSocket();
  useEffect(() => {
    const handleNewWorkspace = async (data: { workspace: WorkSpaceModel }) => {
      console.log("arrived to add", data);

      try {
        await addNewWorkspaceF(data.workspace, dispatch);
      } catch (error) {
        console.error(error);
      }
    };

    const handleEditWorkspace = async (data: {
      workspace: WorkSpaceModel;
      workspaceId: number;
    }) => {
      try {
        console.log("incming edit", data);
        await updateWorkspaceF(+data.workspaceId, data.workspace, dispatch);
      } catch (error) {
        console.error(error);
      }
    };

    const handleDeleteWorkspace = async (data: { workspaceId: number }) => {
      try {
        console.log("arrived to delete", data);
        await deleteWorkspaceF(
          +data.workspaceId,
          +currentWorkspace!.id,
          workspaces,
          dispatch
        );
      } catch (error) {
        console.error(error);
      }
    };

    socket.on("WORKSPACE_ADDED", handleNewWorkspace);
    socket.on("WORKSPACE_EDITED", handleEditWorkspace);
    socket.on("WORKSPACE_DELETED", handleDeleteWorkspace);

    return () => {
      socket.off("WORKSPACE_ADDED", handleNewWorkspace);
      socket.off("WORKSPACE_EDITED", handleEditWorkspace);
      socket.off("WORKSPACE_DELETED", handleDeleteWorkspace);
    };
  }, [socket, workspaces, currentWorkspace, dispatch]);

  return (
    <div className="flex flex-col w-full gap-2">
      {workspaces.map((workspace) => (
        <Workspace
          key={
            workspace.id * Math.random() * Date.now() * Math.ceil(Math.random())
          }
          selected={currentWorkspace?.id === workspace.id}
          workspace={workspace}
          length={workspace.surveys?.length || 0}
          onSelect={handleWorkspaceSelect}
        />
      ))}
    </div>
  );
};

export default Workspaces;
