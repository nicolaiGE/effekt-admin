import actionCreatorFactory from "typescript-fsa";
import { IAnalysisOverview } from "../../models/types";

const actionCreator = actionCreatorFactory();

export interface IFetchAnalysisOverviewActionParams {
  token: string;
}
export const fetchAnalysisOverviewAction = actionCreator.async<
  IFetchAnalysisOverviewActionParams,
  IAnalysisOverview,
  Error
>("FETCH_ANALYSIS_OVERVIEW");
