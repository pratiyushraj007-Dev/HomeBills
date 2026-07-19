import { View, StyleSheet, Pressable, Text } from "react-native";
import Pdf from "react-native-pdf";
import Share from "react-native-share";

const PdfViewer = ({ route }) => {
  const { path } = route.params;

  const sharePDF = async () => {
    try {
      await Share.open({
        url: `file://${path}`,
        type: "application/pdf",
        title: "Share Invoice",
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <Pdf
        source={{ uri: `file://${path}` }}
        style={styles.pdf}
      />

      <Pressable style={styles.shareBtn} onPress={sharePDF}>
        <Text style={styles.shareText}>Share PDF</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  pdf: { flex: 1, width: "100%" },
  shareBtn: {
    padding: 16,
    backgroundColor: "#6366f1",
    alignItems: "center",
  },
  shareText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default PdfViewer;