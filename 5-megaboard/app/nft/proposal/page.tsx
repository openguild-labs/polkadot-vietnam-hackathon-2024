"use client"
import { sampleData } from "@/lib/SampleData";
import { ContractData } from "@/lib/type";
import React, { useState } from "react";
import { Table, Tag, Button } from 'antd';
import StepModal from "@/components/Checking/StepModal";
const getStatusTag = (status: number) => {
    switch (status) {
      case 0:
        return <Tag color="orange">Pending</Tag>;
      case 1:
        return <Tag color="green">Approved</Tag>;
      case 2:
        return <Tag color="red">Rejected</Tag>;
      default:
        return <Tag>Unknown</Tag>;
    }
  };
const contractData: ContractData[] = [
  {
    id: "1",
    billboard: sampleData[0],
    customerName: "Alice Johnson",
    customerAddress: "1234 Maple St, NY",
    customerWallet: "0x123...abc",
    contractId: "CON001",
    status: 0, // Pending
    startDate: sampleData[0].startDate!,
    endDate: sampleData[0].endDate!,
  },
  {
    id: "2",
    billboard: sampleData[0],
    customerName: "Bob Smith",
    customerAddress: "5678 Oak St, CA",
    customerWallet: "0x456...def",
    contractId: "CON002",
    status: 0, // Approved
    startDate: sampleData[1].startDate!,
    endDate: sampleData[1].endDate!,
  },
];
const Page: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedContract, setSelectedContract] = useState<ContractData | null>(
    null
  );

  const showModal = (contract: ContractData) => {
    setSelectedContract(contract);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedContract(null);
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
    },
    {
      title: "Customer's name",
      dataIndex: 'customerName',
      key: "customerName",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: number) => getStatusTag(status),
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: ContractData) => (
        <Button type="primary" onClick={() => showModal(record)}>
          View Details
        </Button>
      ),
    },
  ];

  return (
    <div className="w-full min-h-screen flex justify-center items-center">
      <Table
        dataSource={contractData}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 3 }}
        style={{ backgroundColor: "#f0f2f5", borderRadius: "12px" }}
      />
      {selectedContract && (
        <StepModal
          contract={selectedContract}
          isVisible={isModalVisible}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default Page;
