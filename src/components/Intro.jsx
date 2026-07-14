import { StyleSheet, Text, View, Image, Pressable } from "react-native"
import { SquarePen } from "lucide-react-native"
import { History } from "lucide-react-native"
const Intro = () => {
    return (
        <View style={styles.introContainer}>
            <Image
                source={require("../assets/homeBills.png")}
                style={{ width: 250, height: 250, marginBottom: 20, boxShadow: "0px 0px 5px black", borderRadius: 60,margin:"auto" }}
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
                <Pressable style={[styles.introBtn,{backgroundColor:"skyblue"}]}>
                    <SquarePen size={22} color={"#ffffff"}/>
                    <Text style={{fontSize:20,fontWeight:"600"}}>Create</Text>
                </Pressable>
                <Pressable style={[styles.introBtn,{backgroundColor:"red"}]}>
                    <History size={22} color={"#ffffff"}/>
                    <Text style={{fontSize:20,fontWeight:"600"}}>History</Text>
                </Pressable>
            </View>
        </View>
    )
}
export default Intro

const styles = StyleSheet.create({
    introContainer:{
        marginTop:30
    },
    introPara: {
        fontSize: 16,
        lineHeight: 28,
        color: "black",
        textAlign: "justify",
        fontFamily: "sans-serif",
        fontWeight: "800",
        letterSpacing: 0.3,
        marginHorizontal: 20,
        marginTop: 15,
    },
    introBtn:{
        flex:1,
        flexDirection:"row",
        padding:10,
        gap:10,
        justifyContent:"center",
        borderRadius:10
    },
    introBtnContainer:{
        flex:1,
        flexDirection:"row",
        paddingHorizontal:20,
        gap:20,
        marginTop:20
    }
})