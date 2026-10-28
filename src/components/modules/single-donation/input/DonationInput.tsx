import React, { useState, useEffect } from "react";

import { EffektDatePicker } from "../../../style/elements/datepicker/datepicker.style";

import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";

import { IPaymentMethod, IDonation, IDataOwner } from "../../../../models/types";
import { AppState } from "../../../../models/state";
import { fetchOwnersAction } from "../../../../store/owners/owners.actions";
import { KIDTextWrapper, DonationInputElement } from "../SingleDonation.style";
import { amountToInput, isValidAmountInput, parseAmountInput } from "../../../../util/formatting";

interface IProps {
  onChange(input: Partial<IDonation>): void;
  paymentMethods: Array<IPaymentMethod>;
  suggestedValues?: Partial<IDonation>;
  /** When given, the KID is picked from these options instead of typed. The first is preselected. */
  kidOptions?: Array<{ value: string; label: string }>;
}

interface IState extends Partial<IDonation> {}

export const DonationInput: React.FunctionComponent<IProps> = ({
  paymentMethods,
  onChange,
  suggestedValues,
  kidOptions,
}) => {
  const dispatch = useDispatch();
  const dataOwners = useSelector((state: AppState) => state.dataOwner.owners);
  const currentOwner = useSelector((state: AppState) => state.dataOwner.current);

  const [state, setState] = useState<IState>({
    ...suggestedValues,
    KID: kidOptions && kidOptions.length > 0 ? kidOptions[0].value : undefined,
    paymentId: (suggestedValues && suggestedValues.paymentId) || 4, //Defaults to vipps
    timestamp: (suggestedValues && suggestedValues.timestamp) || new Date(), //Defaults to now
    metaOwnerId: suggestedValues?.metaOwnerId ?? currentOwner?.id, //Defaults to the owner selected in the menu
  });

  useEffect(() => {
    if (!dataOwners) dispatch(fetchOwnersAction.started(undefined));
  }, [dataOwners, dispatch]);

  // The selected owner may load after the form is shown
  useEffect(() => {
    if (currentOwner)
      setState((state) =>
        state.metaOwnerId === undefined ? { ...state, metaOwnerId: currentOwner.id } : state,
      );
  }, [currentOwner]);

  // The sum is kept as typed, so decimals like "100," survive until the next digit is typed
  const [sumText, setSumText] = useState<string>(amountToInput(suggestedValues?.sum));

  useEffect(() => {
    setState((state) => {
      return { ...state, ...suggestedValues };
    });
    if (suggestedValues?.sum !== undefined) setSumText(amountToInput(suggestedValues.sum));
  }, [suggestedValues]);

  useEffect(() => onChange(state), [state, onChange]);

  const methodToOption = (method: IPaymentMethod) => {
    return { value: method.id, label: method.name };
  };

  const getCurrentPaymentMethod = (): IPaymentMethod | undefined => {
    return paymentMethods.find((method) => method.id === state.paymentId);
  };

  const getMethodsSelect = (paymentMethods: Array<IPaymentMethod>) => {
    let current = getCurrentPaymentMethod();
    if (current) {
      return (
        <div style={{ width: "180px" }}>
          <Select
            options={paymentMethods.map((method) => methodToOption(method))}
            value={methodToOption(current)}
            onChange={(selected: any) => setState({ ...state, paymentId: selected.value })}
          ></Select>
        </div>
      );
    }
  };

  let methodsSelect = paymentMethods && getMethodsSelect(paymentMethods);

  const ownerToOption = (owner: IDataOwner) => ({ value: owner.id, label: owner.name });
  const currentDataOwner = dataOwners?.find((owner) => owner.id === state.metaOwnerId);

  return (
    <React.Fragment>
      <EffektDatePicker
        selected={state.timestamp}
        onChange={(timestamp) => timestamp && setState({ ...state, timestamp })}
        showTimeSelect
        timeFormat="HH:mm"
        timeIntervals={15}
        dateFormat="dd.MM.yyyy HH:mm"
        timeCaption="time"
      />
      {kidOptions ? (
        <div style={{ width: "260px" }}>
          <Select
            options={kidOptions}
            value={kidOptions.find((option) => option.value === state.KID)}
            onChange={(selected: any) => setState({ ...state, KID: selected.value })}
          ></Select>
        </div>
      ) : (
        <KIDTextWrapper>
          <DonationInputElement
            placeholder="KID"
            value={state.KID || ""}
            style={{ height: "100%" }}
            onChange={(e) => setState({ ...state, KID: e.target.value })}
          />
        </KIDTextWrapper>
      )}

      <DonationInputElement
        value={sumText}
        placeholder="Sum"
        inputMode="decimal"
        onChange={(e) => {
          const text = e.target.value;
          if (!isValidAmountInput(text)) return;
          setSumText(text);
          setState({ ...state, sum: parseAmountInput(text) });
        }}
      />

      <DonationInputElement
        value={state.paymentExternalRef}
        placeholder="External ref."
        onChange={(e) => setState({ ...state, paymentExternalRef: e.target.value })}
      />
      {methodsSelect}
      {dataOwners && (
        <div style={{ width: "200px" }}>
          <Select
            options={dataOwners.map(ownerToOption)}
            value={currentDataOwner ? ownerToOption(currentDataOwner) : null}
            placeholder="Data owner"
            onChange={(selected: any) => setState({ ...state, metaOwnerId: selected.value })}
          ></Select>
        </div>
      )}
    </React.Fragment>
  );
};
