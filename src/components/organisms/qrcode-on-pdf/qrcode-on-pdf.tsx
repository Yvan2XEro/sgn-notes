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
import JSZip from "jszip";
import { PDFDocument } from "pdf-lib";
import React, { useRef, useState } from "react";
import pdfToText from "react-pdftotext";
import { useLocalStorage } from "usehooks-ts";
import * as XLSX from "xlsx";
import { A4PositionPicker } from "../a4-position-picker";

interface PdfInfo {
  file: File;
  text: string;
}

export const QrCodeOnPdf = () => {
  const [pdfFiles, setPdfFiles] = useState<PdfInfo[]>([]);
  const [excelData, setExcelData] = useState<StudentExcelRecord[]>([]);
  const [matriculeStatus, setMatriculeStatus] = useState<
    Record<string, { found: boolean; fileName?: string }>
  >({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processingProgress, setProcessingProgress] = useState<number>(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [position, setPosition] = useLocalStorage("qrcode-position", {
    x: 0,
    y: 0,
  });

  const handlePdfChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    setIsLoading(true);
    setError(null);
    const newPdfFiles: PdfInfo[] = [];
    const newMatriculeStatus: Record<
      string,
      { found: boolean; fileName?: string }
    > = {};

    try {
      for (const file of files) {
        if (file.type !== "application/pdf") {
          throw new Error(`Le fichier ${file.name} n'est pas un PDF valide`);
        }

        const text = await pdfToText(file);
        newPdfFiles.push({ file, text });

        excelData.forEach((student) => {
          if (text.toLowerCase().includes(student.MATRICULE.toLowerCase())) {
            newMatriculeStatus[student.MATRICULE] = {
              found: true,
              fileName: file.name,
            };
          }
        });
      }

      excelData.forEach((student) => {
        if (!newMatriculeStatus[student.MATRICULE]) {
          newMatriculeStatus[student.MATRICULE] = {
            found: false,
          };
        }
      });

      setPdfFiles(newPdfFiles);
      setMatriculeStatus(newMatriculeStatus);
    } catch (err) {
      console.error("Erreur lors de la lecture des PDFs", err);
      setError(`Erreur lors de la lecture des fichiers PDF: ${err.message}`);
    } finally {
      setIsLoading(false);
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

  const processAndDownloadAll = async () => {
    if (pdfFiles.length === 0) return;

    try {
      setIsLoading(true);
      const zip = new JSZip();
      let processedCount = 0;

      for (const student of excelData) {
        const status = matriculeStatus[student.MATRICULE];
        if (!status?.found) continue;

        const pdfFile = pdfFiles.find((pdf) =>
          pdf.text.toLowerCase().includes(student.MATRICULE.toLowerCase())
        );

        if (!pdfFile) continue;

        try {
          const qrCodeImage = await generateQrCode(student);
          const arrayBuffer = await pdfFile.file.arrayBuffer();
          const pdfDoc = await PDFDocument.load(arrayBuffer);

          const [firstPage] = pdfDoc.getPages();
          const qrCodeImageEmbed = await pdfDoc.embedPng(qrCodeImage);

          firstPage.drawImage(qrCodeImageEmbed, {
            x: position.x * 0.75,
            y: firstPage.getHeight() - position.y * 0.75 - 100,
            width: 100,
            height: 100,
          });

          const modifiedPdfBytes = await pdfDoc.save();
          zip.file(`${student.MATRICULE}_QRCode.pdf`, modifiedPdfBytes);

          processedCount++;
          setProcessingProgress((processedCount / excelData.length) * 100);
        } catch (err) {
          console.error(
            `Erreur lors du traitement du PDF pour ${student.MATRICULE}`,
            err
          );
        }
      }

      const zipContent = await zip.generateAsync({ type: "blob" });
      const url = window.URL.createObjectURL(zipContent);
      const link = document.createElement("a");
      link.href = url;
      link.download = "documents_with_qrcodes.zip";
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Erreur lors de la création du ZIP", err);
      setError("Erreur lors de la création du fichier ZIP");
    } finally {
      setIsLoading(false);
      setProcessingProgress(0);
    }
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Traitement PDF par lots et Ajout de QR Codes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Fichier Excel</Label>
            <Input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleExcelUpload}
              disabled={isLoading}
            />
          </div>
          <div>
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="w-full"
              disabled={isLoading || !excelData || excelData.length === 0}
            >
              Sélectionner les PDFs
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handlePdfChange}
              accept=".pdf"
              className="hidden"
              multiple
            />
            {pdfFiles.length > 0 && (
              <p className="mt-2 text-sm text-gray-600">
                {pdfFiles.length} fichier(s) sélectionné(s)
              </p>
            )}
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {isLoading && processingProgress > 0 && (
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${processingProgress}%` }}
              ></div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="mt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Matricule</TableHead>
              <TableHead>Statut</TableHead>
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
                  {matriculeStatus[student.MATRICULE]?.found ? (
                    <span className="text-green-600">
                      Trouvé dans: {matriculeStatus[student.MATRICULE].fileName}
                    </span>
                  ) : (
                    <span className="text-red-600">Non trouvé</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {excelData.length > 0 && pdfFiles.length > 0 && (
          <div className="mt-4">
            <Button
              onClick={processAndDownloadAll}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading
                ? "Traitement en cours..."
                : "Télécharger tous les PDFs avec QR Codes"}
            </Button>
          </div>
        )}
      </div>

      <A4PositionPicker value={position} onChange={setPosition} />
    </div>
  );
};
