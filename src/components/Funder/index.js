import * as React from "react";
import { useState, useEffect } from "react";

import { WalletSelector } from "components/WalletSelector";
import { Info } from "components/Info";

import { useWallet } from "../../contexts/walletContext";
import { useUser } from "../../contexts/userContext";
import { useTransaction } from "../../contexts/transactionContext";

import { Button } from "@chakra-ui/react";
 
export function Funder({
  axios,
  fundingAmount,
  projectId,
}) {
  const [openWalletSelector, setOpenWalletSelector] = useState(false);
  const [infoContent, setInfoContent] = useState(null);

  const { connect, curWallet, getWallets } = useWallet();
  const { user } = useUser();
  const { assembleTransaction } = useTransaction();

  const getFundTransactionCbor = async (api) => {
    const utxos = await api.getUtxos();

    const res = await axios.post("/transaction/projects/fund", {
      registered_address: user.address,
      funding_utxos: utxos,
      funding_amount: fundingAmount,
      project_id: projectId,
    });

    console.log("res", res);

    return {
      body: res.data.transaction_cbor,
      witness: res.data.witness_cbor,
    };
  };

  return (
    <>
      <Button
        bg={"blue.400"}
        color={"white"}
        w="full"
        _hover={{
          bg: "blue.500",
        }}
        onClick={async () => {
          if (curWallet === null) {
            setOpenWalletSelector(true);
          } else {
            const { body, witness } = await getFundTransactionCbor(curWallet);
            assembleTransaction(curWallet.api, body, witness);
          }
        }}
      >
        Fund Project
      </Button>
      <WalletSelector
        isOpen={openWalletSelector}
        onSelect={async (wallet) => {
          connect(wallet)
            .then(async (result) => {
              if (result.success === true) {
                console.log("Wallet connected!");

                const { body, witness } = await getFundTransactionCbor(
                  result.api
                );
                assembleTransaction(result.api, body, witness);
              } else {
                console.error("Wallet failed while trying to connect!");
                console.error(result.error);

                setInfoContent({
                  header: "Wallet Error",
                  body: "Wallet failed while trying to connect!",
                });
              }

              setOpenWalletSelector(false);
            })
            .catch((err) => {
              console.error(err);
              console.error("Wallet refused to connect!");

              setOpenWalletSelector(false);

              setInfoContent({
                header: "Wallet Error",
                body: "Wallet refused to connect!",
              });
            });
        }}
        onClose={() => setOpenWalletSelector(false)}
      />
      <Info
        isOpen={infoContent !== null}
        onClose={() => setInfoContent(null)}
        header={infoContent?.header}
        body={infoContent?.body}
      />
    </>
  );
}
