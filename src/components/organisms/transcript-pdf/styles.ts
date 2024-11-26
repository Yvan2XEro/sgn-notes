import { StyleSheet } from "@react-pdf/renderer";

export const styles = StyleSheet.create({
  tableCell: {
    padding: "1.5px 3px",
    fontSize: 8,
    lineHeight: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  table: {
    width: '100%',
    marginVertical: 10,
  },
  visibleCell: {
    backgroundColor: '#f8f9fa',
    padding: 5,
  },
  hiddenCell: {
    color: 'transparent',
    padding: 0,
    borderBottom: 'none',
    borderTop: 'none',
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
  },
  bold:{
    fontWeight: 'bold'
  }
});

export const styles2 = StyleSheet.create({
  table: {
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
  },
  tableHeader: {
    fontWeight: "bold",
  },
  tableCol: {
    width: "16.66%", // Pour 6 colonnes
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
  },
  tableCell: {
    fontSize: 7,
    lineHeight: 1.1,
  },
  unitRow: {},
});