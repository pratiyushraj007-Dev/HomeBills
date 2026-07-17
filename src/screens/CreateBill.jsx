import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native"
import Navbar from "../components/Navbar";
import Goback from "../components/Goback";
import { useState } from "react";


const CreateBill = ({ navigation }) => {
    const [meterData, setMeterData] = useState([]);
    const [otherData, setOtherData] = useState([]);

    const addMeterCard = () => {
        setMeterData((prev) => [
            ...prev,
            {
                id: Date.now(),
                serviceName: "",
                initialReading: "",
                finalReading: "",
                rate: ""
            }
        ])
    }

    const addOtherData = () => {
        setOtherData((prev) => [
            ...prev, {
                id: Date.now(),
                otherServiceName: "",
                price: ""
            }
        ])
    }

    const updateMeterCard = (id, field, text) => {
        setMeterData(prev =>
            prev.map((card) =>
                card.id === id ? { ...card, [field]: text } : card
            )
        )
    }

    const updateOtherServiceCard = (id, field, text) => {
        setOtherData(prev =>
            prev.map((card) =>
                card.id === id ? { ...card, [field]: text } : card
            )
        )
    }


    const removeMeterCard = (id) => {
        setMeterData((prev) =>
            prev.filter((elem) => elem.id !== id)
        )
    }

    const removeOtherCard = (id) => {
        setOtherData((prev) =>
            prev.filter((elem) => elem.id !== id)
        )
    }

    return (
        <ScrollView style={styles.container}>
            <Navbar />
            <Goback navigation={navigation} />
                <View>
                    <Text style={styles.labelText}>Tenant Name:</Text>
                    <TextInput placeholder="Enter tenant name" placeholderTextColor="#94a3b8" style={styles.inputText}></TextInput>
                </View>
                <View>
                    <Pressable style={styles.meterdServiceBtn} onPress={addMeterCard}>
                        <Text style={styles.meterdServiceBtnText}>Add Metered Service</Text>
                    </Pressable>
                    <View>
                        {meterData.map((card) => (
                            <View key={card.id} style={styles.serviceCard}>

                                <Text style={styles.serviceCardText}>Enter Metered Service Name:</Text>
                                <TextInput
                                    onChangeText={(text) =>
                                        updateMeterCard(card.id, "serviceName", text)
                                    }
                                    value={card.serviceName}
                                    style={styles.serviceCardInput}
                                />

                                <Text style={styles.serviceCardText}>Initial Reading:</Text>
                                <TextInput
                                    keyboardType="numeric"
                                    onChangeText={(text) =>
                                        updateMeterCard(card.id, "initialReading", text)
                                    }
                                    value={card.initialReading}
                                    style={styles.serviceCardInput}
                                />

                                <Text style={styles.serviceCardText}>Final Reading:</Text>
                                <TextInput
                                    keyboardType="numeric"
                                    onChangeText={(text) =>
                                        updateMeterCard(card.id, "finalReading", text)
                                    }
                                    value={card.finalReading}
                                    style={styles.serviceCardInput}
                                />

                                <Text style={styles.serviceCardText}>Rate:</Text>
                                <TextInput
                                    keyboardType="numeric"
                                    onChangeText={(text) =>
                                        updateMeterCard(card.id, "rate", text)
                                    }
                                    value={card.rate}
                                    style={styles.serviceCardInput}
                                />

                                <Pressable onPress={() => removeMeterCard(card.id)} style={styles.serviceCardRemoveBtn} >
                                    <Text style={styles.serviceCardRemoveBtnText}>Remove</Text>
                                </Pressable>

                            </View>
                        ))}
                    </View>
                </View>
                <View>
                    <Pressable onPress={addOtherData} style={styles.otherServiceBtn}>
                        <Text style={styles.otherServiceBtnText}>Other Service</Text>
                    </Pressable>
                    <View>
                        {otherData.map((card) => (
                            <View key={card.id} style={styles.serviceCard}>

                                <Text style={styles.serviceCardText}>Enter Service Name:</Text>
                                <TextInput
                                    onChangeText={(text) =>
                                        updateOtherServiceCard(card.id, "otherServiceName", text)
                                    }
                                    value={card.otherServiceName}
                                    style={styles.serviceCardInput}
                                />

                                <Text style={styles.serviceCardText}>Cost :</Text>
                                <TextInput
                                    keyboardType="numeric"
                                    onChangeText={(text) =>
                                        updateOtherServiceCard(card.id, "price", text)
                                    }
                                    value={card.price}
                                    style={styles.serviceCardInput}
                                />
                                <Pressable onPress={() => removeOtherCard(card.id)} style={styles.serviceCardRemoveBtn} >
                                    <Text style={styles.serviceCardRemoveBtnText}>Remove</Text>
                                </Pressable>
                            </View>
                        ))}
                    </View>
                </View>
                <View>
                    <Pressable style={styles.generateBillBtn}>
                        <Text style={styles.generateBillText}>Generate Bill</Text>
                    </Pressable>
                </View>
        </ScrollView>
    )
}

