/* eslint-disable @typescript-eslint/no-unused-vars */
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
    createContext,
    PropsWithChildren,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";

const ToolbarCtx = createContext({
  title: "" as ReactNode,
  menu: (<></>) as ReactNode,
  setTitle: (_: ReactNode) => {},
  setMenu: (_: ReactNode) => {},
});

export const AppToolbarTitle = ({ children }: PropsWithChildren) => {
  const { setTitle } = useContext(ToolbarCtx);
  useEffect(() => setTitle(children), [children, setTitle]);
  return <></>;
};
export const AppToolbarMenu = ({ children }: PropsWithChildren) => {
  const { setMenu } = useContext(ToolbarCtx);
  useEffect(() => setMenu(children), [children, setMenu]);
  return <></>;
};

export function useAppToolbar() {
  const ctx = useContext(ToolbarCtx);
  if (!ctx)
    throw new Error("useAppToolbar must be used inside  ToolbarCtx.Provider");

  return ctx;
}

export const AppToolbarProvider = ({ children }: PropsWithChildren) => {
  const [title, setTitle] = useState<ReactNode>(<></>);
  const [menu, setMenu] = useState<ReactNode>(<></>);
  return (
    <ToolbarCtx.Provider
      value={{
        menu,
        setMenu,
        setTitle,
        title,
      }}
    >
      {children}
    </ToolbarCtx.Provider>
  );
};

export const AppToolbar = () => {
  const { menu, title } = useAppToolbar();
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background dark:border-gray-800 dark:bg-gray-950">
      <div className="container mx-auto flex h-12 items-center justify-between px-1">
        <div className="flex items-center gap-3">
          <SidebarTrigger />
          <h1 className="scroll-m-20 text-xl font-semibold tracking-tight">
            {title}
          </h1>
        </div>
        <div className="flex items-center gap-3">{menu}</div>
      </div>
    </header>
  );
};
