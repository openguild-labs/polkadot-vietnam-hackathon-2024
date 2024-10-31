# DotDocs on Polkadot

Một nền tảng thư viện phi tập trung được xây dựng trên Polkadot, cho phép chia sẻ và quản lý tài liệu số thông qua công nghệ blockchain và NFT.

## 📚 Tổng quan

Dự án DotDocs là một nền tảng cho phép:
- Chia sẻ và mua bán sách điện tử dưới dạng NFT
- Mượn sách thông qua hợp đồng thông minh với cơ chế tự động trả sách
- Nhận phần thưởng token cho việc đóng góp tài liệu học thuật có giá trị
- Giao dịch cross-chain thông qua Bifrost SPLx

## 🚀 Tính năng chính

- **Quản lý sách NFT**
  - Tạo và mint sách dưới dạng NFT
  - Lưu trữ metadata và nội dung sách an toàn
  - Chuyển nhượng quyền sở hữu

- **Hệ thống mượn sách**
  - Mượn sách với thời hạn xác định
  - Tự động trả sách qua smart contract
  - Theo dõi trạng thái mượn/trả

- **Token Rewards**
  - Phần thưởng cho người chia sẻ tài liệu
  - Hệ thống đánh giá chất lượng
  - Claim rewards tự động

## 🛠 Công nghệ sử dụng

- Substrate Framework
- Polkadot Network
- Bifrost SPLx Protocol
- IPFS (lưu trữ nội dung)
- Rust
- Node.js

## 📦 Cài đặt

1. Clone repository:
```bash
git clone https://github.com/tuantuho40/NewLibra/defi-library
cd defi-library
```

2. Cài đặt dependencies:
```bash
cargo build --release
```

3. Cấu hình môi trường:
```bash
cp .env.example .env
# Cập nhật các biến môi trường trong file .env
```

## 🔧 Cấu hình và Triển khai

1. **Cấu hình Substrate Node**
```bash
# Khởi động node trong chế độ development
./target/release/node-template --dev
```

2. **Triển khai Smart Contracts**
```bash
# Biên dịch contracts
cargo contract build

# Triển khai lên mạng thử nghiệm
cargo contract upload
```

3. **Cấu hình Bifrost SPLx**
- Thêm các thông số kết nối vào file config
- Cấu hình các bridge validators
- Thiết lập các tham số cross-chain

## 💻 Sử dụng

### Thêm sách mới
```rust
fn add_book(
    origin,
    title: Vec<u8>,
    content_hash: Vec<u8>,
    price: u128,
    metadata: NFTMetadata,
) -> DispatchResult
```

### Mượn sách
```rust
fn borrow_book(
    origin,
    book_hash: T::Hash,
    duration: u64
) -> DispatchResult
```

### Claim rewards
```rust
fn claim_rewards(origin) -> DispatchResult
```

## 🧪 Testing

Chạy các test:
```bash
cargo test
```

## 🤝 Đóng góp

Chúng tôi rất hoan nghênh mọi đóng góp! Hãy:

1. Fork dự án
2. Tạo branch mới (`git checkout -b feature/AmazingFeature`)
3. Commit thay đổi (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📄 License

Dự án được phân phối dưới giấy phép MIT. Xem `LICENSE` để biết thêm thông tin.


## 🙏 Cảm ơn

- Polkadot Network
- Substrate Framework
- Bifrost Protocol
- Cộng đồng Open Source

---
