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
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        paddingVertical: 20,
        paddingHorizontal: 24,
        borderRadius: 0,
        borderBottomWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.15)",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.8,
        shadowRadius: 20,
        elevation: 15,
        marginBottom: 24,
        gap: 14,
        width: "100%",
    },
    iconContainer: {
        backgroundColor: "#ffffff",
        padding: 8,
        borderRadius: 24,
        shadowColor: "#6366f1",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
        elevation: 6,
    },
    navbarText: {
        color: "#ffffff",
        fontSize: 22,
        fontFamily: "sans-serif-medium",
        fontWeight: "900",
        letterSpacing: 1.5,
    }
})