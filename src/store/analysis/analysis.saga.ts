import { call, put } from "redux-saga/effects";
import { Action } from "typescript-fsa";
import * as API from "../../util/api";
import {
  deleteTilsagnAction,
  fetchAnalysisOverviewAction,
  fetchTilsagnAction,
  IDeleteTilsagnActionParams,
  IFetchAnalysisOverviewActionParams,
  IFetchTilsagnActionParams,
  ISaveTilsagnActionParams,
  saveTilsagnAction,
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

export function* fetchTilsagn(action: Action<IFetchTilsagnActionParams>) {
  try {
    const result: API.Response = yield call(API.call, {
      endpoint: "/analysis/pledges",
      method: API.Method.GET,
      token: action.payload.token,
    });
    if (result.status !== 200) throw new Error(result.content);
    yield put(fetchTilsagnAction.done({ params: action.payload, result: result.content }));
  } catch (ex) {
    yield put(fetchTilsagnAction.failed({ params: action.payload, error: ex as Error }));
  }
}

// After a change, reload the list and the overview, so the totals with tilsagn follow
function* reloadTilsagnAndOverview(token: string) {
  yield put(fetchTilsagnAction.started({ token }));
  yield put(fetchAnalysisOverviewAction.started({ token }));
}

export function* saveTilsagn(action: Action<ISaveTilsagnActionParams>) {
  try {
    const { id, tilsagn, token } = action.payload;
    const result: API.Response = yield call(API.call, {
      endpoint: id === undefined ? "/analysis/pledges" : `/analysis/pledges/${id}`,
      method: id === undefined ? API.Method.POST : API.Method.PUT,
      token,
      data: tilsagn,
    });
    if (result.status !== 200) throw new Error(result.content);
    yield put(saveTilsagnAction.done({ params: action.payload, result: result.content }));
    yield* reloadTilsagnAndOverview(token);
  } catch (ex) {
    yield put(saveTilsagnAction.failed({ params: action.payload, error: ex as Error }));
  }
}

export function* deleteTilsagn(action: Action<IDeleteTilsagnActionParams>) {
  try {
    const result: API.Response = yield call(API.call, {
      endpoint: `/analysis/pledges/${action.payload.id}`,
      method: API.Method.DELETE,
      token: action.payload.token,
    });
    if (result.status !== 200) throw new Error(result.content);
    yield put(deleteTilsagnAction.done({ params: action.payload, result: action.payload.id }));
    yield* reloadTilsagnAndOverview(action.payload.token);
  } catch (ex) {
    yield put(deleteTilsagnAction.failed({ params: action.payload, error: ex as Error }));
  }
}
