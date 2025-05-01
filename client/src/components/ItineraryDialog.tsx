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

const ItineraryDialog: React.FC<ItineraryDialogProps> = ({
  open,
  onClose,
  cardData,
}) => {
  const [title, setTitle] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [image, setImage] = React.useState("");

  // TODO: add a way to get existing itineraries from db
  // useEffect maybe?


  // TODO: ADD LOGIC TO SAVE ACTIVITY TO EXISTING ITINERARY
  const handleSaveToExistingItinerary = (itineraryId: string) => {
    return;
  }

  // TODO: add logic to save itinerary to db
  const handleCreateItinerary = () => {
    console.log(title, location, description, image);
    console.log(cardData);

    // must send these layers information as well as title, location, description, image
    // id: string
    // type: text | image
    // content: string
    // position: {x: number, y: number}
    // style: { fontSize?: number, fontFamily?: string, color?: string, zIndex: number, width?: number }
    // metadata?: object [the card object (cardData)]
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Select or Create Itinerary</DialogTitle>
      <DialogContent>
        {/* Pick from exisiting itinerary */}
        <Typography>Select an existing itinerary:</Typography>
        {/* TODO: ADD LIST ITEM AND LOOP THROUGH EXISTING ITINERARIES */}


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
