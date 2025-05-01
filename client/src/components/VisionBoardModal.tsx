import { Modal, ModalDialog } from "@mui/joy";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import Button from "@mui/joy/Button";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import Slider from "@mui/joy/Slider";
import Draggable from "react-draggable";
import { ChromePicker } from "react-color";
import { v4 as uuidv4 } from "uuid";
import React, { useState, useEffect, useRef } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import { useAuth } from "../context/AuthContent";
import axios from "axios";

// import DefaultRestaurantPic from "../assets/default_restaurant_1.jpeg";
// import DefaultRestaurantPic2 from "../assets/default_restaurant_2.jpeg";

// const visionBoardData = [
//   {
//     service: "Restaurants",
//     image: DefaultRestaurantPic,
//     activity_name: "Wine & Dine",
//     time: "7:00 PM",
//     date: "2025-07-18",
//     location: "Napa Valley",
//     details: "Romantic dinner in wine country.",
//     link: "#",
//   },
//   {
//     service: "Restaurants",
//     image: DefaultRestaurantPic2,
//     activity_name: "Seaside Brunch",
//     time: "10:30 AM",
//     date: "2025-07-19",
//     location: "Santa Monica",
//     details: "Brunch by the beach with mimosas.",
//     link: "#",
//   },
// ];

const defaultFonts = [
  "Arial",
  "Georgia",
  "Courier New",
  "Times New Roman",
  "Comic Sans MS",
];

interface VisionBoardModalProps {
  open: boolean;
  onClose: () => void;
  itineraryID: string;
}

