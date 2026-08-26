/**
 * data.js - Data Source for Day 24 (AI Product Financial Model & Unit Economics Lab)
 */
const LAB_DATA = {
  totalDurationMinutes: 90,
  steps: [
    {
      id: "step-0",
      allocatedSeconds: 600, // 10 mins
      title: "Phase 0: Chốt Phạm Vi & Mô Hình Pricing",
      description: `
        <ul class="list-disc pl-5 space-y-2 mt-2">
          <li><strong>Mục tiêu:</strong> Xác định rõ thông tin bài toán và mô hình thu tiền trước khi nhập số.</li>
          <li>Khai báo 4 mục cốt lõi: Dự án đang build, Target Customer/Persona, TAM (Total Addressable Market).</li>
          <li>Lựa chọn 1 trong 4 mô hình thu tiền: <span class="text-emerald-400 font-bold">SaaS MRR, Consumption, Transactional, hoặc Hybrid</span>.</li>
          <li><strong class="text-amber-400">Khuyến nghị:</strong> Mô hình Hybrid (phí cố định + phí usage) là an toàn nhất để chống bẫy lỗ trên Power Users.</li>
        </ul>
      `,
      checkpoints: [
        "Xác định rõ Persona trả tiền và mô hình thu tiền.",
        "Ước tính quy mô TAM có nguồn căn cứ hoặc logic Top-down."
      ]
    },
    {
      id: "step-1",
      allocatedSeconds: 1200, // 20 mins
      title: "Phase 1: Giả Định Đầu Vào (Tab 1)",
      description: `
        <ul class="list-disc pl-5 space-y-2 mt-2">
          <li><strong>Mục tiêu:</strong> Điền 100% ô màu vàng cho cả 3 kịch bản (Optimistic, Base, Pessimistic).</li>
          <li>Điền ARPU, Adoption Rate, TAM, API Cost, Infrastructure, CAC, Churn, Fixed Costs và Initial Cash.</li>
          <li><strong class="text-rose-400">CẢNH BÁO CHI PHÍ ẨN:</strong> Bắt buộc điền <em>AI Hidden Costs</em> (Data Labeling, Retraining ~20%/năm, Human QA, Compliance).</li>
          <li>Quy tắc vàng: <span class="text-emerald-400 font-bold">AI Hidden Costs phải ≥ 30% API Cost</span>. Không được để bằng 0!</li>
        </ul>
      `,
      checkpoints: [
        "100% ô màu vàng ở Tab 1 cả 3 kịch bản đã được điền số.",
        "AI Hidden Costs >= 30% API Cost.",
        "Pessimistic Churn & CAC cao hơn Base ít nhất 1.5 lần."
      ]
    },
    {
      id: "step-2",
      allocatedSeconds: 900, // 15 mins
      title: "Phase 2: Kiểm Chứng Unit Economics (Tab 2)",
      description: `
        <ul class="list-disc pl-5 space-y-2 mt-2">
          <li><strong>Mục tiêu:</strong> Đảm bảo sức khỏe kinh tế đơn vị sản phẩm ở kịch bản Base.</li>
          <li>Bấm sang Tab 2 (Unit Economics), đối chiếu các chỉ số tự động tính:</li>
          <ul class="list-none pl-5 mt-2 space-y-1 text-sm text-slate-300">
            <li>• <strong class="text-white">Gross Margin %:</strong> ≥ 50% - 60% (LTV tính dựa trên Gross Margin).</li>
            <li>• <strong class="text-emerald-400 font-bold">LTV / CAC Ratio:</strong> > 3.0 (Tiêu chuẩn vàng VC).</li>
            <li>• <strong class="text-emerald-400 font-bold">CAC Payback Period:</strong> < 12 tháng.</li>
          </ul>
          <li>Nếu báo <span class="text-rose-400 font-bold">UNHEALTHY</span>: Quay lại Tab 1 tăng ARPU, giảm CAC hoặc giảm Churn.</li>
        </ul>
      `,
      checkpoints: [
        "Tab 2 cột Base trả ra kết quả HEALTHY.",
        "LTV/CAC > 3.0 và CAC Payback < 12 tháng."
      ]
    },
    {
      id: "step-3",
      allocatedSeconds: 1200, // 20 mins
      title: "Phase 3: Stress-test 3 Kịch Bản (Tab 3)",
      description: `
        <ul class="list-disc pl-5 space-y-2 mt-2">
          <li><strong>Mục tiêu:</strong> Kiểm tra dòng tiền và khả năng sống sót trong 24 tháng.</li>
          <li>Ở kịch bản <strong class="text-white">Base</strong>: Kiểm tra NPV > 0, IRR ≥ 20%, Project Payback < 24 tháng.</li>
          <li>Chuyển dropdown C4 sang <strong class="text-rose-400">Pessimistic</strong>: Kiểm tra dòng Cash Position.</li>
          <li><strong class="text-amber-400">Cốt lõi:</strong> Pessimistic Runway phải <span class="text-emerald-400 font-bold">≥ 12 tháng</span> (không âm tiền mặt trước Tháng 12).</li>
          <li>Nếu bị âm vốn: Cắt giảm chi phí cố định (Fixed Cost) hoặc tăng lượng vốn ban đầu.</li>
        </ul>
      `,
      checkpoints: [
        "Cột Base có NPV > 0 và IRR >= 20%.",
        "Đổi sang Pessimistic, Runway đạt ít nhất 12 tháng không bị âm tiền mặt."
      ]
    },
    {
      id: "step-4",
      allocatedSeconds: 1500, // 25 mins
      title: "Phase 4: Decision Note & Nộp Bài",
      description: `
        <ul class="list-disc pl-5 space-y-2 mt-2">
          <li><strong>Mục tiêu:</strong> Viết văn bản bảo vệ mô hình tài chính và hoàn thiện repo nộp bài.</li>
          <li>Viết đoạn <strong>Decision Note (200-300 từ)</strong> gồm 3 phần: (1) Căn cứ chọn ARPU & CAC, (2) Giải trình AI Hidden Costs, (3) Tóm tắt sức khỏe & Plan B khi biến cố xảy ra.</li>
          <li>Đối chiếu 6 lỗi kinh điển trước khi nộp.</li>
          <li>Hoàn thiện repo cá nhân tên: <code class="px-1.5 py-0.5 bg-black/50 border border-white/20 rounded font-mono text-emerald-400">Track1_Day24_MHV_HoVaTen</code> gồm file Excel và file README.md.</li>
        </ul>
      `,
      checkpoints: [
        "Decision Note có căn cứ/benchmark cụ thể bảo vệ các giả định.",
        "File Excel và README.md đã được upload lên repo nộp bài trước 13:00."
      ]
    }
  ]
};

window.LAB_DATA = LAB_DATA;
