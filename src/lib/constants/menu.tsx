import { QrCodeOnPdf } from "@/components/organisms/qrcode-on-pdf";
import {
  FileDownIcon,
  HelpCircleIcon,
  ListCheck,
  Settings2,
} from "lucide-react";

const menuItems = [
  {
    title: "Generer les releves",
    url: "receipts",
    icon: FileDownIcon,
    component: <></>,
    // component: <FullAcademicForm />,
  },
  {
    title: "Configurer les entetes",
    url: "settings",
    icon: Settings2,
    component: <></>,
    // component: <SettingsForm />,
  },
  {
    title: "Liste de matieres",
    url: "courses",
    icon: ListCheck,
    component: <></>,
  },
  {
    title: "Code Barre sur les releves",
    url: "qrcode",
    icon: HelpCircleIcon,
    component: <QrCodeOnPdf />,
  },
  {
    title: "Aide",
    url: "help",
    icon: HelpCircleIcon,
    component: <></>,
  },
];

export { menuItems };
