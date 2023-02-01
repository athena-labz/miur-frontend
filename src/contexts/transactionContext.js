import { C } from "lucid-cardano";
import { createContext, useContext, useEffect, useState } from "react";
import { Buffer } from "buffer";

import { lockUtxo } from "./transactionUtils";

export const TransactionContext_ = createContext({});

const fromHex = (hex) => Buffer.from(hex, "hex");
const toHex = (bytes) => Buffer.from(bytes).toString("hex");

export const TransactionContextProvider = ({ children }) => {
  const getValueCBOR = (lovelace, asset, amount) => {
    const policyId = asset.slice(0, 56);
    const assetName = asset.slice(56);
    const scriptHash = C.ScriptHash.from_bytes(fromHex(policyId));

    const multiAssets = C.MultiAsset.new();
    const assets = C.Assets.new();

    assets.insert(
      C.AssetName.new(fromHex(assetName)),
      C.BigNum.from_str(amount.toString())
    );
    multiAssets.insert(scriptHash, assets);

    const value = C.Value.new_from_assets(multiAssets);
    value.set_coin(C.BigNum.from_str(lovelace.toString()));

    console.log("value");
    console.log(value.to_json());

    return toHex(value.to_bytes());
  };

  const assembleTransaction = async (
    walletApi,
    txBodyCbor,
    txWitnessSetCbor
  ) => {
    // get tx body
    const txBody = C.TransactionBody.from_bytes(Buffer.from(txBodyCbor, "hex"));

    // get tx witness-set
    const witnessSet = C.TransactionWitnessSet.from_bytes(
      Buffer.from(txWitnessSetCbor, "hex")
    );

    // clear vkeys from witness-set
    witnessSet.vkeys()?.free();

    // re-assemble transaction
    const tx = C.Transaction.new(txBody, witnessSet);

    // encode tx
    const encodedTx = Buffer.from(tx.to_bytes()).toString("hex");

    // sign tx using wallet
    const encodedTxVkeyWitnesses = await walletApi.signTx(encodedTx, true);

    // decode witness-set produced by signature
    const txVkeyWitnesses = C.TransactionWitnessSet.from_bytes(
      Buffer.from(encodedTxVkeyWitnesses, "hex")
    );

    // set vkeys to our tx from decoded witness-set
    witnessSet.set_vkeys(txVkeyWitnesses.vkeys());

    // re-assemble signed transaction
    const txSigned = C.Transaction.new(tx.body(), witnessSet);

    // encode signed transaction
    const encodedSignedTx = Buffer.from(txSigned.to_bytes()).toString("hex");

    // submit the transaction
    const txHash = await walletApi.submitTx(encodedSignedTx);

    return txHash;
  };

  return (
    <TransactionContext_.Provider
      value={{ assembleTransaction, getValueCBOR, lockUtxo }}
    >
      {children}
    </TransactionContext_.Provider>
  );
};

export const useTransaction = () => {
  return useContext(TransactionContext_);
};
