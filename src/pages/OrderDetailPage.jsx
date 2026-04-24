import React from 'react'
import { ArrowLeft, Package, Truck, CheckCircle2, Clock, XCircle, MapPin, CreditCard, FileText, ChevronRight } from 'lucide-react'

const OrderDetailPage = ({ order, onBack }) => {
  if (!order) return (
    <div style={{ padding: '100px 0', textAlign: 'center' }}>
      <p>Không tìm thấy thông tin đơn hàng.</p>
      <button onClick={onBack} className="btn-primary" style={{ marginTop: '20px' }}>Quay lại</button>
    </div>
  )

  const steps = [
    { status: 'Chờ xác nhận', icon: Clock, key: 'Pending' },
    { status: 'Đang xử lý', icon: Package, key: 'Processing' },
    { status: 'Đang giao', icon: Truck, key: 'Shipping' },
    { status: 'Hoàn thành', icon: CheckCircle2, key: 'Completed' },
  ]

  const statusMap = {
    'Pending': 0,
    'Processing': 1,
    'Shipping': 2,
    'Completed': 3,
    'Cancelled': -1
  }
  
  const statusKey = order.Status || order.status || 'Pending'
  const currentIndex = statusMap[statusKey] ?? 0
  const isCancelled = statusKey === 'Cancelled'

  const items = order.OrderItems || order.orderItems || order.items || []

  return (
    <div className="animate-fade" style={{ padding: '40px 0 100px', background: '#f8fafc', minHeight: '100vh' }}>
      <div className="container" style={{ maxWidth: '1100px' }}>
        
        {/* Breadcrumbs / Back */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          <span onClick={onBack} style={{ cursor: 'pointer', fontWeight: '600', transition: '0.2s' }} className="hover-primary">Tài khoản</span>
          <ChevronRight size={14} />
          <span onClick={onBack} style={{ cursor: 'pointer', fontWeight: '600', transition: '0.2s' }} className="hover-primary">Đơn hàng của tôi</span>
          <ChevronRight size={14} />
          <span style={{ color: 'var(--text-main)', fontWeight: '700' }}>#{order.OrderId || order.orderId}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '32px', alignItems: 'start' }}>
          
          {/* LEFT COLUMN */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            
            {/* 1. Status Stepper Card */}
            <div style={{ background: 'white', padding: '40px', borderRadius: '32px', boxShadow: '0 10px 40px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <h2 style={{ fontSize: '1.6rem', fontWeight: '800', letterSpacing: '-0.5px' }}>Trạng thái vận chuyển</h2>
                <div style={{ padding: '8px 16px', borderRadius: '12px', background: isCancelled ? '#fee2e2' : '#f0f9ff', color: isCancelled ? '#ef4444' : 'var(--primary)', fontWeight: '700', fontSize: '0.9rem' }}>
                  {isCancelled ? 'Đơn hàng đã hủy' : steps[currentIndex]?.status || statusKey}
                </div>
              </div>

              {!isCancelled ? (
                <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', padding: '0 20px' }}>
                  {/* Progress Line */}
                  <div style={{ position: 'absolute', top: '26px', left: '60px', right: '60px', height: '4px', background: '#f1f5f9', zIndex: 0 }}></div>
                  <div style={{ 
                    position: 'absolute', 
                    top: '26px', 
                    left: '60px', 
                    width: `${(currentIndex / (steps.length - 1)) * 80}%`, // Simplified width logic
                    height: '4px', 
                    background: 'var(--primary)', 
                    zIndex: 0,
                    transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}></div>

                  {steps.map((step, idx) => {
                    const isDone = idx <= currentIndex
                    const isNow = idx === currentIndex
                    return (
                      <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', zIndex: 1, flex: 1 }}>
                        <div style={{ 
                          width: '56px', 
                          height: '56px', 
                          borderRadius: '18px', 
                          background: isDone ? 'var(--primary)' : 'white', 
                          border: isDone ? 'none' : '2px solid #e2e8f0',
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          boxShadow: isNow ? '0 0 0 8px rgba(99, 102, 241, 0.1)' : 'none',
                          transition: '0.4s'
                        }}>
                          <step.icon size={26} color={isDone ? 'white' : '#cbd5e1'} />
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <p style={{ fontSize: '0.9rem', fontWeight: isNow ? '800' : '600', color: isNow ? 'var(--text-main)' : '#94a3b8', marginBottom: '4px' }}>{step.status}</p>
                          {isDone && <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{new Date(order.CreatedAt || order.createdAt).toLocaleDateString('vi-VN')}</p>}
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div style={{ padding: '30px', borderRadius: '24px', background: '#fef2f2', border: '1px dashed #fee2e2', textAlign: 'center' }}>
                  <XCircle size={48} color="#ef4444" style={{ marginBottom: '16px' }} />
                  <p style={{ color: '#991b1b', fontWeight: '700' }}>Đơn hàng này đã bị hủy.</p>
                  <p style={{ color: '#ef4444', fontSize: '0.9rem', marginTop: '4px' }}>Vui lòng liên hệ CSKH nếu có thắc mắc.</p>
                </div>
              )}
            </div>

            {/* 2. Order Items Card */}
            <div style={{ background: 'white', padding: '40px', borderRadius: '32px', boxShadow: '0 10px 40px rgba(0,0,0,0.03)' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '32px' }}>Sản phẩm ({items.length})</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {items.map((item, idx) => {
                  const productInfo = item.Product || item.product || item
                  const itemName = productInfo?.Name || productInfo?.name || 'Sản phẩm không xác định'
                  const itemImage = productInfo?.Image || productInfo?.image
                  const itemPrice = item.PriceAtPurchase || item.priceAtPurchase || item.price || 0
                  const itemQty = item.Quantity || item.quantity || 0

                  return (
                    <div key={idx} style={{ display: 'flex', gap: '24px', alignItems: 'center', paddingBottom: idx === (items.length - 1) ? 0 : '24px', borderBottom: idx === (items.length - 1) ? 'none' : '1px solid #f1f5f9' }}>
                      <div style={{ width: '90px', height: '110px', borderRadius: '16px', background: '#f8fafc', overflow: 'hidden', border: '1px solid #f1f5f9' }}>
                        {itemImage ? (
                          <img src={itemImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <Package size={24} color="#cbd5e1" style={{ margin: 'auto' }} />
                        )}
                      </div>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '6px' }}>{itemName}</h4>
                        <div style={{ display: 'flex', gap: '12px' }}>
                           <span style={{ fontSize: '0.85rem', padding: '4px 10px', borderRadius: '8px', background: '#f1f5f9', color: 'var(--text-muted)', fontWeight: '600' }}>Số lượng: {itemQty}</span>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontWeight: '800', fontSize: '1.15rem', marginBottom: '4px' }}>{itemPrice.toLocaleString()}₫</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', position: 'sticky', top: '100px' }}>
            
            {/* 3. Customer Info */}
            <div style={{ background: 'white', padding: '32px', borderRadius: '32px', boxShadow: '0 10px 40px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#f5f7ff', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MapPin size={18} />
                </div>
                <h4 style={{ fontWeight: '800', fontSize: '1.1rem' }}>Địa chỉ nhận hàng</h4>
              </div>
              <p style={{ fontWeight: '800', marginBottom: '6px', fontSize: '1.05rem' }}>{order.receiverName || order.ReceiverName || order.shippingAddress?.fullName || 'Người nhận'}</p>
              <p style={{ color: 'var(--text-muted)', fontWeight: '600', marginBottom: '8px' }}>{order.receiverPhone || order.ReceiverPhone || order.shippingAddress?.phone || 'N/A'}</p>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '0.95rem' }}>
                {typeof order.shippingAddress === 'string' ? order.shippingAddress : order.ShippingAddress || 'N/A'}
              </p>
            </div>

            {/* 4. Payment Info */}
            <div style={{ background: 'white', padding: '32px', borderRadius: '32px', boxShadow: '0 10px 40px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#f5f7ff', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CreditCard size={18} />
                </div>
                <h4 style={{ fontWeight: '800', fontSize: '1.1rem' }}>Thanh toán</h4>
              </div>
              <p style={{ fontWeight: '700', marginBottom: '16px', color: 'var(--text-main)' }}>
                {order.PaymentMethod === 'COD' || order.paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng (COD)' : 'Thanh toán trực tuyến'}
              </p>
              {(() => {
                const orderStatus = (order.Status || order.status || 'Pending').toLowerCase();
                const paymentMethod = (order.PaymentMethod || order.paymentMethod || 'COD').toLowerCase();
                // Consider as Paid if status is literally "paid" OR if it's an online payment and already being processed/shipped/completed
                const isPaid = orderStatus === 'paid' || (paymentMethod !== 'cod' && !['pending', 'cancelled'].includes(orderStatus));
                
                return (
                  <div style={{ 
                    padding: '12px', 
                    borderRadius: '16px', 
                    background: isPaid ? '#ecfdf5' : '#fff7ed', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    gap: '8px' 
                  }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: isPaid ? '#059669' : '#d97706' }}></div>
                    <span style={{ color: isPaid ? '#059669' : '#d97706', fontWeight: '800', fontSize: '0.85rem' }}>
                      {isPaid ? 'Đã thanh toán thành công' : 'Chờ xử lý'}
                    </span>
                  </div>
                );
              })()}
            </div>

            {/* 5. Summary Card */}
            <div style={{ background: 'white', padding: '32px', borderRadius: '32px', boxShadow: '0 10px 40px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#f5f7ff', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FileText size={18} />
                </div>
                <h4 style={{ fontWeight: '800', fontSize: '1.1rem' }}>Tổng kết đơn hàng</h4>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                  <span style={{ color: 'var(--text-muted)', fontWeight: '600' }}>Tạm tính</span>
                  <span style={{ fontWeight: '700' }}>{(order.TotalPrice || order.totalPrice || order.total || 0).toLocaleString()}₫</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                  <span style={{ color: 'var(--text-muted)', fontWeight: '600' }}>Phí vận chuyển</span>
                  <span style={{ fontWeight: '700' }}>{(order.ShippingFee || order.shippingFee || 0).toLocaleString()}₫</span>
                </div>
                {(order.Discount || order.discount) > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                    <span style={{ color: 'var(--text-muted)', fontWeight: '600' }}>Giảm giá</span>
                    <span style={{ fontWeight: '700', color: '#10b981' }}>-{(order.Discount || order.discount).toLocaleString()}₫</span>
                  </div>
                )}
                <div style={{ height: '1px', background: '#f1f5f9', margin: '10px 0' }}></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: '800', fontSize: '1.1rem' }}>Tổng cộng</span>
                  <span style={{ fontWeight: '900', fontSize: '1.6rem', color: 'var(--primary)', letterSpacing: '-0.5px' }}>{(order.FinalPrice || order.finalPrice || order.total || 0).toLocaleString()}₫</span>
                </div>
              </div>

              <button className="btn-primary" style={{ width: '100%', height: '56px', marginTop: '32px', borderRadius: '16px', justifyContent: 'center', fontSize: '1rem' }}>
                Tải hóa đơn PDF
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderDetailPage
