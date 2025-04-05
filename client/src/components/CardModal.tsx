import React from "react";
import { Modal, Typography, Button, Box, Divider, Stack } from "@mui/material";

type SearchResult = {
  image: string;
  activity_name: string;
  time: string;
  date: string;
  location: string;
  details: string;
  link: string;
};

interface CardModalProps {
  open: boolean;
  onClose: () => void;
  searchResult: SearchResult | null;
}

const CardModal: React.FC<CardModalProps> = ({
  open,
  onClose,
  searchResult,
}) => {
  if (!searchResult) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "80%", sm: 400 },
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}
      >
        {/* Title */}
        <Typography variant="h5" fontWeight={600} gutterBottom>
          {searchResult.activity_name}
        </Typography>

        <Divider sx={{ mb: 2 }} />

        {/* Details */}
        <Stack spacing={1}>
          <Typography variant="body1" fontWeight={500}>
            Details:
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {searchResult.details}
          </Typography>

          <Typography variant="body1" fontWeight={500} mt={2}>
            Location:
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {searchResult.location}
          </Typography>

          <Typography variant="body1" fontWeight={500} mt={2}>
            Date & Time:
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {searchResult.date} at {searchResult.time}
          </Typography>
        </Stack>
        <Button variant="contained" sx={{ mt: 2 }}>Save Event</Button>
      </Box>
    </Modal>
  );
};

export default CardModal;
