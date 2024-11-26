import { Table, TD, TH, TR } from "@ag-media/react-pdf-table";
import { StyleSheet, Text } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  cell: {
    width: "25%",
    alignItems: "center",
    lineHeight: 1,
    fontSize: 7,
    paddingVertical: 3,
    fontWeight: "bold",
    justifyContent: "center",
  },
});
export const GradeTable = () => {
  return (
    <>
      <Text style={{ fontWeight: "bold" }}>Grade Table</Text>
      <Table style={{ width: "100%" }}>
        <TH>
          <TD style={[styles.cell]}>Grade</TD>
          <TD style={[styles.cell]}>Note/4</TD>
          <TD style={[styles.cell]}>Appréciation</TD>
          <TD style={[styles.cell]}>Moy /20</TD>
        </TH>
        {[
          ["A+", "4.0", "Excellent", "[18-20]"],
          ["A", "3.7", "Très Bien", "[16-18["],
          ["B+", "3.3", "Bien", "[14-16["],
          ["B", "3.0", "Assez Bien", "[13-14["],
          ["B-", "2.7", "Assez Bien", "[12-13["],
          ["C+", "2.3", "Passable", "[11-12["],
          ["C", "2.0", "Passable", "[10-11["],
          ["C-", "1.7", "Insuffisant", "[09-10["],
          ["D", "1.3", "Faible", "[08-09["],
          ["E", "1.0", "Très Faible", "[06-08["],
          ["F", "0.0", "Nul", "[00-06["],
        ].map((row, rowIndex) => (
          <TR key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <TD key={cellIndex} style={[styles.cell]}>
                {cell}
              </TD>
            ))}
          </TR>
        ))}
      </Table>
    </>
  );
};
