import { AcademicConfigPayload } from "@/lib/form-schemas/academic-config";
import { Table, TD, TH, TR } from "@ag-media/react-pdf-table";
import { StudentGrade } from "../academic-form/types";
import { styles } from "./styles";

interface TranscriptProps {
  formData: AcademicConfigPayload;
  studentGrades: StudentGrade;
}
export const TeachingUnitsTable = ({
  formData,
  studentGrades,
}: TranscriptProps) => {
  const cellStyle = [
    styles.tableCell,
    { width: "10%", borderBottomWidth: 0 },
  ];
  const lastCellStyle = [
    styles.tableCell,
    { width: "10%" },
  ];
  return (
    <Table>
      <TH>
        <TD style={[styles.tableCell, { width: "10%" }]}>CODE</TD>
        <TD style={[styles.tableCell, { width: "25%" }]}>
          UNITE D'ENSEIGNEMENT
        </TD>
        <TD style={[styles.tableCell, { width: "25%" }]}>
          ELEMENT CONSTITUTIF
        </TD>
        <TD style={[styles.tableCell, { width: "15%" }]}>NOTE/20</TD>
        <TD style={[styles.tableCell, { width: "12.5%" }]}>MOYENNE</TD>
        <TD style={[styles.tableCell, { width: "12.5%" }]}>CREDIT</TD>
      </TH>
      {formData.teachingUnits.map((teachingUnit, unitIndex) => {
        const totalScore = teachingUnit.elements.reduce(
          (sum, element) =>
            sum + (parseFloat(studentGrades[element.displayName] as any) || 0),
          0
        );
        const average = totalScore / teachingUnit.elements.length;
        // const grade = calculateGrade(average);
        // const mgp = calculateMGP(grade);

        return (
          <>
            {/* Unit Table Content */}
            {teachingUnit.elements.map((element, elementIndex) => (
              <TR key={elementIndex}>
                <TD style={[styles.tableCell, { width: "10%" }]}>
                  {teachingUnit.code}
                </TD>
                <TD style={[styles.tableCell, { width: "25%" }]}>
                  {teachingUnit.name}
                </TD>
                <TD style={[styles.tableCell, { width: "25%" }]}>
                  {element.displayName}
                </TD>
                <TD style={[styles.tableCell, { width: "15%" }]}>
                  {studentGrades[element.displayName]}
                </TD>
                <TD style={[styles.tableCell, { width: "12.5%" }]}>
                  {elementIndex === 0 ? average.toFixed(2) : ""}
                </TD>
                <TD style={[styles.tableCell, { width: "12.5%" }]}>
                  {teachingUnit.credits}
                </TD>
              </TR>
            ))}
          </>
        );
      })}
    </Table>
  );
};
