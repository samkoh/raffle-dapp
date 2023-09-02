import { Card, Container, Divider, Flex, Heading, Stack } from "@chakra-ui/react";
import AdminRaffleStatusCard from "../components/adminRaffleStatus";
import AdminTicketPriceCard from "../components/adminTicketPrice";
import AdminWithdrawBalance from "../components/adminWithdrawBalance";
import AdminRaffleWinnerCard from "../components/adminRaffleWinnerCard";

export default function admin() {
    return (
        <Container maxW={"1440px"} py={8}>
            <Heading>Admin Dashboard</Heading>
            <Flex
                flexDirection={"row"}
                mt={8}
                border="1px solid gray"
                borderColor="gray.300"
                p={4}
            >
                <AdminRaffleStatusCard />

                <Card p={4} mt={4} mr={10} w={"25%"}>
                    <Stack spacing={4}>
                        <AdminTicketPriceCard />
                        <Divider />
                        <AdminWithdrawBalance />
                    </Stack>
                </Card>
                <AdminRaffleWinnerCard />
            </Flex>
        </Container>
    )
}