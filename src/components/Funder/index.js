import * as React from "react";
import { useState, useEffect } from "react";

import { WalletSelector } from "components/WalletSelector";
import { Info } from "components/Info";

import { useWallet } from "../../contexts/walletContext";
import { useUser } from "../../contexts/userContext";
import { useTransaction } from "../../contexts/transactionContext";

import { Button, Stack, Input, FormControl, FormLabel } from "@chakra-ui/react";

export function Funder({ axios, projectId }) {
  const [openWalletSelector, setOpenWalletSelector] = useState(false);
  const [infoContent, setInfoContent] = useState(null);
  const [fundingAmount, setFundingAmount] = useState(10_000_000);

  const { connect, curWallet, getWallets } = useWallet();
  const { user, getStakeAddress } = useUser();
  const { assembleTransaction, getValueCBOR } = useTransaction();

  const getFundTransactionCbor = async (api, amount) => {
    if (!amount) {
      console.error(`invalid funding amount ${amount}`);
    }

    const asset = process.env.REACT_APP_FUNDING_ASSET;
    const lovelace = 2_000_000;

    const value_cbor = getValueCBOR(lovelace, asset, amount);
    const utxos = await api.getUtxos(value_cbor);

    const res = await axios.post("/transaction/projects/fund", {
      stake_address: user.stakeAddress,
      funding_utxos: utxos,
      funding_amount: amount,
      project_id: projectId,
      signature: user.signature,
    });

    console.log("res", res);

    return {
      body: res.data.transaction_cbor,
      witness: res.data.witness_cbor,
    };
  };

  const createFundingTransaction = async (api) => {
    const { body, witness } = await getFundTransactionCbor(api, fundingAmount);
    const stakeAddress = await getStakeAddress(api);

    assembleTransaction(api, body, witness)
      .then(async (txHash) => {
        try {
          console.log("Trying to notify backend transaction was submitted!");
          console.log({
            stake_address: stakeAddress,
            transaction_hash: txHash,
            signature: user.signature,
          });
          const res = await axios.post("/transaction/projects/fund/submitted", {
            stake_address: stakeAddress,
            transaction_hash: txHash,
            signature: user.signature,
          });

          console.log("response from tx submission backend", res);
        } catch (error) {
          console.error("Failed to confirm funding transaction as submitted!");
          console.error(error);

          setInfoContent({
            header: "Server Error",
            body: `Failed to notify backend that transaction ${txHash} was submitted`,
          });
        }
      })
      .catch((error) => {
        console.error("Failed to assemble transaction");
        console.error(error);

        setInfoContent({
          header: "Transaction Error",
          body: `Failed to create funding transaction`,
        });
      });
  };

  return (
    <>
      <Stack spacing={6} direction={["column", "row"]} w={"100%"}>
        <FormControl id="funding_amount">
          <FormLabel>Funding Amount</FormLabel>
          <Input
            _placeholder={{ color: "gray.500" }}
            value={fundingAmount}
            onChange={(event) => setFundingAmount(parseInt(event.target.value))}
            type="number"
          />
        </FormControl>
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
              createFundingTransaction(curWallet);
            }
          }}
        >
          Fund Project
        </Button>
      </Stack>
      <WalletSelector
        isOpen={openWalletSelector}
        onSelect={async (wallet) => {
          connect(wallet)
            .then(async (result) => {
              if (result.success === true) {
                console.log("Wallet connected!");

                createFundingTransaction(result.api);
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
