import React, { useState } from 'react'
import { Trash2, Minus, Plus, ShoppingBag, ArrowLeft, ChevronRight } from 'lucide-react'
import { CouponService } from '../api'

const CartPage = ({ cart, setCart, onNavigate }) => {
  const [discount, setDiscount] = useState(0)
  const [couponCode, setCouponCode] = useState('')

  const subtotal = cart.reduce((acc, item) => acc + ((item.salePrice || item.price) * item.quantity), 0)
  const shipping = subtotal > 1000000 ? 0 : 30000

  const handleUpdateQty = (cartId, delta) => {
    setCart(prev => prev.map(item => 
      item.cartId === cartId ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ))
  }

  const handleRemove = (cartId) => {
    setCart(prev => prev.filter(item => item.cartId !== cartId))
  }

  const handleApplyCoupon = async () => {
    try {
      const res = await CouponService.apply(couponCode, subtotal)
      setDiscount(res.data.discount)
      alert('Áp dụng mã thành công!')
    } catch (e) {
      alert('Mã không hợp lệ hoặc đã hết hạn.')
    }
  }

  if (cart.length === 0) {
    return (
      <div className="animate-fade" style={{ padding: '100px 0', textAlign: 'center', background: '#f8fafc', minHeight: '80vh' }}>
        <div className="container">
          <div style={{ maxWidth: '500px', margin: '0 auto', background: 'white', padding: '60px', borderRadius: '32px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}>
            <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <ShoppingBag size={48} color="#94a3b8" />
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '16px' }}>Giỏ hàng trống</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Có vẻ như bạn chưa thêm sản phẩm nào vào giỏ hàng của mình.</p>
            <button onClick={() => onNavigate('products')} className="btn-primary" style={{ width: '100%', height: '56px' }}>Khám phá sản phẩm ngay</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fade" style={{ padding: '60px 0', background: '#f8fafc', minHeight: '100vh' }}>
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
           <button onClick={() => onNavigate('home')} className="btn-ghost" style={{ padding: '8px' }}><ArrowLeft size={24} /></button>
           <h1 style={{ fontSize: '2.5rem', fontWeight: '800', letterSpacing: '-1px' }}>Giỏ hàng</h1>
           <span style={{ background: 'var(--primary)', color: 'white', padding: '4px 12px', borderRadius: '99px', fontSize: '0.9rem', fontWeight: '700' }}>{cart.length} sản phẩm</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '40px', alignItems: 'start' }}>
          {/* Item List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {cart.map(item => (
              <div key={item.cartId} style={{ display: 'flex', gap: '24px', background: 'white', padding: '24px', borderRadius: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)', position: 'relative' }}>
                <div style={{ width: '120px', height: '150px', borderRadius: '16px', background: '#f8fafc', overflow: 'hidden' }}>
                  <img src={item.image || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=600'} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '8px' }}>{item.name}</h3>
                      <button 
                        onClick={() => handleRemove(item.cartId)}
                        style={{ background: '#fff1f2', color: '#e11d48', border: 'none', padding: '8px', borderRadius: '10px', cursor: 'pointer' }}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    {(item.selectedColor || item.selectedSize) && (
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '600' }}>
                        Màu: <span style={{ color: 'var(--text-main)' }}>{item.selectedColor || 'N/A'}</span> • Size: <span style={{ color: 'var(--text-main)' }}>{item.selectedSize || 'N/A'}</span>
                      </p>
                    )}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', borderRadius: '12px', padding: '4px' }}>
                      <button onClick={() => handleUpdateQty(item.cartId, -1)} style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer' }}>
                        <Minus size={14} />
                      </button>
                      <span style={{ width: '40px', textAlign: 'center', fontWeight: '700' }}>{item.quantity}</span>
                      <button onClick={() => handleUpdateQty(item.cartId, 1)} style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer' }}>
                        <Plus size={14} />
                      </button>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--primary)' }}>{((item.salePrice || item.price) * item.quantity).toLocaleString('vi-VN')}₫</p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{(item.salePrice || item.price)?.toLocaleString('vi-VN')}₫ / sản phẩm</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary Sidebar */}
          <div style={{ position: 'sticky', top: '100px' }}>
            <div style={{ background: 'white', padding: '32px', borderRadius: '32px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '24px' }}>Chi tiết đơn hàng</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Tạm tính</span>
                  <span style={{ fontWeight: '700' }}>{subtotal.toLocaleString('vi-VN')}₫</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Phí vận chuyển</span>
                  <span style={{ fontWeight: '700', color: shipping === 0 ? '#10b981' : 'var(--text-main)' }}>
                    {shipping === 0 ? 'Miễn phí' : `${shipping.toLocaleString('vi-VN')}₫`}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Giảm giá</span>
                  <span style={{ fontWeight: '700', color: '#10b981' }}>-{discount.toLocaleString('vi-VN')}₫</span>
                </div>
              </div>

              <div style={{ borderTop: '2px dashed #f1f5f9', paddingTop: '24px', marginBottom: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: '700' }}>Tổng thanh toán</span>
                  <span style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--primary)' }}>{(subtotal + shipping - discount).toLocaleString('vi-VN')}₫</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'right' }}>(Đã bao gồm VAT nếu có)</p>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <p style={{ fontSize: '0.9rem', fontWeight: '700', marginBottom: '12px' }}>Mã giảm giá</p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input 
                    type="text" 
                    placeholder="Nhập mã ưu đãi..." 
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    style={{ flex: 1, padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none', background: '#f8fafc' }}
                  />
                  <button onClick={handleApplyCoupon} className="btn-primary" style={{ padding: '0 20px', fontSize: '0.9rem' }}>Áp dụng</button>
                </div>
              </div>

              <button onClick={() => onNavigate('checkout')} className="btn-primary" style={{ width: '100%', height: '64px', fontSize: '1.1rem', borderRadius: '16px', justifyContent: 'center' }}>
                Tiến hành thanh toán <ChevronRight size={20} style={{ marginLeft: '8px' }} />
              </button>

              <div style={{ marginTop: '24px', padding: '16px', background: '#f8fafc', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981' }}></div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Miễn phí giao hàng cho đơn hàng trên 1.000.000₫</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPage
