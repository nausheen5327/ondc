import React, { useEffect, useState } from "react";
import { CustomStackFullWidth } from "@/styled-components/CustomStyles.style";
import { Grid } from "lucide-react";
const GiftCard = () => {
  return (
    <CustomStackFullWidth
      spacing={2}
      sx={{
        minHeight: "53vh",
        // marginTop: "60px",
      }}
    >
      <p style={{ color: "white" }}>Hello giftcard</p>
    </CustomStackFullWidth>
  );
};

export default GiftCard;
