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
import { Upload } from "lucide-react";
import { PDFDocument } from "pdf-lib";
import { useRef, useState } from "react";
import pdfToText from "react-pdftotext";
import { useLocalStorage } from "usehooks-ts";
import * as XLSX from "xlsx";
import { A4PositionPicker } from "../a4-position-picker";

export const QrCodeOnPdf = () => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [searchText, setSearchText] = useState("");
  const [isTextFound, setIsTextFound] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [excelData, setExcelData] = useState<StudentExcelRecord[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [position, setPosition] = useLocalStorage("qrcode-position", {
    x: 0,
    y: 0,
  });

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
      setError(null);
      setIsTextFound(false);
    } else {
      setError("Veuillez sélectionner un fichier PDF valide");
      setPdfFile(null);
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];

          const jsonData = XLSX.utils.sheet_to_json(worksheet, {
            raw: true,
          }) as StudentExcelRecord[];

          const convertedData = jsonData.map((row) => {
            if (row["DATE DE NAISSANCE"] && typeof row["DATE DE NAISSANCE"] === "number") {
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
          console.log("Parsed Excel Data with DATE conversion:", convertedData);
        } catch (error) {
          console.error("Error parsing Excel file:", error);
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const searchInPDF = async (matricul: string) => {
    if (!pdfFile || !matricul) return;

    setIsLoading(true);
    setError(null);

    try {
      const text = await pdfToText(pdfFile);
      const found = text.toLocaleLowerCase().includes(matricul.toLowerCase());

      setIsTextFound(found);
      if (!found) {
        setError("Matricul non trouvé dans le document");
      }
    } catch (err) {
      setError("Erreur lors de la recherche dans le PDF");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const addQRCodeAndDownload = async () => {
    if (!pdfFile || !searchText || !isTextFound) return;

    try {
      setIsLoading(true);

      const data = {
        ETABLISSEMENT: "",
        NOM: "",
        PRENOM: "",
        MATRICULE: "",
        NIVEAU: "",
        SEMESTRE: "",
        "DATE DE NAISSANCE": "",
        "LIEU DE NAISSANCE": "",
        MOYENNE: 12,
        GRADE: "",
        MENTION: "",
      };
      const qrCodeImage = await generateQrCode(data);

      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);

      const [firstPage] = pdfDoc.getPages();
      const qrCodeImageEmbed = await pdfDoc.embedPng(qrCodeImage);

      if (!firstPage) return;

      firstPage.drawImage(qrCodeImageEmbed, {
        y: firstPage.getHeight() - position.y - 100,
        x: position.x + 0,
        width: 100,
        height: 100,
      });

      const modifiedPdfBytes = await pdfDoc.save();

      const blob = new Blob([modifiedPdfBytes], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `modified_${pdfFile.name}`;
      link.click();
      window.URL.revokeObjectURL(url);

      setIsLoading(false);
      setError(null);
    } catch (err) {
      setError("Erreur lors de la modification du PDF");
      console.error(err);
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="flex">
        <Card>
          <CardHeader>
            <CardTitle>Ajout du QR Code aux releves</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="w-full"
              >
                Sélectionner un releve PDF
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
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
              <div className="flex items-center space-x-2">
                <Input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileUpload}
                  className="flex-1"
                />
                <Button type="button" variant="outline" size="icon">
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
              <p>
                Importez le fichier Excel contenant les notes des étudiants.
              </p>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {isLoading && (
              <p className="text-center text-sm text-gray-600">
                Traitement en cours...
              </p>
            )}
          </CardContent>
        </Card>
      </div>
      <div className="w-full">
        {isTextFound && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Telecharger</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>
                  <Button
                    onClick={addQRCodeAndDownload}
                    disabled={isLoading}
                    className="w-full"
                  >
                    Télécharger avec QR Code
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        )}
      </div>
      <A4PositionPicker value={position} onChange={setPosition} />
    </div>
  );
};
