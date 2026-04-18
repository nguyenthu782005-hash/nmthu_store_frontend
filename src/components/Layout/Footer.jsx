import React from 'react'
import { Facebook, Instagram, Twitter, ArrowRight } from 'lucide-react'

const Footer = () => (
  <footer style={{ padding: '80px 0', borderTop: '1px solid #f1f5f9' }}>
    <div className="container">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '40px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '24px' }}>CLOTH<span className="grad-text">STORE</span></h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Trải nghiệm mua sắm thời trang trực tuyến hiện đại và chuyên nghiệp nhất.</p>
          <div style={{ display: 'flex', gap: '16px' }}>
            {[Facebook, Instagram, Twitter].map((Icon, idx) => (
              <div key={idx} style={{ width: '40px', height: '40px', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <Icon size={18} />
              </div>
            ))}
          </div>
        </div>
        <div>
          <h4 style={{ fontWeight: '800', marginBottom: '24px' }}>Mua sắm</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', color: 'var(--text-muted)' }}>
            <li>Thanh toán</li>
            <li>Vận chuyển</li>
            <li>Chính sách đổi trả</li>
            <li>Câu hỏi thường gặp</li>
          </ul>
        </div>
        <div>
          <h4 style={{ fontWeight: '800', marginBottom: '24px' }}>Thông tin</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', color: 'var(--text-muted)' }}>
            <li>Về chúng tôi</li>
            <li>Liên hệ</li>
            <li>Hệ thống cửa hàng</li>
            <li>Blog thời trang</li>
          </ul>
        </div>
        <div>
          <h4 style={{ fontWeight: '800', marginBottom: '24px' }}>Bản tin</h4>
          <p style={{ color: 'var(--text-muted)', marginBottom: '16px', fontSize: '0.9rem' }}>Đăng ký nhận thông tin khuyến mãi mới nhất.</p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input type="text" placeholder="Email của bạn..." style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none' }} />
            <button style={{ background: 'black', color: 'white', border: 'none', padding: '0 16px', borderRadius: '12px' }}><ArrowRight size={18} /></button>
          </div>
        </div>
      </div>
      <div style={{ marginTop: '60px', paddingTop: '40px', borderTop: '1px solid #f1f5f9', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
        &copy; 2024 CLOTH STORE - Bản quyền thuộc về Nguyen Minh Thu
      </div>
    </div>
  </footer>
)

export default Footer
