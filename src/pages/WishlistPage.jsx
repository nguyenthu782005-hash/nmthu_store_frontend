import React from 'react'
import ProductCard from '../components/Product/ProductCard'
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react'

const WishlistPage = ({ wishlist, onToggleWishlist, onAddToCart, onProductSelect, onNavigate }) => {
  return (
    <div className="animate-fade" style={{ padding: '60px 0', background: '#f8fafc', minHeight: '100vh' }}>
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px' }}>
          <div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '8px', letterSpacing: '-1px' }}>Danh sách yêu thích</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
              Bạn có {wishlist.length} sản phẩm trong danh sách yêu thích
            </p>
          </div>
          <button 
            className="btn-ghost" 
            onClick={() => onNavigate('products')}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '14px', border: '1px solid #e2e8f0', background: 'white' }}
          >
            Tiếp tục mua sắm <ArrowRight size={18} />
          </button>
        </div>

        {wishlist.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '32px' }}>
            {wishlist.map(prod => (
              <ProductCard 
                key={prod.productId} 
                product={prod} 
                wishlist={wishlist}
                onToggleWishlist={onToggleWishlist}
                onAddToCart={onAddToCart}
                onClick={() => onProductSelect(prod)}
              />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '120px 40px', background: 'white', borderRadius: '32px', border: '2px dashed #e2e8f0' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#fff1f2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <Heart size={40} color="#e11d48" fill="#e11d48" />
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '12px' }}>Danh sách đang trống</h3>
            <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto 24px' }}>
              Hãy thêm những sản phẩm bạn yêu thích vào danh sách này để dễ dàng theo dõi và mua sắm sau nhé!
            </p>
            <button onClick={() => onNavigate('products')} className="btn-primary">Khám phá sản phẩm</button>
          </div>
        )}
      </div>
    </div>
  )
}

export default WishlistPage
