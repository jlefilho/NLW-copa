import { useEffect, useState } from 'react';
import { useToast, FlatList } from 'native-base';

import { api } from '../services/api';
import { Match, MatchProps } from './Match';
import { Loading } from './Loading';

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

  async function handleBetConfirm(matchId: string) {
    try {
      if (!firstTeamPoints.trim() || !secondTeamPoints.trim()){
      return toast.show({
        title: 'Informe o placar do palpite!',
        placement: 'top',
        bgColor: 'red.500'        
      })
     }

     await api.post(`/pools/${poolId}/matches/${matchId}/bets`, {
      firstTeamPoints: Number(firstTeamPoints),
      secondTeamPoints: Number(secondTeamPoints)
     })

     toast.show({
      title: 'Palpite relizado com sucesso!',
      placement: 'top',
      bgColor: 'green.500'        
      })

      fetchMatches()

    } catch (err) {
      console.log(err)
      toast.show({
          title: 'Não foi possível enviar o palpite!',
          placement: 'top',
          bgColor: 'red.500'
      })
    } finally {
    }
  }

  useEffect(()=> {
    fetchMatches()
  }, [poolId])

  if (isMatchesLoading) {
    return <Loading />
  }

  return (   
    <FlatList
      data={matches}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <Match
          data={item}
          setFirstTeamPoints={setFirstTeamPoints}
          setSecondTeamPoints={setSecondTeamPoints}
          onBetConfirm={()=> handleBetConfirm(item.id)}
        />
      )}
    />
    
  );
}
