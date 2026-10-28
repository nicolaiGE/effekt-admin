import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router-dom";
import { DateTime } from "luxon";
import { Page } from "../../style/elements/page.style";
import { MainHeader, SubHeader } from "../../style/elements/headers.style";
import { EffektButton, EffektSecondaryButton } from "../../style/elements/button.style";
import { EffektInput } from "../../style/elements/input.style";
import { EffektDatePicker } from "../../style/elements/datepicker/datepicker.style";
import { AppState } from "../../../models/state";
import { ITilsagn, ITilsagnInput } from "../../../models/types";
import {
  deleteTilsagnAction,
  fetchTilsagnAction,
  saveTilsagnAction,
} from "../../../store/analysis/analysis.actions";
import { thousandize } from "../../../util/formatting";
import { Actions, Form, Intro, Table } from "./Tilsagn.style";

/** Reads "1 350 000" or "1350000,50". Undefined unless a positive amount with at most two decimals */
const parseSum = (text: string): number | undefined => {
  const cleaned = text.replace(/\s/g, "").replace(",", ".");
  if (!/^\d+(\.\d{1,2})?$/.test(cleaned)) return undefined;
  const sum = parseFloat(cleaned);
  return sum > 0 ? sum : undefined;
};

const toDateString = (date: Date) => DateTime.fromJSDate(date).toISODate() as string;
const showDate = (date: string) => date.split("-").reverse().join(".");

const inputOf = (tilsagn: ITilsagn): ITilsagnInput => ({
  sum: tilsagn.sum,
  decidedDate: tilsagn.decidedDate,
  receivedDate: tilsagn.receivedDate,
  donationId: tilsagn.donationId,
});

type Editing = { id: number; mode: "received" | "sum" } | null;

