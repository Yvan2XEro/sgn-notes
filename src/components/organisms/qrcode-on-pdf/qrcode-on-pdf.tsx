import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { generateQrCode, StudentExcelRecord } from "@/lib/helpers/qrcode";
import { PDFDocument } from "pdf-lib";
import { useRef, useState } from "react";
import pdfToText from "react-pdftotext";
import { useLocalStorage } from "usehooks-ts";
import * as XLSX from "xlsx";
import { A4PositionPicker } from "../a4-position-picker";

export const QrCodeOnPdf = () => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [excelData, setExcelData] = useState<StudentExcelRecord[]>([]);
  const [matriculeStatus, setMatriculeStatus] = useState<
    Record<string, boolean>
  >({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [position, setPosition] = useLocalStorage("qrcode-position", {
    x: 0,
    y: 0,
  });

  const handlePdfChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
      setError(null);

      try {
        const text = await pdfToText(file);
        const updatedStatus: Record<string, boolean> = {};

        excelData.forEach((student) => {
          updatedStatus[student.MATRICULE] = text
            .toLowerCase()
            .includes(student.MATRICULE.toLowerCase());
        });

        setMatriculeStatus(updatedStatus);
      } catch (err) {
        console.error("Erreur lors de la lecture du PDF", err);
        setError("Erreur lors de la lecture du fichier PDF");
      }
    } else {
      setError("Veuillez sélectionner un fichier PDF valide");
      setPdfFile(null);
    }
  };

  const handleExcelUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];

          const jsonData = XLSX.utils.sheet_to_json(worksheet, {
            raw: true,
          }) as StudentExcelRecord[];

          const convertedData = jsonData.map((row) => {
            if (!row["MATRICULE"] && (row as any)["MAT"]) {
              row["MATRICULE"] = (row as any)["MAT"];
            }
            if (
              row["DATE DE NAISSANCE"] &&
              typeof row["DATE DE NAISSANCE"] === "number"
            ) {
              const date = XLSX.SSF.parse_date_code(row["DATE DE NAISSANCE"]);
              if (date) {
                const formattedDate = `${String(date.d).padStart(
                  2,
                  "0"
                )}/${String(date.m).padStart(2, "0")}/${date.y}`;
                row["DATE DE NAISSANCE"] = formattedDate;
              }
            }
            return row;
          });

          setExcelData(convertedData);
          setMatriculeStatus({});
        } catch (err) {
          console.error("Erreur lors de la lecture du fichier Excel", err);
          setError("Erreur lors de la lecture du fichier Excel");
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const addQRCodeAndDownload = async (student: StudentExcelRecord) => {
    if (!pdfFile) return;

    try {
      setIsLoading(true);
      const qrCodeImage = await generateQrCode(student);

      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);

      const [firstPage] = pdfDoc.getPages();
      const qrCodeImageEmbed = await pdfDoc.embedPng(qrCodeImage);

      firstPage.drawImage(qrCodeImageEmbed, {
        x: position.x,
        y: firstPage.getHeight() - position.y - 100,
        width: 100,
        height: 100,
      });

      const modifiedPdfBytes = await pdfDoc.save();

      const blob = new Blob([modifiedPdfBytes], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${student.MATRICULE}_QRCode.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);

      setIsLoading(false);
    } catch (err) {
      console.error("Erreur lors de la modification du PDF", err);
      setError("Erreur lors de la modification du PDF");
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Recherche PDF et Ajout de QR Code</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="w-full"
            >
              Sélectionner un PDF
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handlePdfChange}
              accept=".pdf"
              className="hidden"
            />
            {pdfFile && (
              <p className="mt-2 text-sm text-gray-600">
                Fichier sélectionné: {pdfFile.name}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label>Fichier Excel</Label>
            <Input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleExcelUpload}
            />
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <div className="mt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Matricule</TableHead>
              <TableHead>Télécharger</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {excelData.map((student) => (
              <TableRow key={student.MATRICULE}>
                <TableCell>
                  {student.NOM} {student.PRENOM}
                </TableCell>
                <TableCell>{student.MATRICULE}</TableCell>
                <TableCell>
                  <Button
                    onClick={() => addQRCodeAndDownload(student)}
                    disabled={!matriculeStatus[student.MATRICULE] || isLoading}
                    className="w-full"
                    size={"sm"}
                  >
                    {matriculeStatus[student.MATRICULE]
                      ? "Télécharger avec QR Code"
                      : "Non trouvé"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <A4PositionPicker value={position} onChange={setPosition} />
    </div>
  );
};
