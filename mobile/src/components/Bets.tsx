import { useEffect, useState } from 'react';
import { Box, useToast, FlatList } from 'native-base';

import { api } from '../services/api';
import { Match, MatchProps } from './Match';

interface Props {
  poolId: string;
}

export function Bets({ poolId }: Props) {
  const [isMatchesLoading, setIsMatchesLoading] = useState(true)
  const [matches, setMatches] = useState<MatchProps[]>([])
  const [firstTeamPoints, setFirstTeamPoints] = useState('')
  const [secondTeamPoints, setSecondTeamPoints] = useState('')

  const toast = useToast()
  
  async function fetchMatches() {
    try {
      setIsMatchesLoading(true)

      const response = await api.get(`/pools/${poolId}/matches`)
      setMatches(response.data.matches)

    } catch (err) {
      console.log(err)
      toast.show({
          title: 'Não foi possível carregar os jogos!',
          placement: 'top',
          bgColor: 'red.500'
      })
    } finally {
      setIsMatchesLoading(false)
    }
  }

  useEffect(()=> {
    fetchMatches()
  }, [poolId])

  return (   
    <FlatList
      data={matches}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <Match
          data={item}
          setFirstTeamPoints={setFirstTeamPoints}
          setSecondTeamPoints={setSecondTeamPoints}
          onBetConfirm={()=> {}}
        />
      )}
    />
    
  );
}
