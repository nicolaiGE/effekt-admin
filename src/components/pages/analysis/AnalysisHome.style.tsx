import styled from "styled-components";
import { grey02, grey05, grey30, grey70 } from "../../style/colors";

export const Ticker = styled.div`
  border-left: 4px solid black;
  padding: 24px 28px 28px;
  margin-bottom: 32px;
  max-width: 1100px;
`;

export const TickerLabel = styled.div`
  font-size: 13px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${grey30};
  margin-bottom: 10px;
`;

export const TickerNumber = styled.div`
  font-family: "ESKlarheitKurrent";
  font-size: clamp(48px, 8vw, 104px);
  line-height: 1;
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
  display: flex;
  align-items: baseline;
  gap: 0.18em;
  flex-wrap: wrap;

  span.kr {
    font-size: 0.3em;
    color: ${grey30};
  }
`;

export const TickerBreakdown = styled.div`
  margin-top: 14px;
  font-size: 16px;
  color: ${grey70};
  font-variant-numeric: tabular-nums;

  b {
    font-weight: 600;
  }
`;

export const Track = styled.div`
  position: relative;
  height: 14px;
  border-radius: 7px;
  background: ${grey05};
  overflow: hidden;
  margin: 22px 0 10px;
`;

export const TrackMeasured = styled.i`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  background: black;
  transition: width 1.6s cubic-bezier(0.22, 0.9, 0.28, 1);
`;

/** Pledges: same color as measured, hatched, so it reads as promised but not received */
export const TrackPledged = styled.i`
  position: absolute;
  top: 0;
  bottom: 0;
  background: repeating-linear-gradient(-45deg, black 0 4px, ${grey02} 4px 8px);
  transition: left 1.6s cubic-bezier(0.22, 0.9, 0.28, 1),
    width 1.6s cubic-bezier(0.22, 0.9, 0.28, 1);
`;

export const TrackCaption = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
  font-size: 14px;
  color: ${grey30};
`;

export const TickerNote = styled.p`
  margin: 16px 0 0;
  font-size: 13px;
  color: ${grey30};
  max-width: 70ch;
`;

export const Cards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  max-width: 1100px;
`;

export const Card = styled.div`
  border-left: 4px solid black;
  padding: 16px 20px;
`;

export const CardNumber = styled.div`
  font-family: "ESKlarheitKurrent";
  font-size: 34px;
  font-variant-numeric: tabular-nums;
  margin: 6px 0 4px;
`;

export const CardSub = styled.div`
  font-size: 13px;
  color: ${grey30};
`;
