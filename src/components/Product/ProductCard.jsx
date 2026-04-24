import React from 'react'
import { Plus, Heart } from 'lucide-react'

const ProductCard = ({ product, wishlist, onToggleWishlist, onAddToCart, onClick }) => {
  const hasDiscount = product.salePrice && product.salePrice < product.price
  const discountPercent = hasDiscount ? Math.round((1 - product.salePrice / product.price) * 100) : 0
  const isWishlisted = wishlist?.some(item => item.productId === product.productId)

  return (
    <div className="product-card" onClick={onClick}>
      <div style={{ position: 'relative', width: '100%', aspectRatio: '3/4', borderRadius: '24px', background: '#f8fafc', overflow: 'hidden', marginBottom: '16px' }}>
        <img 
          src={product.image || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500'} 
          alt={product.name} 
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
          className="product-img"
        />
        
        {hasDiscount && (
          <div style={{ position: 'absolute', top: '16px', left: '16px', background: '#ef4444', color: 'white', padding: '6px 12px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: '800', boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)', zIndex: 10 }}>
            -{discountPercent}%
          </div>
        )}

        <button 
          style={{ position: 'absolute', top: '16px', right: '16px', backgroundColor: isWishlisted ? '#fff1f2' : 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)', border: 'none', padding: '10px', borderRadius: '14px', cursor: 'pointer', zIndex: 10, transition: '0.2s' }}
          onClick={(e) => { e.stopPropagation(); onToggleWishlist(product); }}
        >
          <Heart size={18} color={isWishlisted ? '#e11d48' : '#64748b'} fill={isWishlisted ? '#e11d48' : 'none'} />
        </button>

        <button 
          onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
          style={{ position: 'absolute', bottom: '16px', right: '16px', backgroundColor: 'white', border: 'none', padding: '12px', borderRadius: '16px', cursor: 'pointer', boxShadow: '0 8px 20px rgba(0,0,0,0.1)', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          className="add-btn"
        >
          <Plus size={22} color="var(--primary)" />
        </button>
      </div>

      <div style={{ padding: '0 4px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>{product.category?.name || 'New Arrival'}</span>
          {product.brand && (
            <span style={{ fontSize: '0.75rem', color: 'var(--secondary)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{product.brand.name}</span>
          )}
        </div>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '8px', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.name}</h3>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
          <span style={{ fontSize: '1.2rem', fontWeight: '900', color: 'var(--primary)' }}>{(product.salePrice || product.price)?.toLocaleString('vi-VN')}₫</span>
          {hasDiscount && (
            <span style={{ fontSize: '0.9rem', color: '#94a3b8', textDecoration: 'line-through', fontWeight: '600' }}>{product.price?.toLocaleString('vi-VN')}₫</span>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductCard
