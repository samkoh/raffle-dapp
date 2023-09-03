import { Web3Button, useContract, useContractRead, useAddress } from "@thirdweb-dev/react";
import { LOTTERY_CONTRACT_ADDRESS } from "../const/addresses";
import { useState } from "react";
import { Box, Input, Spinner, Stack, Text } from "@chakra-ui/react";
import { ethers } from "ethers";
import { Tooltip } from "@chakra-ui/react";

export default function AdminTicketPriceCard() {

    const { contract } = useContract(LOTTERY_CONTRACT_ADDRESS);
    const address = useAddress();

    const {
        data: ticketCost,
        isLoading: ticketCostLoading
    } = useContractRead(contract, "ticketCost");

    const {
        data: admin,
        isLoading: isLoadingAdmin
    } = useContractRead(contract, "admin");

    const {
        data: lotteryStatus
    } = useContractRead(contract, "lotteryStatus");

    const [ticketPrice, setTicketPrice] = useState(0);

    function resetTicketPrice() {
        setTicketPrice(0);
    };

    return (
        <Stack spacing={4}>
            <Box>
                <Text fontWeight={"bold"} mb={4} fontSize={"xl"}>Ticket Price</Text>
                {!ticketCostLoading ? (
                    <Text fontSize={"xl"}>{ethers.utils.formatEther(ticketCost)} MATIC</Text>
                ) : (
                    <Spinner />
                )}
            </Box>
            <Input type="number" value={ticketPrice} onChange={(e) => setTicketPrice(parseFloat(e.target.value))} />
            {/* <Web3Button
                contractAddress={LOTTERY_CONTRACT_ADDRESS}
                action={(contract) => contract.call(
                    "changeTicketCost",
                    [
                        ethers.utils.parseEther(ticketPrice.toString())
                    ]
                )}
                onSuccess={resetTicketPrice}
                isDisabled={lotteryStatus}
            >Update Ticket Cost</Web3Button> */}
            {!isLoadingAdmin && address === admin ? (

                <Web3Button
                    contractAddress={LOTTERY_CONTRACT_ADDRESS}
                    action={(contract) => contract.call(
                        "changeTicketCost",
                        [
                            ethers.utils.parseEther(ticketPrice.toString())
                        ]
                    )}
                    onSuccess={resetTicketPrice}
                    isDisabled={lotteryStatus}
                >Update Ticket Cost</Web3Button>
            ) : (
                <Tooltip label="Only admin can update" hasArrow>
                    <div>
                        <Web3Button
                            contractAddress={LOTTERY_CONTRACT_ADDRESS}
                            action={(contract) => contract.call(
                                "changeTicketCost",
                                [
                                    ethers.utils.parseEther(ticketPrice.toString())
                                ]
                            )}
                            onSuccess={resetTicketPrice}
                            isDisabled
                        >Update Ticket Cost</Web3Button>

                    </div>
                </Tooltip>
            )}
        </Stack>
    )
}