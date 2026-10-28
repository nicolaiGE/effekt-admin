import actionCreatorFactory from "typescript-fsa";
import { IAnalysisOverview, ITilsagn, ITilsagnInput } from "../../models/types";

const actionCreator = actionCreatorFactory();

export interface IFetchAnalysisOverviewActionParams {
  token: string;
}
export const fetchAnalysisOverviewAction = actionCreator.async<
  IFetchAnalysisOverviewActionParams,
  IAnalysisOverview,
  Error
>("FETCH_ANALYSIS_OVERVIEW");

export interface IFetchTilsagnActionParams {
  token: string;
}
export const fetchTilsagnAction = actionCreator.async<
  IFetchTilsagnActionParams,
  Array<ITilsagn>,
  Error
>("FETCH_TILSAGN");

export interface ISaveTilsagnActionParams {
  token: string;
  /** Updates this tilsagn when set, adds a new one otherwise */
  id?: number;
  tilsagn: ITilsagnInput;
}
export const saveTilsagnAction = actionCreator.async<ISaveTilsagnActionParams, ITilsagn, Error>(
  "SAVE_TILSAGN",
);

export interface IDeleteTilsagnActionParams {
  token: string;
  id: number;
}
export const deleteTilsagnAction = actionCreator.async<IDeleteTilsagnActionParams, number, Error>(
  "DELETE_TILSAGN",
);
