import { AnyAction, isType } from "typescript-fsa";
import { AnalysisState } from "../../models/state";
import { toastError } from "../../util/toasthelper";
import { fetchAnalysisOverviewAction } from "./analysis.actions";

export const analysisReducer = (state: AnalysisState = {}, action: AnyAction): AnalysisState => {
  if (isType(action, fetchAnalysisOverviewAction.done)) {
    return { ...state, overview: action.payload.result };
  } else if (isType(action, fetchAnalysisOverviewAction.failed)) {
    toastError("Failed to get analysis overview", action.payload.error.message);
  }

  return state;
};
