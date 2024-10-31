import { Billboard } from '@/lib/type';
import { Button, Col, Form, Input, Row } from 'antd'
import React from 'react'
interface Pros{
    billboard: Billboard
    customerName:string,
    customerWallet:string
}
const DetailInformation = ({ billboard,customerName,customerWallet}:Pros) => {
  return (
    <div>
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
          {/* <Form layout="vertical" onFinish={()=>{}}>
            <Form.Item
              label="Customer name"
              name="customerName"
              rules={[{ required: true, message: 'Please input customer name!' }]}
            >
              <Input placeholder="Enter customer name" />
            </Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form> */}
          <p>Customer Name: <strong>{customerName}</strong></p>
          <p><span>Wallet Address:</span> <strong>{customerWallet}</strong></p>
        </Col>
      </Row>
    </div>
  )
}

export default DetailInformation
