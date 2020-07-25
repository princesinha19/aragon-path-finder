import React, { useState } from "react";
import {
    Row,
    Button,
    Card,
    Col,
    Form,
    Modal,
    CardDeck,
} from "react-bootstrap";

import { ethers } from 'ethers';
import { connect } from '@aragon/connect-react';

export default function TxPath() {
    const [errorModal, setErrorModal] = useState({ msg: "", open: false });
    const [details, setDetails] = useState({
        ensAddress: "multipaths.aragonid.eth",
        accountAddress: "0xc07866c1c58824934b0f17090765a372a1933655",
        amount: "1",
        message: "Multiple Path Test Payment",
    });
    const [txPaths, setTxPaths] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isRinkeby, setIsRinkeby] = useState(true);

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
                    Transaction Paths
                </Card.Header>

                <Card.Body>
                    {isProcessing ?
                        <div className="spinner-border" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                        :
                        <div>
                            {txPaths.map((element, key) => (
                                <div>
                                    <p style={{ fontSize: "1.5rem" }}><u>Path {key}</u></p>
                                    <CardDeck key={key} style={{ paddingBottom: "2%" }}>
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
                                </div>
                            ))}
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

            <Modal
                show={errorModal.open}
                onHide={() => setErrorModal({ ...errorModal, open: false })}
                animation={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Opps!! Error...</Modal.Title>
                </Modal.Header>
                <Modal.Body>{errorModal.msg}</Modal.Body>
                <Modal.Footer>
                    <Button variant="danger"
                        onClick={() => setErrorModal({ ...errorModal, open: false })}
                    >
                        Ok
                    </Button>
                </Modal.Footer>
            </Modal>
        </div >
    );
}
