import { ThirdwebNftMedia, Web3Button, useContract, useContractMetadata, useContractRead, useNFT, useAddress } from "@thirdweb-dev/react";
import { LOTTERY_CONTRACT_ADDRESS } from "../const/addresses";
import { Box, Text, Flex } from "@chakra-ui/react";
import { Tooltip } from "@chakra-ui/react";

type Props = {
    nftContractAddress: string;
    tokenId: string;
};

export default function RaffleNFTTransfer({ nftContractAddress, tokenId }: Props) {
    const { contract } = useContract(LOTTERY_CONTRACT_ADDRESS);
    const address = useAddress();

    const { data: lotteryStatus } = useContractRead(contract, "lotteryStatus");

    const {
        contract: prizeNftContract
    } = useContract(nftContractAddress, "nft-drop");

    const {
        data: prizeNftContractMetadata
    } = useContractMetadata(prizeNftContract);

    const {
        data: nft,
        isLoading: nftLoading
    } = useNFT(prizeNftContract, tokenId);

    const {
        data: admin,
        isLoading: isLoadingAdmin
    } = useContractRead(contract, "admin");

    return (
        <Box>
            <Flex my={10} flexDirection={"row"} alignItems={"center"}>
                {!nftLoading && (
                    <ThirdwebNftMedia
                        metadata={nft?.metadata!}
                    />
                )}
                <Box ml={4}>
                    <Text fontSize={"xl"} fontWeight={"bold"}>{prizeNftContractMetadata?.name}</Text>
                    <Text fontWeight={"bold"} fontSize={"xl"}>{nft?.metadata.name}</Text>
                </Box>
            </Flex>

            {/* <Web3Button
                        contractAddress={LOTTERY_CONTRACT_ADDRESS}
                        action={async () => {
                            await prizeNftContract?.setApprovalForToken(
                                LOTTERY_CONTRACT_ADDRESS,
                                tokenId
                            );
                            await contract?.call("pickWinner");
                        }}
                        isDisabled={lotteryStatus}
                    >Select Winner</Web3Button> */}
            {!isLoadingAdmin && address === admin ? (

                <Web3Button
                    contractAddress={LOTTERY_CONTRACT_ADDRESS}
                    action={async () => {
                        await prizeNftContract?.setApprovalForToken(
                            LOTTERY_CONTRACT_ADDRESS,
                            tokenId
                        );
                        await contract?.call("pickWinner");
                    }}
                    isDisabled={lotteryStatus}
                >Select Winner</Web3Button>
            ) : (
                <Tooltip label="Only admin can withdraw the balance" hasArrow>
                    <div>
                        <Web3Button
                            contractAddress={LOTTERY_CONTRACT_ADDRESS}
                            action={async () => {
                                await prizeNftContract?.setApprovalForToken(
                                    LOTTERY_CONTRACT_ADDRESS,
                                    tokenId
                                );
                                await contract?.call("pickWinner");
                            }}
                            isDisabled
                        >Select Winner</Web3Button>
                    </div>
                </Tooltip>
            )}

        </Box>
    )
}

