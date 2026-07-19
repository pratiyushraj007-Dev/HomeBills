import { NavigationContainer} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack=createNativeStackNavigator();

import Home from "../screens/Home";
import CreateBill from "../screens/CreateBill";
import History from "../screens/History";
import PdfViewer from "../screens/PdfViewer"

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
                <Stack.Screen
                    name="History"
                    component={History}
                />
                <Stack.Screen
                    name="PDFView"
                    component={PdfViewer}
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
}
export default StackNavigator;