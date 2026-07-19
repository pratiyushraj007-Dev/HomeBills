import { View, StyleSheet, FlatList, Pressable, Text } from "react-native";
import Navbar from "../components/Navbar";
import RNFS from "react-native-fs";
import { useEffect, useState } from "react";
import { FileText } from "lucide-react-native";

const History = ({navigation}) => {
    const [pdfFiles, setPdfFiles] = useState([]);
    const getPDFs = async () => {
        try {
            const folderPath = `${RNFS.DownloadDirectoryPath}/HomeBills`;

            const exists = await RNFS.exists(folderPath);

            if (!exists) {
                console.log("HomeBills folder not found");
                return;
            }

            const files = await RNFS.readDir(folderPath);

            const pdfs = files.filter(
                file => file.isFile() && file.name.endsWith(".pdf")
            );

            setPdfFiles(pdfs.reverse());

        } catch (error) {
            console.log("PDF Fetch Error:", error);
        }
    };

    useEffect(() => {
        getPDFs();
    }, []);


    return (
        <View style={styles.container}>
            <Navbar />
            <FlatList
                data={pdfFiles}
                keyExtractor={(item) => item.path}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                    <Pressable
                        style={styles.pdfItem}
                        onPress={() =>
                            navigation.navigate("PDFView", {
                                path: item.path,
                            })
                        }
                    >
                        <View style={styles.pdfIconContainer}>
                            <FileText size={24} color="#ffffff" />
                        </View>
                        <Text style={styles.pdfName} numberOfLines={1}>{item.name}</Text>
                    </Pressable>
                )}
            />
        </View>
    )
}

export default History

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0f172a",
    },
    listContent: {
        paddingTop: 16,
        paddingBottom: 20,
    },
    pdfItem: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#1e293b",
        padding: 16,
        marginHorizontal: 16,
        marginBottom: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#334155",
    },
    pdfIconContainer: {
        backgroundColor: "#ef4444",
        padding: 10,
        borderRadius: 8,
        marginRight: 16,
    },
    pdfName: {
        color: "#f1f5f9",
        fontSize: 16,
        fontWeight: "500",
        flex: 1,
    }
});