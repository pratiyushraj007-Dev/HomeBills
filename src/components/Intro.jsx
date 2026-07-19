import { StyleSheet, Text, View, Image, Pressable } from "react-native"
import { SquarePen } from "lucide-react-native"
import { History } from "lucide-react-native"
const Intro = ({navigation}) => {
    return (
        <View style={styles.introContainer}>
            <Image
                source={require("../assets/homeBills.png")}
                style={{ width: 250, height: 250, marginBottom: 30, borderRadius: 60, margin: "auto", shadowColor: "#000", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.5, shadowRadius: 20, elevation: 15 }}
            />
            <Text style={styles.introPara}>
                HomeBills is a modern rental management platform that simplifies property
                management for landlords and tenants. Easily manage monthly rent, utility
                bills, maintenance charges, and additional services from a single, intuitive
                dashboard.

                {"\n"}

                Whether you manage a single property or an entire portfolio, HomeBills helps
                automate billing, organize payments, reduce manual work, and provide a
                seamless rental experience with complete transparency.
            </Text>
            <View style={styles.introBtnContainer}>
                <Pressable 
                style={[styles.introBtn,{backgroundColor:"rgba(99, 102, 241, 0.8)", borderColor: "rgba(99, 102, 241, 1)"}]}
                onPress={()=>navigation.navigate("Create")}
                >
                    <SquarePen size={22} color={"#ffffff"}/>
                    <Text style={{fontSize:20,fontWeight:"700",fontFamily:"sans-serif-medium",color:"#ffffff",letterSpacing:0.5}}>Create</Text>
                </Pressable>
                <Pressable 
                style={[styles.introBtn,{backgroundColor:"rgba(244, 63, 94, 0.8)", borderColor: "rgba(244, 63, 94, 1)"}]}
                onPress={()=>navigation.navigate("History")}
                >
                    <History size={22} color={"#ffffff"}/>
                    <Text style={{fontSize:20,fontWeight:"700",fontFamily:"sans-serif-medium",color:"#ffffff",letterSpacing:0.5}}>History</Text>
                </Pressable>
            </View>
        </View>
    )
}
export default Intro

const styles = StyleSheet.create({
    introContainer:{
        marginTop: 20,
        paddingHorizontal: 10,
    },
    introPara: {
        fontSize: 16,
        lineHeight: 28,
        color: "#cbd5e1",
        textAlign: "center",
        fontFamily: "sans-serif-medium",
        fontWeight: "500",
        letterSpacing: 0.5,
        marginHorizontal: 20,
        marginTop: 20,
    },
    introBtn:{
        flex: 1,
        flexDirection: "row",
        paddingVertical: 16,
        paddingHorizontal: 12,
        gap: 12,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 20,
        borderWidth: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.5,
        shadowRadius: 15,
        elevation: 8,
    },
    introBtnContainer:{
        flexDirection: "row",
        paddingHorizontal: 20,
        gap: 20,
        marginTop: 40,
        paddingBottom: 40,
    }
})