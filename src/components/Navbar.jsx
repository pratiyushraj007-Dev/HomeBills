import { StyleSheet, Text, View } from "react-native"
import { ReceiptText } from "lucide-react-native";
const Navbar = () => {
    return (
        <View style={styles.navbar}>
            <View style={styles.iconContainer}>
                <ReceiptText size={22} color="#6366f1" />
            </View>
            <Text style={styles.navbarText}>HomeBills</Text>
        </View>
    )
}
export default Navbar;

const styles = StyleSheet.create({
    navbar: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#0f172a",
        paddingVertical: 20,
        paddingHorizontal: 24,
        borderBottomWidth: 1,
        borderColor: "#1e293b",
        marginBottom: 24,
        gap: 14,
        width: "100%",
    },
    iconContainer: {
        padding: 4,
    },
    navbarText: {
        color: "#ffffff",
        fontSize: 22,
        fontFamily: "sans-serif-medium",
        fontWeight: "900",
        letterSpacing: 1.5,
    }
})