export default function VisionBoardModal({
  open,
  onClose,
  itineraryID,
}: VisionBoardModalProps) {
  const [selectedCard, setSelectedCard] = useState<{
    service: string;
    image: string;
    activity_name: string;
    time: string;
    date: string;
    location: string;
    details: string;
    link: string;
  } | null>(null);
  interface Layer {
    id: string;
    type: string;
    content: string;
    position: { x: number; y: number };
    style: {
      fontSize?: number;
      fontFamily?: string;
      color?: string;
      zIndex: number;
      width?: number;
    };
    metadata?: any;
  }

  const [layers, setLayers] = useState<Layer[]>([]);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);
  const [showTools, setShowTools] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const toolRef = useRef(null);
  const canvasRef = useRef(null);
  const [existingCards, setExistingCards] = React.useState<any[]>([]);
  const { token } = useAuth();

  // Fetch existing cards
  React.useEffect(() => {
    const fetchCards = async () => {
      try {
        if (!token || typeof token !== "string") {
          console.error("Token is missing, invalid, or not a string.");
          return;
        }

        const response = await axios.post(
          "http://localhost:8000/getitinerarybyid",
          {
            userID: token.trim(),
            itineraryID: itineraryID,
          }
        );
        setExistingCards(response.data || []);
      } catch (error) {
        console.error("Error fetching itineraries:", error);
      }
    };

    if (token) {
      fetchCards();
    }
  }, [token, itineraryID]);

  const addTextLayer = () => {
    const id = uuidv4();
    setLayers((prev) => [
      ...prev,
      {
        id,
        type: "text",
        content: "New Text",
        position: { x: 150, y: 150 },
        style: {
          fontSize: 24,
          fontFamily: "Arial",
          color: "#000000",
          zIndex: prev.length + 1,
        },
      },
    ]);
    setSelectedLayerId(id);
    setShowTools(true);
    setIsSaved(false);
  };

  const updateSelectedLayerStyle = (key: string, value: any) => {
    setLayers((prev) =>
      prev.map((layer) =>
        layer.id === selectedLayerId
          ? { ...layer, style: { ...layer.style, [key]: value } }
          : layer
      )
    );
    setIsSaved(false);
  };

  const saveToFirestoreTemplate = async () => {
    const canvasPayload = {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      layers: layers.map(
        ({ id, type, content, position, style, metadata }) => ({
          id,
          type,
          content,
          position,
          style,
          metadata,
        })
      ),
    };
    console.log("Template save payload:", canvasPayload);
    setIsSaved(true);
  };

  const selectedLayer = layers.find((l) => l.id === selectedLayerId);

  useEffect(() => {
    if (open && layers.length === 0 && Array.isArray(existingCards)) {
      const preloadedLayers = existingCards.map((item, index) => ({
        id: uuidv4(),
        type: "image",
        content: item.image,
        position: { x: 100 + index * 30, y: 100 + index * 30 },
        style: { zIndex: index + 1, width: 150 },
        metadata: item,
      }));
      setLayers(preloadedLayers);
    }
  }, [open, layers.length, existingCards]);

  const handleDragStop = (id: string, data: { x: number; y: number }) => {
    const newPos = { x: data.x, y: data.y };
    setLayers((prev) =>
      prev.map((layer) =>
        layer.id === id ? { ...layer, position: newPos } : layer
      )
    );
    setIsSaved(false);
  };

  const handleCloseEditor = () => {
    if (!isSaved) {
      setShowExitConfirm(true);
    } else {
      onClose();
    }
  };

  const confirmExit = () => {
    setShowExitConfirm(false);
    onClose();
  };

  return (
    <>
      <Modal open={open} onClose={handleCloseEditor}>
        <ModalDialog layout="fullscreen" sx={{ overflow: "hidden" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              height: "100%",
              overflow: "hidden",
            }}
          >
            <Box
              ref={canvasRef}
              sx={{
                flex: 1,
                position: "relative",
                background: "#f7f7f7",
                overflow: "auto",
                touchAction: "none",
              }}
            >
              <Box
                sx={{ width: "2000px", height: "2000px", position: "relative" }}
              >
                {layers.map((layer) => {
                  const content = (
                    <Box
                      onClick={() => {
                        setSelectedLayerId(layer.id);
                        if (!showTools && layer.metadata)
                          setSelectedCard(layer.metadata);
                      }}
                      sx={{
                        position: "absolute",
                        zIndex: layer.style.zIndex,
                        fontSize: layer.style.fontSize,
                        fontFamily: layer.style.fontFamily,
                        color: layer.style.color,
                        border:
                          selectedLayerId === layer.id
                            ? "2px dashed #1976d2"
                            : "none",
                        p: 0.5,
                        pointerEvents: "auto",
                      }}
                    >
                      {layer.type === "text" ? (
                        <Box contentEditable suppressContentEditableWarning>
                          {layer.content}
                        </Box>
                      ) : (
                        <img
                          src={layer.content}
                          alt="Layer"
                          style={{ width: layer.style.width || 150 }}
                        />
                      )}
                    </Box>
                  );

                  return showTools ? (
                    <Draggable
                      key={layer.id}
                      position={layer.position}
                      onStop={(e, data) => handleDragStop(layer.id, data)}
                      enableUserSelectHack={false}
                    >
                      {content}
                    </Draggable>
                  ) : (
                    <Box
                      key={layer.id}
                      style={{
                        left: layer.position.x,
                        top: layer.position.y,
                        position: "absolute",
                      }}
                    >
                      {content}
                    </Box>
                  );
                })}
              </Box>
              <Box
                sx={{ position: "absolute", top: 16, left: "50%", zIndex: 999 }}
              >
                <Button
                  onClick={() => setShowTools((prev) => !prev)}
                  sx={{ backgroundColor: "#FFEE58", color: "black" }}
                >
                  {showTools ? "Hide Tools" : "Edit Canvas"}
                </Button>
              </Box>
              <Button
                onClick={saveToFirestoreTemplate}
                sx={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  zIndex: 999,
                  backgroundColor: "#FFEE58",
                  color: "black",
                }}
              >
                Save
              </Button>
              <Button
                onClick={handleCloseEditor}
                startDecorator={<ArrowBackIcon />}
                sx={{
                  backgroundColor: "#FFEE58",
                  color: "black",
                  position: "absolute",
                  top: 16,
                  left: 16,
                  zIndex: 999,
                }}
              >
                Back
              </Button>
            </Box>

            {showTools && (
              <Box
                ref={toolRef}
                sx={{
                  width: { xs: "100%", md: 280 },
                  height: { xs: "auto", md: "100%" },
                  p: 2,
                  borderTop: { xs: "1px solid #ccc", md: "none" },
                  borderLeft: { md: "1px solid #ccc" },
                  backgroundColor: "white",
                  zIndex: 998,
                }}
              >
                <Typography level="h4" mb={2}>
                  Vision Tools
                </Typography>
                <Button
                  onClick={addTextLayer}
                  fullWidth
                  sx={{ mb: 2, backgroundColor: "#FFEE58", color: "black" }}
                >
                  Add Text
                </Button>
                {selectedLayer && selectedLayer.type === "text" && (
                  <>
                    <Typography level="body-md">Font Size</Typography>
                    <Slider
                      value={selectedLayer.style.fontSize || 24}
                      onChange={(e, val) =>
                        updateSelectedLayerStyle("fontSize", val)
                      }
                      min={10}
                      max={72}
                      sx={{
                        "& .MuiSlider-thumb": {
                          borderColor: "#000000",
                          backgroundColor: "#000000",
                        },
                        "& .MuiSlider-track": { backgroundColor: "#FFEE58" },
                        "& .MuiSlider-rail": { backgroundColor: "#FFEE58" },
                      }}
                    />
                    <Typography level="body-md" sx={{ mt: 2 }}>
                      Font
                    </Typography>
                    <Select
                      value={selectedLayer.style.fontFamily}
                      onChange={(_, value) =>
                        updateSelectedLayerStyle("fontFamily", value)
                      }
                    >
                      {defaultFonts.map((font) => (
                        <Option key={font} value={font}>
                          {font}
                        </Option>
                      ))}
                    </Select>
                    <Typography level="body-md" sx={{ mt: 2 }}>
                      Color
                    </Typography>
                    <ChromePicker
                      color={selectedLayer.style.color}
                      onChangeComplete={(color) =>
                        updateSelectedLayerStyle("color", color.hex)
                      }
                      disableAlpha
                    />
                  </>
                )}
                {selectedLayer && selectedLayer.type === "image" && (
                  <>
                    <Typography level="body-md" sx={{ mt: 2 }}>
                      Image Width
                    </Typography>
                    <Slider
                      value={selectedLayer.style.width || 150}
                      onChange={(e, val) =>
                        updateSelectedLayerStyle("width", val)
                      }
                      min={50}
                      max={400}
                      sx={{
                        "& .MuiSlider-thumb": {
                          borderColor: "#000000",
                          backgroundColor: "#000000",
                        },
                        "& .MuiSlider-track": { backgroundColor: "#FFEE58" },
                        "& .MuiSlider-rail": { backgroundColor: "#FFEE58" },
                      }}
                    />
                  </>
                )}
              </Box>
            )}
          </Box>
        </ModalDialog>
      </Modal>

      {!showTools && (
        <Modal open={!!selectedCard} onClose={() => setSelectedCard(null)}>
          <ModalDialog sx={{ width: 350, borderRadius: "lg", p: 2 }}>
            {selectedCard && (
              <Box>
                <Typography level="title-md" fontWeight="lg" gutterBottom>
                  {selectedCard.activity_name}
                </Typography>
                <Typography level="body-sm" gutterBottom>
                  {selectedCard.location}
                </Typography>
                <Typography level="body-sm" color="neutral">
                  {selectedCard.date} at {selectedCard.time}
                </Typography>
              </Box>
            )}
          </ModalDialog>
        </Modal>
      )}

      <Dialog open={showExitConfirm} onClose={() => setShowExitConfirm(false)}>
        <DialogTitle>Exit without saving?</DialogTitle>
        <DialogActions>
          <Button
            onClick={() => setShowExitConfirm(false)}
            sx={{ backgroundColor: "#FFEE58", color: "black" }}
          >
            Cancel
          </Button>
          <Button color="danger" onClick={confirmExit}>
            Exit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
