# premaketdot
Phát triển một nền tảng cho phép người dùng dự báo xu hướng tài chính và nhận thưởng nếu dự đoán chính xác. Tính năng chính: Dữ liệu tài chính từ thị trường được lưu trữ và phân tích trên blockchain. Người dùng có thể đặt cược token dựa trên dự đoán của mình. Hệ thống thưởng token cho những người dự đoán chính xác xu hướng thị trường. 

# Finance Prediction Platform on Polkadot

Nền tảng dự đoán xu hướng tài chính phi tập trung xây dựng trên Polkadot, cho phép người dùng đặt cược token dựa trên dự đoán thị trường và nhận thưởng cho những dự đoán chính xác.

## 📑 Mục lục
- [Tổng quan](#tổng-quan)
- [Tính năng chính](#tính-năng-chính)
- [Kiến trúc hệ thống](#kiến-trúc-hệ-thống)
- [Công nghệ sử dụng](#công-nghệ-sử-dụng)
- [Cài đặt](#cài-đặt)
- [Hướng dẫn sử dụng](#hướng-dẫn-sử-dụng)
- [Đóng góp](#đóng-góp)
- [Giấy phép](#giấy-phép)

## 🎯 Tổng quan

Dự án này là một nền tảng dự đoán tài chính phi tập trung cho phép:
- Người dùng đặt cược token dựa trên dự đoán về xu hướng thị trường
- Phân tích dữ liệu tài chính thời gian thực trên blockchain
- Phân phối phần thưởng tự động và minh bạch cho những dự đoán chính xác

## ⭐ Tính năng chính

### 1. Quản lý dữ liệu tài chính
- Thu thập và lưu trữ dữ liệu thị trường trên chain
- Phân tích xu hướng thị trường tự động
- Cập nhật dữ liệu thời gian thực

### 2. Hệ thống dự đoán
- Giao diện trực quan để đặt dự đoán
- Nhiều loại dự đoán khác nhau (ngắn hạn, dài hạn)
- Theo dõi lịch sử dự đoán

### 3. Quản lý token và phần thưởng
- Smart contract quản lý đặt cược token
- Phân phối phần thưởng tự động
- Hệ thống xếp hạng người dùng

## 🏗 Kiến trúc hệ thống

```
├── contracts/           # Smart contracts 
├── pallets/            # Các pallet tùy chỉnh
├── runtime/            # Runtime configuration
├── node/               # Node implementation
└── frontend/           # Giao diện người dùng
```

## 🛠 Công nghệ sử dụng

- Substrate Framework
- Polkadot SDK
- Rust
- React.js
- Web3.js

## ⚙️ Cài đặt

1. Yêu cầu hệ thống:
```bash
- Rust và Cargo
- Node.js v14+
- Substrate
```

2. Clone repository:
```bash
git clone [https://github.com/President2000/premaketdot
cd fpremaketdot

```

3. Cài đặt dependencies:
```bash
# Cài đặt Rust dependencies
cargo build

# Cài đặt frontend dependencies
cd frontend
npm install
```

## 📖 Hướng dẫn sử dụng

1. Khởi động node:
```bash
cargo run --release -- --dev
```

2. Khởi động frontend:
```bash
cd frontend
npm start
```

## 🤝 Đóng góp

Chúng tôi hoan nghênh mọi đóng góp! Vui lòng:

1. Fork dự án
2. Tạo branch mới (`git checkout -b feature/AmazingFeature`)
3. Commit thay đổi (`git commit -m 'Add some AmazingFeature'`)
4. Push lên branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## 📝 Giấy phép

Dự án này được cấp phép theo giấy phép MIT - xem file [LICENSE](LICENSE) để biết thêm chi tiết.



## ⚠️ Lưu ý quan trọng

- Đây là phần mềm thử nghiệm, sử dụng với mục đích học tập
- Không sử dụng trong môi trường production khi chưa được audit
- Luôn backup dữ liệu và private key
