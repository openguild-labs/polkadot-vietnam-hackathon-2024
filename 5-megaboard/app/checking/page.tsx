"use client"
import React, { useState } from 'react';
import { Table, Tag, Button } from 'antd';
import {  sampleData } from '@/lib/SampleData';
import { Billboard, ContractData } from '@/lib/type';

import StepModal from '@/components/Checking/StepModal';
import { useRouter } from 'next/navigation';
import { record } from 'zod';


const contractData: ContractData[] = [
  {
    id: '1',
    billboard: sampleData[0],
    customerName: 'Alice Johnson',
    customerAddress: '1234 Maple St, NY',
    customerWallet: '0x123...abc',
    contractId: 'CON001',
    status: 0, // Pending
    endDate:sampleData[0].endDate!,
    startDate:sampleData[0].startDate!
  },
  {
    id: '2',
    billboard: sampleData[1],
    customerName: 'Bob Smith',
    customerAddress: '5678 Oak St, CA',
    customerWallet: '0x456...def',
    contractId: 'CON002',
    status: 1, // Approved
    endDate:sampleData[1].endDate!,
    startDate:sampleData[1].startDate!
  },
  {
    id: '3',
    billboard: sampleData[2],
    customerName: 'Charlie Brown',
    customerAddress: '9101 Pine St, IL',
    customerWallet: '0x789...ghi',
    contractId: 'CON003',
    status: 2, // Rejected
    endDate:sampleData[2].endDate!,
    startDate:sampleData[2].startDate!
  },
  {
    id: '4',
    billboard: sampleData[3],
    customerName: 'Diana Prince',
    customerAddress: '1122 Cedar St, TX',
    customerWallet: '0xabc...jkl',
    contractId: 'CON004',
    status: 1, // Approved
    endDate:sampleData[3].endDate!,
    startDate:sampleData[3].startDate!
  },
];

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

const Page: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedContract, setSelectedContract] = useState<ContractData | null>(null);
  const router = useRouter()
  const showModal = (contract: ContractData) => {
    setSelectedContract(contract);
    setIsModalVisible(true);
  };
  const navigateTracking = ()=>{
    router.push('/tracking')
  }
  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedContract(null);
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      key: 'startDate',
    },
    {
      title: 'End Date',
      dataIndex: 'endDate',
      key: 'endDate',
    },
    {
      title: 'Address',
      dataIndex: ['billboard', 'address'],
      key: 'address',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: number) => getStatusTag(status),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: ContractData) => (
       <>
       <Button type="primary" size='small' onClick={() => showModal(record)}>
          View Details
        </Button>
        {record.status===1&&<Button style={{marginLeft:"4px"}} color='default' size='small' type="default" variant='solid' onClick={navigateTracking}>
          Tracking
        </Button>}
       </> 
      
        
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
        style={{ backgroundColor: '#f0f2f5', borderRadius: '12px' }}
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
