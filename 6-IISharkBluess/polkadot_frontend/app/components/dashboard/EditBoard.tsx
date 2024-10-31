import { DialogStyle } from "@/public/styles/styles";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Modal, TextField } from "@mui/material";
import Typography from "@mui/material/Typography";
import TokenMenu from "../farms/TokenMenu";
import { useState } from "react";
import { chainList } from "@/const";
import InputCollateral from "../common/InputCollateral";
import { Button } from "@headlessui/react";
import { health_ratio_thread, standard_uint } from "@/const/pool.const";
import { useWriteContract } from "wagmi";
import { pool_abis } from "@/common/abi/pool_abi";

function EditBoard({
  isOpen,
  setOpen,
  pool,
  index,
  lendObject,
  collateralObject,
}: {
  isOpen: boolean;
  setOpen: any;
  pool: any;
  index: number;
  lendObject: any;
  collateralObject: any;
}) {
  const [lendToken, setLendToken] = useState(chainList[0]);
  const [collateralToken, setCollateralToken] = useState(chainList[1]);
  const [lendPrice, setLendPrice] = useState<number>(0);
  const [collateralPrice, setCollateralPrice] = useState<number>(0);
  const [lendAmount, setLendAmount] = useState<string>("0");
  const [collateralAmount, setCollateralAmount] = useState<string>("0");
  const [interestRate, setInterestRate] = useState<string>("");
  const tokenInfo = [
    lendPrice * standard_uint,
    collateralPrice * standard_uint,
  ];
  const decimals = [lendObject.decimals, collateralObject.decimals];

  const { writeContractAsync } = useWriteContract();

  const handleEditPool = async () => {
    const execute = await writeContractAsync({
      abi: pool_abis,
      address: `0x${process.env.NEXT_PUBLIC_EVM_SMART_CONTRACT}`,
      functionName: "editPool",
      args: [
        index,
        BigInt(lendAmount),
        BigInt(interestRate),
        tokenInfo,
        decimals,
      ],
    });
  };
  return (
    <Modal open={isOpen} onClose={setOpen}>
      <Box sx={DialogStyle}>
        <div
          className="w-[30vw] flex justify-end cursor-pointer"
          onClick={() => setOpen(false)}
        >
          <FontAwesomeIcon
            icon={faCircleXmark}
            style={{ color: "#eba937", width: 25, height: 40 }}
          />
        </div>
        <div className=" h-[50%] flex justify-center items-center">
          <img src="../images/logo.png" alt="" />
        </div>
        <Box
          sx={{
            width: "100%",
            height: "10%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography id="modal-modal-description" sx={{ pb: 1, mr: 0.5 }}>
              Lend token
            </Typography>
            <TokenMenu
              selectedToken={lendObject}
              tokenType="LendToken"
              price={lendPrice}
              setPrice={setLendPrice}
              labelToken=""
            />
          </Box>
          <Box>
            <Typography id="modal-modal-description" sx={{ pb: 1, mr: 0.5 }}>
              Collateral token
            </Typography>
            <TokenMenu
              selectedToken={collateralObject}
              tokenType="CollateralToken"
              price={collateralPrice}
              setPrice={setCollateralPrice}
              labelToken=""
            />
          </Box>
        </Box>
        <Box
          sx={{
            width: "100%",
            height: "10%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography id="modal-modal-description" sx={{ pb: 1, mr: 1 }}>
            Name
          </Typography>
          <Typography>{pool.name}</Typography>
        </Box>
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
            Asset tier
          </Typography>
          <TextField
            id="outlined-basic"
            label="Type lend amount"
            variant="outlined"
            onChange={(item) => setLendAmount(item.target.value)}
            size="small"
            required
          />
        </Box>
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
            Expire
          </Typography>
          <Typography>{Number(pool.expire)}</Typography>
        </Box>
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
            Interest rate
          </Typography>
          <TextField
            id="outlined-basic"
            label="Type interest rate"
            variant="outlined"
            onChange={(item) => setInterestRate(item.target.value)}
            size="small"
            required
          />
        </Box>
        <InputCollateral
          tokenInfo={tokenInfo}
          lend_amount={Number(lendAmount)}
          setAmount={setCollateralAmount}
          interest_rate={health_ratio_thread}
        />
        <Button className=" font-semibold" onClick={() => handleEditPool()}>
          Change pool
        </Button>
      </Box>
    </Modal>
  );
}

export default EditBoard;
