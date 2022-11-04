import { Avatar, Center, HStack, Text } from 'native-base';

export interface PlayersProps {
  id: string;
  user: {
    name: string;
    avatarUrl: string;
  };
};

interface Props {
  players: PlayersProps[];
  count: number;
};

export function Players({ players, count }: Props) {
  return (
    <HStack>
      {
        players && players.map((player) => (
          <Avatar
            key={player.id}
            source={{ uri: player.user.avatarUrl}}
            w={8}
            h={8}
            rounded="full"
            borderWidth={2}
            marginRight={-3}
            borderColor="gray.800"
          >
           {player.user?.name?.at(0).toUpperCase()}
          </Avatar>
        ))
      }

      <Center w={8} h={8} bgColor="gray.700" rounded="full" borderWidth={1} borderColor="gray.800">
        <Text color="gray.100" fontSize="xs" fontFamily="medium">
          {count ? `+${count}` : 0}
        </Text>
      </Center>
    </HStack>
  );
}