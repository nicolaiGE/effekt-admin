import { AnyAction, isType } from "typescript-fsa";
import { toast } from "react-toastify";
import { AnalysisState } from "../../models/state";
import { toastError } from "../../util/toasthelper";
import {
  deleteTilsagnAction,
  fetchAnalysisOverviewAction,
  fetchTilsagnAction,
  saveTilsagnAction,
} from "./analysis.actions";

export const analysisReducer = (state: AnalysisState = {}, action: AnyAction): AnalysisState => {
  if (isType(action, fetchAnalysisOverviewAction.done)) {
    return { ...state, overview: action.payload.result };
  } else if (isType(action, fetchAnalysisOverviewAction.failed)) {
    toastError("Failed to get analysis overview", action.payload.error.message);
  }

  if (isType(action, fetchTilsagnAction.done)) {
    return { ...state, tilsagn: action.payload.result };
  } else if (isType(action, fetchTilsagnAction.failed)) {
    toastError("Failed to get tilsagn", action.payload.error.message);
  }

  if (isType(action, saveTilsagnAction.done)) {
    toast.success("Tilsagn saved");
  } else if (isType(action, saveTilsagnAction.failed)) {
    toastError("Could not save tilsagn", action.payload.error.message);
  }

  if (isType(action, deleteTilsagnAction.done)) {
    toast.success("Tilsagn deleted");
  } else if (isType(action, deleteTilsagnAction.failed)) {
    toastError("Could not delete tilsagn", action.payload.error.message);
  }

  return state;
};
