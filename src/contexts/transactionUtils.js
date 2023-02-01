import { Blockfrost, Data, Lucid } from "lucid-cardano";

const setupLucid = async (wallet) => {
  const lucid = await Lucid.new(
    new Blockfrost(
      "https://cardano-preprod.blockfrost.io/api/v0",
      process.env.REACT_APP_BLOCKFROST_ID
    ),
    "Preview"
  );

  // Assumes you are in a browser environment
  lucid.selectWallet(wallet);

  return lucid;
};

const script = {
  type: "PlutusV2",
  script: "49480100002221200101",
};

const Datum = Data.Tuple([Data.String, Data.String, Data.BigInt]);
const Redeemer = () => Data.void();

export async function lockUtxo(
  wallet,
  target_address,
  mediator_policy,
  deadline,
  fundingAsset,
  fundingAmount
) {
  const lucid = await setupLucid(wallet);

  const scriptAddress = lucid.utils.validatorToAddress(script);
  const targetAddressDetails = lucid.utils.getAddressDetails(target_address);

  const tx = await lucid
    .newTx()
    .payToContract(
      scriptAddress,
      {
        inline: Data.to(
          [
            targetAddressDetails.paymentCredential.hash,
            mediator_policy,
            BigInt(deadline),
          ],
          Datum
        ),
      },
      { [fundingAsset]: BigInt(fundingAmount) }
    )
    .complete();

  const signedTx = await tx.sign().complete();

  const txHash = await signedTx.submit();

  return txHash;
}

export async function redeemUtxo() {
  const referenceScriptUtxo = (
    await lucid.utxosAt(alwaysSucceedAddress)
  ).find((utxo) => Boolean(utxo.scriptRef));
  if (!referenceScriptUtxo) throw new Error("Reference script not found");

  const utxo = (await lucid.utxosAt(alwaysSucceedAddress)).find(
    (utxo) => utxo.datum === Datum() && !utxo.scriptRef
  );
  if (!utxo) throw new Error("Spending script utxo not found");

  const tx = await lucid
    .newTx()
    .readFrom([referenceScriptUtxo]) // spending utxo by reading plutusV2 from reference utxo
    .collectFrom([utxo], Redeemer())
    .complete();

  const signedTx = await tx.sign().complete();

  const txHash = await signedTx.submit();

  return txHash;
}
