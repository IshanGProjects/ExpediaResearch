import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid2";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import axios from "axios";

type ParsedActivity = {
  image: string;
  activity_name: string;
  time: string;
  date: string;
  location: string;
  details: string;
  link: string;
};

type ResponseData = {
  message: string;
  parsedActivities: ParsedActivity[];
};

const OpenAIFrontend = () => {
  const [prompt, setPrompt] = useState("");
  const [activities, setActivities] = useState<ParsedActivity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:8000/promptOpenAI",
        {
          prompt,
        }
      );
      const data = response.data;
      setActivities(data.parsedActivities);
    } catch (error) {
      setError("Error getting activities");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Grid container spacing={2} paddingTop={4}>
        <Grid size={4} display="flex" justifyContent="center">
          {/* Left Grid Area */}
          <Stack
            component="form"
            sx={{ width: "25ch" }}
            spacing={2}
            noValidate
            autoComplete="off"
          >
            <TextField
              id="user-input-text"
              label="Travel Prompt"
              placeholder="Enter a travel related prompt"
              multiline
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              size="medium"
            />

            <Button
              variant="contained"
              size="large"
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </Stack>
        </Grid>

        {/* Right Grid Area */}
        <Grid size={8} display="flex" justifyContent="center" paddingRight={3}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Image</TableCell>
                  <TableCell align="right">Activity Name</TableCell>
                  <TableCell align="right">Time</TableCell>
                  <TableCell align="right">Date</TableCell>
                  <TableCell align="right">Location</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {activities.map((activity) => (
                    <TableRow key={activity.activity_name}>
                      <TableCell component="th" scope="row">
                        <img src={activity.image} alt={activity.activity_name} style={{ width: "200px" }} />
                      </TableCell>
                      <TableCell align="right">{activity.activity_name}</TableCell>
                      <TableCell align="right">{activity.time}</TableCell>
                      <TableCell align="right">{activity.date}</TableCell>
                      <TableCell align="right">{activity.location}</TableCell>
                    </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </>
  );
};

export default OpenAIFrontend;
