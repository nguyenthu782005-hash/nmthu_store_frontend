import React, { useState } from 'react'
import { ArrowLeft, Mail, Lock, User, Phone, MapPin, UserCircle, Image, Loader2 } from 'lucide-react'
import { AuthService } from '../api'

const RegisterPage = ({ onRegisterSuccess, onBackToLogin }) => {
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '',
    phone: '',
    address: '',
    gender: 'Nam',
    avatar: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await AuthService.register(formData)
      alert('Đăng ký tài khoản thành công! Bây giờ bạn có thể đăng nhập.')
      onRegisterSuccess()
    } catch (err) {
      console.error(err)
      if (err.response?.data) {
        setError(err.response.data)
      } else {
        setError('Có lỗi xảy ra khi đăng ký. Vui lòng thử lại sau.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="animate-fade" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', padding: '40px 24px' }}>
      <div style={{ width: '100%', maxWidth: '600px', background: 'white', borderRadius: '32px', padding: '48px', boxShadow: '0 20px 50px rgba(0,0,0,0.05)', position: 'relative' }}>
        <button 
          onClick={onBackToLogin}
          style={{ position: 'absolute', top: '24px', left: '24px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600' }}
        >
          <ArrowLeft size={20} /> Quay lại
        </button>

        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '8px' }}>Tạo tài khoản mới</h2>
          <p style={{ color: 'var(--text-muted)' }}>Tham gia cộng đồng mua sắm thời trang hàng đầu</p>
        </div>

        {error && (
          <div style={{ background: '#fef2f2', color: '#dc2626', padding: '12px 16px', borderRadius: '12px', fontSize: '0.9rem', marginBottom: '24px', textAlign: 'center', border: '1px solid #fee2e2' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', fontSize: '0.9rem' }}>Họ và tên</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Nguyễn Văn A"
                style={{ width: '100%', padding: '12px 16px 12px 48px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', fontSize: '0.9rem' }}>Email</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="example@gmail.com"
                style={{ width: '100%', padding: '12px 16px 12px 48px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', fontSize: '0.9rem' }}>Mật khẩu</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="password" 
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Tối thiểu 6 ký tự"
                style={{ width: '100%', padding: '12px 16px 12px 48px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', fontSize: '0.9rem' }}>Số điện thoại</label>
            <div style={{ position: 'relative' }}>
              <Phone size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="tel" 
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="09xx xxx xxx"
                style={{ width: '100%', padding: '12px 16px 12px 48px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', fontSize: '0.9rem' }}>Giới tính</label>
            <div style={{ position: 'relative' }}>
              <UserCircle size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <select 
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                style={{ width: '100%', padding: '12px 16px 12px 48px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none', background: 'white', appearance: 'none', cursor: 'pointer' }}
              >
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
            </div>
          </div>

          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', fontSize: '0.9rem' }}>Địa chỉ</label>
            <div style={{ position: 'relative' }}>
              <MapPin size={18} style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--text-muted)' }} />
              <textarea 
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố..."
                style={{ width: '100%', padding: '12px 16px 12px 48px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none', minHeight: '80px', fontFamily: 'inherit', resize: 'vertical' }}
              />
            </div>
          </div>

          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', fontSize: '0.9rem' }}>Link ảnh đại diện (URL)</label>
            <div style={{ position: 'relative' }}>
              <Image size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                name="avatar"
                value={formData.avatar}
                onChange={handleChange}
                placeholder="https://example.com/photo.jpg"
                style={{ width: '100%', padding: '12px 16px 12px 48px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none' }}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary" 
            style={{ gridColumn: 'span 2', height: '56px', justifyContent: 'center', fontSize: '1.2rem', marginTop: '12px' }}
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Đăng ký ngay'}
          </button>
        </form>

        <div style={{ marginTop: '32px', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
            Đã có tài khoản? <span onClick={onBackToLogin} style={{ color: 'var(--primary)', fontWeight: '700', cursor: 'pointer' }}>Đăng nhập</span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
