import React, { useState } from "react";
import {
    Row,
    Button,
    Card,
    Col,
    Form,
} from "react-bootstrap";

import { ethers } from 'ethers';
import { connect } from '@aragon/connect-react';
import DisplayPath from "./DisplayPath";
import AlertModal from "./AlertModal";

export default function TxPath() {
    const [errorModal, setErrorModal] = useState({
        msg: "",
        open: false
    });
    const [details, setDetails] = useState({
        ensAddress: "multipaths.aragonid.eth",
        accountAddress: "0xc07866c1c58824934b0f17090765a372a1933655",
        amount: "1",
        message: "Multiple Path Test Payment",
    });
    const [txPaths, setTxPaths] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isRinkeby, setIsRinkeby] = useState(true);
    const [showTx, setShowTx] = useState({
        all: true,
        shortest: false,
        longest: false,
    });

    const txPathHandler = async () => {
        try {
            let org;
            setIsProcessing(true);

            if (!isRinkeby) {
                org = await connect(details.ensAddress, 'thegraph')
            } else {
                org = await connect(details.ensAddress, 'thegraph', { chainId: 4 })
            }

            const app = await org.app('finance');

            // Transaction intent
            const intent = org.appIntent(app.address, 'newImmediatePayment', [
                ethers.constants.AddressZero,
                details.accountAddress,
                ethers.utils.parseEther(details.amount),
                details.message,
            ])

            // Transaction paths
            const paths = await intent.paths(details.accountAddress);

            setTxPaths(paths);
            setIsProcessing(false);
        } catch (error) {
            setIsProcessing(false);
            setErrorModal({
                open: true,
                msg: error.message,
            });
        }
    }

    const validateForm = () => {
        if (details.accountAddress.length !== 42) {
            setErrorModal({
                open: true,
                msg: "Please enter valid account address !!",
            });
        } else if (!details.ensAddress) {
            setErrorModal({
                open: true,
                msg: "All fields are mandatory !!",
            });
        } else {
            txPathHandler();
        }
    }

    const handleClearStatus = () => {
        setTxPaths([]);
    }

    return (
        <div style={{ width: "100%" }}>
            <Card className="mx-auto form-card ">
                <Card.Header style={{ fontSize: "2rem" }}>
                    PATH VISUALIZER
                </Card.Header>

                <Card.Body style={{ textAlign: "left" }}>
                    <p
                        style={{ textAlign: "center", fontWeight: "bold" }}
                    >
                        <u>Transaction Path Visualizer for New Immediate Payment</u>
                    </p>
                    <Row>
                        <Col>
                            <div key={`inline-radio`} className="mb-3">
                                <Form.Check
                                    inline
                                    label="Rinkeby"
                                    type="radio"
                                    id={`inline-radio-1`}
                                    checked={isRinkeby}
                                    onChange={() => setIsRinkeby(true)}
                                />
                                <Form.Check
                                    inline
                                    label="Mainnet"
                                    type="radio"
                                    id={`inline-radio-2`}
                                    checked={!isRinkeby}
                                    onChange={() => setIsRinkeby(false)}
                                />
                            </div>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <Form.Control
                                className="mb-4"
                                type="text"
                                placeholder="Organization ENS Address (eg: myorg.aragonid.eth)"
                                onChange={(e) => setDetails({
                                    ...details,
                                    ensAddress: e.target.value
                                })}
                                value={details.ensAddress}
                                required
                            />
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <Form.Control
                                className="mb-4"
                                type="email"
                                placeholder="Ethereum address of signer"
                                onChange={(e) => setDetails({
                                    ...details,
                                    accountAddress: e.target.value
                                })}
                                value={details.accountAddress}
                                required
                            />
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <Form.Control
                                className="mb-4"
                                type="number"
                                placeholder="Amount (eg: 1)"
                                onChange={(e) => setDetails({
                                    ...details,
                                    amount: e.target.value
                                })}
                                value={details.amount}
                                required
                            />
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <Form.Control
                                className="mb-4"
                                type="text"
                                placeholder="Description Message"
                                onChange={(e) => setDetails({
                                    ...details,
                                    message: e.target.value
                                })}
                                value={details.message}
                                required
                            />
                        </Col>
                    </Row>
                </Card.Body>

                <Card.Footer className="text-center">
                    <Button
                        onClick={validateForm}
                        variant="outline-success"
                    >
                        Get Paths
                    </Button>
                </Card.Footer>
            </Card>

            <Card className="mx-auto path-card">
                <Card.Header style={{ fontSize: "1.5rem" }}>
                    Transaction Path
                </Card.Header>

                <Card.Body>
                    {isProcessing ?
                        <div className="spinner-border" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                        :
                        <div>
                            {txPaths.length > 0 ?
                                <div>
                                    <div style={{ textAlign: "right", marginBottom: "1%" }} key={`tx-radio`}>
                                        <span style={{ fontSize: "1.1rem" }}>Show Path: </span>
                                        <Form.Check
                                            inline
                                            label="All"
                                            type="radio"
                                            id={`inline-radio-3`}
                                            checked={showTx.all}
                                            onChange={() => {
                                                setShowTx({
                                                    ...showTx,
                                                    all: true,
                                                    shortest: false,
                                                    longest: false,
                                                });
                                            }}
                                        />
                                        <Form.Check
                                            inline
                                            label="Shortest"
                                            type="radio"
                                            id={`inline-radio-4`}
                                            checked={showTx.shortest}
                                            onChange={() => {
                                                setShowTx({
                                                    ...showTx,
                                                    all: false,
                                                    shortest: true,
                                                    longest: false,
                                                });
                                            }}
                                        />
                                        <Form.Check
                                            inline
                                            label="Longest"
                                            type="radio"
                                            id={`inline-radio-5`}
                                            checked={showTx.longest}
                                            onChange={() => {
                                                setShowTx({
                                                    ...showTx,
                                                    all: false,
                                                    shortest: false,
                                                    longest: true,
                                                });
                                            }}
                                        />
                                    </div>

                                    {showTx.all ?
                                        <DisplayPath
                                            txPaths={txPaths}
                                            networkId={isRinkeby ? 4 : 1}
                                            account={details.accountAddress}
                                        />
                                        : (
                                            showTx.shortest
                                                ?
                                                <DisplayPath
                                                    txPaths={[txPaths[0]]}
                                                    networkId={isRinkeby ? 4 : 1}
                                                    account={details.accountAddress}
                                                />
                                                :
                                                <DisplayPath
                                                    txPaths={[txPaths[txPaths.length - 1]]}
                                                    networkId={isRinkeby ? 4 : 1}
                                                    account={details.accountAddress}
                                                />
                                        )
                                    }
                                </div>
                                : null
                            }
                        </div>
                    }

                </Card.Body>

                <Card.Footer>
                    <Button
                        variant="warning"
                        onClick={handleClearStatus}
                    >
                        CLEAR
                    </Button>
                </Card.Footer>
            </Card>

            <AlertModal
                open={errorModal.open}
                toggle={() => setErrorModal({ ...errorModal, open: false })}
            >
                {errorModal.msg}
            </AlertModal>
        </div >
    );
}
