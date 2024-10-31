# DOTsee
 DOTsee hệ thống nhận dạng phi tập trung giúp người dùng kiểm soát và quản lý danh tính kỹ thuật số 

Smart Contract (Substrate pallet):

Lưu trữ và quản lý DID documents
Cho phép tạo, cập nhật và xóa DID
Quản lý quyền sở hữu DID
Hỗ trợ thêm các services vào DID

Frontend Application:
Kết nối với Polkadot wallet
Tạo và quản lý DID
Hiển thị thông tin DID
Cập nhật DID document

Các tính năng chính:
Quản lý danh tính phi tập trung:

Người dùng hoàn toàn kiểm soát DID của mình
DID được lưu trữ trên blockchain
Sử dụng public-key cryptography để bảo mật

Xác thực an toàn:

Sử dụng cặp khóa public/private
Hỗ trợ nhiều phương thức xác thực
Tích hợp với Polkadot wallet


Khả năng mở rộng:


Có thể thêm các services mới
Hỗ trợ nhiều loại credentials
Tương thích với các chuẩn DID

Để triển khai:

Cài đặt substrate node:

bashCopysubstrate-node-new my-did-node
cd my-did-node

Thêm pallet vào runtime:

Copy code smart contract vào pallets/did
Cấu hình trong runtime/src/lib.rs


Chạy frontend:

bashCopynpm install
npm start
Bạn có muốn tôi giải thích thêm về bất kỳ phần nào không?
