import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth0 } from "@auth0/auth0-react";
import { toast } from "react-toastify";
import { AppState } from "../../../../models/state";
import { IDistributionSearchResultItem, IDonation, IPaymentMethod } from "../../../../models/types";
import {
  fetchPaymentMethodsAction,
  insertDonationAction,
} from "../../../../store/single-donation/single-donation.actions";
import { thousandize } from "../../../../util/formatting";
import { EffektButton } from "../../../style/elements/button.style";
import { DonationInput } from "../../single-donation/input/DonationInput";
import { DonationControls } from "../../single-donation/controls/DonationControls";
import { ControlsWrapper, InputWrapper } from "../../single-donation/SingleDonation.style";

// The API returns "KID", while the type says "kid"
const kidOf = (distribution: IDistributionSearchResultItem): string | undefined =>
  (distribution as { KID?: string }).KID ?? distribution.kid;

interface IProps {
  donorId: number;
  distributions?: Array<IDistributionSearchResultItem>;
}

/**
 * Registers a donation on one of the donor's existing KIDs, from the donor page.
 * New distributions are still made from the register page.
 */
export const RegisterDonorDonation: React.FunctionComponent<IProps> = ({
  donorId,
  distributions,
}) => {
  const dispatch = useDispatch();
  const { getAccessTokenSilently } = useAuth0();

  const [open, setOpen] = useState<boolean>(false);
  const [donationInput, setDonationInput] = useState<Partial<IDonation>>({});
  // Remounting the input clears it after a successful insert
  const [formKey, setFormKey] = useState<number>(0);
  const [pending, setPending] = useState<boolean>(false);

  const paymentMethods = useSelector<AppState, Array<IPaymentMethod>>(
    (state: AppState) => state.singleDonation.paymentMethods,
  );
  const donations = useSelector((state: AppState) => state.donorPage.donations);

  useEffect(() => {
    if (open && paymentMethods.length === 0) dispatch(fetchPaymentMethodsAction.started(undefined));
  }, [open, paymentMethods.length, dispatch]);

  // The donation list is reloaded after an insert, so a new list means the insert succeeded
  useEffect(() => {
    if (pending) {
      setPending(false);
      setFormKey((key) => key + 1);
    }
  }, [donations]);

  // Most used KID first, so the usual one is preselected
  const kidOptions = useMemo(
    () =>
      [...(distributions || [])]
        .filter((distribution) => kidOf(distribution))
        .sort((a, b) => (b.count || 0) - (a.count || 0))
        .map((distribution) => ({
          value: kidOf(distribution) as string,
          label: `${kidOf(distribution)} (${distribution.count || 0} donations, ${thousandize(
            distribution.sum || 0,
          )} kr)`,
        })),
    [distributions],
  );

  const onDonationInputChange = useCallback(
    (input: Partial<IDonation>) => setDonationInput(input),
    [setDonationInput],
  );

  const submit = (receipt: boolean) => {
    if (
      !donationInput.KID ||
      donationInput.sum === undefined ||
      donationInput.paymentId === undefined ||
      !donationInput.paymentExternalRef ||
      donationInput.timestamp === undefined
    )
      return toast.error("Missing fields");

    getAccessTokenSilently().then((token) => {
      setPending(true);
      dispatch(
        insertDonationAction.started({
          donation: { ...(donationInput as IDonation), receipt },
          token,
          refreshDonorId: donorId,
        }),
      );
    });
  };

  if (!open) {
    return (
      <EffektButton onClick={() => setOpen(true)} style={{ marginBottom: "14px" }}>
        + Add donation
      </EffektButton>
    );
  }

  if (!distributions) return <span>Loading distributions...</span>;

  if (kidOptions.length === 0) {
    return (
      <div style={{ marginBottom: "14px" }}>
        The donor has no distributions. Register the donation from the register page.{" "}
        <EffektButton onClick={() => setOpen(false)}>Close</EffektButton>
      </div>
    );
  }

  return (
    <div style={{ marginBottom: "24px", maxWidth: "900px" }}>
      <InputWrapper>
        <DonationInput
          key={formKey}
          paymentMethods={paymentMethods}
          kidOptions={kidOptions}
          onChange={onDonationInputChange}
        ></DonationInput>
      </InputWrapper>
      <ControlsWrapper>
        <DonationControls onInsert={submit} onIgnore={() => setOpen(false)}></DonationControls>
      </ControlsWrapper>
    </div>
  );
};
