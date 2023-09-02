import { Container, Flex, Text, Button } from "@chakra-ui/react";
import { ConnectWallet, useAddress, useContract, useContractRead } from "@thirdweb-dev/react";
import Link from "next/link";
import { LOTTERY_CONTRACT_ADDRESS } from "../const/addresses";

export default function Navbar() {
    const address = useAddress();

    const { contract } = useContract(LOTTERY_CONTRACT_ADDRESS);

    const {
        data: admin,
        isLoading: isLoadingAdmin
    } = useContractRead(contract, "admin");

    return (
        <Container maxW={"1440px"} py={8}>
            <Flex
                flexDirection={"row"}
                justifyContent={"space-between"}
                alignItems={"center"}
            >
                <Link href={"/"}>
                    <Text fontSize={"3xl"} fontWeight={"bold"}>Raffle APP</Text>
                </Link>
                <Flex flexDirection={"row"} alignItems={"center"}>
                    {!isLoadingAdmin && address === admin && (
                        <Link href={"/admin"}>
                            <Button
                                colorScheme="gray"
                                variant="solid"
                                fontWeight="bold"
                                mr={10}
                            >
                                Admin
                            </Button>
                        </Link>
                    )}
                    <ConnectWallet />
                </Flex>
            </Flex>
        </Container>
    )
}