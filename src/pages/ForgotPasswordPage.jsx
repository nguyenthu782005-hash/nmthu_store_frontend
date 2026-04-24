import React, { useState } from 'react'
import { ArrowLeft, Mail, Loader2, CheckCircle2 } from 'lucide-react'
import { AuthService } from '../api'

const ForgotPasswordPage = ({ onBack, onGoToReset }) => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await AuthService.forgotPassword(email)
      setSuccess(true)
      setTimeout(() => {
        onGoToReset(email)
      }, 2000)
    } catch (err) {
      console.error(err)
      if (err.response?.status === 404) {
        setError('Email không tồn tại trong hệ thống.')
      } else if (err.response?.status === 500) {
        setError('Không thể gửi email. Vui lòng thử lại sau.')
      } else {
        setError(err.response?.data || 'Có lỗi xảy ra. Vui lòng thử lại.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="animate-fade" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: '420px', background: 'white', borderRadius: '32px', padding: '48px', boxShadow: '0 20px 50px rgba(0,0,0,0.05)', position: 'relative' }}>
        <button 
          onClick={onBack}
          style={{ position: 'absolute', top: '24px', left: '24px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <ArrowLeft size={20} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '24px', background: 'linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <Mail size={36} color="white" />
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '8px' }}>Quên mật khẩu?</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>
            Nhập email đã đăng ký, chúng tôi sẽ gửi mã xác nhận để đặt lại mật khẩu.
          </p>
        </div>

        {success ? (
          <div style={{ textAlign: 'center', padding: '24px' }}>
            <CheckCircle2 size={56} color="#10b981" style={{ marginBottom: '16px' }} />
            <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '8px', color: '#10b981' }}>Đã gửi mã xác nhận!</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Kiểm tra hộp thư email của bạn. Đang chuyển hướng...</p>
          </div>
        ) : (
          <>
            {error && (
              <div style={{ background: '#fef2f2', color: '#dc2626', padding: '12px 16px', borderRadius: '12px', fontSize: '0.9rem', marginBottom: '24px', textAlign: 'center', border: '1px solid #fee2e2' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', fontSize: '0.9rem' }}>Email</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Nhập email đã đăng ký..."
                    style={{ width: '100%', padding: '14px 16px 14px 48px', borderRadius: '14px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '1rem' }}
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="btn-primary" 
                style={{ width: '100%', height: '56px', justifyContent: 'center', fontSize: '1.1rem', borderRadius: '14px' }}
              >
                {loading ? <Loader2 className="animate-spin" size={22} /> : 'Gửi mã xác nhận'}
              </button>
            </form>

            <div style={{ marginTop: '28px', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Nhớ mật khẩu rồi? <span onClick={onBack} style={{ color: 'var(--primary)', fontWeight: '700', cursor: 'pointer' }}>Đăng nhập</span>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default ForgotPasswordPage
