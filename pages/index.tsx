
import { NextPage } from "next";
import { Container, SimpleGrid, Flex, Text, Stack, Box, Button, Input } from "@chakra-ui/react";
import { MediaRenderer, Web3Button, useAddress, useContract, useContractRead } from "@thirdweb-dev/react";
import { HEAD_IMAGE_URL, LOTTERY_CONTRACT_ADDRESS } from "../const/addresses";
import { ethers } from "ethers";
import RaffleStatus from "../components/raffleStatus";
import { useState } from "react";
import CurrentEntries from "../components/currentEntries";
import PrizeNFT from "../components/prizeNFT";

const Home: NextPage = () => {
  const address = useAddress();

  const { contract } = useContract(LOTTERY_CONTRACT_ADDRESS);

  const {
    data: entryCost,
    isLoading: isLoadingEntryCost
  } = useContractRead(contract, "ticketCost");

  const {
    data: totalEntries,
    isLoading: totalEntriesLoading
  } = useContractRead(contract, "totalEntries");

  const entryCostInEther = entryCost ? ethers.utils.formatEther(entryCost) : "0";

  const {
    data: raffleStatus
  } = useContractRead(contract, "lotteryStatus");

  const [ticketAmount, setTicketAmount] = useState(0);

  const ticketTotalPrice = ticketAmount * parseFloat(entryCostInEther);

  function increaseTicketAmount() {
    setTicketAmount(ticketAmount + 1);
  }

  function decreaseTicketAmount() {
    setTicketAmount(ticketAmount - 1);
  }

  return (
    <Container maxW={"1440px"} py={8}>
      <SimpleGrid columns={2} spacing={10} minH={"60vh"}>
        <Flex justifyContent={"center"} alignItems={"center"}>
          {raffleStatus ? (
            <PrizeNFT />
          ) : (
            <MediaRenderer
              src={HEAD_IMAGE_URL}
              width="100%"
              height="80%"
            />
          )}

        </Flex>
        <Flex justifyContent={"center"} alignItems={"center"} p={"5%"}>
          <Stack spacing={10}>
            <Box>
              <Text fontSize={"2xl"}>Raffle App</Text>
              <Text fontSize={"4xl"} fontWeight={"bold"}>Your entry ticket could lead you to victory with the NFT Prize!</Text>
            </Box>
            <Text fontSize={"xl"}>Purchase entries for a unique opportunity to win the NFT! A lucky winner will be chosen to receive the NFT, which will be promptly transferred to them. Increase your chances of winning the prize by obtaining more entries.</Text>

            <RaffleStatus raffleStatus={raffleStatus} />

            {!isLoadingEntryCost && (
              <Text fontSize={"2xl"} fontWeight={"bold"}>Cost Per Entry: {entryCostInEther} MATIC</Text>
            )}

            {address ? (
              <Flex flexDirection={"row"}>
                <Flex flexDirection={"row"} w={"25%"} mr={"40px"}>
                  <Button onClick={decreaseTicketAmount}>-</Button>
                  <Input
                    value={ticketAmount}
                    type={"number"}
                    onChange={(e) => setTicketAmount(parseInt(e.target.value))}
                    textAlign={"center"}
                    mx={2}
                  />
                  <Button onClick={increaseTicketAmount}>+</Button>
                </Flex>

                <Web3Button
                  contractAddress={LOTTERY_CONTRACT_ADDRESS}
                  action={(contract) => contract.call(
                    "buyTicket", [ticketAmount], { value: ethers.utils.parseEther(ticketTotalPrice.toString()) }
                  )}
                  isDisabled={!RaffleStatus}
                >{`Buy Ticket(s)`}</Web3Button>

              </Flex>
            ) : (
              <Text>Connect wallet to buy ticket.</Text>
            )}
            {!totalEntriesLoading && (
              <Text>Total Entries: {totalEntries.toString()}</Text>
            )}
          </Stack>
        </Flex>
      </SimpleGrid>
      <Stack mt={"40px"} textAlign={"center"}>
        <Text fontSize={"xl"} fontWeight={"bold"}>Current Raffle Participants:</Text>
        <CurrentEntries />
      </Stack>
    </Container>
  );
};

export default Home;
