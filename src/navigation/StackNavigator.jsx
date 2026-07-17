import { NavigationContainer} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack=createNativeStackNavigator();

import Home from "../screens/Home";
import CreateBill from "../screens/CreateBill";

const StackNavigator=()=>{
    return(
        <NavigationContainer>
            <Stack.Navigator 
            initialRouteName="Home"
            screenOptions={{
                headerShown:false
            }}
            >
                <Stack.Screen
                    name="Home"
                    component={Home}
                />
                <Stack.Screen
                    name="Create"
                    component={CreateBill}
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
}
export default StackNavigator;