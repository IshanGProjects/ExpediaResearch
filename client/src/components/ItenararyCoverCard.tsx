import AspectRatio from "@mui/joy/AspectRatio";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import Typography from "@mui/joy/Typography";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Box from "@mui/joy/Box";

type ItineraryCardProps = {
  image: string; // Path like '/assets/pic.jpg' or remote URL
  title: string;
  location: string;
  description?: string;
};

export default function ItineraryCard({
  image,
  title,
  location,
  description,
}: ItineraryCardProps) {
  return (
    <Card variant="outlined" sx={{ width: 300, borderRadius: "lg" }}>
      <AspectRatio ratio="4/3" variant="plain" sx={{ borderRadius: "md" }}>
        <img
          src={image}
          alt={title}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: 8,
          }}
        />
      </AspectRatio>

      <CardContent>
        <Typography level="title-lg" fontWeight="lg" sx={{ mb: 0.5 }}>
          {title}
        </Typography>

        <Box display="flex" alignItems="center" gap={1} sx={{ mb: 1 }}>
          <LocationOnIcon fontSize="small" />
          <Typography level="body-sm">{location}</Typography>
        </Box>

        {description && (
          <Typography level="body-sm" color="neutral">
            {description}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
