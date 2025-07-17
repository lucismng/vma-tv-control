
# VMA TV Control

Một ứng dụng web mạnh mẽ để quản lý, kiểm tra và tổ chức các link stream của kênh truyền hình. Ứng dụng chạy hoàn toàn trên trình duyệt và lưu trữ tất cả dữ liệu của bạn cục bộ bằng `localStorage`.

## ✨ Tính năng nổi bật

*   **Quản lý Kênh:** Thêm, sửa, xóa các kênh truyền hình một cách dễ dàng.
*   **Import/Export M3U:** Nhập danh sách kênh từ file `.m3u` hoặc URL, và xuất danh sách của bạn ra file M3U tương thích.
*   **Phân nhóm Kênh:** Tổ chức các kênh của bạn vào các nhóm tùy chỉnh (ví dụ: Thể thao, Tin tức, Giải trí).
*   **Kiểm tra Trạng thái Stream:** Tự động kiểm tra xem một stream (HLS, YouTube) có đang hoạt động (Online) hay không (Offline).
*   **Tích hợp Lịch phát sóng (EPG):** Hỗ trợ hiển thị lịch phát sóng từ **nhiều nguồn URL XMLTV** cùng lúc. Dữ liệu sẽ được tự động tổng hợp.
*   **Chế độ xem EPG trực tiếp:** Xem lịch phát sóng chi tiết của một kênh ngay bên cạnh trình phát video trực tiếp.
*   **Giao diện Linh hoạt:** Chuyển đổi giữa chế độ xem Lưới (Grid) và Danh sách (List) để phù hợp với sở thích của bạn.
*   **Lưu trữ Cục bộ:** Toàn bộ dữ liệu được lưu an toàn trên trình duyệt của bạn, không cần máy chủ backend.

## 🚀 Công nghệ sử dụng

*   **Frontend:** [React](https://reactjs.org/) & [TypeScript](https://www.typescriptlang.org/)
*   **Build Tool:** [Vite](https://vitejs.dev/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **Video Player:** [Video.js](https://videojs.com/) với sự hỗ trợ cho HLS và YouTube, cung cấp một trình phát mạnh mẽ và có thể tùy chỉnh.
*   **Dữ liệu:** `localStorage` của trình duyệt.

## 🛠️ Hướng dẫn sử dụng

Ứng dụng được thiết kế để sử dụng ngay lập tức mà không cần cài đặt phức tạp.

1.  **Thêm Kênh:**
    *   Nhấn nút **"Thêm Kênh"**.
    *   Điền thông tin cần thiết: Tên kênh, URL stream, Logo (URL hoặc tải lên), và TVG-ID (để khớp với EPG).
    *   Trạng thái stream sẽ được tự động kiểm tra.

2.  **Import từ M3U:**
    *   Nhấn nút **"Import"** (biểu tượng upload).
    *   Bạn có thể dán URL của một file M3U hoặc tải lên một file từ máy tính của bạn.
    *   Các kênh và nhóm sẽ được tự động thêm vào danh sách của bạn.

3.  **Thiết lập Lịch phát sóng (EPG):**
    *   Vào mục **"Cài đặt"** ở thanh sidebar.
    *   Trong phần "Nguồn EPG", thêm một hoặc nhiều URL của các file XMLTV.
    *   Bạn có thể nhấn nút kiểm tra để xác thực từng URL, sau đó lưu lại.
    *   Chế độ xem "Lịch Phát Sóng" và thông tin EPG trên các kênh sẽ được kích hoạt với dữ liệu tổng hợp từ tất cả các nguồn.

## 🤝 Đóng góp

Mọi ý kiến đóng góp hoặc báo lỗi đều được hoan nghênh. Vui lòng tạo một "issue" trên kho chứa GitHub (nếu có) hoặc liên hệ với tác giả.
