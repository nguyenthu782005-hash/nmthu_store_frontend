import React from 'react'
import { Plus } from 'lucide-react'

const ProductCard = ({ product, onAddToCart, onClick }) => {
  return (
    <div className="product-card" onClick={onClick}>
      <div style={{ width: '100%', aspectRatio: '3/4', borderRadius: '12px', background: '#f8fafc', overflow: 'hidden', marginBottom: '16px', position: 'relative' }}>
        <img 
          src={product.image || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=600'} 
          alt={product.name} 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <button 
          onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
          style={{ position: 'absolute', bottom: '12px', right: '12px', backgroundColor: 'white', border: 'none', padding: '10px', borderRadius: '12px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
        >
          <Plus size={20} color="var(--primary)" />
        </button>
      </div>
      <div>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>{product.category?.name || 'BST Mới'}</span>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '8px' }}>{product.name}</h3>
        <p style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--primary)' }}>{product.price?.toLocaleString('vi-VN')}₫</p>
      </div>
    </div>
  )
}

export default ProductCard
