import { AcademicConfigPayload } from "@/lib/form-schemas/academic-config";
import { StyleSheet, Text, View } from "@react-pdf/renderer";
import { StudentGrade } from "../academic-form/types";

interface TranscriptProps {
  formData: AcademicConfigPayload;
  studentGrades: StudentGrade;
}

const styles = StyleSheet.create({
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
    width: "12%", // Pour 6 colonnes
    alignItems: 'center',
    justifyContent: 'center',
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
  bold: {
    fontWeight: 'bold'
  }
});

export const TeachingUnitsTable = ({
  formData,
  studentGrades,
}: TranscriptProps) => {
  return (
    <View style={styles.table}>
      {/* En-tête du tableau */}
      <View style={[styles.tableRow, styles.tableHeader]}>
        <View style={[styles.tableCol, { width: "10%" }]}>
          <Text style={styles.tableCell}>CODE</Text>
        </View>
        <View style={[styles.tableCol, { width: "22%" }]}>
          <Text style={styles.tableCell}>UNITE D'ENSEIGNEMENT</Text>
        </View>
        <View style={[styles.tableCol, { width: "32%" }]}>
          <Text style={styles.tableCell}>ELEMENT CONSTITUTIF</Text>
        </View>
        <View style={[styles.tableCol, { width: "12%" }]}>
          <Text style={styles.tableCell}>NOTE/20</Text>
        </View>
        <View style={styles.tableCol}>
          <Text style={styles.tableCell}>MOYENNE</Text>
        </View>
        <View style={styles.tableCol}>
          <Text style={styles.tableCell}>CREDIT</Text>
        </View>
      </View>

      {/* Corps du tableau */}
      {formData.teachingUnits.map((teachingUnit, unitIndex) => {
        const totalScore = teachingUnit.elements.reduce(
          (sum, element) =>
            sum + (parseFloat(studentGrades[element.displayName] as any) || 0),
          0
        );
        const average = totalScore / teachingUnit.elements.length;

        // Créer une grande cellule pour l'unité qui englobe toutes les lignes de ses éléments
        return (
          <View key={unitIndex}>
            {teachingUnit.elements.map((element, elementIndex) => (
              <View
                key={elementIndex}
                style={[
                  styles.tableRow,
                  elementIndex === 0 ? styles.unitRow : {},
                ]}
              >
                {elementIndex === 0 ? (
                  <>
                    <View
                      style={[
                        styles.tableCol,
                        { width: "10%" },
                        { height: `${teachingUnit.elements.length * 100}%` },
                      ]}
                    >
                      <Text style={styles.tableCell}>{teachingUnit.code}</Text>
                    </View>
                    <View
                      style={[
                        styles.tableCol,
                        { width: "22%" },
                        { height: `${teachingUnit.elements.length * 100}%` },
                      ]}
                    >
                      <Text style={styles.tableCell}>{teachingUnit.name}</Text>
                    </View>
                  </>
                ) : null}
                <View
                  style={[
                    styles.tableCol,
                    { width: "32%" },
                    elementIndex !== 0 ? { marginLeft: "32%" } : {},
                  ]}
                >
                  <Text style={styles.tableCell}>{element.displayName}</Text>
                </View>
                <View style={[styles.tableCol,]}>
                  <Text style={styles.tableCell}>
                    {studentGrades[element.displayName]}
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    {elementIndex === 0 ? average.toFixed(2) : ""}
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    {elementIndex === 0 ? teachingUnit.credits : ""}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        );
      })}
    </View>
  );
};
