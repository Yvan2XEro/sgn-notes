import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";

interface IProps {
  value: {
    x: number;
    y: number;
  };
  onChange: (p: { x: number; y: number }) => void;
}
export const A4PositionPicker = ({
  value: position,
  onChange: setPosition,
}: IProps) => {
  const handleDrag = (_: DraggableEvent, data: DraggableData) => {
    setPosition({ x: data.x, y: data.y });
  };
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>
          Choisir la position du QR Code ({position.x}, {position.y})
        </Button>
      </SheetTrigger>
      <SheetContent className="min-w-[70vw] max-h-screen py-4 overflow-y-auto">
        <div
          style={{
            width: "210mm", // A4 width
            height: "297mm", // A4 height
            border: "1px solid #ccc",
            position: "relative",
            overflow: "hidden",
            margin: "0 auto",
            backgroundColor: "#f9f9f9",
          }}
        >
          <Draggable
            bounds="parent"
            position={{ x: position.x, y: position.y }}
            onDrag={handleDrag}
          >
            <div
              style={{
                width: "100px", // Taille du carré draggable
                height: "100px",
                backgroundColor: "rgba(0, 123, 255, 0.5)",
                border: "1px solid #007bff",
                borderRadius: "4px",
                cursor: "move",
                position: "absolute",
              }}
            />
          </Draggable>
          <div
            style={{
              position: "absolute",
              bottom: "10px",
              left: "10px",
              fontSize: "12px",
              color: "#333",
            }}
          >
            <strong>Coordonnées:</strong> X: {position.x.toFixed(1)}, Y:{" "}
            {position.y.toFixed(1)}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
