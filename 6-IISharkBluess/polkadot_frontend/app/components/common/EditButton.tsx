// import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { Box, Button, Modal, Typography } from '@mui/material'
// import React from 'react'

// function EditButton({ isOpen, setOpen }: { isOpen: boolean; setOpen: any ) {
//   return (
//     <Modal open={isOpen} onClose={setOpen}>
//       <Box sx={DialogStyle}>
//         <div
//           className="w-[30vw] flex justify-end cursor-pointer"
//           onClick={() => setOpen(false)}
//         >
//           <FontAwesomeIcon
//             icon={faCircleXmark}
//             style={{ color: "#eba937", width: 25, height: 40 }}
//           />
//         </div>
//         <div className=" h-[50%] flex justify-center items-center">
//           <img src="../images/logo.png" alt="" />
//         </div>
//         <Box
//           sx={{
//             width: "100%",
//             height: "10%",
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//           }}
//         >
//           <Typography id="modal-modal-description" sx={{ pb: 1, mr: 1 }}>
//             Name
//           </Typography>
//           <TextField
//             id="outlined-basic"
//             label="Type name"
//             variant="outlined"
//             onChange={(item) => setName(item.target.value)}
//             size="small"
//             required
//           />
//         </Box>
//         <Box
//           sx={{
//             width: "100%",
//             height: "10%",
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//           }}
//         >
//           <Typography id="modal-modal-description" sx={{ pb: 1, mr: 0.5 }}>
//             Asset tier
//           </Typography>
//           <TextField
//             id="outlined-basic"
//             label="Type lend amount"
//             variant="outlined"
//             onChange={(item) => setLendAmount(item.target.value)}
//             size="small"
//             required
//           />
//         </Box>
//         <Box
//           sx={{
//             width: "100%",
//             height: "10%",
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//           }}
//         >
//           <Typography id="modal-modal-description" sx={{ pb: 1, mr: 0.5 }}>
//             Expire
//           </Typography>
//           <TextField
//             id="outlined-basic"
//             label="Type expire"
//             variant="outlined"
//             onChange={(item) => setExpire(item.target.value)}
//             size="small"
//             required
//           />
//         </Box>
//         <Box
//           sx={{
//             width: "100%",
//             height: "10%",
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//           }}
//         >
//           <Typography id="modal-modal-description" sx={{ pb: 1, mr: 0.5 }}>
//             Interest rate
//           </Typography>
//           <TextField
//             id="outlined-basic"
//             label="Type interest rate"
//             variant="outlined"
//             onChange={(item) => setInterestRate(item.target.value)}
//             size="small"
//             required
//           />
//         </Box>
//         <InputCollateral
//           tokenInfo={tokenInfo}
//           lend_amount={Number(lendAmount)}
//           setAmount={setCollateralAmount}
//           decimals={lendToken.decimals}
//           mul_rate={health_ratio_thread}
//           div_rate={standard_uint}
//         />
//         <Button onClick={handleCreateFarm}>Create pool</Button>
//       </Box>
//     </Modal>
//   )
// }

// export default EditButton