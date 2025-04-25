import React from "react";
import { Skeleton, Stack } from "@mui/material";

const CardSkeleton = () => {
  return (
    <Stack spacing={1} sx={{ width: "100%", minHeight: 250, maxWidth: 450 }}>
      <Skeleton variant="rectangular" height={170} sx={{ width: "100%" }} />
      <Skeleton variant="text" />
      <Skeleton variant="text" />
    </Stack>
  );
};

export default CardSkeleton;
