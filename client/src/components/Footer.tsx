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
        &copy; {new Date().getFullYear()} Expedia Travel. All rights reserved.
      </Typography>
    </Box>
  )
}

export default Footer