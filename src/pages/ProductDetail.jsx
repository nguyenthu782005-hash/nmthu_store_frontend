import React from 'react'
import { Star } from 'lucide-react'

const ProductDetail = ({ product, onClose, onAddToCart }) => {
  if (!product) return null

  return (
    <div className="animate-fade" style={{ background: 'white', minHeight: '100vh', padding: '60px 0' }}>
      <div className="container">
        <button className="btn-ghost" onClick={onClose} style={{ marginBottom: '32px' }}>
           &larr; Quay lại danh sách
        </button>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px' }}>
          <div style={{ borderRadius: '32px', overflow: 'hidden', background: '#f8fafc' }}>
            <img 
              src={product.image || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=600'} 
              alt={product.name} 
              style={{ width: '100%', height: 'auto' }}
            />
          </div>
          <div>
            <span className="badge" style={{ marginBottom: '16px', display: 'inline-block' }}>{product.category?.name || 'Mới nhất'}</span>
            <h2 style={{ fontSize: '3rem', fontWeight: '800', lineHeight: '1.2', marginBottom: '24px' }}>{product.name}</h2>
            <p style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '32px' }}>{product.price?.toLocaleString('vi-VN')}₫</p>
            
            <div style={{ borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9', padding: '24px 0', marginBottom: '32px' }}>
              <h4 style={{ fontWeight: '700', marginBottom: '12px' }}>Mô tả sản phẩm</h4>
              <p style={{ color: 'var(--text-muted)' }}>{product.description || 'Sản phẩm cao cấp chất lượng tuyệt hảo.'}</p>
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
              <button 
                className="btn-primary" 
                style={{ flex: 1, height: '56px', fontSize: '1.1rem' }}
                onClick={() => onAddToCart(product)}
              >
                Thêm vào giỏ hàng
              </button>
              <button className="btn-ghost" style={{ border: '1px solid #e2e8f0', width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Star size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
