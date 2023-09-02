import { Card, Text } from "@chakra-ui/react";

type Props = {
    raffleStatus: boolean;
}

export default function RaffleStatus({ raffleStatus }: Props) {
    let backgroundColor = raffleStatus ? "green.200" : "red.200";
    let borderColor = raffleStatus ? "green.500" : "red.500";
    let textColor = raffleStatus ? "green.700" : "red.700";

    return (
        <Card py={2} textAlign={"center"} backgroundColor={backgroundColor} border={"1px solid"} borderColor={borderColor}>
            <Text fontWeight={"bold"} color={textColor} fontSize={"sm"}>Lottery Status: {raffleStatus ? "Open" : "Closed"}</Text>
        </Card>
    )
};

