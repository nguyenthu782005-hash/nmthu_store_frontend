import React, { useState } from 'react'
import { MapPin, Truck, CreditCard, ChevronRight, ArrowLeft, CheckCircle2, ShieldCheck } from 'lucide-react'
import { CouponService, OrderService, VnPayService } from '../api'

const CheckoutPage = ({ cart, user, onNavigate, onClearCart }) => {
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    address: user?.address || '',
    note: ''
  })

  const [shippingMethod, setShippingMethod] = useState('standard')
  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState(false)
  const [discount, setDiscount] = useState(0)
  const [couponCode, setCouponCode] = useState('')
  const [lastOrder, setLastOrder] = useState(null)

  const subtotal = cart.reduce((acc, item) => acc + ((item.salePrice || item.price) * item.quantity), 0)
  const shippingFee = shippingMethod === 'standard' ? 30000 : 50000
  const total = subtotal + shippingFee - discount

  const handleApplyCoupon = async (e) => {
    e.preventDefault()
    if (!couponCode.trim()) return
    
    try {
      const res = await CouponService.apply(couponCode, subtotal)
      setDiscount(res.data.discountAmount || res.data.discount || 0)
      alert('Áp dụng mã thành công!')
    } catch (e) {
      alert(e.response?.data?.message || 'Mã giảm giá không hợp lệ hoặc đã hết hạn.')
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault()
    if (!user) {
      alert('Vui lòng đăng nhập để đặt hàng!')
      onNavigate('login')
      return
    }

    setIsProcessing(true)
    
    const orderData = {
      UserId: user.userId,
      OrderItems: cart.map(item => ({
        ProductId: item.productId,
        VariantId: item.variantId,
        Quantity: item.quantity,
        PriceAtPurchase: item.salePrice || item.price
      })),
      TotalPrice: subtotal,
      ShippingFee: shippingFee,
      Discount: discount,
      FinalPrice: total,
      Status: 'Pending',
      PaymentMethod: paymentMethod === 'cod' ? 'COD' : paymentMethod.toUpperCase(),
      Note: formData.note,
      ReceiverName: formData.fullName,
      ReceiverPhone: formData.phone,
      ShippingAddress: formData.address
    }

    try {
      const res = await OrderService.create(orderData)
      setLastOrder(res.data)
      
      if (paymentMethod === 'vnpay') {
        const vnpayRes = await VnPayService.createPaymentUrl(res.data.orderId, total)
        if (vnpayRes.data && vnpayRes.data.url) {
          window.location.href = vnpayRes.data.url
          return // Redirecting, stop execution
        }
      }

      setIsProcessing(false)
      setOrderSuccess(true)
      onClearCart()
    } catch (err) {
      console.error(err)
      alert(err.response?.data?.message || 'Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.')
      setIsProcessing(false)
    }
  }

  if (orderSuccess) {
    return (
      <div className="animate-fade" style={{ padding: '100px 0', textAlign: 'center', background: '#f8fafc', minHeight: '100vh' }}>
        <div className="container">
          <div style={{ maxWidth: '600px', margin: '0 auto', background: 'white', padding: '60px', borderRadius: '40px', boxShadow: '0 20px 60px rgba(0,0,0,0.05)' }}>
            <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px' }}>
              <CheckCircle2 size={60} color="#22c55e" />
            </div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '16px', letterSpacing: '-1px' }}>Đặt hàng thành công!</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '40px', lineHeight: '1.6' }}>
              Cảm ơn bạn đã tin tưởng THUSTORE. Mã đơn hàng của bạn là <b>#{lastOrder?.orderId || 'TS'+Math.floor(Math.random()*100000)}</b>. 
              Chúng tôi sẽ liên hệ với bạn sớm nhất để xác nhận đơn hàng.
            </p>
            <div style={{ display: 'flex', gap: '16px' }}>
              <button onClick={() => onNavigate('home')} className="btn-primary" style={{ flex: 1, height: '56px' }}>Tiếp tục mua sắm</button>
              <button onClick={() => onNavigate('profile')} className="btn-ghost" style={{ flex: 1, height: '56px', border: '1px solid #e2e8f0' }}>Xem đơn hàng</button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fade" style={{ padding: '60px 0', background: '#f8fafc', minHeight: '100vh' }}>
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
           <button onClick={() => onNavigate('cart')} className="btn-ghost" style={{ padding: '8px' }}><ArrowLeft size={24} /></button>
           <h1 style={{ fontSize: '2.5rem', fontWeight: '800', letterSpacing: '-1px' }}>Thanh toán</h1>
        </div>

        <form onSubmit={handlePlaceOrder} style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '40px', alignItems: 'start' }}>
          {/* Main Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            
            {/* Shipping Information */}
            <section style={{ background: 'white', padding: '32px', borderRadius: '32px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MapPin size={20} />
                </div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: '800' }}>Thông tin giao hàng</h3>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div className="form-group">
                  <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>Họ và tên</label>
                  <input name="fullName" value={formData.fullName} onChange={handleInputChange} required type="text" placeholder="Nguyễn Văn A" style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc' }} />
                </div>
                <div className="form-group">
                  <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>Số điện thoại</label>
                  <input name="phone" value={formData.phone} onChange={handleInputChange} required type="tel" placeholder="090 123 4567" style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc' }} />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>Địa chỉ email</label>
                <input name="email" value={formData.email} onChange={handleInputChange} required type="email" placeholder="example@gmail.com" style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc' }} />
              </div>

              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>Địa chỉ nhận hàng</label>
                <input name="address" value={formData.address} onChange={handleInputChange} required type="text" placeholder="Số nhà, tên đường, Phường/Xã, Quận/Huyện, Tỉnh/Thành..." style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc' }} />
              </div>

              <div className="form-group">
                <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>Ghi chú đơn hàng (Tùy chọn)</label>
                <textarea name="note" value={formData.note} onChange={handleInputChange} rows="3" placeholder="Lưu ý cho người giao hàng..." style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc', resize: 'none' }}></textarea>
              </div>
            </section>

            {/* Shipping Method */}
            <section style={{ background: 'white', padding: '32px', borderRadius: '32px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Truck size={20} />
                </div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: '800' }}>Phương thức vận chuyển</h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px', borderRadius: '16px', border: `2px solid ${shippingMethod === 'standard' ? 'var(--primary)' : '#e2e8f0'}`, cursor: 'pointer', background: shippingMethod === 'standard' ? '#f5f7ff' : 'white', transition: '0.2s' }}>
                  <input type="radio" name="shipping" value="standard" checked={shippingMethod === 'standard'} onChange={() => setShippingMethod('standard')} style={{ width: '20px', height: '20px', accentColor: 'var(--primary)' }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: '700' }}>Giao hàng tiêu chuẩn</p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Thời gian nhận hàng: 3-5 ngày</p>
                  </div>
                  <span style={{ fontWeight: '800' }}>30.000₫</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px', borderRadius: '16px', border: `2px solid ${shippingMethod === 'express' ? 'var(--primary)' : '#e2e8f0'}`, cursor: 'pointer', background: shippingMethod === 'express' ? '#f5f7ff' : 'white', transition: '0.2s' }}>
                  <input type="radio" name="shipping" value="express" checked={shippingMethod === 'express'} onChange={() => setShippingMethod('express')} style={{ width: '20px', height: '20px', accentColor: 'var(--primary)' }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: '700' }}>Giao hàng nhanh (Express)</p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Thời gian nhận hàng: 1-2 ngày</p>
                  </div>
                  <span style={{ fontWeight: '800' }}>50.000₫</span>
                </label>
              </div>
            </section>

            {/* Payment Method */}
            <section style={{ background: 'white', padding: '32px', borderRadius: '32px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CreditCard size={20} />
                </div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: '800' }}>Hình thức thanh toán</h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                <label style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '20px', borderRadius: '16px', border: `2px solid ${paymentMethod === 'cod' ? 'var(--primary)' : '#e2e8f0'}`, cursor: 'pointer', background: paymentMethod === 'cod' ? '#f5f7ff' : 'white', transition: '0.2s' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} style={{ width: '20px', height: '20px', accentColor: 'var(--primary)' }} />
                    <p style={{ fontWeight: '700' }}>COD (Khi nhận hàng)</p>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Thanh toán bằng tiền mặt khi shipper giao hàng đến cho bạn.</p>
                </label>
                <label style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '20px', borderRadius: '16px', border: `2px solid ${paymentMethod === 'vnpay' ? 'var(--primary)' : '#e2e8f0'}`, cursor: 'pointer', background: paymentMethod === 'vnpay' ? '#f5f7ff' : 'white', transition: '0.2s' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <input type="radio" name="payment" value="vnpay" checked={paymentMethod === 'vnpay'} onChange={() => setPaymentMethod('vnpay')} style={{ width: '20px', height: '20px', accentColor: 'var(--primary)' }} />
                    <p style={{ fontWeight: '700' }}>Ví điện tử VNPay</p>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Thanh toán qua mã QR hoặc thẻ ngân hàng nội địa/quốc tế.</p>
                </label>
                <label style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '20px', borderRadius: '16px', border: `2px solid ${paymentMethod === 'bank' ? 'var(--primary)' : '#e2e8f0'}`, cursor: 'pointer', background: paymentMethod === 'bank' ? '#f5f7ff' : 'white', transition: '0.2s' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <input type="radio" name="payment" value="bank" checked={paymentMethod === 'bank'} onChange={() => setPaymentMethod('bank')} style={{ width: '20px', height: '20px', accentColor: 'var(--primary)' }} />
                    <p style={{ fontWeight: '700' }}>Chuyển khoản</p>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Chuyển tiền trực tiếp vào số tài khoản ngân hàng của THUSTORE.</p>
                </label>
              </div>
            </section>
          </div>

          {/* Sidebar Summary */}
          <div style={{ position: 'sticky', top: '100px' }}>
            <div style={{ background: 'white', padding: '32px', borderRadius: '32px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '24px' }}>Đơn hàng của bạn</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '300px', overflowY: 'auto', marginBottom: '24px', paddingRight: '10px' }}>
                {cart.map(item => (
                  <div key={item.cartId} style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ width: '60px', height: '70px', borderRadius: '10px', background: '#f8fafc', overflow: 'hidden', flexShrink: 0 }}>
                      <img src={item.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: '700', marginBottom: '4px' }}>{item.name}</h4>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>SL: {item.quantity}</span>
                        <span style={{ fontSize: '0.9rem', fontWeight: '700' }}>{((item.salePrice || item.price) * item.quantity).toLocaleString()}₫</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '24px', display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Tạm tính</span>
                  <span style={{ fontWeight: '700' }}>{subtotal.toLocaleString()}₫</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Phí vận chuyển</span>
                  <span style={{ fontWeight: '700' }}>{shippingFee.toLocaleString()}₫</span>
                </div>
                {discount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Giảm giá</span>
                    <span style={{ fontWeight: '700', color: '#10b981' }}>-{discount.toLocaleString()}₫</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid #f1f5f9', paddingTop: '16px' }}>
                  <span style={{ fontWeight: '800', fontSize: '1.2rem' }}>Tổng cộng</span>
                  <span style={{ fontWeight: '900', fontSize: '1.5rem', color: 'var(--primary)' }}>{total.toLocaleString()}₫</span>
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input 
                    type="text" 
                    placeholder="Mã giảm giá..." 
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    style={{ flex: 1, padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc', outline: 'none' }}
                  />
                  <button onClick={handleApplyCoupon} style={{ background: 'black', color: 'white', border: 'none', padding: '0 16px', borderRadius: '12px', fontWeight: '600', cursor: 'pointer' }}>
                    Áp dụng
                  </button>
                </div>
              </div>

              <button 
                disabled={isProcessing}
                className="btn-primary" 
                style={{ width: '100%', height: '64px', fontSize: '1.1rem', borderRadius: '16px', justifyContent: 'center', opacity: isProcessing ? 0.7 : 1 }}
              >
                {isProcessing ? 'Đang xử lý...' : 'Xác nhận đặt hàng'} <ChevronRight size={20} style={{ marginLeft: '8px' }} />
              </button>

              <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center', color: '#10b981', fontSize: '0.85rem' }}>
                <ShieldCheck size={18} />
                <span>Thanh toán an toàn & bảo mật 100%</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CheckoutPage
