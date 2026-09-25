import React from "react";
import type { Metadata } from "next";
import "./landingpage.css";
import LandingPageInteractive from "./LandingPageInteractive";
import LandingHero3D from "./LandingHero3D";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const isJa = params.locale === "ja";
  return {
    title: isJa
      ? "KONTUR — 建築設計・3DCG空間ビジュアライゼーション"
      : "KONTUR — Kiến Trúc & Diễn Họa 3D Chuẩn Kỹ Thuật",
    description:
      "Giải pháp thiết kế kiến trúc chuẩn kỹ thuật và diễn họa 3D không gian sống chân thực 100%. Giúp bạn hình dung trọn vẹn, kiểm soát chi phí và tránh sai sót thi công.",
  };
}

export default function LandingPage() {
  return (
    <div className="landingpage-root">
      <LandingPageInteractive />
      

    
    <LandingHero3D />

    <section className="pain-points-section" id="quy-trinh">
      <div className="content-container">

        <div className="section-title-split reveal-item">
          <div className="title-left">
            <span className="sec-eyebrow">01. THỰC TRẠNG THƯỜNG GẶP</span>
            <h2 className="sec-main-title">
              NỖI ĐAU CỦA BẠN KHI XÂY DỰNG &amp; TÌM KIẾM ĐỐI TÁC
            </h2>
          </div>
          <div className="title-right">
            <p className="sec-subtitle">
              Rất nhiều gia chủ và nhà thầu gặp rắc rối vì hình ảnh phối cảnh không đồng bộ với hồ sơ thi công, dẫn đến
              lãng phí thời gian và đội chi phí hàng trăm triệu.
            </p>
          </div>
        </div>

        
        <div className="pain-cards-grid" id="painCardsGrid">

          
          <div className="pain-card reveal-item delay-0 active-crossfade" data-index="0">
            <div className="pain-card-progress"></div>
            <div className="pain-card-top">
              <span className="pain-tag">NỖI ĐAU SỐ 01</span>
              <span className="pain-badge-alert">KHÔNG ĐỒNG BỘ THỰC TẾ</span>
            </div>
            <h3 className="pain-quote">“Ý tưởng trong đầu nhưng không hình dung ra sao?”</h3>
            <p className="pain-detail">
              Gia chủ có rất nhiều ý tưởng nhưng không thể diễn đạt cho thợ xây, dẫn đến ngôi nhà hoàn thiện khác xa kỳ
              vọng ban đầu.
            </p>
            <div className="solution-box">
              <span className="sol-label">Giải pháp Kontur:</span>
              <p className="sol-text">Diễn họa 3D chân thực theo tỉ lệ 1:1 từ góc nhìn thực tế giúp gia chủ thấy rõ ngôi nhà
                tương lai.</p>
            </div>
          </div>

          
          <div className="pain-card reveal-item delay-1" data-index="1">
            <div className="pain-card-progress"></div>
            <div className="pain-card-top">
              <span className="pain-tag">NỖI ĐAU SỐ 02</span>
              <span className="pain-badge-alert">ĐỘI CHI PHÍ XÂY DỰNG</span>
            </div>
            <h3 className="pain-quote">“Sợ phát sinh chi phí và sai góc nhìn 3D?”</h3>
            <p className="pain-detail">
              Bản vẽ 2D khô khan khiến chủ nhà khó hình dung được ánh sáng, chất liệu vật liệu thực tế sẽ như thế nào
              khi hoàn thiện.
            </p>
            <div className="solution-box">
              <span className="sol-label">Giải pháp Kontur:</span>
              <p className="sol-text">Bóc tách vật liệu và render quang học chuẩn xác, kiểm soát ngân sách trước khi thi
                công.</p>
            </div>
          </div>

          
          <div className="pain-card reveal-item delay-2" data-index="2">
            <div className="pain-card-progress"></div>
            <div className="pain-card-top">
              <span className="pain-tag">NỖI ĐAU SỐ 03</span>
              <span className="pain-badge-alert">BẤT ĐỒNG VỚI ĐƠN VỊ THI CÔNG</span>
            </div>
            <h3 className="pain-quote">“Nhìn 3D thì đẹp nhưng thi công thực tế không giống?”</h3>
            <p className="pain-detail">
              Nhiều đơn vị chỉ vẽ hình ảo 3D lung linh nhưng không thể hiện đúng kết cấu kỹ thuật, khiến đội thi công
              không thể thực hiện.
            </p>
            <div className="solution-box">
              <span className="sol-label">Giải pháp Kontur:</span>
              <p className="sol-text">Hồ sơ kiến trúc chuẩn kỹ thuật SIA/TCVN, khớp hoàn toàn giữa bản vẽ 3D và thực tế công
                trình.</p>
            </div>
          </div>

          
          <div className="pain-card reveal-item delay-3" data-index="3">
            <div className="pain-card-progress"></div>
            <div className="pain-card-top">
              <span className="pain-tag">NỖI ĐAU SỐ 04</span>
              <span className="pain-badge-alert">CHẬM TIẾN ĐỘ THI CÔNG</span>
            </div>
            <h3 className="pain-quote">“Mất thời gian chờ đợi bản vẽ &amp; sửa lại nhiều lần?”</h3>
            <p className="pain-detail">
              Chỉnh sửa liên tục, kéo dài nhiều tuần mà vẫn không đúng ý, làm trễ ngày khởi công và hao tổn tâm trí gia
              chủ.
            </p>
            <div className="solution-box">
              <span className="sol-label">Giải pháp Kontur:</span>
              <p className="sol-text">Cam kết tiến độ 3-7 ngày hoàn thiện, quy trình tiếp nhận &amp; chỉnh sửa khoa học 3
                vòng rõ ràng.</p>
            </div>
          </div>

        </div>

      </div>
    </section>


    
    <section className="workflow-direct-section" id="quy-trinh-thuc-hien">
      <div className="content-container">

        
        <div className="workflow-header-block reveal-item">
          <div className="workflow-eyebrow-badge">
            <span className="badge-dot-live"></span>
            <span>02. QUY TRÌNH THỰC THI &amp; SẢN PHẨM BÀN GIAO TRỰC TIẾP</span>
          </div>
          <div className="workflow-header-split">
            <h2 className="workflow-main-title">
              CHÚNG TÔI TRỰC TIẾP THỰC HIỆN GÌ CHO BẠN TỪ A — Z?
            </h2>
            <p className="workflow-sub-title">
              Trực quan hóa từng bước những gì Kontur thực hiện và bàn giao tận tay bạn: từ khảo sát vi khí hậu, phác thảo 2D CAD, mô hình 3D quang học đến thước phim video 360° và bộ hồ sơ kỹ thuật thi công trọn gói.
            </p>
          </div>
        </div>

        
        <div className="workflow-studio-card reveal-item">
          
          
          <div className="workflow-steps-nav" id="workflowStepsNav" role="tablist" aria-label="Quy trình 5 giai đoạn">
            <button type="button" className="workflow-step-btn active" data-stage="1" role="tab" aria-selected="true">
              <span className="step-badge-num">01</span>
              <div className="step-btn-info">
                <span className="step-btn-title">Khảo Sát &amp; 2D CAD</span>
                <span className="step-btn-sub">Mặt bằng vi khí hậu</span>
              </div>
            </button>
            <button type="button" className="workflow-step-btn" data-stage="2" role="tab" aria-selected="false">
              <span className="step-badge-num">02</span>
              <div className="step-btn-info">
                <span className="step-btn-title">3D Whitebox &amp; Khối</span>
                <span className="step-btn-sub">Tỉ lệ &amp; Thông thủy</span>
              </div>
            </button>
            <button type="button" className="workflow-step-btn" data-stage="3" role="tab" aria-selected="false">
              <span className="step-badge-num">03</span>
              <div className="step-btn-info">
                <span className="step-btn-title">Render 8K Siêu Thực</span>
                <span className="step-btn-sub">Vật liệu &amp; Ánh sáng</span>
              </div>
            </button>
            <button type="button" className="workflow-step-btn" data-stage="4" role="tab" aria-selected="false">
              <span className="step-badge-num">04</span>
              <div className="step-btn-info">
                <span className="step-btn-title">Phim 3D &amp; VR 360°</span>
                <span className="step-btn-sub">Video tour chuyển động</span>
              </div>
            </button>
            <button type="button" className="workflow-step-btn" data-stage="5" role="tab" aria-selected="false">
              <span className="step-badge-num">05</span>
              <div className="step-btn-info">
                <span className="step-btn-title">Hồ Sơ Kỹ Thuật &amp; BOQ</span>
                <span className="step-btn-sub">Bản vẽ &amp; Dự toán</span>
              </div>
            </button>
          </div>

          
          <div className="workflow-stage-viewport">

            
            <div className="workflow-stage-panel active" id="stagePanel-1" role="tabpanel">
              <div className="stage-cinema-player">
                <div className="cinema-media-frame">
                  <img src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1400&q=85" alt="Khảo sát vi khí hậu và bản vẽ kỹ thuật 2D CAD" className="cinema-bg-img" />
                  <div className="cinema-overlay-gradient"></div>
                  <div className="cinema-tech-hud">
                    <span className="hud-crosshair tl"></span>
                    <span className="hud-crosshair tr"></span>
                    <span className="hud-crosshair bl"></span>
                    <span className="hud-crosshair br"></span>
                    <div className="hud-stage-tag">
                      <span className="hud-dot"></span>
                      <span>STAGE 01 / 2D TECHNICAL SPECIFICATION &amp; SITE SURVEY</span>
                    </div>
                    <div className="hud-spec-data">
                      <span>SCALE: 1:50</span>
                      <span>•</span>
                      <span>TCVN / SIA CODE COMPLIANT</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="stage-deliverable-detail">
                <div className="stage-tag-badge">GIAI ĐOẠN 01 • KHẢO SÁT &amp; THIẾT KẾ MẶT BẰNG</div>
                <h3 className="stage-detail-title">ĐO ĐẠC HIỆN TRẠNG &amp; QUY HOẠCH VI KHÍ HẬU</h3>
                <p className="stage-detail-desc">
                  KTS Trưởng Kontur trực tiếp khảo sát thực địa khu đất, phân tích hướng nắng mặt trời, hướng gió tự nhiên và phong thủy hiện đại trước khi đặt nét vẽ đầu tiên.
                </p>

                <div className="stage-direct-actions">
                  <span className="action-block-title">KONTUR TRỰC TIẾP THỰC HIỆN CHO BẠN:</span>
                  <ul className="action-check-list">
                    <li>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                      <span>Đo đạc ranh giới, cốt cao độ và hạ tầng kỹ thuật xung quanh khu đất.</span>
                    </li>
                    <li>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                      <span>Vẽ biểu đồ bóng đổ và luồng gió mát xuyên phòng, giảm nhiệt tự nhiên.</span>
                    </li>
                    <li>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                      <span>Thiết lập mặt bằng công năng phân luồng giao thông tối ưu cho từng thành viên.</span>
                    </li>
                  </ul>
                </div>

                <div className="stage-tangible-box">
                  <div className="tangible-header">
                    <span className="tangible-icon">📁</span>
                    <span className="tangible-label">SẢN PHẨM BÀN GIAO BẠN NHẬN ĐƯỢC:</span>
                  </div>
                  <p className="tangible-val">Bộ file CAD .DWG + Hồ sơ mặt bằng PDF chuẩn in ấn A3 (kèm thuyết minh ý tưởng kiến trúc).</p>
                </div>

                <div className="stage-action-footer">
                  <span className="stage-time-est">⏱️ Thời gian: 24 - 48 Giờ</span>
                  <a href="#nhan-tu-van" className="btn-stage-cta">Đăng Ký Tư Vấn Giai Đoạn Này →</a>
                </div>
              </div>
            </div>

            
            <div className="workflow-stage-panel" id="stagePanel-2" role="tabpanel">
              <div className="stage-cinema-player">
                <div className="cinema-media-frame">
                  <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=85" alt="Mô hình 3D Whitebox kiểm tra khối tích và ánh sáng" className="cinema-bg-img" />
                  <div className="cinema-overlay-gradient"></div>
                  <div className="cinema-tech-hud">
                    <span className="hud-crosshair tl"></span>
                    <span className="hud-crosshair tr"></span>
                    <span className="hud-crosshair bl"></span>
                    <span className="hud-crosshair br"></span>
                    <div className="hud-stage-tag">
                      <span className="hud-dot"></span>
                      <span>STAGE 02 / 3D VOLUMETRIC WHITEBOX &amp; DAYLIGHT STUDY</span>
                    </div>
                    <div className="hud-spec-data">
                      <span>GEOMETRY 1:1</span>
                      <span>•</span>
                      <span>SOLAR RAY SIMULATION</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="stage-deliverable-detail">
                <div className="stage-tag-badge">GIAI ĐOẠN 02 • MÔ HÌNH 3D WHITEBOX</div>
                <h3 className="stage-detail-title">KIỂM TRA HÌNH KHỐI, CHIỀU CAO &amp; THÔNG THỦY</h3>
                <p className="stage-detail-desc">
                  Chuyển hóa mặt bằng 2D thành mô hình 3D không gian thực tế để kiểm tra trực quan tỉ lệ trần nhà, độ dốc mái và các khoảng giếng trời trước khi ốp vật liệu.
                </p>

                <div className="stage-direct-actions">
                  <span className="action-block-title">KONTUR TRỰC TIẾP THỰC HIỆN CHO BẠN:</span>
                  <ul className="action-check-list">
                    <li>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                      <span>Dựng mô hình 3D tỉ lệ 1:1 chuẩn xác từng centimet theo kích thước đất thực tế.</span>
                    </li>
                    <li>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                      <span>Mô phỏng ánh sáng mặt trời theo từng khung giờ trong ngày (8h sáng, 12h trưa, 17h chiều).</span>
                    </li>
                    <li>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                      <span>Phát hiện sớm các góc khuất, dầm xà chắn tầm nhìn để điều chỉnh kết cấu.</span>
                    </li>
                  </ul>
                </div>

                <div className="stage-tangible-box">
                  <div className="tangible-header">
                    <span className="tangible-icon">📁</span>
                    <span className="tangible-label">SẢN PHẨM BÀN GIAO BẠN NHẬN ĐƯỢC:</span>
                  </div>
                  <p className="tangible-val">Bộ ảnh góc nhìn mô hình 3D đa hướng + Link mô hình 3D tương tác xoay 360° trên trình duyệt web.</p>
                </div>

                <div className="stage-action-footer">
                  <span className="stage-time-est">⏱️ Thời gian: 48 - 72 Giờ</span>
                  <a href="#nhan-tu-van" className="btn-stage-cta">Đăng Ký Tư Vấn Giai Đoạn Này →</a>
                </div>
              </div>
            </div>

            
            <div className="workflow-stage-panel" id="stagePanel-3" role="tabpanel">
              <div className="stage-cinema-player">
                <div className="cinema-media-frame">
                  <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=85" alt="Phối cảnh 3D Render Quang Học 8K siêu thực" className="cinema-bg-img" />
                  <div className="cinema-overlay-gradient"></div>
                  <div className="cinema-tech-hud">
                    <span className="hud-crosshair tl"></span>
                    <span className="hud-crosshair tr"></span>
                    <span className="hud-crosshair bl"></span>
                    <span className="hud-crosshair br"></span>
                    <div className="hud-stage-tag">
                      <span className="hud-dot"></span>
                      <span>STAGE 03 / 8K PHOTOREALISTIC RAY-TRACED RENDERING</span>
                    </div>
                    <div className="hud-spec-data">
                      <span>RESOLUTION: 7680 × 4320</span>
                      <span>•</span>
                      <span>TRUE MATERIAL SHADERS</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="stage-deliverable-detail">
                <div className="stage-tag-badge">GIAI ĐOẠN 03 • DIỄN HỌA 8K SIÊU THỰC</div>
                <h3 className="stage-detail-title">KHẮC HỌA 100% VẬT LIỆU, ĐÁ, GỖ &amp; ÁNH SÁNG</h3>
                <p className="stage-detail-desc">
                  Áp dụng công nghệ Render quang học Ray-tracing chuẩn xác. Mỗi bề mặt đá marble, thớ gỗ óc chó, kính Low-E đều có độ phản xạ và khúc xạ ánh sáng như công trình thực tế.
                </p>

                <div className="stage-direct-actions">
                  <span className="action-block-title">KONTUR TRỰC TIẾP THỰC HIỆN CHO BẠN:</span>
                  <ul className="action-check-list">
                    <li>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                      <span>Lấy mẫu vật liệu có mã thương hiệu thực tế trên thị trường Việt Nam.</span>
                    </li>
                    <li>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                      <span>Render phối cảnh ban ngày nắng rực rỡ và hoàng hôn đêm lung linh ánh đèn.</span>
                    </li>
                    <li>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                      <span>Chỉnh sửa 3 vòng trực tiếp với KTS Trưởng đến khi bạn hoàn toàn hài lòng.</span>
                    </li>
                  </ul>
                </div>

                <div className="stage-tangible-box">
                  <div className="tangible-header">
                    <span className="tangible-icon">📁</span>
                    <span className="tangible-label">SẢN PHẨM BÀN GIAO BẠN NHẬN ĐƯỢC:</span>
                  </div>
                  <p className="tangible-val">Bộ 20 - 35 hình ảnh 8K Ultra-HD gốc không nén, không watermark + Bảng mã chỉ định vật liệu tương ứng.</p>
                </div>

                <div className="stage-action-footer">
                  <span className="stage-time-est">⏱️ Thời gian: 3 - 5 Ngày</span>
                  <a href="#nhan-tu-van" className="btn-stage-cta">Đăng Ký Tư Vấn Giai Đoạn Này →</a>
                </div>
              </div>
            </div>

            
            <div className="workflow-stage-panel" id="stagePanel-4" role="tabpanel">
              <div className="stage-cinema-player">
                <div className="cinema-media-frame">
                  <img src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1400&q=85" alt="Thước phim 3D Video Tour và VR 360°" className="cinema-bg-img" />
                  <div className="cinema-overlay-gradient"></div>
                  
                  
                  <div className="cinema-play-overlay">
                    <div className="play-btn-pulse">
                      <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                    </div>
                    <span className="play-caption">4K 60FPS FLY-THROUGH SIMULATION</span>
                  </div>

                  <div className="cinema-tech-hud">
                    <span className="hud-crosshair tl"></span>
                    <span className="hud-crosshair tr"></span>
                    <span className="hud-crosshair bl"></span>
                    <span className="hud-crosshair br"></span>
                    <div className="hud-stage-tag">
                      <span className="hud-dot"></span>
                      <span>STAGE 04 / 3D CINEMATIC ANIMATION &amp; VR 360° IMMERSION</span>
                    </div>
                    <div className="hud-spec-data">
                      <span>4K 60FPS</span>
                      <span>•</span>
                      <span>SPATIAL AUDIO INCLUDED</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="stage-deliverable-detail">
                <div className="stage-tag-badge">GIAI ĐOẠN 04 • PHIM 3D VIDEO TOUR &amp; VR 360°</div>
                <h3 className="stage-detail-title">TRẢI NGHIỆM ĐI DẠO TRONG NGÔI NHÀ TƯƠNG LAI</h3>
                <p className="stage-detail-desc">
                  Thước phim 3D chuyển động mượt mà lướt qua từng sảnh đón, phòng khách, hồ bơi và sân thượng, kết hợp tour thực tế ảo VR 360° xoay đa hướng ngay trên điện thoại.
                </p>

                <div className="stage-direct-actions">
                  <span className="action-block-title">KONTUR TRỰC TIẾP THỰC HIỆN CHO BẠN:</span>
                  <ul className="action-check-list">
                    <li>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                      <span>Biên kịch góc quay điện ảnh lướt từ toàn cảnh flycam xuống cận cảnh không gian sống.</span>
                    </li>
                    <li>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                      <span>Tích hợp âm thanh thiên nhiên, tiếng nước chảy và âm nhạc thư giãn chuẩn điện ảnh.</span>
                    </li>
                    <li>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                      <span>Khởi tạo đường link Virtual Tour VR 360° chia sẻ cho gia đình, bạn bè cùng xem.</span>
                    </li>
                  </ul>
                </div>

                <div className="stage-tangible-box">
                  <div className="tangible-header">
                    <span className="tangible-icon">📁</span>
                    <span className="tangible-label">SẢN PHẨM BÀN GIAO BẠN NHẬN ĐƯỢC:</span>
                  </div>
                  <p className="tangible-val">File Video MP4 4K chất lượng cao (1-3 phút) + Link Web VR 360° tương tác đa chiều vĩnh viễn.</p>
                </div>

                <div className="stage-action-footer">
                  <span className="stage-time-est">⏱️ Thời gian: 3 - 5 Ngày</span>
                  <a href="#nhan-tu-van" className="btn-stage-cta">Đăng Ký Tư Vấn Giai Đoạn Này →</a>
                </div>
              </div>
            </div>

            
            <div className="workflow-stage-panel" id="stagePanel-5" role="tabpanel">
              <div className="stage-cinema-player">
                <div className="cinema-media-frame">
                  <img src="https://images.unsplash.com/photo-1541888946425-d0fbb18015f6?auto=format&fit=crop&w=1400&q=85" alt="Hồ sơ bản vẽ kỹ thuật thi công và bóc tách dự toán BOQ" className="cinema-bg-img" />
                  <div className="cinema-overlay-gradient"></div>
                  <div className="cinema-tech-hud">
                    <span className="hud-crosshair tl"></span>
                    <span className="hud-crosshair tr"></span>
                    <span className="hud-crosshair bl"></span>
                    <span className="hud-crosshair br"></span>
                    <div className="hud-stage-tag">
                      <span className="hud-dot"></span>
                      <span>STAGE 05 / FULL TECHNICAL MEP DRAWINGS &amp; BOQ BUDGET TAKEOFF</span>
                    </div>
                    <div className="hud-spec-data">
                      <span>100+ A3 PAGES</span>
                      <span>•</span>
                      <span>ACCURACY &gt; 95%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="stage-deliverable-detail">
                <div className="stage-tag-badge">GIAI ĐOẠN 05 • HỒ SƠ THI CÔNG &amp; DỰ TOÁN BOQ</div>
                <h3 className="stage-detail-title">HỒ SƠ BẢN VẼ CHI TIẾT &amp; KIỂM SOÁT NGÂN SÁCH</h3>
                <p className="stage-detail-desc">
                  Bàn giao trọn gói bộ hồ sơ kỹ thuật thi công chuẩn quy chuẩn xây dựng kèm bảng bóc tách khối lượng chi tiết từng viên gạch, bao xi măng, giúp thợ thi công chuẩn xác và loại bỏ 100% chi phí phát sinh.
                </p>

                <div className="stage-direct-actions">
                  <span className="action-block-title">KONTUR TRỰC TIẾP THỰC HIỆN CHO BẠN:</span>
                  <ul className="action-check-list">
                    <li>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                      <span>Khai triển bản vẽ chi tiết kiến trúc, kết cấu bê tông, điện nước MEP chuẩn TCVN/SIA.</span>
                    </li>
                    <li>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                      <span>Lập bảng dự toán BOQ chi tiết khối lượng vật tư và đơn giá thị trường cập nhật.</span>
                    </li>
                    <li>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                      <span>Hỗ trợ giải đáp kỹ thuật trực tiếp cho đội thợ trong suốt quá trình xây thô và hoàn thiện.</span>
                    </li>
                  </ul>
                </div>

                <div className="stage-tangible-box">
                  <div className="tangible-header">
                    <span className="tangible-icon">📁</span>
                    <span className="tangible-label">SẢN PHẨM BÀN GIAO BẠN NHẬN ĐƯỢC:</span>
                  </div>
                  <p className="tangible-val">02 Bộ hồ sơ in ấn đóng quyển bìa cứng A3 (100-150 trang) + File mềm CAD/PDF + Bảng tính Excel dự toán BOQ.</p>
                </div>

                <div className="stage-action-footer">
                  <span className="stage-time-est">⏱️ Thời gian: 5 - 7 Ngày</span>
                  <a href="#nhan-tu-van" className="btn-stage-cta">Đăng Ký Tư Vấn Giai Đoạn Này →</a>
                </div>
              </div>
            </div>

          </div>

        </div>

        
        <div className="deliverables-gallery-block reveal-item">
          <div className="deliverables-block-header">
            <span className="sec-eyebrow">DANH MỤC BÀN GIAO HOÀN CHỈNH</span>
            <h3 className="deliverables-block-title">4 BỘ SẢN PHẨM TRỰC TIẾP BÀN GIAO TẬN TAY GIA CHỦ</h3>
            <p className="deliverables-block-desc">
              Tất cả các sản phẩm đều được Kontur bàn giao đầy đủ cả file mềm chất lượng cao và hồ sơ in ấn đóng quyển trang trọng.
            </p>
          </div>

          <div className="deliverables-4cards-grid">

            
            <div className="deliverable-box-card">
              <div className="deliv-card-img-wrap">
                <img src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=700&q=80" alt="Hồ sơ bản vẽ kỹ thuật thi công A3" className="deliv-card-img" />
                <span className="deliv-badge">100+ TRANG A3</span>
              </div>
              <div className="deliv-card-body">
                <div className="deliv-card-num">01 / BẢN VẼ THI CÔNG</div>
                <h4 className="deliv-card-heading">Hồ Sơ Kỹ Thuật Thi Công Chuẩn TCVN/SIA</h4>
                <p className="deliv-card-text">
                  Bản vẽ chi tiết kết cấu thép, mặt cắt dầm cột, hệ thống cấp thoát nước, sơ đồ điện thông minh và chi tiết ốp lát từng phòng.
                </p>
                <div className="deliv-meta-tag">Đóng tập bìa cứng A3 + File CAD/PDF</div>
              </div>
            </div>

            
            <div className="deliverable-box-card">
              <div className="deliv-card-img-wrap">
                <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=700&q=80" alt="Bộ phối cảnh diễn họa 3D 8K" className="deliv-card-img" />
                <span className="deliv-badge">8K ULTRA-HD</span>
              </div>
              <div className="deliv-card-body">
                <div className="deliv-card-num">02 / DIỄN HỌA 3D 8K</div>
                <h4 className="deliv-card-heading">Bộ Phối Cảnh 3D Render Quang Học (20-35 Ảnh)</h4>
                <p className="deliv-card-text">
                  Góc nhìn toàn cảnh ngoại thất, hồ bơi, phòng khách, phòng ngủ master và góc cận cảnh vật liệu dưới ánh sáng ngày và đêm.
                </p>
                <div className="deliv-meta-tag">Ảnh gốc không nén 7680×4320 px</div>
              </div>
            </div>

            
            <div className="deliverable-box-card">
              <div className="deliv-card-img-wrap">
                <img src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=700&q=80" alt="Thước phim 3D Video Tour và VR 360°" className="deliv-card-img" />
                <span className="deliv-badge">VIDEO 4K &amp; VR 360°</span>
              </div>
              <div className="deliv-card-body">
                <div className="deliv-card-num">03 / VIDEO TOUR &amp; VR</div>
                <h4 className="deliv-card-heading">Phim 3D Video Animation &amp; Virtual Tour 360°</h4>
                <p className="deliv-card-text">
                  Clip flycam chuyển động điện ảnh mượt mà kèm link tương tác VR 360° giúp gia chủ đi dạo khắp ngôi nhà trước ngày khởi công.
                </p>
                <div className="deliv-meta-tag">Video MP4 4K 60fps + Link Cloud VR</div>
              </div>
            </div>

            
            <div className="deliverable-box-card">
              <div className="deliv-card-img-wrap">
                <img src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=700&q=80" alt="Bảng dự toán bóc tách khối lượng BOQ" className="deliv-card-img" />
                <span className="deliv-badge">CHỐNG ĐỘI VỐN 100%</span>
              </div>
              <div className="deliv-card-body">
                <div className="deliv-card-num">04 / DỰ TOÁN BOQ</div>
                <h4 className="deliv-card-heading">Bảng Bóc Tách Khối Lượng &amp; Dự Toán Chi Phí</h4>
                <p className="deliv-card-text">
                  Thống kê chính xác số lượng thép, xi măng, gạch lát, nhôm kính kèm mã thương hiệu, giúp gia chủ kiểm soát tuyệt đối ngân sách.
                </p>
                <div className="deliv-meta-tag">File Excel tính toán + Bảng định mức vật tư</div>
              </div>
            </div>

          </div>
        </div>

        
        <div className="workflow-optimization-compare reveal-item">
          <div className="compare-intro-split">
            <div className="compare-left-info">
              <span className="sec-eyebrow">TỐI ƯU HÓA KHÔNG GIAN SỐNG</span>
              <h3 className="compare-main-title">LOẠI BỎ SAI SÓT THIẾT KẾ TRƯỚC KHI XÂY</h3>
              <p className="compare-sub-desc">
                Kéo thanh trượt để so sánh trực quan cách KTS Kontur biến một không gian thô sơ, thiếu sáng thành ngôi nhà ngập tràn ánh sáng tự nhiên và thông thoáng tối đa.
              </p>
            </div>
            <div className="compare-right-stat">
              <div className="compare-stat-pill">
                <span className="stat-highlight">0%</span>
                <span className="stat-caption">Rủi ro đập phá sửa chữa</span>
              </div>
              <div className="compare-stat-pill">
                <span className="stat-highlight">100%</span>
                <span className="stat-caption">Đồng bộ bản vẽ &amp; thực tế</span>
              </div>
            </div>
          </div>

          
          <div className="before-after-container" id="baContainer">
            <div className="ba-image-layer before-layer">
              <img src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80" alt="Bản vẽ thô ban đầu thiếu sáng và bí bách" />
              <span className="ba-pill-label label-left">HIỆN TRẠNG / BẢN VẼ THÔ (THIẾU SÁNG, BÍ BÁCH)</span>
            </div>
            <div className="ba-image-layer after-layer" id="baAfterLayer">
              <img src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80" alt="Giải pháp 3D Kontur tối ưu hoàn thiện" />
              <span className="ba-pill-label label-right">GIẢI PHÁP KONTUR TỐI ƯU HOÀN THIỆN (THÔNG TẦNG ĐÓN SÁNG)</span>
            </div>
            <div className="ba-slider-handle" id="baSliderHandle">
              <div className="handle-line"></div>
              <div className="handle-circle">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>


    
    <section className="services-pillars-section" id="dich-vu">
      <div className="content-container">

        <div className="section-title-split reveal-item">
          <div className="title-left">
            <span className="sec-eyebrow">03. DỊCH VỤ TOÀN DIỆN CỦA CHÚNG TÔI</span>
            <h2 className="sec-main-title">
              HAI TRỤ CỘT DỊCH VỤ TOÀN DIỆN TỪ Ý TƯỞNG ĐẾN THỰC THI
            </h2>
          </div>
          <div className="title-right">
            <p className="sec-subtitle">
              Chọn lĩnh vực chuyên môn bên dưới để xem chi tiết giải pháp thiết kế kiến trúc và quy chuẩn diễn họa 3D
              thực tế tương ứng.
            </p>
          </div>
        </div>

        
        <div className="domain-tabs-wrapper reveal-item">
          <div className="domain-tabs-scroll" id="domainTabsContainer" role="tablist" aria-label="Lĩnh vực dịch vụ">
            <button className="domain-tab-btn active" data-domain="all" role="tab" aria-selected="true"
              aria-controls="panel-all">
              <span className="tab-dot"></span>
              <span className="tab-name">Tất Cả Lĩnh Vực</span>
              <span className="tab-badge">Tổng quan</span>
            </button>
            <button className="domain-tab-btn" data-domain="villa" role="tab" aria-selected="false"
              aria-controls="panel-villa">
              <span className="tab-dot"></span>
              <span className="tab-name">Biệt Thự &amp; Nhà Phố</span>
            </button>
            <button className="domain-tab-btn" data-domain="apartment" role="tab" aria-selected="false"
              aria-controls="panel-apartment">
              <span className="tab-dot"></span>
              <span className="tab-name">Căn Hộ &amp; Penthouse</span>
            </button>
            <button className="domain-tab-btn" data-domain="hospitality" role="tab" aria-selected="false"
              aria-controls="panel-hospitality">
              <span className="tab-dot"></span>
              <span className="tab-name">Resort &amp; Khách Sạn</span>
            </button>
            <button className="domain-tab-btn" data-domain="commercial" role="tab" aria-selected="false"
              aria-controls="panel-commercial">
              <span className="tab-dot"></span>
              <span className="tab-name">Showroom &amp; F&amp;B</span>
            </button>
            <button className="domain-tab-btn" data-domain="masterplan" role="tab" aria-selected="false"
              aria-controls="panel-masterplan">
              <span className="tab-dot"></span>
              <span className="tab-name">Quy Hoạch &amp; Cảnh Quan</span>
            </button>
          </div>
        </div>

        
        <div className="domain-panels-wrap">

          
          <div className="domain-content-panel active" id="panel-all" role="tabpanel">
            <div className="service-carousel-wrapper">
              
              
              <div className="carousel-nav-header">
                <div className="carousel-counter">
                  <span className="curr-slide">01</span>
                  <span className="sep-slash">/</span>
                  <span className="total-slides">06 TRỤ CỘT DỊCH VỤ</span>
                </div>
                <div className="carousel-nav-actions">
                  <button type="button" className="carousel-arrow-btn prev-btn" aria-label="Xem thẻ dịch vụ trước" title="Thẻ trước">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                  </button>
                  <button type="button" className="carousel-arrow-btn next-btn" aria-label="Xem thẻ dịch vụ tiếp theo" title="Thẻ tiếp theo">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </button>
                </div>
              </div>

              
              <div className="service-carousel-viewport">
                <div className="service-carousel-track">
                  
                  
                  <article className="service-pillar-card">
                    <div className="pillar-card-header">
                      <span className="pillar-num">TRỤ CỘT 01</span>
                      <span className="pillar-target-tag">GIA CHỦ &amp; CĐT</span>
                    </div>
                    <h3 className="pillar-title">KIẾN TRÚC &amp; QUY HOẠCH</h3>
                    <p className="pillar-description">
                      Phân chia không gian sống tối ưu công năng, đón sáng và thông gió tự nhiên theo phong thủy hiện đại.
                    </p>
                    <ul className="pillar-checklist">
                      <li>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#121316" strokeWidth="2.5">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span><strong>Thiết kế trọn gói:</strong> Mặt bằng tối ưu nhân khẩu học.</span>
                      </li>
                      <li>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#121316" strokeWidth="2.5">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span><strong>Hồ sơ kỹ thuật:</strong> Kết cấu, MEP chi tiết từng mảng tường.</span>
                      </li>
                      <li>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#121316" strokeWidth="2.5">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span><strong>Giám sát tác giả:</strong> Hỗ trợ thợ suốt quá trình xây thô.</span>
                      </li>
                    </ul>
                    <div className="pillar-image-wrap">
                      <img
                        src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80"
                        alt="Không gian nội thất kiến trúc tối giản hiện đại ngập tràn ánh sáng" className="pillar-img"
                        loading="lazy" />
                    </div>
                  </article>

                  
                  <article className="service-pillar-card">
                    <div className="pillar-card-header">
                      <span className="pillar-num">TRỤ CỘT 02</span>
                      <span className="pillar-target-tag">KTS &amp; STUDIO</span>
                    </div>
                    <h3 className="pillar-title">DIỄN HỌA 3D SIÊU THỰC</h3>
                    <p className="pillar-description">
                      Render phối cảnh 3D 8K sắc nét từng thớ gỗ, vân đá và mô phỏng ánh sáng tự nhiên chuẩn xác 100%.
                    </p>
                    <ul className="pillar-checklist">
                      <li>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#121316" strokeWidth="2.5">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span><strong>Render 3D 8K:</strong> Sắc nét đến từng chi tiết phản xạ kính.</span>
                      </li>
                      <li>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#121316" strokeWidth="2.5">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span><strong>3D Video &amp; VR 360°:</strong> Thước phim chuyển động sống động.</span>
                      </li>
                      <li>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#121316" strokeWidth="2.5">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span><strong>Tiến độ siêu tốc:</strong> Giao demo sơ bộ trong 48h.</span>
                      </li>
                    </ul>
                    <div className="pillar-image-wrap">
                      <img
                        src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=900&q=80"
                        alt="Chi tiết góc tường bê tông và ánh sáng phản chiếu chân thực" className="pillar-img"
                        loading="lazy" />
                    </div>
                  </article>

                  
                  <article className="service-pillar-card">
                    <div className="pillar-card-header">
                      <span className="pillar-num">TRỤ CỘT 03</span>
                      <span className="pillar-target-tag">NỘI THẤT LUXURY</span>
                    </div>
                    <h3 className="pillar-title">NỘI THẤT &amp; FIT-OUT</h3>
                    <p className="pillar-description">
                      May đo không gian sống cao cấp, tối ưu hóa hệ tủ âm tường và khai thác trọn vẹn tầm nhìn panorama.
                    </p>
                    <ul className="pillar-checklist">
                      <li>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#121316" strokeWidth="2.5">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span><strong>Layout mở liên hoàn:</strong> Phòng khách - bếp đảo liên hoàn.</span>
                      </li>
                      <li>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#121316" strokeWidth="2.5">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span><strong>Fit-out may đo:</strong> Gỗ óc chó, đá Calacatta tự nhiên.</span>
                      </li>
                      <li>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#121316" strokeWidth="2.5">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span><strong>Hồ sơ BQL tòa nhà:</strong> Hoàn thiện MEP theo tiêu chuẩn.</span>
                      </li>
                    </ul>
                    <div className="pillar-image-wrap">
                      <img
                        src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=80"
                        alt="Nội thất phòng khách penthouse cao cấp với góc nhìn mở ngập ánh sáng" className="pillar-img"
                        loading="lazy" />
                    </div>
                  </article>

                  
                  <article className="service-pillar-card">
                    <div className="pillar-card-header">
                      <span className="pillar-num">TRỤ CỘT 04</span>
                      <span className="pillar-target-tag">THI CÔNG TRỌN GÓI</span>
                    </div>
                    <h3 className="pillar-title">DỰ TOÁN &amp; KỸ THUẬT</h3>
                    <p className="pillar-description">
                      Bộ hồ sơ thi công hoàn chỉnh kèm bảng bóc tách khối lượng chi tiết từng viên gạch, chống đội vốn 100%.
                    </p>
                    <ul className="pillar-checklist">
                      <li>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#121316" strokeWidth="2.5">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span><strong>Bóc tách khối lượng:</strong> Dự toán chuẩn xác 95%.</span>
                      </li>
                      <li>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#121316" strokeWidth="2.5">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span><strong>Khớp 100% bản vẽ 3D:</strong> Thợ thi công dễ dàng, không sửa lại.</span>
                      </li>
                      <li>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#121316" strokeWidth="2.5">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span><strong>Cam kết 0% phát sinh:</strong> Định mức vật liệu bám sát ngân sách.</span>
                      </li>
                    </ul>
                    <div className="pillar-image-wrap">
                      <img
                        src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=900&q=80"
                        alt="Bản vẽ hồ sơ kỹ thuật và thi công công trình" className="pillar-img"
                        loading="lazy" />
                    </div>
                  </article>

                  
                  <article className="service-pillar-card">
                    <div className="pillar-card-header">
                      <span className="pillar-num">TRỤ CỘT 05</span>
                      <span className="pillar-target-tag">CHỦ ĐẦU TƯ BĐS</span>
                    </div>
                    <h3 className="pillar-title">RESORT &amp; NGHỈ DƯỠNG</h3>
                    <p className="pillar-description">
                      Quy hoạch tổng thể bungalow, villa sinh thái nương theo địa hình tự nhiên, tạo điểm nhấn check-in độc bản.
                    </p>
                    <ul className="pillar-checklist">
                      <li>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#121316" strokeWidth="2.5">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span><strong>Quy hoạch cảnh quan:</strong> Nương theo sườn đồi, rừng thông và ven biển.</span>
                      </li>
                      <li>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#121316" strokeWidth="2.5">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span><strong>Tối ưu hóa tầm nhìn:</strong> 100% phòng ngủ view hướng hồ / biển Panorama.</span>
                      </li>
                      <li>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#121316" strokeWidth="2.5">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span><strong>Phim 3D xúc tiến đầu tư:</strong> Thu hút khách booking sớm trước mở bán.</span>
                      </li>
                    </ul>
                    <div className="pillar-image-wrap">
                      <img
                        src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=900&q=80"
                        alt="Resort sinh thái nghỉ dưỡng giữa thiên nhiên" className="pillar-img"
                        loading="lazy" />
                    </div>
                  </article>

                  
                  <article className="service-pillar-card">
                    <div className="pillar-card-header">
                      <span className="pillar-num">TRỤ CỘT 06</span>
                      <span className="pillar-target-tag">THƯƠNG MẠI &amp; F&amp;B</span>
                    </div>
                    <h3 className="pillar-title">SHOWROOM &amp; KHÔNG GIAN F&amp;B</h3>
                    <p className="pillar-description">
                      Thiết kế kiến trúc thương mại kết hợp chiếu sáng nghệ thuật, tối ưu luồng di chuyển và kích thích doanh thu.
                    </p>
                    <ul className="pillar-checklist">
                      <li>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#121316" strokeWidth="2.5">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span><strong>Nhận diện kiến trúc:</strong> Tạo dấu ấn thương hiệu nổi bật ngay mặt tiền.</span>
                      </li>
                      <li>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#121316" strokeWidth="2.5">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span><strong>Phân luồng khách hàng:</strong> Tối ưu số lượng bàn và khu vực phục vụ.</span>
                      </li>
                      <li>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#121316" strokeWidth="2.5">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span><strong>Chiếu sáng thương mại:</strong> Tôn vinh sản phẩm và trải nghiệm khách.</span>
                      </li>
                    </ul>
                    <div className="pillar-image-wrap">
                      <img
                        src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=900&q=80"
                        alt="Không gian showroom và quán cafe phong cách hiện đại" className="pillar-img"
                        loading="lazy" />
                    </div>
                  </article>

                </div>
              </div>

            </div>
          </div>

          
          <div className="domain-content-panel" id="panel-villa" role="tabpanel">
            <div className="pillars-2col-grid">
              
              <article className="service-pillar-card">
                <div className="pillar-card-header">
                  <span className="pillar-num">LĨNH VỰC: BIỆT THỰ &amp; NHÀ PHỐ</span>
                  <span className="pillar-target-tag">KIẾN TRÚC CAO CẤP</span>
                </div>
                <h3 className="pillar-title">THIẾT KẾ BIỆT THỰ &amp; DINH THỰ ĐỘC BẢN</h3>
                <p className="pillar-description">
                  Quy hoạch kiến trúc biệt thự đơn lập, song lập, nhà phố thương mại và dinh thự tư gia. Tập trung vào
                  tính cá nhân hóa, vi khí hậu và sân vườn cảnh quan liền mạch.
                </p>
                <ul className="pillar-checklist">
                  <li>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#121314" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span><strong>Quy hoạch cảnh quan &amp; hồ bơi liên hoàn:</strong> Kết nối phòng khách, hiên nhà và
                      bể bơi ngoài trời tạo luồng sinh khí mát mẻ.</span>
                  </li>
                  <li>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#121314" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span><strong>Bố trí công năng chuyên biệt:</strong> Thiết kế hầm để xe, hầm rượu vang, phòng giải
                      trí cách âm, master suite chuẩn resort.</span>
                  </li>
                  <li>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#121314" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span><strong>Hồ sơ kỹ thuật chịu lực &amp; kết cấu vượt nhịp:</strong> Tối đa hóa khoảng không
                      không cột, tăng góc nhìn kính bao quát.</span>
                  </li>
                  <li>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#121314" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span><strong>Tối ưu hóa ngân sách xây thô &amp; hoàn thiện:</strong> Định mức dự toán minh bạch
                      từng hạng mục đá ốp, khung nhôm cầu cách nhiệt.</span>
                  </li>
                </ul>
                <div className="pillar-image-wrap">
                  <img
                    src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=900&q=80"
                    alt="Biệt thự hiện đại sang trọng với hồ bơi và sân vườn xanh mát" className="pillar-img"
                    loading="lazy" />
                </div>
              </article>

              
              <article className="service-pillar-card">
                <div className="pillar-card-header">
                  <span className="pillar-num">LĨNH VỰC: BIỆT THỰ &amp; NHÀ PHỐ</span>
                  <span className="pillar-target-tag">DIỄN HỌA 3D VILLA</span>
                </div>
                <h3 className="pillar-title">RENDER NGOẠI THẤT &amp; CẢNH QUAN 3D VILLA</h3>
                <p className="pillar-description">
                  Dựng hình 3D phối cảnh ngoại thất đa góc nhìn từ trên cao (Flycam) và tầm mắt, tái hiện chính xác vật
                  liệu đá marble tự nhiên, mặt nước và cây xanh sinh động.
                </p>
                <ul className="pillar-checklist">
                  <li>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#121314" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span><strong>Phối cảnh Flycam tổng thể 8K:</strong> Bao quát kiến trúc mái, sân vườn, tường rào và
                      sự ăn nhập với cảnh quan khu vực lân cận.</span>
                  </li>
                  <li>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#121314" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span><strong>Mô phỏng ánh sáng ban đêm (Night Scene):</strong> Kịch bản đèn rọi facade, đèn âm đất
                      lối đi và ánh sáng ấm cúng từ bên trong nhà.</span>
                  </li>
                  <li>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#121314" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span><strong>3D Walkthrough Cinematic 60fps:</strong> Video chuyển động dẫn người xem dạo bước từ
                      cổng chính qua sân vườn vào đại sảnh.</span>
                  </li>
                  <li>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#121314" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span><strong>Chính xác màu sắc và vật liệu 100%:</strong> Đúng chuẩn mã sơn ngoại thất, đá ốp tự
                      nhiên và độ trong suốt của kính hộp Low-E.</span>
                  </li>
                </ul>
                <div className="pillar-image-wrap">
                  <img
                    src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=900&q=80"
                    alt="Phối cảnh 3D ngoại thất biệt thự nghỉ dưỡng lúc hoàng hôn" className="pillar-img" loading="lazy" />
                </div>
              </article>
            </div>
          </div>

          
          <div className="domain-content-panel" id="panel-apartment" role="tabpanel">
            <div className="pillars-2col-grid">
              
              <article className="service-pillar-card">
                <div className="pillar-card-header">
                  <span className="pillar-num">LĨNH VỰC: CĂN HỘ &amp; PENTHOUSE</span>
                  <span className="pillar-target-tag">NỘI THẤT LUXURY</span>
                </div>
                <h3 className="pillar-title">THIẾT KẾ NỘI THẤT PENTHOUSE &amp; LUXURY APARTMENT</h3>
                <p className="pillar-description">
                  Tối ưu không gian liên thông mở, đón trọn tầm nhìn Panorama view đắt giá và kiến tạo không gian sống
                  tiện nghi đẳng cấp thượng lưu.
                </p>
                <ul className="pillar-checklist">
                  <li>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#121314" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span><strong>Thiết kế Layout mở liên hoàn:</strong> Phòng khách - Bếp đảo - Ban công sky lounge
                      liền mạch, mở rộng tối đa tầm mắt.</span>
                  </li>
                  <li>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#121314" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span><strong>Hệ tủ âm tường &amp; nội thất Fit-out may đo:</strong> Tối ưu từng centimet vuông, ẩn
                      giấu hệ thống kỹ thuật thông minh.</span>
                  </li>
                  <li>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#121314" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span><strong>Vật liệu cao cấp:</strong> Gỗ óc chó Bắc Mỹ, da bò Nappa Ý, kim loại mạ PVD và hệ đá
                      cẩm thạch Calacatta.</span>
                  </li>
                  <li>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#121314" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span><strong>Hồ sơ xin phép BQL tòa nhà:</strong> Hoàn thiện đầy đủ bản vẽ MEP và PCCC theo quy
                      chuẩn chung cư cao cấp.</span>
                  </li>
                </ul>
                <div className="pillar-image-wrap">
                  <img
                    src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=80"
                    alt="Nội thất phòng khách penthouse cao cấp với góc nhìn mở ngập ánh sáng" className="pillar-img"
                    loading="lazy" />
                </div>
              </article>

              
              <article className="service-pillar-card">
                <div className="pillar-card-header">
                  <span className="pillar-num">LĨNH VỰC: CĂN HỘ &amp; PENTHOUSE</span>
                  <span className="pillar-target-tag">DIỄN HỌA NỘI THẤT 3D</span>
                </div>
                <h3 className="pillar-title">DIỄN HỌA CHI TIẾT NỘI THẤT 3D SIÊU THỰC</h3>
                <p className="pillar-description">
                  Phối cảnh nội thất sắc nét tới từng chi tiết cận cảnh (Close-up Macro), phản chiếu ánh sáng tự nhiên
                  qua rèm lụa và hệ đèn chiếu điểm tinh tế.
                </p>
                <ul className="pillar-checklist">
                  <li>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#121314" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span><strong>Render chi tiết vật liệu Macro:</strong> Hiển thị rõ nét thớ vải sofa, vân veneer óc
                      chó và độ bóng satin kim loại.</span>
                  </li>
                  <li>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#121314" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span><strong>Mô phỏng ánh sáng tự nhiên theo giờ:</strong> Thấy rõ góc nắng rọi vào phòng lúc 8h
                      sáng, 15h chiều và kịch bản đèn đêm.</span>
                  </li>
                  <li>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#121314" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span><strong>Tour 360 độ tương tác mọi phòng:</strong> Xoay nhìn toàn cảnh phòng khách, phòng ngủ
                      Master, phòng tắm Panorama.</span>
                  </li>
                  <li>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#121314" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span><strong>Tối ưu hóa góc nhìn camera:</strong> Tôn vinh chiều cao trần nhà và chiều sâu không
                      gian căn hộ.</span>
                  </li>
                </ul>
                <div className="pillar-image-wrap">
                  <img
                    src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=80"
                    alt="Phối cảnh 3D không gian phòng khách hiện đại tông màu ấm" className="pillar-img" loading="lazy" />
                </div>
              </article>
            </div>
          </div>

          
          <div className="domain-content-panel" id="panel-hospitality" role="tabpanel">
            <div className="pillars-2col-grid">
              
              <article className="service-pillar-card">
                <div className="pillar-card-header">
                  <span className="pillar-num">LĨNH VỰC: RESORT &amp; KHÁCH SẠN</span>
                  <span className="pillar-target-tag">QUY HOẠCH NGHỈ DƯỠNG</span>
                </div>
                <h3 className="pillar-title">QUY HOẠCH &amp; KIẾN TRÚC RESORT NGHỈ DƯỠNG</h3>
                <p className="pillar-description">
                  Thiết kế tổ hợp nghỉ dưỡng sinh thái, khách sạn boutique và resort ven biển/đồi núi theo chuẩn vận
                  hành quốc tế 5 sao kết hợp bản sắc văn hóa địa phương.
                </p>
                <ul className="pillar-checklist">
                  <li>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#121314" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span><strong>Quy hoạch phân khu chức năng:</strong> Khu đón tiếp Lobby, cụm Bungalow biệt lập, cụm
                      Spa chăm sóc sức khỏe, cụm F&amp;B.</span>
                  </li>
                  <li>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#121314" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span><strong>Tối ưu hóa đường dây vận hành (BOH &amp; FOH):</strong> Phân luồng di chuyển nhân viên
                      dịch vụ và du khách hoàn toàn riêng biệt.</span>
                  </li>
                  <li>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#121314" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span><strong>Kiến trúc bền vững &amp; bảo tồn cảnh quan:</strong> Nương theo địa hình dốc tự nhiên,
                      giảm thiểu san lấp đất và giữ trọn cây xanh bản địa.</span>
                  </li>
                  <li>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#121314" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span><strong>Vật liệu địa phương kết hợp công nghệ hiện đại:</strong> Sử dụng tre, đá chẻ, gỗ tái
                      chế cùng giải pháp cách nhiệt thông minh.</span>
                  </li>
                </ul>
                <div className="pillar-image-wrap">
                  <img
                    src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80"
                    alt="Khu nghỉ dưỡng resort sinh thái ven biển với hồ bơi vô cực" className="pillar-img"
                    loading="lazy" />
                </div>
              </article>

              
              <article className="service-pillar-card">
                <div className="pillar-card-header">
                  <span className="pillar-num">LĨNH VỰC: RESORT &amp; KHÁCH SẠN</span>
                  <span className="pillar-target-tag">3D MARKETING BĐS</span>
                </div>
                <h3 className="pillar-title">3D VISUALIZATION &amp; PHIM QUẢNG BÁ RESORT</h3>
                <p className="pillar-description">
                  Sản xuất gói hình ảnh 3D và video animation điện ảnh phục vụ chiến dịch truyền thông thu hút vốn đầu
                  tư và mở bán dịch vụ du lịch nghỉ dưỡng.
                </p>
                <ul className="pillar-checklist">
                  <li>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#121314" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span><strong>Phim 3D Cinematic giới thiệu tiện ích:</strong> Video chuyển động với âm thanh thiên
                      nhiên, tái hiện một ngày trải nghiệm trọn vẹn tại resort.</span>
                  </li>
                  <li>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#121314" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span><strong>Render hoàng hôn biển ánh vàng Golden Hour:</strong> Cảm xúc thư giãn tuyệt đối với
                      góc nhìn hướng đại dương mênh mông.</span>
                  </li>
                  <li>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#121314" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span><strong>Bản đồ phối cảnh tương tác toàn khu:</strong> Khách hàng có thể tương tác chọn từng
                      căn biệt thự để xem tầm nhìn thực tế.</span>
                  </li>
                  <li>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#121314" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span><strong>Bàn giao định dạng in ấn khổ lớn:</strong> File render 8K không vỡ nét phục vụ
                      billboard quảng cáo ngoài trời và brochure.</span>
                  </li>
                </ul>
                <div className="pillar-image-wrap">
                  <img
                    src="https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=900&q=80"
                    alt="Phối cảnh 3D hoàng hôn lãng mạn tại khu nghỉ dưỡng cao cấp" className="pillar-img"
                    loading="lazy" />
                </div>
              </article>
            </div>
          </div>

          
          <div className="domain-content-panel" id="panel-commercial" role="tabpanel">
            <div className="pillars-2col-grid">
              
              <article className="service-pillar-card">
                <div className="pillar-card-header">
                  <span className="pillar-num">LĨNH VỰC: SHOWROOM &amp; F&amp;B</span>
                  <span className="pillar-target-tag">KHÔNG GIAN TRẢI NGHIỆM</span>
                </div>
                <h3 className="pillar-title">THIẾT KẾ SHOWROOM, NHÀ HÀNG &amp; CAFE</h3>
                <p className="pillar-description">
                  Kiến tạo không gian thương mại định vị thương hiệu mạnh mẽ, dẫn dắt hành vi mua sắm và tối ưu hóa số
                  lượng chỗ ngồi mà vẫn giữ sự riêng tư thoải mái.
                </p>
                <ul className="pillar-checklist">
                  <li>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#121314" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span><strong>Tối ưu hóa lưu tuyến khách hàng (Customer Flow):</strong> Sắp xếp quầy order, khu vực
                      trải nghiệm sản phẩm và bàn ghế khoa học.</span>
                  </li>
                  <li>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#121314" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span><strong>Đồng bộ nhận diện thương hiệu (Brand DNA):</strong> Màu sắc, đường nét, ánh sáng và
                      vật liệu làm nổi bật câu chuyện thương hiệu.</span>
                  </li>
                  <li>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#121314" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span><strong>Giải pháp âm học &amp; thông gió khử mùi F&amp;B:</strong> Hệ thống tiêu âm và hút khí
                      cục bộ chuyên biệt cho nhà hàng sang trọng.</span>
                  </li>
                  <li>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#121314" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span><strong>Thiết kế thi công nhanh theo tiến độ mặt bằng:</strong> Bộ hồ sơ chi tiết giúp rút
                      ngắn thời gian hoàn thiện, tiết kiệm tiền thuê mặt bằng.</span>
                  </li>
                </ul>
                <div className="pillar-image-wrap">
                  <img src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=900&q=80"
                    alt="Không gian nhà hàng ẩm thực thiết kế hiện đại sang trọng" className="pillar-img" loading="lazy" />
                </div>
              </article>

              
              <article className="service-pillar-card">
                <div className="pillar-card-header">
                  <span className="pillar-num">LĨNH VỰC: SHOWROOM &amp; F&amp;B</span>
                  <span className="pillar-target-tag">DIỄN HỌA THƯƠNG MẠI</span>
                </div>
                <h3 className="pillar-title">DIỄN HỌA 3D BÁN LẺ &amp; GÓC CHECK-IN VIRAL</h3>
                <p className="pillar-description">
                  Phối cảnh 3D sống động với ánh sáng thương mại tập trung, tôn vinh sản phẩm trưng bày và tạo điểm nhấn
                  check-in lan tỏa trên mạng xã hội.
                </p>
                <ul className="pillar-checklist">
                  <li>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#121314" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span><strong>Render hiệu ứng ánh sáng đèn LED &amp; Neon Sign:</strong> Mô phỏng chính xác độ hoàn
                      màu CRI cao giúp sản phẩm lên hình rực rỡ.</span>
                  </li>
                  <li>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#121314" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span><strong>Phối cảnh mặt tiền Facade ban ngày &amp; ban đêm:</strong> Giúp chủ đầu tư hình dung
                      độ nhận diện thương hiệu từ khoảng cách 50m.</span>
                    <span><strong>Diễn họa góc nhìn mắt người (Eye-level 1.6m):</strong> Đảm bảo trải nghiệm thị giác
                      thực tế của khách hàng khi vừa bước qua cửa.</span>
                  </li>
                  <li>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#121314" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span><strong>Tiến độ bàn giao siêu tốc 48h - 72h:</strong> Hỗ trợ Agency và chủ đầu tư kịp thời nộp
                      hồ sơ đấu thầu mặt bằng trung tâm thương mại.</span>
                  </li>
                </ul>
                <div className="pillar-image-wrap">
                  <img
                    src="https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=900&q=80"
                    alt="Phối cảnh 3D không gian showroom nội thất và ánh sáng đèn nghệ thuật" className="pillar-img"
                    loading="lazy" />
                </div>
              </article>
            </div>
          </div>

        </div>

      </div>
    </section>

    
    <section className="trust-dark-section">
      <div className="content-container">

        <div className="trust-header-block reveal-item">
          <span className="trust-eyebrow">UY TÍN ĐƯỢC CHỨNG MINH QUA 500+ DỰ ÁN</span>
          <h2 className="trust-title">TẠI SAO 250+ GIA CHỦ &amp; ĐỐI TÁC TIN CHỌN KONTUR?</h2>
        </div>

        <div className="trust-4col-grid">

          <div className="trust-card reveal-item">
            <span className="trust-num">01</span>
            <h4 className="trust-card-title">Hình ảnh siêu thực 100%</h4>
            <p className="trust-card-desc">Ánh sáng, chất liệu và tỷ lệ chuẩn xác tuyệt đối, không có cảm giác "giả lập" hay
              hoạt hình.</p>
          </div>

          <div className="trust-card reveal-item delay-1">
            <span className="trust-num">02</span>
            <h4 className="trust-card-title">Chuẩn kỹ thuật thi công</h4>
            <p className="trust-card-desc">100% bản vẽ dựng từ mô hình BIM/CAD thực tế, đội thợ nhìn vào là thi công được
              ngay.</p>
          </div>

          <div className="trust-card reveal-item delay-2">
            <span className="trust-num">03</span>
            <h4 className="trust-card-title">Đúng hẹn cam kết</h4>
            <p className="trust-card-desc">Trả bài đúng tiến độ từng mốc, bảo hành chỉnh sửa 3 vòng miễn phí đến khi hoàn
              toàn hài lòng.</p>
          </div>

          <div className="trust-card reveal-item delay-3">
            <span className="trust-num">04</span>
            <h4 className="trust-card-title">Chi phí rõ ràng minh bạch</h4>
            <p className="trust-card-desc">Báo giá trọn gói không phát sinh, hỗ trợ tư vấn lựa chọn vật liệu tối ưu ngân
              sách.</p>
          </div>

        </div>

      </div>
    </section>


    
    <section className="applications-section" id="ung-dung-thuc-te">
      <div className="content-container">

        <div className="section-title-split reveal-item">
          <div className="title-left">
            <span className="sec-eyebrow">05. ỨNG DỤNG THỰC TẾ CHO KHÁCH HÀNG</span>
            <h2 className="sec-main-title">ỨNG DỤNG THỰC TẾ THEO TỪNG LĨNH VỰC &amp; NHU CẦU</h2>
          </div>
          <div className="title-right">
            <p className="sec-subtitle">
              Giải pháp diễn họa &amp; mô phỏng không gian được ứng dụng trực tiếp vào từng giai đoạn thực thi, xúc tiến
              bán hàng, kiểm soát chi phí và thi công thực tiễn.
            </p>
          </div>
        </div>

        
        <div className="usecase-filter-bar reveal-item">
          <button type="button" className="usecase-tab-btn active" data-filter="all">TẤT CẢ ỨNG DỤNG (06)</button>
          <button type="button" className="usecase-tab-btn" data-filter="bds">Bất Động Sản &amp; Quy Hoạch</button>
          <button type="button" className="usecase-tab-btn" data-filter="kts">Thiết Kế Kiến Trúc &amp; Nội Thất</button>
          <button type="button" className="usecase-tab-btn" data-filter="nha-thau">Thi Công &amp; Xây Dựng</button>
          <button type="button" className="usecase-tab-btn" data-filter="gia-chu">Nhà Ở &amp; Biệt Thự Tư Nhân</button>
          <button type="button" className="usecase-tab-btn" data-filter="hospitality">Resort, Hotel &amp; F&amp;B</button>
          <button type="button" className="usecase-tab-btn" data-filter="furniture">Catalogue &amp; Sản Phẩm Nội
            Thất</button>
        </div>

        
        <div className="usecases-scroll-container" id="usecasesScrollContainer">
          <div className="usecases-grid-3col">

          
          <article className="usecase-card reveal-item" data-category="bds">
            <div className="usecase-img-wrap">
              <img src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80"
                alt="Ứng dụng trong Dự Án Bất Động Sản & Quy Hoạch" className="usecase-img" />
              <div className="usecase-badge-row">
                <span className="usecase-target-tag">BẤT ĐỘNG SẢN &amp; QUY HOẠCH</span>
                <span className="usecase-num">01</span>
              </div>
            </div>
            <div className="usecase-body">
              <h3 className="usecase-title">Ứng Dụng Trong Mở Bán, Marketing &amp; Dự Án BĐS</h3>
              <div className="usecase-problem-box">
                <span className="prob-label">BÀI TOÁN &amp; NHU CẦU THỰC TẾ:</span>
                <p className="prob-text">Cần tư liệu hình ảnh &amp; phim 3D quy mô lớn để mở bán sớm (Presale), làm tài liệu
                  truyền thông, thuyết phục nhà đầu tư và khách hàng trước khi xây.</p>
              </div>
              <ul className="usecase-checklist">
                <li>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Phối cảnh tổng thể quy hoạch &amp; hệ tiện ích độ nét 8K</span>
                </li>
                <li>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Phim 3D Animation &amp; Tour trải nghiệm thực tế ảo VR 360°</span>
                </li>
                <li>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Bộ ảnh phối cảnh căn hộ mẫu, villa theo từng phân khu</span>
                </li>
              </ul>
              <div className="usecase-outcome-footer">
                <span className="outcome-label">GIÁ TRỊ THỰC TẾ ĐẠT ĐƯỢC:</span>
                <span className="outcome-val">Tăng 45% tốc độ chốt cọc presale &amp; nâng tầm định vị dự án</span>
              </div>
            </div>
          </article>

          
          <article className="usecase-card reveal-item delay-1" data-category="kts">
            <div className="usecase-img-wrap">
              <img src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80"
                alt="Ứng dụng trong Thiết Kế Kiến Trúc & Nội Thất" className="usecase-img" />
              <div className="usecase-badge-row">
                <span className="usecase-target-tag">THIẾT KẾ KIẾN TRÚC &amp; NỘI THẤT</span>
                <span className="usecase-num">02</span>
              </div>
            </div>
            <div className="usecase-body">
              <h3 className="usecase-title">Ứng Dụng Trong Trình Bày Ý Tưởng &amp; Đồ Án Kiến Trúc</h3>
              <div className="usecase-problem-box">
                <span className="prob-label">BÀI TOÁN &amp; NHU CẦU THỰC TẾ:</span>
                <p className="prob-text">Cần diễn họa chuẩn gu thẩm mỹ cao cấp (Editorial Standard) để khách hàng chốt duyệt
                  nhanh phương án ý tưởng hoặc tham gia các giải thưởng kiến trúc.</p>
              </div>
              <ul className="usecase-checklist">
                <li>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Mô phỏng ánh sáng tự nhiên &amp; chất cảm vật liệu siêu thực</span>
                </li>
                <li>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Dựng phối cảnh chuẩn xác theo file CAD/BIM/Skp</span>
                </li>
                <li>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Đảm bảo tiến độ bàn giao nghiêm ngặt từng mốc 48h - 72h</span>
                </li>
              </ul>
              <div className="usecase-outcome-footer">
                <span className="outcome-label">GIÁ TRỊ THỰC TẾ ĐẠT ĐƯỢC:</span>
                <span className="outcome-val">Tiết kiệm 60% thời gian render &amp; nâng cao tỷ lệ duyệt phương án</span>
              </div>
            </div>
          </article>

          
          <article className="usecase-card reveal-item delay-2" data-category="nha-thau">
            <div className="usecase-img-wrap">
              <img src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80"
                alt="Ứng dụng trong Thi Công & Xây Dựng" className="usecase-img" />
              <div className="usecase-badge-row">
                <span className="usecase-target-tag">THI CÔNG &amp; QUẢN LÝ XÂY DỰNG</span>
                <span className="usecase-num">03</span>
              </div>
            </div>
            <div className="usecase-body">
              <h3 className="usecase-title">Ứng Dụng Trong Khớp Nối Kỹ Thuật &amp; Biện Pháp Thi Công</h3>
              <div className="usecase-problem-box">
                <span className="prob-label">BÀI TOÁN &amp; NHU CẦU THỰC TẾ:</span>
                <p className="prob-text">Cần bản vẽ 3D chuẩn xác 1:1 với hồ sơ kỹ thuật để đội ngũ thợ hiểu ngay cấu tạo,
                  giải quyết xung đột bản vẽ 2D và không bị đập sửa khi đang xây.</p>
              </div>
              <ul className="usecase-checklist">
                <li>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Mô phỏng 3D cấu tạo khớp nối &amp; chi tiết kết cấu kỹ thuật</span>
                </li>
                <li>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Phối cảnh trực quan giải trình biện pháp thi công</span>
                </li>
                <li>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Bóc tách khối lượng vật tư khớp 100% với hình ảnh thực</span>
                </li>
              </ul>
              <div className="usecase-outcome-footer">
                <span className="outcome-label">GIÁ TRỊ THỰC TẾ ĐẠT ĐƯỢC:</span>
                <span className="outcome-val">Triệt tiêu 95% sai sót thi công &amp; bàn giao công trình đúng tiến độ</span>
              </div>
            </div>
          </article>

          
          <article className="usecase-card reveal-item" data-category="gia-chu">
            <div className="usecase-img-wrap">
              <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
                alt="Ứng dụng trong Nhà Ở & Biệt Thự Tư Nhân" className="usecase-img" />
              <div className="usecase-badge-row">
                <span className="usecase-target-tag">NHÀ Ở &amp; BIỆT THỰ TƯ NHÂN</span>
                <span className="usecase-num">04</span>
              </div>
            </div>
            <div className="usecase-body">
              <h3 className="usecase-title">Ứng Dụng Trong Định Hình &amp; Xây Dựng Không Gian Sống</h3>
              <div className="usecase-problem-box">
                <span className="prob-label">BÀI TOÁN &amp; NHU CẦU THỰC TẾ:</span>
                <p className="prob-text">Muốn "nhìn thấy trước ngôi nhà tương lai" với ánh sáng, màu sắc và vật liệu thực tế
                  trước khi đặt bút ký hợp đồng thi công tiền tỷ.</p>
              </div>
              <ul className="usecase-checklist">
                <li>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Trực quan hóa toàn bộ ngôi nhà từ ngoại thất đến từng góc phòng</span>
                </li>
                <li>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Thử nghiệm nhiều giải pháp vật liệu &amp; tối ưu công năng phong thủy</span>
                </li>
                <li>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Bảng dự toán chi phí chi tiết theo đúng thiết kế</span>
                </li>
              </ul>
              <div className="usecase-outcome-footer">
                <span className="outcome-label">GIÁ TRỊ THỰC TẾ ĐẠT ĐƯỢC:</span>
                <span className="outcome-val">An tâm 100% khi chi tiền &amp; loại bỏ hoàn toàn chi phí phát sinh</span>
              </div>
            </div>
          </article>

          
          <article className="usecase-card reveal-item delay-1" data-category="hospitality">
            <div className="usecase-img-wrap">
              <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80"
                alt="Ứng dụng trong Resort, Hotel & F&B" className="usecase-img" />
              <div className="usecase-badge-row">
                <span className="usecase-target-tag">RESORT, HOTEL &amp; F&amp;B</span>
                <span className="usecase-num">05</span>
              </div>
            </div>
            <div className="usecase-body">
              <h3 className="usecase-title">Ứng Dụng Trong Nhận Diện Không Gian Resort, Khách Sạn &amp; F&amp;B</h3>
              <div className="usecase-problem-box">
                <span className="prob-label">BÀI TOÁN &amp; NHU CẦU THỰC TẾ:</span>
                <p className="prob-text">Cần concept kiến trúc độc bản tạo điểm nhấn "viral check-in" và tư liệu hình ảnh
                  cao cấp để làm truyền thông sớm, nhận booking trước khai trương.</p>
              </div>
              <ul className="usecase-checklist">
                <li>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Phối cảnh trải nghiệm không gian theo góc máy Cinematic</span>
                </li>
                <li>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Mô phỏng ánh sáng ban ngày &amp; không khí dạ tiệc ban đêm</span>
                </li>
                <li>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Xuất file hình ảnh độ phân giải cao dùng ngay cho Website/OTA</span>
                </li>
              </ul>
              <div className="usecase-outcome-footer">
                <span className="outcome-label">GIÁ TRỊ THỰC TẾ ĐẠT ĐƯỢC:</span>
                <span className="outcome-val">Khai thác truyền thông sớm 2 tháng &amp; lấp đầy phòng khi khai trương</span>
              </div>
            </div>
          </article>

          
          <article className="usecase-card reveal-item delay-2" data-category="furniture">
            <div className="usecase-img-wrap">
              <img src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80"
                alt="Ứng dụng trong Catalogue & Sản Phẩm Nội Thất" className="usecase-img" />
              <div className="usecase-badge-row">
                <span className="usecase-target-tag">CATALOGUE &amp; SẢN PHẨM NỘI THẤT</span>
                <span className="usecase-num">06</span>
              </div>
            </div>
            <div className="usecase-body">
              <h3 className="usecase-title">Ứng Dụng Trong Catalogue &amp; Dàn Cảnh Sản Phẩm 3D</h3>
              <div className="usecase-problem-box">
                <span className="prob-label">BÀI TOÁN &amp; NHU CẦU THỰC TẾ:</span>
                <p className="prob-text">Cần chụp ảnh catalogue sản phẩm/vật liệu trong không gian thực nhưng chi phí dàn
                  dựng studio bối cảnh quá đắt đỏ và mất nhiều tuần lễ.</p>
              </div>
              <ul className="usecase-checklist">
                <li>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>3D Product Rendering chi tiết từng vân gỗ, đường may, kim loại</span>
                </li>
                <li>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Dàn cảnh sản phẩm vào không gian kiến trúc sang trọng mẫu</span>
                </li>
                <li>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Dễ dàng thay đổi chất liệu, màu sắc và góc chụp trong vài phút</span>
                </li>
              </ul>
              <div className="usecase-outcome-footer">
                <span className="outcome-label">GIÁ TRỊ THỰC TẾ ĐẠT ĐƯỢC:</span>
                <span className="outcome-val">Tiết kiệm 70% chi phí chụp studio &amp; phát hành catalogue siêu tốc</span>
              </div>
            </div>
          </article>

          </div>
        </div>

        
        <div className="stats-counter-strip reveal-item">
          <div className="stat-cell">
            <span className="stat-num" data-target="250">250+</span>
            <span className="stat-label">Gia chủ &amp; Đối tác hài lòng</span>
          </div>
          <div className="stat-cell">
            <span className="stat-num" data-target="98">98%</span>
            <span className="stat-label">Đánh giá 5 sao hài lòng</span>
          </div>
          <div className="stat-cell">
            <span className="stat-num" data-target="12">12+</span>
            <span className="stat-label">Năm kinh nghiệm kiến trúc</span>
          </div>
          <div className="stat-cell">
            <span className="stat-num" data-target="8">08</span>
            <span className="stat-label">Giải thưởng kiến trúc uy tín</span>
          </div>
        </div>

      </div>
    </section>


    
    <section className="clients-marquee-section" id="khach-hang">
      <div className="content-container">

        <div className="section-title-split reveal-item">
          <div className="title-left">
            <span className="sec-eyebrow">06. UY TÍN &amp; KHÁCH HÀNG ĐỒNG HÀNH</span>
            <h2 className="sec-main-title">250+ ĐỐI TÁC &amp; KHÁCH HÀNG TRÊN TOÀN QUỐC</h2>
          </div>
          <div className="title-right">
            <p className="sec-subtitle">
              Hơn 500+ dự án thực tế đã hoàn thành, đồng hành cùng các chủ đầu tư danh tiếng, văn phòng kiến trúc hàng
              đầu và hàng trăm gia chủ không gian sống cao cấp.
            </p>
          </div>
        </div>

        
        <div className="client-industry-grid reveal-item">
          <div className="client-ind-card">
            <span className="ind-num">120+</span>
            <h4 className="ind-name">Biệt Thự &amp; Villa Nghỉ Dưỡng</h4>
            <p className="ind-desc">Gia chủ cao cấp tại TP.HCM, Hà Nội, Đà Lạt, Hồ Tràm, Phú Quốc</p>
          </div>
          <div className="client-ind-card">
            <span className="ind-num">45+</span>
            <h4 className="ind-name">Dự Án BĐS &amp; Đô Thị</h4>
            <p className="ind-desc">Chủ đầu tư, sàn phân phối F1 mở bán presale &amp; marketing</p>
          </div>
          <div className="client-ind-card">
            <span className="ind-num">60+</span>
            <h4 className="ind-name">Studio &amp; Văn Phòng KTS</h4>
            <p className="ind-desc">Đối tác thiết kế ủy thác diễn họa 3D chuẩn tạp chí quốc tế</p>
          </div>
          <div className="client-ind-card">
            <span className="ind-num">35+</span>
            <h4 className="ind-name">Resort, Hotel &amp; Chuỗi F&amp;B</h4>
            <p className="ind-desc">Concept không gian check-in độc bản &amp; chuỗi nhà hàng sang trọng</p>
          </div>
        </div>

      </div>

      
      <div className="infinite-marquee-container marquee-left-flow">
        <div className="marquee-track">
          
          <article className="partner-story-card">
            <div className="partner-card-bg">
              <img src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80" alt="Masterise Homes" className="partner-bg-img" loading="lazy" />
              <div className="partner-card-overlay"></div>
            </div>
            <div className="story-card-inner">
              <div className="story-brand-center">
                <h3 className="story-brand-name">MASTERISE HOMES</h3>
                <span className="story-brand-sub">Bất động sản hạng sang</span>
              </div>
            </div>
          </article>

          <article className="partner-story-card">
            <div className="partner-card-bg">
              <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80" alt="Novaland Group" className="partner-bg-img" loading="lazy" />
              <div className="partner-card-overlay"></div>
            </div>
            <div className="story-card-inner">
              <div className="story-brand-center">
                <h3 className="story-brand-name">NOVALAND GROUP</h3>
                <span className="story-brand-sub">Đô thị &amp; Nghỉ dưỡng</span>
              </div>
            </div>
          </article>

          <article className="partner-story-card">
            <div className="partner-card-bg">
              <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80" alt="Coteccons" className="partner-bg-img" loading="lazy" />
              <div className="partner-card-overlay"></div>
            </div>
            <div className="story-card-inner">
              <div className="story-brand-center">
                <h3 className="story-brand-name">COTECCONS</h3>
                <span className="story-brand-sub">Tổng thầu xây dựng</span>
              </div>
            </div>
          </article>

          <article className="partner-story-card">
            <div className="partner-card-bg">
              <img src="https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=600&q=80" alt="Hòa Bình Corp" className="partner-bg-img" loading="lazy" />
              <div className="partner-card-overlay"></div>
            </div>
            <div className="story-card-inner">
              <div className="story-brand-center">
                <h3 className="story-brand-name">HÒA BÌNH CORP</h3>
                <span className="story-brand-sub">Tập đoàn xây dựng</span>
              </div>
            </div>
          </article>

          <article className="partner-story-card">
            <div className="partner-card-bg">
              <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80" alt="MIA Design" className="partner-bg-img" loading="lazy" />
              <div className="partner-card-overlay"></div>
            </div>
            <div className="story-card-inner">
              <div className="story-brand-center">
                <h3 className="story-brand-name">MIA DESIGN</h3>
                <span className="story-brand-sub">Văn phòng kiến trúc</span>
              </div>
            </div>
          </article>

          <article className="partner-story-card">
            <div className="partner-card-bg">
              <img src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80" alt="An Cường Wood" className="partner-bg-img" loading="lazy" />
              <div className="partner-card-overlay"></div>
            </div>
            <div className="story-card-inner">
              <div className="story-brand-center">
                <h3 className="story-brand-name">AN CƯỜNG WOOD</h3>
                <span className="story-brand-sub">Vật liệu nội thất</span>
              </div>
            </div>
          </article>

          <article className="partner-story-card">
            <div className="partner-card-bg">
              <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80" alt="AA Corporation" className="partner-bg-img" loading="lazy" />
              <div className="partner-card-overlay"></div>
            </div>
            <div className="story-card-inner">
              <div className="story-brand-center">
                <h3 className="story-brand-name">AA CORPORATION</h3>
                <span className="story-brand-sub">Nội thất 5 sao</span>
              </div>
            </div>
          </article>

          <article className="partner-story-card">
            <div className="partner-card-bg">
              <img src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80" alt="Sun Group" className="partner-bg-img" loading="lazy" />
              <div className="partner-card-overlay"></div>
            </div>
            <div className="story-card-inner">
              <div className="story-brand-center">
                <h3 className="story-brand-name">SUN GROUP</h3>
                <span className="story-brand-sub">Quần thể nghỉ dưỡng</span>
              </div>
            </div>
          </article>

          <article className="partner-story-card">
            <div className="partner-card-bg">
              <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80" alt="Akari City" className="partner-bg-img" loading="lazy" />
              <div className="partner-card-overlay"></div>
            </div>
            <div className="story-card-inner">
              <div className="story-brand-center">
                <h3 className="story-brand-name">AKARI CITY</h3>
                <span className="story-brand-sub">Đô thị chuẩn Nhật</span>
              </div>
            </div>
          </article>

          <article className="partner-story-card">
            <div className="partner-card-bg">
              <img src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80" alt="Decora Arch" className="partner-bg-img" loading="lazy" />
              <div className="partner-card-overlay"></div>
            </div>
            <div className="story-card-inner">
              <div className="story-brand-center">
                <h3 className="story-brand-name">DECORA ARCH</h3>
                <span className="story-brand-sub">Design Agency</span>
              </div>
            </div>
          </article>

          
          <article className="partner-story-card">
            <div className="partner-card-bg">
              <img src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80" alt="Masterise Homes" className="partner-bg-img" loading="lazy" />
              <div className="partner-card-overlay"></div>
            </div>
            <div className="story-card-inner">
              <div className="story-brand-center">
                <h3 className="story-brand-name">MASTERISE HOMES</h3>
                <span className="story-brand-sub">Bất động sản hạng sang</span>
              </div>
            </div>
          </article>

          <article className="partner-story-card">
            <div className="partner-card-bg">
              <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80" alt="Novaland Group" className="partner-bg-img" loading="lazy" />
              <div className="partner-card-overlay"></div>
            </div>
            <div className="story-card-inner">
              <div className="story-brand-center">
                <h3 className="story-brand-name">NOVALAND GROUP</h3>
                <span className="story-brand-sub">Đô thị &amp; Nghỉ dưỡng</span>
              </div>
            </div>
          </article>

          <article className="partner-story-card">
            <div className="partner-card-bg">
              <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80" alt="Coteccons" className="partner-bg-img" loading="lazy" />
              <div className="partner-card-overlay"></div>
            </div>
            <div className="story-card-inner">
              <div className="story-brand-center">
                <h3 className="story-brand-name">COTECCONS</h3>
                <span className="story-brand-sub">Tổng thầu xây dựng</span>
              </div>
            </div>
          </article>

          <article className="partner-story-card">
            <div className="partner-card-bg">
              <img src="https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=600&q=80" alt="Hòa Bình Corp" className="partner-bg-img" loading="lazy" />
              <div className="partner-card-overlay"></div>
            </div>
            <div className="story-card-inner">
              <div className="story-brand-center">
                <h3 className="story-brand-name">HÒA BÌNH CORP</h3>
                <span className="story-brand-sub">Tập đoàn xây dựng</span>
              </div>
            </div>
          </article>

          <article className="partner-story-card">
            <div className="partner-card-bg">
              <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80" alt="MIA Design" className="partner-bg-img" loading="lazy" />
              <div className="partner-card-overlay"></div>
            </div>
            <div className="story-card-inner">
              <div className="story-brand-center">
                <h3 className="story-brand-name">MIA DESIGN</h3>
                <span className="story-brand-sub">Văn phòng kiến trúc</span>
              </div>
            </div>
          </article>

          <article className="partner-story-card">
            <div className="partner-card-bg">
              <img src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80" alt="An Cường Wood" className="partner-bg-img" loading="lazy" />
              <div className="partner-card-overlay"></div>
            </div>
            <div className="story-card-inner">
              <div className="story-brand-center">
                <h3 className="story-brand-name">AN CƯỜNG WOOD</h3>
                <span className="story-brand-sub">Vật liệu nội thất</span>
              </div>
            </div>
          </article>

          <article className="partner-story-card">
            <div className="partner-card-bg">
              <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80" alt="AA Corporation" className="partner-bg-img" loading="lazy" />
              <div className="partner-card-overlay"></div>
            </div>
            <div className="story-card-inner">
              <div className="story-brand-center">
                <h3 className="story-brand-name">AA CORPORATION</h3>
                <span className="story-brand-sub">Nội thất 5 sao</span>
              </div>
            </div>
          </article>

          <article className="partner-story-card">
            <div className="partner-card-bg">
              <img src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80" alt="Sun Group" className="partner-bg-img" loading="lazy" />
              <div className="partner-card-overlay"></div>
            </div>
            <div className="story-card-inner">
              <div className="story-brand-center">
                <h3 className="story-brand-name">SUN GROUP</h3>
                <span className="story-brand-sub">Quần thể nghỉ dưỡng</span>
              </div>
            </div>
          </article>

          <article className="partner-story-card">
            <div className="partner-card-bg">
              <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80" alt="Akari City" className="partner-bg-img" loading="lazy" />
              <div className="partner-card-overlay"></div>
            </div>
            <div className="story-card-inner">
              <div className="story-brand-center">
                <h3 className="story-brand-name">AKARI CITY</h3>
                <span className="story-brand-sub">Đô thị chuẩn Nhật</span>
              </div>
            </div>
          </article>

          <article className="partner-story-card">
            <div className="partner-card-bg">
              <img src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80" alt="Decora Arch" className="partner-bg-img" loading="lazy" />
              <div className="partner-card-overlay"></div>
            </div>
            <div className="story-card-inner">
              <div className="story-brand-center">
                <h3 className="story-brand-name">DECORA ARCH</h3>
                <span className="story-brand-sub">Design Agency</span>
              </div>
            </div>
          </article>
        </div>
      </div>



    </section>


    
    <section className="gallery-dark-exhibition" id="du-an">
      <div className="content-container">

        
        <div className="gallery-header-block reveal-item">
          <div className="gallery-header-top">
            <div className="gallery-title-group">
              <span className="gallery-eyebrow">07. ARCHITECTURAL SHOWCASE &amp; SAMPLES</span>
              <h2 className="gallery-main-heading">BỘ SƯU TẬP CÔNG TRÌNH &amp; MẪU THIẾT KẾ THỰC TẾ</h2>
            </div>
            <div className="gallery-header-right">
              <p className="gallery-sub-text">
                Không chỉ là bản vẽ 3D đơn thuần, mỗi công trình là một tác phẩm kiến trúc chuẩn kỹ thuật, tối ưu hóa
                công năng và sẵn sàng thi công chính xác 100%.
              </p>
              <div className="gallery-stats-pills">
                <span className="gallery-pill">✦ 500+ Phối cảnh 8K</span>
                <span className="gallery-pill">✦ 100% Khớp kỹ thuật</span>
                <span className="gallery-pill">✦ VR 360° Sống động</span>
              </div>
            </div>
          </div>

          
          <div className="gallery-filter-bar">
            <button className="gallery-tab-btn active" data-gallery-filter="all" aria-selected="true">
              <span className="tab-dot"></span>
              <span>Tất Cả Mẫu (06)</span>
            </button>
            <button className="gallery-tab-btn" data-gallery-filter="villa" aria-selected="false">
              <span className="tab-dot"></span>
              <span>Biệt Thự &amp; Villa</span>
            </button>
            <button className="gallery-tab-btn" data-gallery-filter="townhouse" aria-selected="false">
              <span className="tab-dot"></span>
              <span>Nhà Phố Kiến Trúc</span>
            </button>
            <button className="gallery-tab-btn" data-gallery-filter="penthouse" aria-selected="false">
              <span className="tab-dot"></span>
              <span>Penthouse &amp; Căn Hộ</span>
            </button>
            <button className="gallery-tab-btn" data-gallery-filter="resort" aria-selected="false">
              <span className="tab-dot"></span>
              <span>Resort &amp; Nghỉ Dưỡng</span>
            </button>
            <button className="gallery-tab-btn" data-gallery-filter="fnb" aria-selected="false">
              <span className="tab-dot"></span>
              <span>Không Gian F&amp;B &amp; Cafe</span>
            </button>
          </div>
        </div>

        
        <div className="gallery-showcase-split-layout">

          
          <div className="gallery-split-left-col">
            <div className="gallery-hero-spotlight reveal-item"
              data-project-id="p-lakeside" id="galleryHeroSpotlight">
              <div className="spotlight-visual-frame" id="spotlightVisualFrame">
                <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=90"
                  alt="Dự án tiêu điểm The Lakeside Horizon Villa" className="spotlight-main-img" id="spotlightMainImg" />
                <div className="spotlight-gradient-overlay"></div>

                <div className="spotlight-badge-top">
                  <span className="badge-accent-tag" id="spotlightBadgeAccent">DỰ ÁN ĐANG XEM</span>
                  <span className="badge-scope-tag" id="spotlightBadgeScope">KIẾN TRÚC &amp; DIỄN HỌA 3D 8K</span>
                </div>

                
                <div className="spotlight-hotspots-layer" id="spotlightHotspotsLayer"></div>

                
                <div className="spotlight-zoom-hint" id="spotlightZoomHint">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    <line x1="11" y1="8" x2="11" y2="14"></line>
                    <line x1="8" y1="11" x2="14" y2="11"></line>
                  </svg>
                  <span>Phóng to ảnh 8K &amp; Mặt bằng</span>
                </div>
              </div>

              
              <div className="spotlight-info-pane" id="spotlightInfoPane">
                <div className="spotlight-header">
                  <div className="spotlight-cat-tag" id="spotlightCatTag">BIỆT THỰ NGHỈ DƯỠNG CAO CẤP</div>
                  <h3 className="spotlight-title" id="spotlightTitle">THE LAKESIDE HORIZON VILLA</h3>
                  <p className="spotlight-loc" id="spotlightLoc">Hồ Tràm, Bà Rịa — Vũng Tàu</p>
                </div>

                <p className="spotlight-narrative" id="spotlightNarrative">
                  Biệt thự ven hồ kết hợp tinh tế giữa bê tông trần mộc mạc và hệ lam gỗ thông gió tự nhiên. Toàn bộ phương
                  án diễn họa 3D được mô phỏng đường đi ánh sáng mặt trời theo từng mùa trong năm để tối ưu vi khí hậu.
                </p>

                <div className="spotlight-specs-grid" id="spotlightSpecsGrid">
                  <div className="spec-cell">
                    <span className="spec-k">Diện tích sàn</span>
                    <span className="spec-v">850 m²</span>
                  </div>
                  <div className="spec-cell">
                    <span className="spec-k">Quy mô</span>
                    <span className="spec-v">3 Tầng • 5 PN</span>
                  </div>
                  <div className="spec-cell">
                    <span className="spec-k">Phong cách</span>
                    <span className="spec-v">Modern Tropical Zen</span>
                  </div>
                  <div className="spec-cell">
                    <span className="spec-k">Mức độ khớp thực tế</span>
                    <span className="spec-v highlight-green">100% Không sai lệch</span>
                  </div>
                </div>

                <div className="spotlight-action-row">
                  <a href="#nhan-tu-van" className="btn-spotlight-primary-cta" id="spotlightConsultBtn">
                    <span>TƯ VẤN PHƯƠNG ÁN NÀY</span>
                    <span className="btn-icon">→</span>
                  </a>
                  <a href="tel:0984384190" className="btn-spotlight-consult">
                    <span>Hotline: 0984 384 190</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          
          <div className="gallery-split-right-col">
            <div className="gallery-curated-grid">

              
              <article className="project-gallery-card reveal-item gallery-project-item" data-category="townhouse"
                data-project-id="p-stone">
                <div className="gallery-card-thumb">
                  <img src="https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1000&q=80"
                    alt="Minimalist Stone House Đà Lạt" className="gallery-card-img" />
                  <div className="gallery-card-overlay">
                    <span className="card-view-btn">Xem chi tiết ↗</span>
                  </div>
                  <span className="card-floating-badge">NHÀ PHỐ KIẾN TRÚC</span>
                </div>
                <div className="gallery-card-content">
                  <div className="card-meta-line">
                    <span className="card-loc">Đà Lạt • 420 m²</span>
                    <span className="card-style">Minimalist Zen</span>
                  </div>
                  <h4 className="card-title">Minimalist Stone House</h4>
                  <p className="card-desc">Nhà phố 4 tầng kết hợp giếng trời trung tâm và đá tự nhiên nguyên khối mang lại không
                    gian sống tĩnh tại.</p>
                  <div className="card-footer-specs">
                    <span className="spec-chip">4 Tầng</span>
                    <span className="spec-chip">Giếng Trời</span>
                    <span className="spec-chip">Bàn Giao 2026</span>
                  </div>
                </div>
              </article>

              
              <article className="project-gallery-card reveal-item delay-1 gallery-project-item" data-category="penthouse"
                data-project-id="p-skyline">
                <div className="gallery-card-thumb">
                  <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80"
                    alt="Duplex Skyline Penthouse Hà Nội" className="gallery-card-img" />
                  <div className="gallery-card-overlay">
                    <span className="card-view-btn">Xem chi tiết ↗</span>
                  </div>
                  <span className="card-floating-badge">PENTHOUSE &amp; CĂN HỘ</span>
                </div>
                <div className="gallery-card-content">
                  <div className="card-meta-line">
                    <span className="card-loc">Hà Nội • 350 m²</span>
                    <span className="card-style">Contemporary Luxury</span>
                  </div>
                  <h4 className="card-title">Duplex Skyline Penthouse</h4>
                  <p className="card-desc">Căn hộ thông tầng cao cấp với tầm nhìn Panorama toàn thành phố, nội thất gỗ óc chó và
                    hệ chiếu sáng gián tiếp tinh tế.</p>
                  <div className="card-footer-specs">
                    <span className="spec-chip">Thông Tầng 6.5m</span>
                    <span className="spec-chip">Gỗ Óc Chó</span>
                    <span className="spec-chip">Bàn Giao 2026</span>
                  </div>
                </div>
              </article>

              
              <article className="project-gallery-card reveal-item gallery-project-item" data-category="resort"
                data-project-id="p-forest">
                <div className="gallery-card-thumb">
                  <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80"
                    alt="Boutique Forest Retreat Ba Vì" className="gallery-card-img" />
                  <div className="gallery-card-overlay">
                    <span className="card-view-btn">Xem chi tiết ↗</span>
                  </div>
                  <span className="card-floating-badge">RESORT &amp; NGHỈ DƯỠNG</span>
                </div>
                <div className="gallery-card-content">
                  <div className="card-meta-line">
                    <span className="card-loc">Ba Vì • 1,200 m²</span>
                    <span className="card-style">Eco Luxury Retreat</span>
                  </div>
                  <h4 className="card-title">Boutique Forest Retreat</h4>
                  <p className="card-desc">Khu nghỉ dưỡng sinh thái nép mình dưới tán thông già, cấu trúc mái dốc mộc mạc hòa
                    quyện hoàn hảo vào địa hình tự nhiên.</p>
                  <div className="card-footer-specs">
                    <span className="spec-chip">8 Bungalow</span>
                    <span className="spec-chip">Đất Nện &amp; Gỗ</span>
                    <span className="spec-chip">Bàn Giao 2026</span>
                  </div>
                </div>
              </article>

              
              <article className="project-gallery-card reveal-item delay-1 gallery-project-item" data-category="fnb"
                data-project-id="p-komorebi">
                <div className="gallery-card-thumb">
                  <img src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1000&q=80"
                    alt="Komorebi Tea House TP.HCM" className="gallery-card-img" />
                  <div className="gallery-card-overlay">
                    <span className="card-view-btn">Xem chi tiết ↗</span>
                  </div>
                  <span className="card-floating-badge">F&amp;B &amp; CAFE</span>
                </div>
                <div className="gallery-card-content">
                  <div className="card-meta-line">
                    <span className="card-loc">TP. Hồ Chí Minh • 280 m²</span>
                    <span className="card-style">Wabi-Sabi Japandi</span>
                  </div>
                  <h4 className="card-title">Komorebi Tea House</h4>
                  <p className="card-desc">Concept quán trà phong cách Wabi-Sabi với ánh sáng xuyên kẽ lá, vách đất mộc và hồ
                    nước cá Koi tạo điểm check-in hút khách.</p>
                  <div className="card-footer-specs">
                    <span className="spec-chip">Sức Chứa 65 Chỗ</span>
                    <span className="spec-chip">Vườn Zen</span>
                    <span className="spec-chip">Đã Khai Trương</span>
                  </div>
                </div>
              </article>

              
              <article className="project-gallery-card reveal-item gallery-project-item" data-category="villa"
                data-project-id="p-tropical">
                <div className="gallery-card-thumb">
                  <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=80"
                    alt="The Tropical Courtyard Villa Đà Nẵng" className="gallery-card-img" />
                  <div className="gallery-card-overlay">
                    <span className="card-view-btn">Xem chi tiết ↗</span>
                  </div>
                  <span className="card-floating-badge">BIỆT THỰ NHIỆT ĐỚI</span>
                </div>
                <div className="gallery-card-content">
                  <div className="card-meta-line">
                    <span className="card-loc">Đà Nẵng • 620 m²</span>
                    <span className="card-style">Tropical Modernism</span>
                  </div>
                  <h4 className="card-title">The Tropical Courtyard Villa</h4>
                  <p className="card-desc">Biệt thự sân trong với hồ bơi xanh ngắt bao quanh phòng khách, tối ưu hóa thông gió
                    tự nhiên thích ứng hoàn hảo khí hậu miền Trung.</p>
                  <div className="card-footer-specs">
                    <span className="spec-chip">3 Tầng • 4 PN</span>
                    <span className="spec-chip">Sân Trong</span>
                    <span className="spec-chip">Bàn Giao 2026</span>
                  </div>
                </div>
              </article>

            </div>
          </div>

        </div>

      </div>
    </section>

    
    <div className="gallery-modal-overlay" id="galleryModal" aria-hidden="true">
      <div className="gallery-modal-dialog">
        <button className="gallery-modal-close" id="modalCloseBtn" aria-label="Đóng popup">✕</button>

        <div className="modal-body-split">
          <div className="modal-gallery-view">
            <img src="" alt="Chi tiết công trình Kontur" className="modal-main-img" id="modalMainImg" />
            <div className="modal-img-caption" id="modalImgCaption"></div>
          </div>

          <div className="modal-details-view">
            <span className="modal-cat-tag" id="modalCatTag"></span>
            <h3 className="modal-proj-title" id="modalProjTitle"></h3>
            <p className="modal-proj-loc" id="modalProjLoc"></p>

            <div className="modal-desc-box">
              <h5 className="modal-sub-h">Ý TƯỞNG THIẾT KẾ &amp; GIẢI PHÁP KỸ THUẬT</h5>
              <p className="modal-proj-desc" id="modalProjDesc"></p>
            </div>

            <div className="modal-specs-list" id="modalSpecsList"></div>

            <div className="modal-cta-box">
              <a href="#nhan-tu-van" className="btn-modal-contact" id="modalContactBtn">
                <span>YÊU CẦU TƯ VẤN THIẾT KẾ TƯƠNG TỰ</span>
                <span className="btn-arr">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>


    
    <section className="pricing-architectural-section" id="bao-gia">
      <div className="content-container">

        
        <div className="pricing-header-block reveal-item">
          <div className="pricing-header-split">
            <div className="pricing-title-col">
              <span className="pricing-eyebrow">08. TRANSPARENT PRICING &amp; GUARANTEES</span>
              <h2 className="pricing-main-heading">BÁO GIÁ MINH BẠCH &amp; YẾU TỐ CẠNH TRANH</h2>
            </div>
            <div className="pricing-desc-col">
              <p className="pricing-sub-desc">
                Báo giá trọn gói một lần duy nhất, không chi phí ẩn, không phụ phí phát sinh. Cam kết tiến độ bàn giao 7
                ngày và hỗ trợ chỉnh sửa linh hoạt bằng văn bản hợp đồng pháp lý.
              </p>
            </div>
          </div>
        </div>

        
        <div className="pricing-tiers-grid">

          
          <div className="pricing-tier-card reveal-item">
            <div className="tier-card-header">
              <span className="tier-badge-pill">GÓI TRẢI NGHIỆM NHANH</span>
              <h3 className="tier-name">PHÁC THẢO &amp; NGOẠI THẤT 3D</h3>
              <p className="tier-summary">Dành cho gia chủ muốn xem trước hình khối, màu sắc mặt tiền nhà phố hoặc hồ sơ xin
                phép xây dựng.</p>
            </div>

            <div className="tier-price-box">
              <span className="tier-price-from">CHỈ TỪ</span>
              <div className="tier-price-number-row">
                <span className="tier-price-val">490.000</span>
                <span className="tier-price-unit">VNĐ / góc</span>
              </div>
              <span className="tier-package-alt">hoặc 1.800.000 VNĐ trọn gói 4 góc ngoại thất</span>
            </div>

            <div className="tier-commitments-bar">
              <div className="commit-item">
                <span className="commit-icon">⏱</span>
                <span className="commit-text">Bàn giao: <strong>3 – 5 ngày</strong></span>
              </div>
              <div className="commit-item">
                <span className="commit-icon">✦</span>
                <span className="commit-text">Chỉnh sửa: <strong>02 lần miễn phí</strong></span>
              </div>
            </div>

            <ul className="tier-features-list">
              <li>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span><strong>03 Phối cảnh 3D ngoại thất 4K</strong> ban ngày &amp; hoàng hôn</span>
              </li>
              <li>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span><strong>Tặng 02 lần đổi phong cách / màu sơn &amp; gạch ốp</strong> miễn phí</span>
              </li>
              <li>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>File ảnh phân giải cao in ấn &amp; gửi thợ xem trước hình khối</span>
              </li>
              <li>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>Tư vấn hướng nắng &amp; lam chắn gió cơ bản</span>
              </li>
            </ul>

            <a href="#nhan-tu-van" className="btn-tier-action outline">
              <span>ĐĂNG KÝ GÓI NGOẠI THẤT</span>
              <span className="btn-arr">→</span>
            </a>
          </div>

          
          <div className="pricing-tier-card featured-tier reveal-item delay-1">
            <div className="tier-spotlight-ribbon">✦ ĐƯỢC 75% GIA CHỦ LỰA CHỌN</div>

            <div className="tier-card-header">
              <span className="tier-badge-pill highlight">GÓI TOÀN DIỆN TIÊU CHUẨN</span>
              <h3 className="tier-name">THIẾT KẾ KIẾN TRÚC &amp; 3D</h3>
              <p className="tier-summary">Giải pháp hoàn chỉnh từ phân khu mặt bằng phong thủy đến toàn bộ phối cảnh 3D nội
                - ngoại thất 8K.</p>
            </div>

            <div className="tier-price-box">
              <span className="tier-price-from">MỨC GIÁ CHUẨN</span>
              <div className="tier-price-number-row">
                <span className="tier-price-val">160.000 – 220.000</span>
                <span className="tier-price-unit">VNĐ / m²</span>
              </div>
              <span className="tier-package-alt">Báo giá theo tổng diện tích sàn xây dựng</span>
            </div>

            <div className="tier-commitments-bar">
              <div className="commit-item">
                <span className="commit-icon">⏱</span>
                <span className="commit-text">Bàn giao: <strong>7 – 10 ngày</strong></span>
              </div>
              <div className="commit-item">
                <span className="commit-icon">✦</span>
                <span className="commit-text">Mặt bằng: <strong>Sửa đến khi ưng ý</strong></span>
              </div>
            </div>

            <ul className="tier-features-list">
              <li>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span><strong>Quy hoạch mặt bằng công năng chuẩn vi khí hậu &amp; phong thủy</strong></span>
              </li>
              <li>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span><strong>Trọn bộ phối cảnh 3D 8K</strong> tất cả các phòng &amp; kiến trúc mặt tiền</span>
              </li>
              <li>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span><strong>TẶNG Video Animation 3D &amp; Tour trải nghiệm VR 360°</strong></span>
              </li>
              <li>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span><strong>Chỉnh sửa phương án mặt bằng không giới hạn</strong> trước khi render 3D</span>
              </li>
              <li>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>KTS Trưởng trực tiếp chủ trì và bảo vệ đồ án</span>
              </li>
            </ul>

            <a href="#nhan-tu-van" className="btn-tier-action solid">
              <span>ĐĂNG KÝ GÓI TOÀN DIỆN</span>
              <span className="btn-arr">→</span>
            </a>
          </div>

          
          <div className="pricing-tier-card reveal-item">
            <div className="tier-card-header">
              <span className="tier-badge-pill">TRỌN GÓI THI CÔNG</span>
              <h3 className="tier-name">HỒ SƠ KỸ THUẬT &amp; DỰ TOÁN</h3>
              <p className="tier-summary">Bộ hồ sơ kỹ thuật thi công hoàn chỉnh kèm bảng bóc tách khối lượng chi tiết từng
                viên gạch, thanh thép.</p>
            </div>

            <div className="tier-price-box">
              <span className="tier-price-from">MỨC GIÁ CHUẨN</span>
              <div className="tier-price-number-row">
                <span className="tier-price-val">260.000 – 350.000</span>
                <span className="tier-price-unit">VNĐ / m²</span>
              </div>
              <span className="tier-package-alt">Bao gồm toàn bộ Kiến trúc + Kết cấu + MEP</span>
            </div>

            <div className="tier-commitments-bar">
              <div className="commit-item">
                <span className="commit-icon">⏱</span>
                <span className="commit-text">Bàn giao: <strong>15 – 20 ngày</strong></span>
              </div>
              <div className="commit-item">
                <span className="commit-icon">✦</span>
                <span className="commit-text">Giám sát: <strong>Hỗ trợ kỹ thuật 24/7</strong></span>
              </div>
            </div>

            <ul className="tier-features-list">
              <li>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span><strong>Bao gồm toàn bộ quyền lợi của Gói 02 (Kiến trúc + 3D 8K)</strong></span>
              </li>
              <li>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span><strong>Hồ sơ kết cấu chịu lực, cấp thoát nước &amp; điện thông minh (MEP)</strong></span>
              </li>
              <li>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span><strong>Bảng dự toán bóc tách vật tư chi tiết (Chống đội vốn khi thợ xây)</strong></span>
              </li>
              <li>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>KTS đồng hành giám sát tác giả trực tiếp các mốc đổ móng &amp; sàn</span>
              </li>
            </ul>

            <a href="#nhan-tu-van" className="btn-tier-action outline">
              <span>ĐĂNG KÝ HỒ SƠ THI CÔNG</span>
              <span className="btn-arr">→</span>
            </a>
          </div>

        </div>


        
        <div className="pricing-calculator-block reveal-item" id="priceEstimatorBlock">
          <div className="calc-header-row">
            <div className="calc-header-left">
              <span className="calc-eyebrow">✦ CÔNG CỤ TƯƠNG TÁC TRỰC TUYẾN</span>
              <h3 className="calc-title">TÍNH DỰ TOÁN CHI PHÍ &amp; THỜI GIAN THEO DIỆN TÍCH</h3>
              <p className="calc-sub">Kéo thanh trượt diện tích xây dựng (m²) để xem ngay chi phí ước tính và tiến độ cam
                kết theo quy mô công trình.</p>
            </div>
            <div className="calc-header-badge">
              <span>BÁO GIÁ TỨC THÌ 100% MIỄN PHÍ</span>
            </div>
          </div>

          <div className="calc-body-grid">

            
            <div className="calc-controls-col">

              
              <div className="calc-control-group">
                <label className="calc-label">1. Loại hình công trình của bạn:</label>
                <div className="calc-type-buttons">
                  <button type="button" className="calc-type-btn active" data-type-rate="180000"
                    data-type-name="Nhà phố hiện đại">Nhà phố hiện đại</button>
                  <button type="button" className="calc-type-btn" data-type-rate="210000"
                    data-type-name="Biệt thự & Villa">Biệt thự &amp; Villa</button>
                  <button type="button" className="calc-type-btn" data-type-rate="160000"
                    data-type-name="Penthouse / Căn hộ">Penthouse / Căn hộ</button>
                  <button type="button" className="calc-type-btn" data-type-rate="190000"
                    data-type-name="F&B / Khách sạn">F&amp;B / Khách sạn</button>
                </div>
              </div>

              
              <div className="calc-control-group">
                <label className="calc-label">2. Gói dịch vụ bạn quan tâm:</label>
                <div className="calc-tier-buttons">
                  <button type="button" className="calc-tier-btn" data-tier-mult="0.6" data-tier-days="3"
                    data-tier-name="Phác Thảo Ngoại Thất 3D">Ngoại thất 3D</button>
                  <button type="button" className="calc-tier-btn active" data-tier-mult="1.0" data-tier-days="7"
                    data-tier-name="Kiến Trúc & 3D Toàn Diện">Kiến trúc &amp; 3D (Khuyên dùng)</button>
                  <button type="button" className="calc-tier-btn" data-tier-mult="1.5" data-tier-days="15"
                    data-tier-name="Hồ Sơ Thi Công & Dự Toán">Hồ sơ thi công trọn gói</button>
                </div>
              </div>

              
              <div className="calc-control-group">
                <div className="calc-slider-header">
                  <label className="calc-label">3. Tổng diện tích sàn xây dựng (m²):</label>
                  <div className="calc-area-display">
                    <span className="area-val" id="calcAreaVal">250</span>
                    <span className="area-unit">m² sàn</span>
                  </div>
                </div>

                <div className="calc-slider-wrap">
                  <input type="range" id="calcAreaSlider" min="50" max="1000" step="10" value="250"
                    className="calc-range-slider" />
                </div>

                
                <div className="calc-area-presets">
                  <span className="preset-label">Chọn nhanh:</span>
                  <button type="button" className="calc-preset-btn" data-preset="100">100m²</button>
                  <button type="button" className="calc-preset-btn active" data-preset="250">250m²</button>
                  <button type="button" className="calc-preset-btn" data-preset="400">400m²</button>
                  <button type="button" className="calc-preset-btn" data-preset="650">650m²</button>
                  <button type="button" className="calc-preset-btn" data-preset="850">850m²</button>
                </div>
              </div>

            </div>

            
            <div className="calc-results-col">
              <div className="calc-result-card">
                <span className="res-card-label">KẾT QUẢ DỰ TOÁN SƠ BỘ</span>

                <div className="res-price-block">
                  <span className="res-price-caption">TỔNG CHI PHÍ THIẾT KẾ DỰ TÍNH:</span>
                  <div className="res-price-main">
                    <span className="res-number" id="calcResultPrice">45.000.000</span>
                    <span className="res-curr">VNĐ</span>
                  </div>
                  <span className="res-unit-detail" id="calcUnitDetail">~ 180.000 VNĐ / m² sàn</span>
                </div>

                <div className="res-specs-rows">
                  <div className="res-spec-row">
                    <span className="res-k">Thời gian bàn giao cam kết:</span>
                    <span className="res-v" id="calcResultDays">7 – 10 Ngày làm việc</span>
                  </div>
                  <div className="res-spec-row">
                    <span className="res-k">Cam kết số lần chỉnh sửa:</span>
                    <span className="res-v" id="calcResultRevisions">Miễn phí đến khi ưng ý 100%</span>
                  </div>
                  <div className="res-spec-row">
                    <span className="res-k">Cam kết phát sinh chi phí:</span>
                    <span className="res-v green">0% Cam kết không phát sinh</span>
                  </div>
                </div>

                <a href="#nhan-tu-van" className="btn-calc-submit" id="calcCtaBtn">
                  <span>NHẬN BÁO GIÁ CHI TIẾT THEO MẶT BẰNG NÀY</span>
                  <span className="btn-arr">→</span>
                </a>

                <p className="calc-disclaimer">
                  * Mức giá trên là dự toán sơ bộ. KTS trưởng sẽ khảo sát mặt bằng thực tế để tối ưu chi phí thấp nhất
                  cho gia chủ.
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>


    
    <section className="faq-lead-section" id="nhan-tu-van">
      <div className="content-container">

        <div className="faq-lead-split-grid">

          
          <div className="faq-col reveal-item" id="faq">
            <span className="sec-eyebrow">GIẢI ĐÁP THẮC MẮC</span>
            <h2 className="faq-main-title">CÂU HỎI THƯỜNG GẶP KHI LÀM VIỆC ONLINE</h2>
            <p className="faq-desc">
              Quy trình làm việc từ xa chuyên nghiệp giúp chúng tôi phục vụ khách hàng trên toàn quốc và quốc tế một
              cách chính xác nhất.
            </p>

            <div className="faq-accordion-list">

              
              <div className="accordion-item active">
                <button className="accordion-header" aria-expanded="true">
                  <span>1. Làm việc online từ xa thì khảo sát hiện trạng như thế nào?</span>
                  <span className="acc-icon">−</span>
                </button>
                <div className="accordion-body">
                  <p>Chúng tôi tiếp nhận tọa độ Google Maps, sổ đỏ, hình ảnh &amp; video khu đất từ gia chủ. Với công
                    trình phức tạp, KTS của Kontur sẽ trực tiếp bay đến khảo sát hoặc hướng dẫn bạn đo đạc chi tiết.</p>
                </div>
              </div>

              
              <div className="accordion-item">
                <button className="accordion-header" aria-expanded="false">
                  <span>2. Tôi muốn sửa bản vẽ nhiều lần thì có tính thêm phí không?</span>
                  <span className="acc-icon">+</span>
                </button>
                <div className="accordion-body">
                  <p>Giai đoạn lên ý tưởng mặt bằng và 3D ban đầu được chỉnh sửa thoải mái đến khi gia chủ hoàn toàn ưng
                    ý. Chúng tôi cam kết không thu thêm phụ phí vô lý.</p>
                </div>
              </div>

              
              <div className="accordion-item">
                <button className="accordion-header" aria-expanded="false">
                  <span>3. Thời gian hoàn thành hồ sơ thiết kế mất bao lâu?</span>
                  <span className="acc-icon">+</span>
                </button>
                <div className="accordion-body">
                  <p>Phương án 3D sơ bộ hoàn thành trong 3 - 5 ngày làm việc. Bộ hồ sơ kỹ thuật thi công hoàn chỉnh từ
                    10 - 20 ngày tùy theo quy mô và độ phức tạp của công trình.</p>
                </div>
              </div>

              
              <div className="accordion-item">
                <button className="accordion-header" aria-expanded="false">
                  <span>4. Sau khi thiết kế xong Kontur có hỗ trợ giám sát thi công không?</span>
                  <span className="acc-icon">+</span>
                </button>
                <div className="accordion-body">
                  <p>Có. Kontur luôn đồng hành giám sát tác giả từ xa qua nhóm Zalo kỹ thuật 24/7 và hỗ trợ kiểm tra
                    trực tiếp các mốc quan trọng (đổ móng, đổ sàn, nghiệm thu hoàn thiện).</p>
                </div>
              </div>

            </div>

            <div className="direct-contact-box">
              <span className="call-caption">TƯ VẤN TRỰC TIẾP QUA HOTLINE / ZALO:</span>
              <a href="tel:0984384190" className="call-number">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path
                    d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <span>+84 (0) 984 384 190</span>
              </a>
            </div>
          </div>

          
          <div className="lead-form-col reveal-item delay-1">
            <div className="lead-card-box">
              <div className="lead-card-header">
                <span className="lead-promo-tag">ƯU ĐÃI ĐẶC BIỆT THÁNG NÀY</span>
                <h3 className="lead-card-title">ĐĂNG KÝ NHẬN PHÁC THẢO MẶT BẰNG MIỄN PHÍ</h3>
                <p className="lead-card-sub">Chỉ dành cho 10 gia chủ đăng ký sớm nhất trong tuần này để được KTS trưởng trực
                  tiếp tư vấn.</p>
              </div>

              <form className="lead-submit-form" id="leadRegistrationForm" >

                <div className="form-field">
                  <label htmlFor="leadName">Họ và tên gia chủ*</label>
                  <input type="text" id="leadName" placeholder="e.g., Anh Tuấn / Chị Lan" required />
                </div>

                <div className="form-field">
                  <label htmlFor="leadPhone">Số điện thoại / Zalo nhận bản vẽ*</label>
                  <input type="tel" id="leadPhone" placeholder="098x xxx xxx" required />
                </div>

                <div className="form-row-2col">
                  <div className="form-field">
                    <label htmlFor="leadType">Loại hình công trình</label>
                    <div className="select-wrap">
                      <select id="leadType">
                        <option value="biet-thu">Biệt thự / Villa</option>
                        <option value="nha-pho">Nhà phố / Shophouse</option>
                        <option value="can-ho">Căn hộ Penthouse / Duplex</option>
                        <option value="homestay">Khu nghỉ dưỡng / Homestay</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-field">
                    <label htmlFor="leadLocation">Địa điểm xây dựng</label>
                    <input type="text" id="leadLocation" placeholder="TP. HCM / Hà Nội / Tỉnh..." />
                  </div>
                </div>

                <div className="form-field">
                  <label htmlFor="leadNote">Diện tích đất &amp; Nhu cầu sơ bộ</label>
                  <textarea id="leadNote" rows={3}
                    placeholder="Ví dụ: Đất 10x20m, xây 3 tầng phong cách hiện đại tối giản, 4 phòng ngủ..."></textarea>
                </div>

                <button type="submit" className="btn-lead-submit" id="leadSubmitBtn">
                  <span>GỬI YÊU CẦU &amp; NHẬN PHÁC THẢO MIỄN PHÍ</span>
                  <span className="btn-arrow">→</span>
                </button>

                <div className="lead-status-msg" id="leadStatusMsg"></div>

                <div className="lead-card-footer">
                  <span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Bảo mật thông tin 100%
                  </span>
                  <span>KTS liên hệ trong 30 phút</span>
                </div>

              </form>
            </div>
          </div>

        </div>

      </div>
    </section>

  
<div className="floating-lead-widget" id="floatingLeadWidget">

    
    <button type="button" className="floating-lead-toggle-btn" id="floatingLeadToggleBtn" aria-label="Mở form đăng ký nhận phác thảo mặt bằng">
      <span className="floating-btn-pulse pulse-1"></span>
      <span className="floating-btn-pulse pulse-2"></span>
      <span className="floating-btn-icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
      </span>
      <span className="floating-btn-text">Liên hệ</span>
    </button>

    
    <div className="floating-lead-panel" id="floatingLeadPanel" aria-hidden="true">
      <div className="floating-lead-header">
        <div className="floating-lead-title-wrap">
          <h4 className="floating-lead-title">ĐĂNG KÝ NHẬN PHÁC THẢO MIỄN PHÍ</h4>
          <p className="floating-lead-sub">KTS Trưởng tư vấn trực tiếp 1:1 trong 30 phút</p>
        </div>
        <button type="button" className="floating-lead-close-btn" id="floatingLeadCloseBtn" aria-label="Thu nhỏ form">✕</button>
      </div>

      <form className="floating-lead-form" id="floatingLeadForm" >
        <div className="floating-form-field">
          <label htmlFor="floatName">Họ và tên gia chủ*</label>
          <input type="text" id="floatName" placeholder="e.g., Anh Tuấn / Chị Lan" required />
        </div>

        <div className="floating-form-field">
          <label htmlFor="floatPhone">Số điện thoại / Zalo nhận bản vẽ*</label>
          <input type="tel" id="floatPhone" placeholder="098x xxx xxx" required />
        </div>

        <div className="floating-form-row">
          <div className="floating-form-field">
            <label htmlFor="floatType">Loại công trình</label>
            <div className="select-wrap">
              <select id="floatType">
                <option value="biet-thu">Biệt thự / Villa</option>
                <option value="nha-pho">Nhà phố / Shophouse</option>
                <option value="can-ho">Căn hộ Penthouse</option>
                <option value="homestay">Resort / Homestay</option>
                <option value="fnb">Showroom / F&amp;B</option>
              </select>
            </div>
          </div>

          <div className="floating-form-field">
            <label htmlFor="floatLocation">Địa điểm xây dựng</label>
            <input type="text" id="floatLocation" placeholder="TP.HCM / Hà Nội..." />
          </div>
        </div>

        <div className="floating-form-field">
          <label htmlFor="floatService">Gói dịch vụ quan tâm</label>
          <div className="select-wrap">
            <select id="floatService">
              <option value="toan-dien">Thiết kế Kiến trúc &amp; 3D Toàn diện</option>
              <option value="dien-hoa-3d">Diễn họa 3D Siêu thực 8K</option>
              <option value="ho-so-thi-cong">Hồ sơ thi công &amp; Dự toán bóc tách</option>
              <option value="tu-van-so-bo">Tư vấn phác thảo 2D sơ bộ (0đ)</option>
            </select>
          </div>
        </div>

        <div className="floating-status-msg" id="floatStatusMsg"></div>

        <button type="submit" className="floating-submit-btn" id="floatSubmitBtn">
          <span>GỬI YÊU CẦU &amp; NHẬN PHÁC THẢO</span>
          <span className="btn-arr">→</span>
        </button>

        <div className="floating-hotline-footer">
          <span>Hoặc gọi hotline KTS: </span>
          <a href="tel:0984384190"><strong>0984 384 190</strong></a>
        </div>
      </form>
    </div>

  </div>

  
    </div>
  );
}
