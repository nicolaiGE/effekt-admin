import { call, put } from "redux-saga/effects";
import { Action } from "typescript-fsa";
import * as API from "../../util/api";
import {
  fetchAnalysisOverviewAction,
  IFetchAnalysisOverviewActionParams,
} from "./analysis.actions";

export function* fetchAnalysisOverview(action: Action<IFetchAnalysisOverviewActionParams>) {
  try {
    const result: API.Response = yield call(API.call, {
      endpoint: "/analysis/overview",
      method: API.Method.GET,
      token: action.payload.token,
    });
    if (result.status !== 200) throw new Error(result.content);
    yield put(fetchAnalysisOverviewAction.done({ params: action.payload, result: result.content }));
  } catch (ex) {
    yield put(fetchAnalysisOverviewAction.failed({ params: action.payload, error: ex as Error }));
  }
}
