"use client";
import { Button, message, Modal, Steps } from "antd";
import React, { useState } from "react";
import Pay from "./Pay";
import DetailInformation from "./DetailInformation";
import {
  CheckOutlined,
  CodeSandboxOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import OwnerConfirm from "./OwnerConfirm";
import { ContractData } from "@/lib/type";

interface StepModalProps {
  contract: ContractData;
  isVisible: boolean;
  onCancel: () => void;
}

const StepModal: React.FC<StepModalProps> = ({
  contract,
  isVisible,
  onCancel,
  
}) => {
  const [current, setCurrent] = useState(0);
  const next = () => {
    if (current < steps.length - 1) {
      setCurrent(current + 1);
    } else {
      message.success("Processing complete!");
    }
  };

  const prev = () => {
    if (current > 0) {
      setCurrent(current - 1);
    }
  };
  const steps = [
    {
      title: "Detail",
      component: <DetailInformation billboard={contract.billboard} customerName={contract.customerName} customerWallet={contract.customerWallet}/>,
      icon: <CodeSandboxOutlined />,
    },
    {
      title: "Owner's Confirm",
      component: <OwnerConfirm />,
      icon: <CheckOutlined />,
    },
    {
      title: "Pay",
      component: <Pay />,
      icon: <DollarOutlined />,
    },
  ];
  return (
    <Modal
      title="Processing"
      open={isVisible}
      onCancel={onCancel}
      footer={null}
      width={700} // Adjust modal width
      height={500}
      className="custom-modal"
    >
      <Steps
      className="mt-6"
        current={current}
        items={steps.map((step) => ({
          title: step.title,
          
        //   status: step.status,
          icon: step.icon,
        }))}
      />
      <div style={{ marginTop: 24, height: 300 }}>{steps[current].component}</div>
      <div className="flex gap-2 self-start">
        <div style={{ marginTop: 24 }}>
          {current < steps.length - 1 && (
            <Button type="primary" onClick={next}>
              Next
            </Button>
          )}
          {current > 0 && (
            <Button style={{ margin: "0 8px" }} onClick={prev}>
              Previous
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default StepModal;
