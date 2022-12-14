import { useCallback, useState } from "react";
import { FlatList, Icon, useToast, VStack } from "native-base";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Octicons } from '@expo/vector-icons'
import { api } from "../services/api";

import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { PoolCard, PoolCardProps } from "../components/PoolCard";
import { EmptyPoolList } from "../components/EmptyPoolList";
import { Loading } from "../components/Loading";


export function Pools() {
    const [isPoolLoading, setIsPoolLoading] = useState(true)
    const [pools, setPools] = useState<PoolCardProps[]>([])

    const { navigate } = useNavigation()

    const toast = useToast()

    async function fecthPools() {
        try {
            setIsPoolLoading(true)
            const response = await api.get('/pools')
            setPools(response.data.pools)
        } catch (err) {
            console.log(err)
            toast.show({
                title: 'Não foi possível carregar os bolões!',
                placement: 'top',
                bgColor: 'red.500'
            })
        } finally {
            setIsPoolLoading(false)
        }
    }

    useFocusEffect(useCallback(() => {
        fecthPools()
    },[]))

    return (
        <VStack flex={1} bgColor='gray.900'>
            <Header title='Meus bolões' />
            <VStack
                mt={6}
                mx={5}
                borderBottomWidth={1}
                borderBottomColor='gray.600'
                pb={4}
                mb={4}
            >
                <Button
                    title='BUSCAR BOLÃO POR CÓDIGO'
                    leftIcon={
                        <Icon as={Octicons} name='search' color='black' size='md' />
                    }
                    onPress={() => navigate('findPool')}
                />
            </VStack>
            
            {
                isPoolLoading 
                    ? <Loading /> 
                    :
                        <FlatList
                            data={pools}
                            keyExtractor={item => item.id}
                            renderItem={({ item }) => (
                                <PoolCard 
                                    data={item}
                                    onPress={() => navigate('poolDetails', { id: item.id })}
                                />
                            )}
                            ListEmptyComponent={() => <EmptyPoolList />}
                            px={5}
                            showsVerticalScrollIndicator={false}
                            _contentContainerStyle={{ pb: 20 }}
                        />
            }
        </VStack>
    )
}