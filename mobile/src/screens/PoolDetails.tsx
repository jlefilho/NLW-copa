import { useRoute } from "@react-navigation/native";
import { HStack, useToast, VStack } from "native-base";
import { useEffect, useState } from "react";
import { api } from "../services/api";

import { Header } from "../components/Header";
import { Loading } from "../components/Loading";
import { PoolCardProps } from "../components/PoolCard";
import { PoolHeader } from "../components/PoolHeader";
import { EmptyMyPoolList } from "../components/EmptyMyPoolList";
import { Option } from "../components/Option";
import { Share } from "react-native";

interface RouteParams {
    id: string;
}

export function PoolDetails() {
    const [isPoolDetailsLoading, setIsPoolDetailsLoading] = useState(true)
    const [poolDetails, setPoolDetails] = useState<PoolCardProps>({} as PoolCardProps)
    const [optionSelected, setOptionSelected] = useState<'bets' | 'ranking'>('bets')

    const route = useRoute()

    const { id } = route.params as RouteParams

    const toast = useToast()

    async function fetchPoolDetails() {
        try {
            setIsPoolDetailsLoading(true)

            const response = await api.get(`/pools/${id}`)
            setPoolDetails(response.data.pool)
        } catch (err) {
            console.log(err)
            toast.show({
                title: 'Não foi possível carregar os detalhes do bolão!',
                placement: 'top',
                bgColor: 'red.500'
            })
        } finally {
            setIsPoolDetailsLoading(false)
        }
    }

    async function handleCodeShare() {
        await Share.share({
            message: poolDetails.code
        })
    }

    useEffect(() => {
        fetchPoolDetails()
    }, [id])

    if (isPoolDetailsLoading) {
        return <Loading />
    }

    return (
        <VStack flex={1} bgColor='gray.900'>
            <Header
                title={poolDetails.title}
                showBackButton
                showShareButton
                onShare={handleCodeShare}
            />

            {
                poolDetails._count?.players > 0 
                    ? (
                        <VStack px={5} flex={1}>
                            <PoolHeader data={poolDetails}/>

                            <HStack bgColor='gray.800' p={1} rounded='sm' mb={5}>
                                <Option 
                                    title="Seus palpites"
                                    isSelected={optionSelected === 'bets'}
                                    onPress={() => setOptionSelected('bets')}
                                />
                                <Option
                                    title="Ranking"
                                    isSelected={optionSelected === 'ranking'}
                                    onPress={() => setOptionSelected('ranking')}
                                />
                            </HStack>
                        </VStack>
                    ) : (
                        <EmptyMyPoolList code={poolDetails.code}/>
                    )
            }
        </VStack>
    )
}