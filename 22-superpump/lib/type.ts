
export interface Billboard {
    id: string;             // ID của biển quảng cáo
    owner: string;          // Tên chủ sở hữu biển quảng cáo
    address: string;        // Địa chỉ biển quảng cáo
    imageUrl: string;       // Các hình ảnh của biển quảng cáo
    price: number|null;          // Giá thuê biển quảng cáo
    size: string|null;           // Kích thước biển quảng cáo
    country: string|null;        // Quốc gia
    city: string|null;           // Thành phố
    startDate: string|null;      // Ngày bắt đầu có sẵn
    endDate: string|null;        // Ngày kết thúc có sẵn
    ownerWallet: string|null;    // Địa chỉ ví của chủ sở hữu
    status: number|null;         // Trạng thái: 0: available, 1: unavailable
    isMint: boolean|null;        // Biển quảng cáo đã được mint chưa
    tokenId:number
  }
  export interface IProposal{
    customerName:string,
    customerWallet:string,
  }
  export interface ContractData {
    id: string;
    billboard: Billboard;
    customerName: string;
    customerAddress: string;
    customerWallet: string;
    contractId: string;
    status: number; // 0: pending, 1: approve, 2: reject
    startDate: string;
    endDate: string;
  }
  