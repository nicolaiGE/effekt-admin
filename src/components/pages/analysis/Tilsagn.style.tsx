import styled from "styled-components";
import { grey05, grey30 } from "../../style/colors";

export const Intro = styled.p`
  max-width: 75ch;
  color: ${grey30};
  margin: 0 0 24px;
`;

export const Form = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 16px;
  margin-bottom: 32px;

  label {
    display: flex;
    flex-direction: column;
    gap: 6px;
    font-size: 13px;
    color: ${grey30};
  }
`;

export const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
`;

export const Table = styled.table`
  border-collapse: collapse;
  width: 100%;
  max-width: 1100px;
  font-variant-numeric: tabular-nums;

  th,
  td {
    text-align: left;
    padding: 10px 12px;
    border-bottom: 1px solid ${grey05};
    vertical-align: middle;
  }

  th {
    font-weight: 400;
    font-size: 13px;
    color: ${grey30};
  }

  .sum {
    text-align: right;
  }

  tr.received td {
    color: ${grey30};
  }
`;