export default CreateBill;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0f172a", // Dark mode Slate 900
    },
    labelText: {
        fontSize: 16,
        color: "#cbd5e1",
        fontFamily: "sans-serif-medium",
        fontWeight: "600",
        marginLeft: 24,
        marginTop: 20,
        letterSpacing: 0.5,
    },
    inputText: {
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        color: "#ffffff",
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.15)",
        fontSize: 16,
        fontFamily: "sans-serif",
        marginTop: 10,
        marginBottom: 20,
        marginHorizontal: 16,
    },
    meterdServiceBtn: {
        backgroundColor: "rgba(16, 185, 129, 0.2)",
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 20,
        alignSelf: "flex-start",
        marginLeft: 16,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: "rgba(16, 185, 129, 0.5)",
    },
    meterdServiceBtnText: {
        color: "#10b981",
        fontSize: 16,
        fontFamily: "sans-serif-medium",
        fontWeight: "700",
        letterSpacing: 0.5,
    },
    serviceCard: {
        marginTop: 20,
        backgroundColor: "rgba(255, 255, 255, 0.08)",
        width: "92%",
        alignSelf: "center",
        padding: 24,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.2)",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 8,
    },
    serviceCardText: {
        fontSize: 15,
        color: "#e2e8f0",
        fontFamily: "sans-serif-medium",
        fontWeight: "600",
        marginBottom: 8,
        marginTop: 12,
        letterSpacing: 0.5,
    },
    serviceCardInput: {
        backgroundColor: "rgba(0, 0, 0, 0.2)",
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.1)",
        marginVertical: 8,
        fontSize: 16,
        fontFamily: "sans-serif",
        color: "#ffffff",
        fontWeight: "600",
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderRadius: 16,
    },
    serviceCardRemoveBtn: {
        backgroundColor: "rgba(244, 63, 94, 0.2)",
        alignSelf: "flex-start",
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 16,
        marginTop: 20,
        borderWidth: 1,
        borderColor: "rgba(244, 63, 94, 0.5)",
    },
    serviceCardRemoveBtnText: {
        color: "#f43f5e",
        fontSize: 16,
        fontFamily: "sans-serif-medium",
        fontWeight: "800",
        letterSpacing: 0.5,
    },
    otherServiceBtn: {
        backgroundColor: "rgba(139, 92, 246, 0.2)",
        alignSelf: "flex-start",
        marginLeft: 16,
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 20,
        marginTop: 20,
        borderWidth: 1,
        borderColor: "rgba(139, 92, 246, 0.5)",
    },
    otherServiceBtnText: {
        color: "#a78bfa",
        fontSize: 16,
        fontFamily: "sans-serif-medium",
        fontWeight: "700",
        textTransform: "capitalize",
        letterSpacing: 0.5,
    },
    generateBillBtn: {
        backgroundColor: "#6366f1",
        alignSelf: "center",
        width: "92%",
        alignItems: "center",
        paddingVertical: 18,
        marginVertical: 40,
        borderRadius: 24,
        shadowColor: "#6366f1",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
        elevation: 8,
    },
    generateBillText: {
        color: "#ffffff",
        fontSize: 18,
        fontFamily: "sans-serif-medium",
        fontWeight: "800",
        textTransform: "capitalize",
        letterSpacing: 1,
    }
})