import { useContract, useContractRead } from "@thirdweb-dev/react";
import { LOTTERY_CONTRACT_ADDRESS } from "../const/addresses";
import { Container, Spinner } from "@chakra-ui/react";
import EntryCard from "./entryCard";

export default function CurrentEntries() {

    const { contract } = useContract(LOTTERY_CONTRACT_ADDRESS);

    const {
        data: entries,
        isLoading: totalEntriesLoading
    } = useContractRead(contract, "getPlayers")

    return (
        <Container py={8}>
            {!totalEntriesLoading ? (
                entries.map((entry: any, index: number) => (
                    <EntryCard
                        key={index}
                        walletAddress={entry}
                    />
                ))
            ) : (
                <Spinner />
            )}

        </Container>
    )
}