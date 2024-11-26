import { useReadLocalStorage } from "usehooks-ts";
import "./App.css";
import { AppSidebar } from "./components/organisms/app-sidebar";
import {
  AppToolbar,
  AppToolbarProvider,
} from "./components/organisms/app-toolbar";
import { SidebarProvider } from "./components/ui/sidebar";
import { menuItems } from "./lib/constants/menu";

function App() {
  const path = useReadLocalStorage<string>("current_path");

  return (
    <SidebarProvider>
      <AppSidebar />
      <AppToolbarProvider>
        <main className="px-3 w-full">
          <AppToolbar />
          <div>{menuItems.find((m) => m.url === path)?.component}</div>
        </main>
      </AppToolbarProvider>
    </SidebarProvider>
  );
}

export default App;