export const TilsagnPage: React.FC = () => {
  const dispatch = useDispatch();
  const { getAccessTokenSilently } = useAuth0();
  const tilsagn = useSelector((state: AppState) => state.analysis.tilsagn);

  const [newSum, setNewSum] = useState<string>("");
  const [newDecided, setNewDecided] = useState<Date>(new Date());

  const [editing, setEditing] = useState<Editing>(null);
  const [receivedDate, setReceivedDate] = useState<Date>(new Date());
  const [donationId, setDonationId] = useState<string>("");
  const [editSum, setEditSum] = useState<string>("");

  useEffect(() => {
    getAccessTokenSilently().then((token) => dispatch(fetchTilsagnAction.started({ token })));
  }, [dispatch, getAccessTokenSilently]);

  const save = (input: ITilsagnInput, id?: number) =>
    getAccessTokenSilently().then((token) =>
      dispatch(saveTilsagnAction.started({ token, id, tilsagn: input })),
    );

  const add = () => {
    const sum = parseSum(newSum);
    if (sum === undefined) return;
    save({ sum, decidedDate: toDateString(newDecided), receivedDate: null, donationId: null });
    setNewSum("");
  };

  const startEditing = (row: ITilsagn, mode: "received" | "sum") => {
    setEditing({ id: row.id, mode });
    setReceivedDate(new Date());
    setDonationId("");
    setEditSum(String(row.sum));
  };

  const markReceived = (row: ITilsagn) => {
    const id = donationId.trim() === "" ? null : parseInt(donationId.trim());
    if (id !== null && Number.isNaN(id)) return;
    save({ ...inputOf(row), receivedDate: toDateString(receivedDate), donationId: id }, row.id);
    setEditing(null);
  };

  const changeSum = (row: ITilsagn) => {
    const sum = parseSum(editSum);
    if (sum === undefined) return;
    save({ ...inputOf(row), sum }, row.id);
    setEditing(null);
  };

  const reopen = (row: ITilsagn) =>
    save({ ...inputOf(row), receivedDate: null, donationId: null }, row.id);

  const remove = (row: ITilsagn) => {
    if (
      window.confirm(
        `Delete the tilsagn of ${thousandize(row.sum)} kr decided ${showDate(row.decidedDate)}?`,
      )
    )
      getAccessTokenSilently().then((token) =>
        dispatch(deleteTilsagnAction.started({ token, id: row.id })),
      );
  };

  const open = (tilsagn || []).filter((row) => row.receivedDate === null);
  const openSum = open.reduce((total, row) => total + row.sum, 0);

  return (
    <Page>
      <MainHeader>Tilsagn</MainHeader>
      <Intro>
        A tilsagn is a decided gift that is not received yet. Open tilsagn are shown on top of the
        measured total in the analysis overview. Only the amount and the date it was decided are
        stored, never who gave it. When the money comes in, register the donation as usual, then
        mark the tilsagn as received so it is not counted twice. If only part has come in, change
        the sum to what remains.
      </Intro>

      <SubHeader>Add tilsagn</SubHeader>
      <Form>
        <label>
          Sum (kr)
          <EffektInput
            value={newSum}
            inputMode="decimal"
            placeholder="1 350 000"
            onChange={(e) => setNewSum(e.target.value)}
          />
        </label>
        <label>
          Decided
          <EffektDatePicker
            selected={newDecided}
            onChange={(date) => date && setNewDecided(date as Date)}
            dateFormat="dd.MM.yyyy"
          />
        </label>
        <EffektButton onClick={add} disabled={parseSum(newSum) === undefined}>
          Add
        </EffektButton>
      </Form>

      <SubHeader>
        {open.length} open, {thousandize(openSum)} kr
      </SubHeader>
      {!tilsagn ? (
        <div>Loading...</div>
      ) : (
        <Table>
          <thead>
            <tr>
              <th>Decided</th>
              <th className="sum">Sum</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {tilsagn.map((row) => (
              <tr key={row.id} className={row.receivedDate ? "received" : undefined}>
                <td>{showDate(row.decidedDate)}</td>
                <td className="sum">
                  {editing?.id === row.id && editing.mode === "sum" ? (
                    <EffektInput
                      value={editSum}
                      inputMode="decimal"
                      onChange={(e) => setEditSum(e.target.value)}
                    />
                  ) : (
                    `${thousandize(row.sum)} kr`
                  )}
                </td>
                <td>
                  {row.receivedDate ? (
                    <>
                      Received {showDate(row.receivedDate)}
                      {row.donationId !== null && (
                        <>
                          {" "}
                          ·{" "}
                          <Link to={`/donations/${row.donationId}`}>donation {row.donationId}</Link>
                        </>
                      )}
                    </>
                  ) : editing?.id === row.id && editing.mode === "received" ? (
                    <Actions>
                      <EffektDatePicker
                        selected={receivedDate}
                        onChange={(date) => date && setReceivedDate(date as Date)}
                        dateFormat="dd.MM.yyyy"
                      />
                      <EffektInput
                        value={donationId}
                        placeholder="Donation ID (optional)"
                        onChange={(e) => setDonationId(e.target.value)}
                      />
                    </Actions>
                  ) : (
                    "Open"
                  )}
                </td>
                <td>
                  <Actions>
                    {editing?.id === row.id ? (
                      <>
                        <EffektButton
                          onClick={() =>
                            editing.mode === "received" ? markReceived(row) : changeSum(row)
                          }
                        >
                          Save
                        </EffektButton>
                        <EffektSecondaryButton onClick={() => setEditing(null)}>
                          Cancel
                        </EffektSecondaryButton>
                      </>
                    ) : row.receivedDate ? (
                      <EffektSecondaryButton onClick={() => reopen(row)}>
                        Reopen
                      </EffektSecondaryButton>
                    ) : (
                      <>
                        <EffektButton onClick={() => startEditing(row, "received")}>
                          Mark as received
                        </EffektButton>
                        <EffektSecondaryButton onClick={() => startEditing(row, "sum")}>
                          Change sum
                        </EffektSecondaryButton>
                        <EffektSecondaryButton onClick={() => remove(row)}>
                          Delete
                        </EffektSecondaryButton>
                      </>
                    )}
                  </Actions>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Page>
  );
};
