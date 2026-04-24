import React, { useState } from 'react'
import { ArrowLeft, Mail, Lock, Loader2 } from 'lucide-react'
import { AuthService } from '../api'

const LoginPage = ({ onLoginSuccess, onBack, onGoToRegister, onGoToForgotPassword }) => {
  const [formData, setFormData] = useState({ email: '', password: '' })
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
      const res = await AuthService.login(formData)
      // Backend returns User object directly: { userId, name, email, ... }
      const user = res.data
      localStorage.setItem('user', JSON.stringify(user))
      onLoginSuccess(user)
    } catch (err) {
      console.error(err)
      if (err.response?.status === 401) {
        setError('Email hoặc mật khẩu không đúng.')
      } else if (err.response?.status === 404) {
        setError('Đường dẫn đăng nhập bị lỗi (404). Vui lòng kiểm tra Server.')
      } else {
        setError('Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại sau.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="animate-fade" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: '400px', background: 'white', borderRadius: '32px', padding: '40px', boxShadow: '0 20px 50px rgba(0,0,0,0.05)', position: 'relative' }}>
        <button 
          onClick={onBack}
          style={{ position: 'absolute', top: '24px', left: '24px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <ArrowLeft size={20} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '8px' }}>Chào mừng trở lại</h2>
          <p style={{ color: 'var(--text-muted)' }}>Đăng nhập để trải nghiệm mua sắm tuyệt vời nhất</p>
        </div>

        {error && (
          <div style={{ background: '#fef2f2', color: '#dc2626', padding: '12px 16px', borderRadius: '12px', fontSize: '0.9rem', marginBottom: '24px', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
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

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', fontSize: '0.9rem' }}>Mật khẩu</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="password" 
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                style={{ width: '100%', padding: '12px 16px 12px 48px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none' }}
              />
            </div>
          </div>

          <div style={{ textAlign: 'right', marginBottom: '24px' }}>
            <span onClick={onGoToForgotPassword} style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer' }}>Quên mật khẩu?</span>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary" 
            style={{ width: '100%', height: '52px', justifyContent: 'center', fontSize: '1.1rem' }}
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Đăng nhập ngay'}
          </button>
        </form>

        <div style={{ marginTop: '32px', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Chưa có tài khoản? <span onClick={onGoToRegister} style={{ color: 'var(--primary)', fontWeight: '700', cursor: 'pointer' }}>Đăng ký</span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
