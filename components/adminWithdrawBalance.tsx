import { Web3Button, useContract, useContractRead, useAddress } from "@thirdweb-dev/react";
import { LOTTERY_CONTRACT_ADDRESS } from "../const/addresses";
import { Box, Spinner, Text } from "@chakra-ui/react";
import { ethers } from "ethers";
import { Tooltip } from "@chakra-ui/react";

export default function WithdrawBalance() {
    const { contract } = useContract(LOTTERY_CONTRACT_ADDRESS);
    const address = useAddress();

    const {
        data: contractBalance,
        isLoading: contractBalanceLoading
    } = useContractRead(contract, "getBalance");

    const {
        data: admin,
        isLoading: isLoadingAdmin
    } = useContractRead(contract, "admin");

    return (
        <Box>
            <Box>
                <Text fontWeight={"bold"} mb={4} fontSize={"xl"}>Contract Balance</Text>
                {!contractBalanceLoading ? (
                    <Text fontSize={"xl"}>{ethers.utils.formatEther(contractBalance)} MATIC</Text>
                ) : (
                    <Spinner />
                )}
            </Box>
            {!isLoadingAdmin && address === admin ? (
                <Web3Button
                    contractAddress={LOTTERY_CONTRACT_ADDRESS}
                    action={(contract) => contract.call("withdrawBalance")}
                >Withdraw Balance</Web3Button>
            ) : (
                <Tooltip label="Only admin can withdraw the balance" hasArrow>
                    <div>
                        <Web3Button
                            contractAddress={LOTTERY_CONTRACT_ADDRESS}
                            action={(contract) => contract.call("withdrawBalance")}
                            isDisabled
                        >Withdraw Balance</Web3Button>
                    </div>
                </Tooltip>
            )}
        </Box>
    )
}