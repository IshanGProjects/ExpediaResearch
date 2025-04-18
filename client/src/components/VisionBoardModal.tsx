import { Modal, ModalDialog } from "@mui/joy";
import Box from "@mui/joy/Box";
import ItineraryCoverCard from "./ItenararyCoverCard";
import Draggable from "react-draggable";

type Itinerary = {
  image: string;
  title: string;
  location: string;
  description?: string;
};

type VisionBoardModalProps = {
  open: boolean;
  onClose: () => void;
  itineraries: Itinerary[];
};

export default function VisionBoardModal({
  open,
  onClose,
  itineraries,
}: VisionBoardModalProps) {
  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog
        layout="fullscreen"
        sx={{
          overflow: "hidden",
          backgroundColor: "#fdfdfd",
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: "100%",
            position: "relative",
            overflow: "hidden",
            backgroundColor: "#f7f7f7",
          }}
        >
          {itineraries.map((item, index) => (
            <Draggable key={index} bounds="parent">
              <Box
                sx={{
                  position: "absolute",
                  cursor: "grab",
                  zIndex: 10,
                  width: 300,
                }}
              >
                <ItineraryCoverCard {...item} />
              </Box>
            </Draggable>
          ))}
        </Box>
      </ModalDialog>
    </Modal>
  );
}
