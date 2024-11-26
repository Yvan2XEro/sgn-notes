"use client";

import { AcademicConfigPayload } from "@/lib/form-schemas/academic-config";
import { calculateGrade, calculateMGP } from "@/lib/helpers/grades";
import { StyleSheet, Text, View } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  table: {
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderTopWidth: 0,
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
  bold: {
    fontWeight: "bold",
  },
});

interface SemesterTableProps {
  academicConfig: AcademicConfigPayload;
}

export const SemesterTable: React.FC<SemesterTableProps> = ({
  academicConfig,
}) => {
  const { teachingUnits } = academicConfig;

  // Calcul des totaux et des moyennes basés sur teachingUnits
  const totalCredits = teachingUnits.reduce(
    (sum, unit) => sum + unit.credits,
    0
  );
  const totalPoints = teachingUnits.reduce(
    (sum, unit) =>
      sum + unit.elements.reduce((subSum, el) => subSum + el.excelColumn, 0), // Placeholder: adapter au calcul réel
    0
  );
  const average = totalCredits > 0 ? totalPoints / totalCredits : 0;
  const mgp = average / 2; // Modifier selon vos règles
  const grade = mgp >= 3.5 ? "A" : mgp >= 3.0 ? "B" : "C";
  const decision = average >= 10 ? "SEMESTRE VALIDE" : "SEMESTRE NON VALIDE";

  return (
    <View style={styles.table}>
      <View style={styles.tableRow}>
        <View style={[styles.tableCol, { width: "100%" }]}> </View>
      </View>
      <View style={styles.tableRow}>
        <View style={[styles.tableCol, { width: "14%" }]}>
          <Text style={styles.tableCell}>RELEVE NIVEAU</Text>
        </View>
        <View style={[styles.tableCol, { width: "10%" }]}>
          <Text style={styles.tableCell}>SEMESTRE</Text>
        </View>
        <View style={[styles.tableCol, { width: "14%" }]}>
          <Text style={styles.tableCell}>TOTAL CREDIT/ 30</Text>
        </View>
        <View style={[styles.tableCol, { width: "24%" }]}>
          <Text style={styles.tableCell}>MOYENNE SEMESTRIELLE / 20</Text>
        </View>
        <View style={[styles.tableCol, { width: "10%" }]}>
          <Text style={styles.tableCell}>MGP</Text>
        </View>
        <View style={[styles.tableCol, { width: "10%" }]}>
          <Text style={styles.tableCell}>GRADE</Text>
        </View>
        <View style={[styles.tableCol, { width: "18%" }]}>
          <Text style={styles.tableCell}>DECISION DU JURY</Text>
        </View>
      </View>
      <View style={styles.tableRow}>
        <View style={[styles.tableCol, { width: "14%" }]}>
          <Text style={[styles.tableCell, styles.bold]}>
            {academicConfig.level}
          </Text>
        </View>
        <View style={[styles.tableCol, { width: "10%" }]}>
          <Text style={[styles.tableCell, styles.bold]}>3</Text>
        </View>
        <View style={[styles.tableCol, { width: "14%" }]}>
          <Text style={[styles.tableCell, styles.bold]}>{totalPoints}</Text>
        </View>
        <View style={[styles.tableCol, { width: "24%" }]}>
          <Text style={[styles.tableCell, styles.bold]}>
            {totalPoints.toFixed(2)}
          </Text>
        </View>
        <View style={[styles.tableCol, { width: "10%" }]}>
          <Text style={[styles.tableCell, styles.bold]}>
            {calculateMGP(calculateGrade(average))}
          </Text>
        </View>
        <View style={[styles.tableCol, { width: "10%" }]}>
          <Text style={[styles.tableCell, styles.bold]}>
            {calculateGrade(average)}
          </Text>
        </View>
        <View style={[styles.tableCol, { width: "18%" }]}>
          <Text style={[styles.tableCell, styles.bold]}>{decision}</Text>
        </View>
      </View>
    </View>
  );
};
