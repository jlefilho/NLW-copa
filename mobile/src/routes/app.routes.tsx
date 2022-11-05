import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NewPool } from '../screens/NewPool'
import { Pools } from '../screens/Pools'

const { Navigator, Screen } = createBottomTabNavigator()

export function AppRoutes() {
    return (
        <Navigator>
            <Screen
                name="newPool"
                component={NewPool}
            />

            <Screen
                name="pools"
                component={Pools}
            />
        </Navigator>
    )
}