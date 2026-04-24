import React, { useState, useEffect } from 'react'
import { ArrowLeft, User, Mail, Phone, MapPin, Loader2, Save, UserCircle, Package } from 'lucide-react'
import api, { AuthService, OrderService } from '../api'

const ProfilePage = ({ user, onUpdate, onBack }) => {
  const [formData, setFormData] = useState({
    userId: user?.userId || '',
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    gender: user?.gender || '',
    avatar: user?.avatar || '',
    role: user?.role || 'customer',
    isActive: user?.isActive !== false,
    createdAt: user?.createdAt || new Date().toISOString(),
    password: user?.password || ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [activeTab, setActiveTab] = useState('profile')
  const [orders, setOrders] = useState([])
  const [fetchingOrders, setFetchingOrders] = useState(false)

  useEffect(() => {
    if (activeTab === 'orders' && user?.userId) {
      fetchOrders()
    }
  }, [activeTab, user?.userId])

  const fetchOrders = async () => {
    setFetchingOrders(true)
    setError('')
    try {
      const res = await OrderService.getAll()
      // Filter by UserId (PascalCase)
      const userOrders = res.data.filter(o => o.UserId === user.userId || o.userId === user.userId)
      setOrders(userOrders)
    } catch (err) {
      console.error('Error fetching orders:', err)
      setError('Không thể lấy danh sách đơn hàng.')
    } finally {
      setFetchingOrders(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await AuthService.update(user.userId, formData)
      setSuccess('Cập nhật thông tin thành công!')
      if (onUpdate) {
        onUpdate(response.data)
      }
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      console.error(err)
      setError('Cập nhật thất bại. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  const getStatusInfo = (status) => {
    const s = (status || 'Pending').toLowerCase();
    const map = {
      'pending': { text: 'Chờ xác nhận', color: '#f59e0b', bg: '#fef3c7' },
      'processing': { text: 'Đang xử lý', color: '#3b82f6', bg: '#dbeafe' },
      'shipping': { text: 'Đang giao', color: '#8b5cf6', bg: '#ede9fe' },
      'completed': { text: 'Hoàn thành', color: '#10b981', bg: '#dcfce7' },
      'cancelled': { text: 'Đã hủy', color: '#ef4444', bg: '#fee2e2' },
      'paid': { text: 'Đã thanh toán', color: '#10b981', bg: '#dcfce7' },
    }
    return map[s] || map['pending']
  }

  return (
    <div className="animate-fade" style={{ minHeight: '100vh', background: '#f8fafc', padding: '40px 24px' }}>
      <div style={{ width: '100%', maxWidth: '900px', margin: '0 auto' }}>
        <button 
          onClick={onBack}
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', fontSize: '1rem', fontWeight: '600' }}
        >
          <ArrowLeft size={20} /> Quay lại trang chủ
        </button>

        <div style={{ background: 'white', borderRadius: '32px', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.05)' }}>
          {/* Header */}
          <div style={{ padding: '40px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '24px' }}>
             <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              {formData.avatar ? <img src={formData.avatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <UserCircle size={48} color="#94a3b8" />}
             </div>
             <div>
               <h2 style={{ fontSize: '1.8rem', fontWeight: '800' }}>Chào, {formData.name}</h2>
               <p style={{ color: 'var(--text-muted)' }}>Thành viên từ {new Date(formData.createdAt).toLocaleDateString('vi-VN')}</p>
             </div>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', background: '#f8fafc', padding: '8px' }}>
            <button 
              onClick={() => setActiveTab('profile')}
              style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontWeight: '700', fontSize: '0.95rem', background: activeTab === 'profile' ? 'white' : 'transparent', color: activeTab === 'profile' ? 'var(--primary)' : 'var(--text-muted)', boxShadow: activeTab === 'profile' ? '0 4px 12px rgba(0,0,0,0.05)' : 'none', transition: '0.3s' }}
            >
              Hồ sơ của tôi
            </button>
            <button 
              onClick={() => setActiveTab('orders')}
              style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontWeight: '700', fontSize: '0.95rem', background: activeTab === 'orders' ? 'white' : 'transparent', color: activeTab === 'orders' ? 'var(--primary)' : 'var(--text-muted)', boxShadow: activeTab === 'orders' ? '0 4px 12px rgba(0,0,0,0.05)' : 'none', transition: '0.3s' }}
            >
              Đơn hàng của tôi
            </button>
          </div>

          <div style={{ padding: '40px' }}>
            {activeTab === 'profile' ? (
              <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                {error && <div style={{ gridColumn: 'span 2', background: '#fef2f2', color: '#dc2626', padding: '16px', borderRadius: '16px', border: '1px solid #fee2e2' }}>{error}</div>}
                {success && <div style={{ gridColumn: 'span 2', background: '#ecfdf5', color: '#059669', padding: '16px', borderRadius: '16px', border: '1px solid #d1fae5' }}>{success}</div>}
                
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>Họ và tên</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>Số điện thoại</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>Giới tính</label>
                  <select name="gender" value={formData.gender} onChange={handleChange} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc' }}>
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>Địa chỉ</label>
                  <textarea name="address" value={formData.address} onChange={handleChange} rows={3} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc', resize: 'none' }} />
                </div>
                <button type="submit" disabled={loading} className="btn-primary" style={{ gridColumn: 'span 2', height: '56px', justifyContent: 'center' }}>
                  {loading ? <Loader2 className="animate-spin" /> : 'Lưu thay đổi'}
                </button>
              </form>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {fetchingOrders ? (
                  <div style={{ textAlign: 'center', padding: '40px' }}>
                    <Loader2 className="animate-spin" size={40} color="var(--primary)" style={{ margin: '0 auto 16px' }} />
                    <p style={{ color: 'var(--text-muted)' }}>Đang tải danh sách đơn hàng...</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '60px 40px', background: '#f8fafc', borderRadius: '24px' }}>
                    <Package size={48} color="#cbd5e1" style={{ marginBottom: '16px' }} />
                    <h4 style={{ fontWeight: '700', marginBottom: '8px' }}>Chưa có đơn hàng nào</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Bạn chưa đặt bất kỳ đơn hàng nào. Hãy bắt đầu mua sắm ngay!</p>
                  </div>
                ) : (
                  orders.map(order => {
                    const statusKey = order.Status || order.status || 'Pending'
                    const status = getStatusInfo(statusKey)
                    
                    // Robust field mapping for various JSON casings
                    const displayId = order.OrderId || order.orderId || order.id || 'N/A'
                    const displayTotal = order.FinalPrice || order.finalPrice || order.TotalPrice || order.totalPrice || order.totalAmount || order.total || 0
                    const createdAt = order.CreatedAt || order.createdAt || new Date()
                    
                    const items = order.OrderItems || order.orderItems || order.items || []
                    const firstOrderItem = items[0]
                    const productInfo = firstOrderItem?.Product || firstOrderItem?.product || firstOrderItem
                    
                    const productName = productInfo?.Name || productInfo?.name || 'Sản phẩm không xác định'
                    const productImage = productInfo?.Image || productInfo?.image
                    
                    return (
                      <div key={displayId} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px', borderRadius: '24px', border: '1px solid #f1f5f9', transition: '0.3s', cursor: 'pointer', background: 'white' }} 
                        className="hover-lift"
                        onClick={() => onUpdate && onUpdate('order-detail', { ...order, items, total: displayTotal, orderId: displayId })}
                      >
                        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                          <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: '#f8fafc', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #f1f5f9' }}>
                            {productImage ? (
                              <img src={productImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                              <Package size={24} color="#cbd5e1" />
                            )}
                          </div>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                              <p style={{ fontWeight: '800' }}>Đơn hàng #{displayId}</p>
                            </div>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: '600', marginBottom: '4px' }}>
                              {productName}{items.length > 1 ? ` +${items.length - 1} sản phẩm khác` : ''}
                            </p>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(createdAt).toLocaleDateString('vi-VN')}</p>
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <p style={{ fontWeight: '900', fontSize: '1.2rem', marginBottom: '8px', color: 'var(--primary)' }}>{Number(displayTotal).toLocaleString()}₫</p>
                          <span style={{ padding: '6px 14px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: '800', background: status.bg, color: status.color, textTransform: 'uppercase' }}>
                            {status.text}
                          </span>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
