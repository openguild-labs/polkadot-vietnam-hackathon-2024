import React from 'react';
import { Modal, Form, Input, Row, Col, Button, DatePicker, message } from 'antd';
import { Billboard } from '@/lib/type';
import dayjs from "dayjs";
import { useAccount, useChainId, useWriteContract } from "wagmi";
import {
  CONTRACT_NFT_ADDRESS_MOONBEAM,
  BLOCK_EXPLORER_MOONBEAM,
  BLOCK_EXPLORER_BAOBAB,
  CHAINID,
 
} from "@/components/contract";
import { erc20Abi } from "@/components/erc20-abi";
interface BookingModalProps {
  billboard: Billboard;
  isVisible: boolean;
  onCancel: () => void;
  // onSubmit: (values: any) => void;
}
const { RangePicker } = DatePicker;

const BookingModal: React.FC<BookingModalProps> = ({ billboard, isVisible, onCancel }) => {
  // const account = useAccount();
  // const chainId = useChainId();
  // let blockexplorer: string;
  // let tokenAddress: `0x${string}`;
  // const { data: hash, writeContract } = useWriteContract();

  const account = useAccount();
  const chainId = useChainId();
  const [form] = Form.useForm();
  const { data: hash, writeContract } = useWriteContract();

  let blockexplorer: string;
  let tokenAddress: `0x${string}`;
  console.log(chainId)

  switch (chainId) {
    case CHAINID.BAOBAB:
      tokenAddress = CONTRACT_NFT_ADDRESS_MOONBEAM;
      blockexplorer = BLOCK_EXPLORER_BAOBAB;
      break;
    case CHAINID.MOONBEAM:
      tokenAddress = CONTRACT_NFT_ADDRESS_MOONBEAM;
      blockexplorer = BLOCK_EXPLORER_MOONBEAM;
      break;
    default:
      throw new Error("Network not supported");
  }
  const onSubmit = async (values: any) => {
    if (account.address) {
      await writeContract({
        abi: erc20Abi,
        address: tokenAddress,
        functionName: "booking_OOH_NFT",
        args: [
          account.address as `0x${string}`,
          billboard.ownerWallet! as `0x${string}`,
          billboard.address,
          BigInt(1),
          BigInt(billboard.tokenId),
        ],
      });
      message.success("Booking success")
      onCancel()
    }
  };
  // switch (chainId) {
  //   case CHAINID.BAOBAB:
  //     blockexplorer = BLOCK_EXPLORER_BAOBAB;
  //     break;
  //   case CHAINID.MOONBEAM:
  //     tokenAddress = CONTRACT_NFT_ADDRESS_MOONBEAM;
  //     blockexplorer = BLOCK_EXPLORER_MOONBEAM;
  //     break;
  //   default:
  //     throw new Error("Network not supported");
  // }
  return (
    <Modal
      title="Booking Form"
      open={isVisible}
      onCancel={onCancel}
      footer={null}
      width={700}  // Adjust modal width
      className="custom-modal"
    >
      <Row gutter={16}>
        <Col span={12}>
          <img src={billboard.imageUrl} alt="Billboard" style={{ width: '100%' }} />
        </Col>
        <Col span={12}>
        <div className='flex flex-col gap-1'>
        <p><span>Address:</span> <strong>{billboard.address}</strong></p>
          <p><span>Country:</span> <strong>{billboard.country}</strong></p>
          <p><span>City:</span> <strong>{billboard.city}</strong></p>
          <p><span>Start Date:</span> <strong>{billboard.startDate}</strong></p>
          <p><span>End Date:</span> <strong>{billboard.endDate}</strong></p>
          <p><span>Size:</span> <strong>{billboard.size}</strong></p>
          <p><span>Price:</span> <strong>{billboard.price}</strong></p>

        </div>
         
        </Col>
      </Row>
      <Row gutter={16} style={{ marginTop: '20px' }}>
        <Col span={12}>
          <p>Owner Name: <strong>{billboard.owner}</strong></p>
          <p><span>Wallet Address:</span> <strong>{billboard.ownerWallet}</strong></p>
        </Col>
        <Col span={12}>
          <Form layout="vertical" onFinish={onSubmit}>
            <Form.Item
              label="Customer wallet"
              name="customerWallet"
              initialValue={account.address}
              rules={[{ required: true, message: 'Please input customer wallet!' }]}
            >
              <Input placeholder="Enter customer wallet" />
            </Form.Item>
            <Form.Item
          name="dateRange"
          label={<label style={{ color: "black" }}>Select Date Range</label>}
          rules={[{ required: true, message: "Please select a date range!" }]}
        >
          <RangePicker
            format="YYYY-MM-DD"
            disabledDate={(current) =>
              current && current < dayjs().startOf("day")
            }
            className="w-full"
          />
        </Form.Item>

            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form>
        </Col>
      </Row>
    </Modal>
  );
};

export default BookingModal;
