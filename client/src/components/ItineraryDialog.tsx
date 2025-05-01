import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemButton,
  Typography,
  TextField,
} from "@mui/material";
import axios from "axios";
import { useAuth } from "../context/AuthContent";
import { v4 as uuidv4 } from "uuid";

type SearchResult = {
  service: string;
  image: string;
  activity_name: string;
  time: string;
  date: string;
  location: string;
  details: string;
  link: string;
};

interface ItineraryDialogProps {
  open: boolean;
  onClose: () => void;
  cardData?: SearchResult;
}

// type Layer struct {
// 	ID       string                 `json:"id"`
// 	Type     string                 `json:"type"` // "text" or "image"
// 	Content  string                 `json:"content"`
// 	Position Position               `json:"position"`
// 	Style    Style                  `json:"style"`
// 	Metadata map[string]interface{} `json:"metadata,omitempty"`
// }

// type Layer = {
//   id: string;
//   type: string; // "text" or "image"
//   content: string;
//   position: { x: number; y: number };
//   style: {
//     fontSize: number;
//     fontFamily: string;
//     color: string;
//     zIndex: number;
//     width: number;
//   };
//   metadata: SearchResult;
// }

const ItineraryDialog: React.FC<ItineraryDialogProps> = ({
  open,
  onClose,
  cardData,
}) => {
  const [title, setTitle] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [image, setImage] = React.useState("");
  const { token } = useAuth();
  const [existingItineraries, setExistingItineraries] = React.useState<any[]>(
    []
  );

  // Fetch existing itineraries
  React.useEffect(() => {
    const fetchItineraries = async () => {
      try {
        if (!token || typeof token !== "string") {
          console.error("Token is missing, invalid, or not a string.");
          return;
        }

        const response = await axios.post("http://localhost:8000/itineraries", {
          userID: token.trim(),
        });
        setExistingItineraries(response.data || []);
        // if (response.data && response.data.Itinerary) {
        //   console.log("Fetched itineraries:", JSON.stringify(response.data.Itinerary, null, 2));
        // } else {
        //   console.warn("Itinerary data is undefined or null.");
        // }
      } catch (error) {
        console.error("Error fetching itineraries:", error);
      }
    };

    if (token) {
      fetchItineraries();
    }
  }, [token]);

  const handleSaveToExistingItinerary = async (itineraryId: string) => {
    try {
      await axios.put("http://localhost:8000/updatesubitinerary", {
        userID: String(token),
        itineraryID: String(itineraryId),
        layerID: layerID, // ERROR 
        layerData: {
          id: layerID, // ERROR
          type: "image",
          content: cardData?.activity_name ?? "Unnamed Activity",
          position: { x: 0, y: 0 },
          style: {
            fontSize: 16,
            fontFamily: "Arial",
            color: "#000000",
            zIndex: 1,
            width: 200,
          },
          metadata: cardData ?? {},
        },
      });
      console.log("Successfully updated itinerary.");
    } catch (err) {
      console.error("Error updating itinerary:", err);
    }
  };

  // TODO: add logic to save itinerary to db
  const handleCreateItinerary = () => {
    // handle endpoint
    const itineraryID = uuidv4(); // Generate a unique identifier
    const response = axios.put("http://localhost:8000/putitinerary", {
      userID: token,
      itineraryID: itineraryID,
      itinerary: {
        cover: {
          image: image,
          title: title,
          location: location,
          description: description,
        },
        layers: [
          {
            id: uuidv4(),
            type: "text",
            content: cardData?.activity_name,
            position: { x: 0, y: 0 },
            style: {
              fontSize: 16,
              fontFamily: "Arial",
              color: "#000000",
              zIndex: 1,
              width: 200,
            },
            metadata: cardData,
          },
        ],
      },
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Select or Create Itinerary</DialogTitle>
      <DialogContent>
        {/* Pick from exisiting itinerary */}
        <Typography>Select an existing itinerary:</Typography>
        {/* TODO: ADD LIST ITEM AND LOOP THROUGH EXISTING ITINERARIES */}
        <List>
          {existingItineraries.length > 0 ? (
            existingItineraries.map((itinerary) => (
              <ListItem key={itinerary.itineraryID}>
                <ListItemButton
                  onClick={() =>
                    handleSaveToExistingItinerary(itinerary.itineraryID)
                  }
                >
                  <Typography>{itinerary.cover.title}</Typography>
                </ListItemButton>
              </ListItem>
            ))
          ) : (
            <Typography>No existing itineraries found.</Typography>
          )}
        </List>

        {/* Creating New Itinerary*/}
        <Typography>Or create a new itinerary:</Typography>
        {/* Title */}
        <TextField
          variant="outlined"
          label="Title"
          fullWidth
          margin="dense"
          onChange={(e) => setTitle(e.target.value)}
          // sx={{ mt: 5 }}
        />

        {/* Location */}
        <TextField
          variant="outlined"
          label="Location"
          fullWidth
          margin="dense"
          onChange={(e) => setLocation(e.target.value)}
        />

        {/* Description */}
        <TextField
          variant="outlined"
          label="Description"
          fullWidth
          margin="dense"
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* Image */}
        <TextField
          variant="outlined"
          label="Image URL"
          fullWidth
          margin="dense"
          onChange={(e) => setImage(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        {/* Button to Cancel */}
        <Button onClick={onClose}>Cancel</Button>

        {/* Button to save Itinerary */}
        {/* TODO: ADD LOGIC TO CREATE AND SAVE ITINERARY */}
        <Button onClick={handleCreateItinerary} color="primary">
          Create & Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ItineraryDialog;
