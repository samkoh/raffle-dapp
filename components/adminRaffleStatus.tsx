import { Web3Button, useContract, useContractRead, useAddress } from "@thirdweb-dev/react";
import { LOTTERY_CONTRACT_ADDRESS } from "../const/addresses";
import { useState } from "react";
import { Box, Card, Input, Stack, Text } from "@chakra-ui/react";
import RaffleStatus from "./raffleStatus";
import { Tooltip } from "@chakra-ui/react";

export default function AdminRaffleStatusCard() {
    const { contract } = useContract(LOTTERY_CONTRACT_ADDRESS);
    const address = useAddress();

    const { data: lotteryStatus } = useContractRead(contract, "lotteryStatus");
    const {
        data: admin,
        isLoading: isLoadingAdmin
    } = useContractRead(contract, "admin");

    const [contractAddress, setContractAddress] = useState("");
    const [tokenId, setTokenId] = useState(0);

    function reset() {
        setContractAddress("");
        setTokenId(0);
    }

    return (
        <Card p={4} mt={4} mr={10} w={"25%"}>
            <Text fontWeight={"bold"} mb={4} fontSize={"xl"}>Raffle Status</Text>
            <RaffleStatus raffleStatus={lotteryStatus} />

            {!lotteryStatus ? (
                <Stack spacing={4} mt={4}>
                    <Box>
                        <Text>Prize Contract Address:</Text>
                        <Input
                            placeholder={"0x000000"}
                            type="text"
                            value={contractAddress}
                            onChange={(e) => setContractAddress(e.target.value)}
                        />
                    </Box>
                    <Box>
                        <Text>Prize Token ID:</Text>
                        <Input
                            placeholder={"0"}
                            type="number"
                            value={tokenId}
                            onChange={(e) => setTokenId(parseInt(e.target.value))}
                        />
                    </Box>
                    {/* <Web3Button
                        contractAddress={LOTTERY_CONTRACT_ADDRESS}
                        action={(contract) => contract.call(
                            "startLottery", [
                            contractAddress,
                            tokenId
                        ]
                        )}
                        onSuccess={reset}
                    >Start Raffle</Web3Button> */}
                    {!isLoadingAdmin && address === admin ? (
                        <Web3Button
                            contractAddress={LOTTERY_CONTRACT_ADDRESS}
                            action={(contract) => contract.call(
                                "startLottery", [
                                contractAddress,
                                tokenId
                            ]
                            )}
                            onSuccess={reset}
                        >Start Raffle</Web3Button>
                    ) : (
                        <Tooltip label="Only admin can start the raffle" hasArrow>
                            <div>
                                <Web3Button
                                    contractAddress={LOTTERY_CONTRACT_ADDRESS}
                                    action={(contract) => contract.call(
                                        "startLottery", [
                                        contractAddress,
                                        tokenId
                                    ]
                                    )}
                                    onSuccess={reset}
                                    isDisabled
                                >Start Raffle</Web3Button>
                            </div>
                        </Tooltip>
                    )}
                </Stack>
            ) : (
                <Stack spacing={4} mt={4}>
                    {!isLoadingAdmin && address === admin ? (
                        <Web3Button
                            contractAddress={LOTTERY_CONTRACT_ADDRESS}
                            action={(contract) => contract.call("endLottery")}
                        >End Raffle</Web3Button>
                    ) : (
                        <Tooltip label="Only admin can end the raffle" hasArrow>
                            <div>
                                <Web3Button
                                    contractAddress={LOTTERY_CONTRACT_ADDRESS}
                                    action={(contract) => contract.call("endLottery")}
                                    isDisabled
                                >End Raffle</Web3Button>
                            </div>
                        </Tooltip>
                    )}
                </Stack>
            )}
        </Card>
    )
}