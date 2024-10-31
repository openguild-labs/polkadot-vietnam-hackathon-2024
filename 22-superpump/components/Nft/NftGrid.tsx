"use client"
import React, { useState } from "react";
import { Row, Col, Pagination } from "antd";
import { Billboard } from '@/lib/type';
import NftBillBoard from "./NftBillBoard";
interface Pros {
    dataCard: Billboard[];
  }
const NftGrid = ({ dataCard }: Pros) => {
    const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6; 
  const handleBooking = (id: string) => {
    // console.log("Booking billboard with ID:", id);
  };

  const paginatedBillboards = dataCard.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  return (
    <div className="mt-[64px] w-full overflow-hidden flex flex-col items-center">
      {/* Hiển thị billboard theo hàng */}
      <Row gutter={[32, 32]} className="flex-grow w-full p-3">
        {paginatedBillboards.map((billboard) => (
          <Col key={billboard.id} xs={24} sm={12} md={12} lg={8}>
            <NftBillBoard
              billboard={billboard}
            />
          </Col>
        ))}
      </Row>

      {/* Phân trang */}
      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={dataCard.length}
        onChange={(page) => setCurrentPage(page)}
        style={{ marginTop: "5px", textAlign: "center" }}
      />
    </div>
  )
}

export default NftGrid
