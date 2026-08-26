# Thông tin học viên

- Họ tên: Trần Hoàng Quân
- MSHV: 2A202601805
- Tên dự án: Education AI Tutor

# Decision note

Chúng tôi chọn **ARPU Base 80.000 VNĐ/user/tháng** vì đây là mức giá tương đối phù hợp với khả năng chi trả của sinh viên, đồng thời vẫn đủ để duy trì biên lợi nhuận cho một sản phẩm AI có chi phí inference liên tục. So với các nền tảng học tập quốc tế như Quizlet hoặc các công cụ AI study assistant có mức giá phổ biến vài USD đến hơn 10 USD/tháng, mức 80.000 VNĐ được đặt thấp hơn để phù hợp với thị trường Việt Nam. **CAC Base 150.000 VNĐ/khách** giả định sản phẩm tăng trưởng chủ yếu qua social media, referral, cộng đồng sinh viên và campus ambassador thay vì phụ thuộc hoàn toàn vào paid ads. Trong kịch bản tốt, CAC có thể giảm xuống 80.000 VNĐ; ngược lại, khi conversion thấp và cần chi nhiều hơn cho marketing, CAC có thể tăng lên 260.000 VNĐ.

Mô hình cũng tính riêng **AI Hidden Costs 10.000 VNĐ/user/tháng trong Base case**, bên cạnh 8.800 VNĐ API và 5.000 VNĐ infrastructure. Khoản này dùng cho xây dựng và duy trì evaluation set, kiểm tra chất lượng câu hỏi được sinh, labeling các trường hợp lỗi và cải thiện prompt/model. Team Product/AI sẽ thực hiện QA trên một mẫu output định kỳ hàng tuần; dữ liệu lỗi được tổng hợp hàng tháng và tiến hành một đợt đánh giá lớn khoảng **3 tháng/lần**. Fine-tuning hoặc retraining chỉ được thực hiện khi kết quả evaluation cho thấy chất lượng suy giảm hoặc xuất hiện nhóm lỗi lặp lại, tránh retrain cố định gây lãng phí chi phí.

Ở **Base case**, COGS là 23.800 VNĐ nên gross profit đạt **56.200 VNĐ/user/tháng**. Với churn 10%/tháng, thời gian sử dụng trung bình khoảng 10 tháng, tương ứng **LTV ≈ 562.000 VNĐ**, **LTV/CAC ≈ 3,75x** và **CAC Payback ≈ 2,7 tháng**. Đây là mức unit economics tương đối khỏe. Nếu kịch bản Pessimistic xảy ra với churn 15%, CAC 260.000 VNĐ và COGS 45.000 VNĐ, nhóm sẽ giảm paid marketing, thúc đẩy referral, giới hạn AI usage theo quota, tối ưu model/API rẻ hơn và ưu tiên cải thiện retention trước khi tiếp tục mở rộng acquisition.
