import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { standard_uint } from "@/const/pool.const";

function InputCollateral({
  tokenInfo,
  lend_amount,
  setAmount,
  interest_rate,
}: {
  tokenInfo: number[];
  lend_amount: number;
  setAmount: any;
  interest_rate: number;
}) {
  const collateral = tokenInfo[0] * lend_amount * interest_rate / tokenInfo[1];
  setAmount(collateral);

  return (
    <Box
      sx={{
        width: "100%",
        height: "10%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Typography id="modal-modal-description" sx={{ pb: 1, mr: 0.5 }}>
        Estimated collateral
      </Typography>
      <Typography id="modal-modal-description" sx={{ pb: 1, mr: 0.5 }}>
        {Number(collateral.toFixed(2))}
      </Typography>
    </Box>
  );
}

export default InputCollateral;
