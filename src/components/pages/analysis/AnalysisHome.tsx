import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth0 } from "@auth0/auth0-react";
import { Page } from "../../style/elements/page.style";
import { MainHeader } from "../../style/elements/headers.style";
import { AppState } from "../../../models/state";
import { fetchAnalysisOverviewAction } from "../../../store/analysis/analysis.actions";
import { thousandize } from "../../../util/formatting";
import {
  Card,
  CardNumber,
  CardSub,
  Cards,
  Ticker,
  TickerBreakdown,
  TickerLabel,
  TickerNote,
  TickerNumber,
  Track,
  TrackCaption,
  TrackMeasured,
  TrackPledged,
} from "./AnalysisHome.style";

const COUNT_UP_MS = 1600;

/** Counts from 0 to the target once, so the ticker reads as a live number */
const useCountUp = (target: number | undefined) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (target === undefined) return;
    let frame: number;
    let start: number | null = null;
    const step = (time: number) => {
      if (start === null) start = time;
      const progress = Math.min((time - start) / COUNT_UP_MS, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [target]);

  return value;
};

const percentOf = (part: number, whole: number) =>
  whole > 0 ? Math.min((100 * part) / whole, 100) : 0;

export const AnalysisHomePage: React.FC = () => {
  const dispatch = useDispatch();
  const { getAccessTokenSilently } = useAuth0();
  const overview = useSelector((state: AppState) => state.analysis.overview);

  useEffect(() => {
    getAccessTokenSilently().then((token) =>
      dispatch(fetchAnalysisOverviewAction.started({ token })),
    );
  }, [dispatch, getAccessTokenSilently]);

  const tickerValue = useCountUp(overview?.withPledges.sum);

  // Start the bar at zero and let it grow, like the number
  const [grown, setGrown] = useState(false);
  useEffect(() => {
    if (!overview) return;
    const timeout = setTimeout(() => setGrown(true), 80);
    return () => clearTimeout(timeout);
  }, [overview]);

  if (!overview) {
    return (
      <Page>
        <MainHeader>Analysis</MainHeader>
        <div>Loading...</div>
      </Page>
    );
  }

  const { thisYear, throughTime, pledges, withPledges } = overview;
  const measuredWidth = percentOf(throughTime.measured, withPledges.milestone);
  const pledgedWidth = Math.min(
    percentOf(pledges.open, withPledges.milestone),
    100 - measuredWidth,
  );
  const fromYear = throughTime.from ? throughTime.from.slice(0, 4) : null;

  return (
    <Page>
      <MainHeader>Analysis</MainHeader>

      <Ticker>
        <TickerLabel>
          Given to the recipients{fromYear ? ` since ${fromYear}` : ""}, including open tilsagn
        </TickerLabel>
        <TickerNumber>
          <span>{thousandize(tickerValue)}</span>
          <span className="kr">kr</span>
        </TickerNumber>
        <TickerBreakdown>
          <b>{thousandize(throughTime.measured)} kr</b> measured
          {pledges.open > 0 && (
            <>
              {" "}
              + <b>{thousandize(pledges.open)} kr</b> in {pledges.count} open tilsagn
            </>
          )}
        </TickerBreakdown>

        <Track>
          <TrackMeasured style={{ width: grown ? `${measuredWidth}%` : 0 }} />
          {pledges.open > 0 && (
            <TrackPledged
              style={{
                left: grown ? `${measuredWidth}%` : 0,
                width: grown ? `${pledgedWidth}%` : 0,
              }}
            />
          )}
        </Track>
        <TrackCaption>
          <span>
            {withPledges.passed
              ? `${thousandize(withPledges.milestone / 1_000_000)} mill. passed, with tilsagn`
              : `${thousandize(withPledges.remaining)} kr left to ${thousandize(
                  withPledges.milestone / 1_000_000,
                )} mill., with tilsagn`}
          </span>
          <span>{thousandize(withPledges.milestone)} kr</span>
        </TrackCaption>

        <TickerNote>
          Tilsagn are decided gifts that are not received yet. They are shown on top of the measured
          number, hatched in the bar, and are never counted as measured. Support for our own
          operations is not included.
        </TickerNote>
      </Ticker>

      <Cards>
        <Card>
          <CardSub>Collected in {thisYear.year}</CardSub>
          <CardNumber>{thousandize(thisYear.sum)} kr</CardNumber>
          <CardSub>All confirmed donations so far this year</CardSub>
        </Card>
        <Card>
          <CardSub>Through time, measured</CardSub>
          <CardNumber>{thousandize(throughTime.measured)} kr</CardNumber>
          <CardSub>
            {thousandize(throughTime.donations)} donations
            {throughTime.from ? ` since ${throughTime.from.split("-").reverse().join(".")}` : ""}
          </CardSub>
        </Card>
        <Card>
          <CardSub>Open tilsagn</CardSub>
          <CardNumber>{thousandize(pledges.open)} kr</CardNumber>
          <CardSub>{pledges.count} tilsagn decided, not received</CardSub>
        </Card>
      </Cards>
    </Page>
  );
};
