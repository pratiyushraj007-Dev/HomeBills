import { Pressable, View, Text, StyleSheet } from "react-native"
import { ArrowLeft } from "lucide-react-native"


const Goback = ({navigation}) => {
    return (
        <View>
            <Pressable style={styles.goBack} onPress={()=>navigation.goBack()}>
                <ArrowLeft style={styles.goBackText} color="#ffffff" />
                <Text style={styles.goBackText} >Back</Text>
            </Pressable>
        </View>
    )
}

export default Goback;

const styles = StyleSheet.create({
    goBack: {
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        paddingVertical: 12,
        paddingHorizontal: 16,
        flexDirection: "row",
        alignItems: "center",
        width: 120,
        justifyContent: "center",
        gap: 10,
        borderRadius: 24,
        marginLeft: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.15)",
    },
    goBackText: {
        color: "#ffffff",
        fontSize: 18,
        fontFamily: "sans-serif-medium",
        fontWeight: "700",
        letterSpacing: 0.5,
    }
})