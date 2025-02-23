import { Blockfrost, Data, Lucid } from "lucid-cardano";

const setupLucid = async (wallet) => {
  const lucid = await Lucid.new(
    new Blockfrost(
      "https://cardano-preprod.blockfrost.io/api/v0",
      process.env.REACT_APP_BLOCKFROST_ID
    ),
    "Preprod"
  );

  // Assumes you are in a browser environment
  lucid.selectWallet(wallet);

  return lucid;
};

const script = {
  type: "PlutusV2",
  script: "5902a45902a10100003232323232323232323232323232323232323232323232323232323232323232323232323232323232323232222533357346660080060040022930b11119191992999ab9a3370e0029000091981909981280218050038998111810180f0021804003891919192999ab9a530203301f001300c00a15335738603c603a9201294d65646961746f722056616c756520646f6573206e6f7420636f6e7461696e20706f6c6963792069640014a02a666ae694c080cc0a001c00854cd5ce180f180ea4811d547820776173206e6f74207369676e6564206279206d65646961746f720014a02a666ae68cc094c06cc08401cc02c02854cd5ce180f180ea491b446561646c696e6520686173206e6f7420706173736564207965740014a02a2944c064c060008c8cc94ccd5cd19b870014800048c064004494cd5ce180f980f2490474657374001635573a6ea8004004c054c050c05c004c048c044010d55ce9baa001001003300c0010050030012357426eb00048d5d0980200091aba13002001235744600400246ae88dd600080880411aba1375800201c01a018006004460146014600400246ae84c05c0048dd49b98001237326eb800488c8c8cc004004008894ccd5cd1aba300114a02a666ae68cdd79aab9d3574200200829444cc008008d5d10009bab0022130080010012357426016002460046004600400246ae84c0400040048c88c010cdc40011bad001375a0024666ae6800528251223300e37586006004466ebc0040080048d5d0980100091aba23002001235744600400246ae88c0080048d5d1180100091aba23002001235744600400246ae88c0080048d5d1180100091aab9e37540024464666002002006004444a666ae68d5d18010a5015333573460026ae8400852889998018019aba20020012253335734a0042a0022941",
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
