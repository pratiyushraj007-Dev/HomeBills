import { StyleSheet, Text, View } from "react-native"
import { ReceiptText } from "lucide-react-native";
const Navbar = () => {
    return (
        <View style={styles.navbar}>
            <ReceiptText size={24} color="white" />
            <Text style={styles.navbarText}>HomeBills</Text>
        </View>
    )
}
export default Navbar;

const styles = StyleSheet.create({
    navbar: {
        flex:1,
        flexDirection:"row",
        justifyContent:"center",
        alignItems: "center",
        backgroundColor: "red",
        padding:10,
        marginBottom:20,
        gap:10
    },
    navbarText: {
        color: "#ffffff",
        fontSize: 25,
        fontWeight: "600"
    }
})