import React from 'react'
import { Box, Typography } from '@mui/material'

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        width: "100%",
        backgroundColor: "#333",
        color: "#fff",
        textAlign: "center",
        py: 2,
        mt: "auto",
      }}
    >
      <Typography variant="body2">
        &copy; {new Date().getFullYear()} Travel | Created as a CU Boulder Capstone Project
      </Typography>
    </Box>
  )
}

export default Footer