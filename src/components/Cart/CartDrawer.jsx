import React, { useState } from 'react'
import { X, ShoppingBag, Plus, Minus } from 'lucide-react'
import { CouponService } from '../../api'

const CartDrawer = ({ isOpen, onClose, cart, setCart }) => {
  const [discount, setDiscount] = useState(0)
  const [couponCode, setCouponCode] = useState('')

  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0)

  const handleUpdateQty = (id, delta) => {
    setCart(prev => prev.map(item => 
      item.productId === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ))
  }

  const handleRemove = (id) => {
    setCart(prev => prev.filter(item => item.productId !== id))
  }

  const handleApplyCoupon = async () => {
    try {
      const res = await CouponService.apply(couponCode, total)
      setDiscount(res.data.discount)
      alert('Áp dụng mã thành công!')
    } catch (e) {
      alert('Mã không hợp lệ hoặc đã hết hạn.')
    }
  }

  if (!isOpen) return null

  return (
    <div style={{ position: 'fixed', top: 0, right: 0, width: '100%', height: '100vh', zIndex: 200, display: 'flex', justifyContent: 'flex-end' }}>
      <div 
        onClick={onClose}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }} 
      />
      <div className="animate-fade" style={{ width: '100%', maxWidth: '450px', background: 'white', position: 'relative', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '24px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ fontSize: '1.4rem', fontWeight: '800' }}>Giỏ hàng của bạn</h3>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', marginTop: '100px' }}>
              <ShoppingBag size={64} style={{ color: '#e2e8f0', marginBottom: '16px' }} />
              <p style={{ color: '#94a3b8' }}>Giỏ hàng trống</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {cart.map(item => (
                <div key={item.productId} style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ width: '80px', height: '100px', borderRadius: '12px', background: '#f8fafc', overflow: 'hidden' }}>
                     <img src={item.image || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=600'} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '4px' }}>{item.name}</h4>
                    <p style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: '700', marginBottom: '8px' }}>{item.price?.toLocaleString('vi-VN')}₫</p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '4px' }}>
                        <button onClick={() => handleUpdateQty(item.productId, -1)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px' }}><Minus size={14} /></button>
                        <span style={{ padding: '0 12px', fontWeight: '600' }}>{item.quantity}</span>
                        <button onClick={() => handleUpdateQty(item.productId, 1)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px' }}><Plus size={14} /></button>
                      </div>
                      <button onClick={() => handleRemove(item.productId)} style={{ color: '#ef4444', fontSize: '0.8rem', background: 'transparent', border: 'none', cursor: 'pointer' }}>Xóa</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div style={{ padding: '24px', borderTop: '1px solid #f1f5f9', background: '#f8fafc' }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
              <input 
                type="text" 
                placeholder="Mã giảm giá..." 
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none' }}
              />
              <button onClick={handleApplyCoupon} style={{ background: 'black', color: 'white', border: 'none', padding: '0 16px', borderRadius: '12px', fontWeight: '600', cursor: 'pointer' }}>
                Áp dụng
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Tạm tính:</span>
                <span style={{ fontWeight: '600' }}>{total.toLocaleString('vi-VN')}₫</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Giảm giá:</span>
                <span style={{ fontWeight: '600', color: '#10b981' }}>-{discount.toLocaleString('vi-VN')}₫</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #e2e8f0' }}>
                <span style={{ fontWeight: '800', fontSize: '1.2rem' }}>Tổng cộng:</span>
                <span style={{ fontWeight: '800', fontSize: '1.2rem', color: 'var(--primary)' }}>{(total - discount).toLocaleString('vi-VN')}₫</span>
              </div>
            </div>
            <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', height: '56px' }}>
              Thanh toán ngay
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default CartDrawer
