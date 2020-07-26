import React, { useState } from "react";
import { ethers } from 'ethers';
import {
    Card,
    CardDeck,
    Button,
} from "react-bootstrap";
import AlertModal from "./AlertModal";

export default function DisplayPath({
    txPaths,
    networkId,
    account,
}) {
    const [errorModal, setErrorModal] = useState({
        msg: "",
        open: false
    });

    const sendTxRequest = async (key, provider, signer) => {
        const choosedPath = txPaths[key];

        for (let i = 0; i < choosedPath.transactions.length; i++) {
            try {
                const tx = await signer.sendTransaction
                    ({
                        from: choosedPath.transactions[i].from,
                        to: choosedPath.transactions[i].to,
                        data: choosedPath.transactions[i].data,
                    });

                await provider.waitForTransaction(tx.hash);

            } catch (error) {
                setErrorModal({
                    open: true,
                    msg: error.message,
                });
            }
        }
    };

    const validateAndSendTx = async (key) => {
        const web3 = window.ethereum;
        await web3.enable();

        const provider = new ethers.providers.Web3Provider(web3);
        const signer = provider.getSigner();

        if (networkId !== await signer.getChainId()) {
            setErrorModal({
                open: true,
                msg: "Incorrect network choosen !! Please choose correct network.",
            });
        } else {
            if (
                await ethers.utils.getAddress(account) !== await signer.getAddress()
            ) {
                setErrorModal({
                    open: true,
                    msg: "Incorrect signer choosen !! Please choose " + account,
                });
            } else {
                sendTxRequest(key, provider, signer);
            }
        }
    };

    return (
        <div style={{ width: "100%" }}>
            {txPaths.map((element, key) => (
                <div>
                    {txPaths.length > 1 ?
                        <p style={{ fontSize: "1.5rem" }}><u>Path {key}</u></p>
                        : null
                    }
                    <CardDeck key={key} style={{ paddingBottom: "1%" }}>
                        {element.transactions.map((tx, k) => (
                            <>
                                <Card key={k}>
                                    <Card.Header>{k + 1}</Card.Header>
                                    <Card.Body>
                                        <p style={{ fontWeight: "bold" }}>{tx.to}</p>
                                        {tx.description}
                                    </Card.Body>
                                </Card>
                                {k !== element.transactions.length - 1
                                    ? <span className="right-arrow">&#8594;</span>
                                    : null
                                }
                            </>
                        ))}
                    </CardDeck>

                    <Button
                        onClick={() => validateAndSendTx(key)}
                        variant="outline-success"
                        size="sm"
                        style={{ marginBottom: "2%" }}
                    >
                        Choose & Send
                    </Button>
                </div>
            ))}

            <AlertModal
                open={errorModal.open}
                toggle={() => setErrorModal({ ...errorModal, open: false })}
            >
                {errorModal.msg}
            </AlertModal>
        </div>
    );
}
