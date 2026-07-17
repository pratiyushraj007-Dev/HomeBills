import { View, Text, ScrollView, StyleSheet } from "react-native";
import Navbar from "../components/Navbar";
import Intro from "../components/Intro";
const Home=({navigation})=>{
    return(
 <View style={styles.container}>
      <ScrollView>
        <Navbar />
        <Intro navigation={navigation} />
      </ScrollView>
    </View>
    )
}
export default Home;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0f172a",
    }
});