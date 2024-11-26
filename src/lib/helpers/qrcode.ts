import QRCode from "qrcode";

interface QrCodePayload {
  scholl: string;
  name: string;
  surname: string;
  registrationNumber: string;
  birthDate: string;
  birthPlace: string;
  level: string;
  semester: string;
  avg: number | string;
  grade: string;
  appreciation: string;
}
export function getQrCodePayload({
  birthDate,
  birthPlace,
  level,
  name,
  registrationNumber,
  scholl,
  semester,
  surname,
  appreciation,
  avg,
  grade,
}: QrCodePayload) {
  return `
Etablissement: ${scholl}\n
Nom: ${name}\n
Prénom: ${surname}\n
Matricule: ${registrationNumber}\n
Date De Naissance: ${birthDate}\n
Lieu De Naissance: ${birthPlace}\n
Niveau: ${level}\n
Semestre: ${semester}\n
Moyenne: ${avg}\n
Grade: ${grade}\n
Mention: ${appreciation}
    `;
}

export type StudentExcelRecord = {
  ETABLISSEMENT: string;
  NOM: string;
  PRENOM: string;
  MATRICULE: string;
  "DATE DE NAISSANCE": string;
  "LIEU DE NAISSANCE": string;
  NIVEAU: string;
  SEMESTRE: string;
  MOYENNE: number | string;
  GRADE: string;
  MENTION: string;
};

export async function generateQrCode(payload: StudentExcelRecord) {
  const qrCodeDataURL = await QRCode.toDataURL(
    getQrCodePayload({
      appreciation: payload.MENTION,
      avg: payload.MOYENNE,
      birthDate: payload["DATE DE NAISSANCE"],
      birthPlace: payload["LIEU DE NAISSANCE"],
      grade: payload.GRADE,
      level: payload.NIVEAU,
      name: payload.NOM,
      registrationNumber: payload.MATRICULE,
      scholl: payload.ETABLISSEMENT,
      semester: payload.SEMESTRE,
      surname: payload.PRENOM,
    })
  );
  const qrCodeImage = await fetch(qrCodeDataURL).then((res) =>
    res.arrayBuffer()
  );
  return qrCodeImage;
}
