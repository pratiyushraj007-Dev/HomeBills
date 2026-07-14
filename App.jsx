import { View, Text, ScrollView } from "react-native";
import Navbar from "./src/components/Navbar";
import Intro from "./src/components/Intro";
const App = () => {
  return (
    <View>
      <ScrollView>
        <Navbar />
        <Intro />
      </ScrollView>
    </View>
  )
}
export default App;
