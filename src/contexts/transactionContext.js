import { C } from "lucid-cardano";
import { createContext, useContext, useEffect, useState } from "react";
import { Buffer } from "buffer";

export const TransactionContext_ = createContext({});

export const TransactionContextProvider = ({ children }) => {
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
      value={{ assembleTransaction }}
    >
      {children}
    </TransactionContext_.Provider>
  );
};

export const useTransaction = () => {
    return useContext(TransactionContext_);
};