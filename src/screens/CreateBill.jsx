import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native"
import { generatePDF } from "react-native-html-to-pdf";
import Navbar from "../components/Navbar";
import Goback from "../components/Goback";
import { useState } from "react";
import { HOME_LOGO_BASE64 } from "../utils/pdfHomeLogo";
import RNFS from "react-native-fs";
import { launchImageLibrary } from "react-native-image-picker";
import Pdf from "react-native-pdf";
import Share from "react-native-share";
import QRCode from "react-native-qrcode-svg";
import { useRef } from "react";

const CreateBill = ({ navigation }) => {
    const [propertyName, setPropertyName] = useState("");
    const [roomRent, setRoomRent] = useState("");
    const [tenantName, setTenantName] = useState("");
    const [meterData, setMeterData] = useState([]);
    const [otherData, setOtherData] = useState([]);
    const [deducedCharge, setDeducedCharge] = useState([]);
    const [image, setImage] = useState([]);
    const [pdfPath, setPdfPath] = useState(null);
    const [upiId, setUpiId] = useState("");
    const qrRef = useRef(null);
    const scrollRef = useRef();

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

    const addDeducedCard = () => {
        setDeducedCharge((prev) => [
            ...prev,
            {
                id: Date.now(),
                deducedChargeName: "",
                deduced: ""
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

    const updateDeducedCard = (id, field, text) => {
        setDeducedCharge(prev =>
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

    const removeDeducedCard = (id) => {
        setDeducedCharge((prev) =>
            prev.filter((elem) => elem.id !== id)
        )
    }

    const pickImage = async () => {
        const result = await launchImageLibrary({
            mediaType: "photo",
            selectionLimit: 0
        })
        if (!result.didCancel && result.assets?.length) {
            setImage((prev) => [
                ...prev, ...result.assets
            ]);
        }
        Alert.alert("Image is Added")
    }


    const sharePDF = async () => {
        try {
            await Share.open({
                url: `file://${pdfPath}`,
                type: "application/pdf",
                title: "Share Invoice",
            });
        } catch (error) {
            console.log(error);
        }
    };

    const meterTotal = meterData.reduce(
        (sum, item) =>
            sum +
            (Number(item.finalReading) - Number(item.initialReading)) *
            Number(item.rate),
        0
    );

    const otherTotal = otherData.reduce(
        (sum, item) => sum + Number(item.price),
        0
    );

    const deductionTotal = deducedCharge.reduce(
        (sum, item) => sum + Number(item.deduced),
        0
    );

    const subTotal = Number(roomRent) + meterTotal + otherTotal;

    const total =
        Number(roomRent) +
        meterTotal +
        otherTotal -
        deductionTotal;


    const generateInvoice = async () => {

        Alert.alert("Please Wait...")
        const upiURL = `upi://pay?pa=${upiId}&pn=HomeBills&am=${total}&cu=INR`;

        const qrBase64 = await new Promise((resolve, reject) => {
            if (!qrRef.current) {
                reject("QR not ready");
                return;
            }

            qrRef.current.toDataURL((data) => {
                resolve(data);
            });
        });

        const base64Images = await Promise.all(
            image.map(async (elem) => {
                const base64 = await RNFS.readFile(
                    elem.uri.replace("file://", ""),
                    "base64"
                )
                return {
                    ...elem,
                    base64
                }
            })
        )

        const html = `
            <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice</title>
</head>
<style>
    body{
        width: 90vw;
        margin: auto;
    }
    nav {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 30px;
    }

    .homeTitle {
        font-size: 32px;
        text-transform: uppercase;
        margin-left: 45px;
    }

    .billingDetails {
        display: flex;
        margin-top: 15px;
        justify-content: space-between;
        align-items: center;
        padding: 0px 55px;
    }

    .leftSideBillingDetails {
        display: flex;
        gap: 15px;
    }

    .billingDetailsContainer {
        width: 90vw;
        margin: auto;
        padding: 0px 15px;
        margin-top: 15px;
    }

    .billingDetailsTitle {
        color: purple;
    }

    .billingDetailsContainer {
        border-top: 2px solid purple;
    }
    .rightSideBillingDetails{
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    table {
        width: 100%;
        border-collapse: collapse;
    }

    thead th {
        text-align: left;
        font-size: 12px;
        letter-spacing: 0.5px;
        color: #4b3fa7;
        font-weight: 600;
        padding-bottom: 15px;
    }

    thead th.right {
        text-align: right;
    }

    tbody tr.item-row td {
        padding-top: 20px;
        padding-bottom: 12px;
        border-bottom: 1px solid #e5e5e5;
    }

    .item-title {
        font-size: 16px;
        font-weight: 500;
        color: #222;
    }
    .right {
        text-align: center;
    }
    .rate-cell{
        text-align: center;
    }
    .rightheader{
        text-align: center;
    }
    .rightmostheader{
        text-align: right;
    }
    .rightmostdata{
        text-align: right;
    }

    .tax-note {
        font-size: 12px;
        color: #888;
    }

    .summary-table {
        width: 100%;
        margin-top: 15px;
        border-collapse: collapse;
    }

    .summary-table td {
        padding: 6px 0;
        font-size: 14px;
    }

    .summary-table td.label {
        text-align: right;
        color: #333;
        padding-right: 40px;
    }

    .summary-table td.value {
        text-align: right;
        width: 140px;
    }

    .summary-table tr.total-row td {
        border-top: 1px solid #e5e5e5;
        padding-top: 12px;
    }

    thead tr p {
        font-size: 17px;
    }
    .attachImagePara{
        font-size:30px;
        font-weight:800
    }   
    
</style>

<body>
    <nav>
        <div class="homeImage">
            <img src="data:image/png;base64,${HOME_LOGO_BASE64}" alt="" srcset="" width="120px">
        </div>
        <div class="homeTitle">
            <p>${propertyName}</p>
        </div>
    </nav>
    <div class="billingDetails">
        <div class="leftSideBillingDetails">
            <div class="billedTo">
                <p class="billingDetailsTitle">Billed To</p>
                <p class="billingTitleInfo">${tenantName}</p>
            </div>
                <div class="dateIssued">
                    <p class="billingDetailsTitle">Date Issued</p>
                    <p class="billingTitleInfo">${new Date().toLocaleDateString("en-GB")}</p>
                </div>
                <div class="amountIssued">
                    <p class="billingDetailsTitle">Amount Due</p>
                    <p class="billingTitleInfo" style="font-weight: bold;">25000</p>
                </div>
        </div>
         <div class="rightSideBillingDetails">
         <a href="${upiURL}">
            <img
                src="data:image/png;base64,${qrBase64}"
                width="80"
                height="80"
            />
        </a>
           <p style="text-align: center; font-size:12px;  color: #4b3fa7;">Click or Scan QR to pay bill</p>
        </div>
    </div>
    <div class="billingDetailsContainer">
        <table>
            <thead>
                <tr>
                    <th style="width:50%;">
                        <p>DESCRIPTION</p>
                    </th>
                    <th class="rightheader">
                        <p>RATE</p>
                    </th>
                    <th class="rightheader">
                        <p>QTY</p>
                    </th>
                    <th class="rightmostheader">
                        <p>AMOUNT</p>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr class="item-row">
                    <td class="item-title">Room Rent</td>
                    <td class="rate-cell">-</td>
                    <td class="right">-</td>
                    <td class="rightmostdata">₹${Number(roomRent).toLocaleString("en-IN")}</td>
                </tr>

               ${meterData
                .map(
                    (elem) => `
      <tr class="item-row">
        <td class="item-title">${elem.serviceName}</td>
        <td class="rate-cell">₹${elem.rate}</td>
        <td class="right">
          <div>
            <p>Initial Reading: ${elem.initialReading}</p>
          </div>
          <div>
            <p>Final Reading: ${elem.finalReading}</p>
          </div>
        </td>
        <td class="rightmostdata">
          ₹${((Number(elem.finalReading) - Number(elem.initialReading)) * Number(elem.rate)).toLocaleString("en-IN")}
        </td>
      </tr>
    `
                )
                .join("")}

             ${otherData
                .map(
                    (elem) => `
      <tr class="item-row">
        <td class="item-title">${elem.otherServiceName}</td>
        <td class="rate-cell">-</td>
        <td class="right">-</td>
        <td class="rightmostdata">₹${Number(elem.price).toLocaleString("en-IN")}</td>
      </tr>
    `
                )
                .join("")}
            </tbody>
        </table>

        <table class="summary-table">
            <tr>
                <td class="label" colspan="3">Subtotal</td>
                <td class="value">₹${Number(subTotal).toLocaleString("en-IN")}</td>
            </tr>
            ${deducedCharge.
                map(
                    (elem) => `
                        <tr>
                <td class="label" colspan="3">${elem.deducedChargeName}</td>
                <td class="value">-₹${Number(elem.deduced).toLocaleString("en-IN")}</td>
            </tr>
                    `
                ).join("")
            }
            <tr class="total-row">
                <td class="label" colspan="3">Total</td>
                <td class="value">₹${Number(total).toLocaleString("en-IN")}</td>
            </tr>
            <tr>
                <td class="label" colspan="3">Deposit Requested</td>
                <td class="value">₹${Number(total).toLocaleString("en-IN")}</td>
            </tr>
        </table>
        <p style="color: #4b3fa7; font-weight: 800;">Terms</p>
        <p>
            Please pay within 5-7 days using QR code in your invoice
        </p>
    </div>
    <div class="imageSection">
   ${base64Images.length > 0 ? `
    <p style="font-size: 28px; color: #4b3fa7; font-weight: bolder; margin-top: 40px; margin-bottom: 30px;">
        <u>Attach Image</u>
    </p>
` : ""}
           <div class="imageContainer">
            ${base64Images
                .map(
                    (img) => `
      <img
        src="data:image/jpeg;base64,${img.base64}"
        width="250"
        height="250"
        style="margin:10px;"
      />
    `
                )
                .join("")
            }
           </div>
    </div >
</body >

</html >
    `

        try {
            const file = await generatePDF({
                html,
                fileName: `RoomRent-${Date.now()}`,
                directory: "Documents",
                base64: false,
            });

            const folderPath = `${RNFS.DownloadDirectoryPath}/HomeBills`;

            if (!(await RNFS.exists(folderPath))) {
                await RNFS.mkdir(folderPath);
            }

            const newPath = `${folderPath}/RoomRent-${Date.now()}.pdf`;

            await RNFS.moveFile(file.filePath, newPath);

            Alert.alert("PDF is Generated");
            setPdfPath(newPath);
            setPropertyName("");
            setTenantName("")
            setRoomRent("")
            setMeterData([])
            setOtherData([])
            setDeducedCharge([])
            setTimeout(() => {
                scrollRef.current?.scrollToEnd({ animated: true });
            }, 500);

        } catch (error) {
            Alert.alert(JSON.stringify(error));
        }

    }

    return (
        <ScrollView
            style={styles.container}
            ref={scrollRef}
        >
            <Navbar />
            <Goback navigation={navigation} />
            <View>
                <Text style={styles.labelText}>Property Name:</Text>
                <TextInput
                    placeholder="Enter Property Name"
                    placeholderTextColor="#94a3b8"
                    style={styles.inputText}
                    value={propertyName}
                    onChangeText={(text) =>
                        setPropertyName(text)
                    }
                />
                <Text style={styles.labelText}>Tenant Name:</Text>
                <TextInput
                    placeholder="Enter tenant name"
                    placeholderTextColor="#94a3b8"
                    style={styles.inputText}
                    value={tenantName}
                    onChangeText={(text) =>
                        setTenantName(text)
                    }
                />
                <Text style={styles.labelText}>Room Rent:</Text>
                <TextInput
                    placeholder="Enter Rent"
                    placeholderTextColor="#94a3b8"
                    keyboardType="numeric"
                    style={styles.inputText}
                    value={roomRent}
                    onChangeText={(text) =>
                        setRoomRent(text)
                    }
                />
                <Text style={styles.labelText}>
                    UPI ID:
                </Text>

                <TextInput
                    placeholder="example@upi"
                    placeholderTextColor="#94a3b8"
                    style={styles.inputText}
                    value={upiId}
                    onChangeText={(text) => setUpiId(text)}
                />
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
                <View>
                    <Pressable style={styles.deducedServiceBtn} onPress={addDeducedCard}>
                        <Text style={styles.deducedServiceBtnText}>Deduced Charge</Text>
                    </Pressable>
                    <View>
                        {deducedCharge.map((card) => (
                            <View key={card.id} style={styles.serviceCard}>

                                <Text style={styles.serviceCardText}>Enter Service Name:</Text>
                                <TextInput
                                    onChangeText={(text) =>
                                        updateDeducedCard(card.id, "deducedChargeName", text)
                                    }
                                    value={card.deducedChargeName}
                                    style={styles.serviceCardInput}
                                />

                                <Text style={styles.serviceCardText}>Cost :</Text>
                                <TextInput
                                    keyboardType="numeric"
                                    onChangeText={(text) =>
                                        updateDeducedCard(card.id, "deduced", text)
                                    }
                                    value={card.deduced}
                                    style={styles.serviceCardInput}
                                />
                                <Pressable onPress={() => removeDeducedCard(card.id)} style={styles.serviceCardRemoveBtn} >
                                    <Text style={styles.serviceCardRemoveBtnText}>Remove</Text>
                                </Pressable>
                            </View>
                        ))}
                    </View>
                </View>
                <View>
                    <Pressable style={styles.addImageBtn} onPress={pickImage}>
                        <Text style={styles.addImageBtnText}>Add Image</Text>
                    </Pressable>
                </View>
            </View>
            <View>
                <Pressable style={styles.generateBillBtn} onPress={generateInvoice}>
                    <Text style={styles.generateBillText}>Generate Bill</Text>
                </Pressable>
            </View>
            {pdfPath && (
                <View style={styles.previewContainer}>
                    <Text style={styles.previewTitle}>PDF Preview</Text>

                    <Pdf
                        source={{ uri: `file://${pdfPath}` }}
                        style={styles.pdf}
                        trustAllCerts={false}
                        onError={(error) => console.log(error)}
                    />

                    <Pressable
                        style={styles.shareBtn}
                        onPress={sharePDF}
                    >
                        <Text style={styles.shareBtnText}>
                            Share PDF
                        </Text>
                    </Pressable>
                </View>
            )}
            <View>
            </View>

            <View
                style={{
                    position: "absolute",
                    left: -9999,
                    top: -9999,
                }}
            >
                <QRCode
                    value={`upi://pay?pa=${upiId}&pn=HomeBills&am=${total}&cu=INR`}
                    size={220}
                    getRef={(ref) => {
                        qrRef.current = ref;
                    }}
                />
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
    deducedServiceBtn: {
        backgroundColor: "rgba(245, 158, 11, 0.2)",
        alignSelf: "flex-start",
        marginLeft: 16,
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 20,
        marginTop: 20,
        borderWidth: 1,
        borderColor: "rgba(245, 158, 11, 0.5)",
    },
    deducedServiceBtnText: {
        color: "#fbbf24",
        fontSize: 16,
        fontFamily: "sans-serif-medium",
        fontWeight: "700",
        textTransform: "capitalize",
        letterSpacing: 0.5,
    },
    addImageBtn: {
        backgroundColor: "rgba(56, 189, 248, 0.2)",
        alignSelf: "flex-start",
        marginLeft: 16,
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 20,
        marginTop: 20,
        borderWidth: 1,
        borderColor: "rgba(56, 189, 248, 0.5)",
    },
    addImageBtnText: {
        color: "#38bdf8",
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
    },
    previewContainer: {
        marginTop: 20,
        marginHorizontal: 16,
        marginBottom: 40,
        padding: 16,
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        borderRadius: 24,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.15)",
        alignItems: 'center',
    },
    previewTitle: {
        fontSize: 20,
        color: "#ffffff",
        fontFamily: "sans-serif-medium",
        fontWeight: "700",
        marginBottom: 16,
        letterSpacing: 0.5,
    },
    pdf: {
        width: '100%',
        height: 450,
        backgroundColor: '#ffffff',
        borderRadius: 12,
        marginBottom: 20,
    },
    shareBtn: {
        backgroundColor: "#10b981",
        width: "100%",
        alignItems: "center",
        paddingVertical: 16,
        borderRadius: 16,
        shadowColor: "#10b981",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    shareBtnText: {
        color: "#ffffff",
        fontSize: 16,
        fontFamily: "sans-serif-medium",
        fontWeight: "700",
        letterSpacing: 0.5,
    }
})