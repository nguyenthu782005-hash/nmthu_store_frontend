import React, { useState, useEffect } from 'react'
import { ArrowRight, Star } from 'lucide-react'

const Hero = ({ banners, onExplore }) => {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!banners || banners.length <= 1) return
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % banners.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [banners])

  const activeBanner = banners && banners.length > 0 ? banners[current] : null

  return (
    <section style={{ padding: '80px 0', background: 'white', position: 'relative', overflow: 'hidden' }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', alignItems: 'center', gap: '60px' }}>
        <div className="animate-fade" key={current}>
          <span className="badge" style={{ color: 'var(--primary)', background: 'rgba(99, 102, 241, 0.1)', marginBottom: '16px' }}>BST Mới 2024</span>
          <h2 style={{ fontSize: '4.5rem', fontWeight: '800', lineHeight: '1.1', marginBottom: '24px', letterSpacing: '-2px' }}>
            {activeBanner ? activeBanner.title : <>Nâng Tầm <br /> <span className="grad-text">Phong Cách</span> Bản Thân</>}
          </h2>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '40px', maxWidth: '500px' }}>
            Khám phá bộ sưu tập thời trang cao cấp với thiết kế hiện đại, tinh tế và chất liệu bền vững giúp bạn tự tin tỏa sáng mỗi ngày.
          </p>
          <div style={{ display: 'flex', gap: '16px' }}>
            <button className="btn-primary" onClick={onExplore}>
              Mua ngay thôi <ArrowRight size={20} />
            </button>
            <button className="btn-ghost" style={{ padding: '12px 24px', border: '1px solid #e2e8f0' }}>Xem Lookbook</button>
          </div>
        </div>
        <div style={{ position: 'relative' }}>
          <div style={{ width: '100%', aspectRatio: '4/5', background: '#f8fafc', borderRadius: '32px', overflow: 'hidden', transform: 'rotate(2deg)' }}>
             <img 
               src={activeBanner ? activeBanner.imageUrl : "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800"} 
               alt={activeBanner ? activeBanner.title : "Hero"} 
               style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
             />
          </div>
          <div style={{ position: 'absolute', bottom: '40px', left: '-40px', background: 'white', padding: '24px', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', transform: 'rotate(-2deg)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <div style={{ display: 'flex' }}>
                {[1,2,3,4,5].map(i => <Star key={i} size={14} fill="#fca311" color="#fca311" />)}
              </div>
              <span style={{ fontWeight: '700' }}>4.9/5</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Hơn 10k+ khách hàng tin dùng</p>
          </div>
        </div>
      </div>
      {banners && banners.length > 1 && (
        <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px' }}>
          {banners.map((_, idx) => (
            <div 
              key={idx} 
              onClick={() => setCurrent(idx)}
              style={{ 
                width: idx === current ? '24px' : '8px', 
                height: '8px', 
                borderRadius: '4px', 
                background: idx === current ? 'var(--primary)' : '#cbd5e1', 
                cursor: 'pointer',
                transition: 'all 0.3s'
              }} 
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default Hero
