import React, { useState, useRef, useEffect } from 'react'
import { ArrowLeft, Lock, ShieldCheck, Loader2, CheckCircle2, Eye, EyeOff } from 'lucide-react'
import { AuthService } from '../api'

const ResetPasswordPage = ({ email, onBack, onSuccess }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [step, setStep] = useState(1) // 1 = OTP, 2 = new password
  const inputRefs = useRef([])

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [])

  const handleOtpChange = (index, value) => {
    // Only accept digits
    const digit = value.replace(/\D/g, '')
    if (digit.length === 0 && value !== '') return

    const newOtp = [...otp]
    // Always take only the last typed digit
    newOtp[index] = digit ? digit.slice(-1) : ''
    setOtp(newOtp)

    // Auto-advance to next input
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      e.preventDefault()
      const newOtp = [...otp]
      if (otp[index]) {
        // Clear current field
        newOtp[index] = ''
        setOtp(newOtp)
      } else if (index > 0) {
        // Move to previous field and clear it
        newOtp[index - 1] = ''
        setOtp(newOtp)
        inputRefs.current[index - 1]?.focus()
      }
    }
  }

  const handleOtpFocus = (e) => {
    // Select all text so typing replaces old value
    e.target.select()
  }

  const handleOtpPaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    const newOtp = ['', '', '', '', '', '']
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i]
    }
    setOtp(newOtp)
    const focusIndex = Math.min(pastedData.length, 5)
    inputRefs.current[focusIndex]?.focus()
  }

  const handleVerifyOtp = () => {
    const otpString = otp.join('')
    if (otpString.length !== 6) {
      setError('Vui lòng nhập đủ 6 chữ số OTP.')
      return
    }
    setError('')
    setStep(2)
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    if (newPassword.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự.')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.')
      return
    }

    setLoading(true)
    setError('')
    try {
      await AuthService.resetPassword({
        email,
        otp: otp.join(''),
        newPassword
      })
      setSuccess(true)
      setTimeout(() => {
        onSuccess()
      }, 2500)
    } catch (err) {
      console.error(err)
      if (err.response?.status === 400) {
        setError('Mã OTP không hợp lệ hoặc đã hết hạn. Vui lòng thử lại.')
        setStep(1)
      } else {
        setError(err.response?.data || 'Có lỗi xảy ra. Vui lòng thử lại.')
      }
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="animate-fade" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', padding: '24px' }}>
        <div style={{ width: '100%', maxWidth: '420px', background: 'white', borderRadius: '32px', padding: '48px', boxShadow: '0 20px 50px rgba(0,0,0,0.05)', textAlign: 'center' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <CheckCircle2 size={40} color="#10b981" />
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '12px', color: '#10b981' }}>Đặt lại thành công!</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Mật khẩu mới đã được cập nhật. Đang chuyển đến trang đăng nhập...</p>
        </div>
      </div>
    )
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
          <div style={{ width: '80px', height: '80px', borderRadius: '24px', background: step === 1 ? 'linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%)' : 'linear-gradient(135deg, #00b894 0%, #55efc4 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', transition: 'background 0.3s' }}>
            {step === 1 ? <ShieldCheck size={36} color="white" /> : <Lock size={36} color="white" />}
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '8px' }}>
            {step === 1 ? 'Nhập mã xác nhận' : 'Mật khẩu mới'}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            {step === 1 
              ? <>Mã OTP đã được gửi đến <strong style={{ color: 'var(--primary)' }}>{email}</strong></>
              : 'Nhập mật khẩu mới cho tài khoản của bạn'
            }
          </p>
        </div>

        {/* Steps indicator */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '32px' }}>
          <div style={{ width: '40px', height: '4px', borderRadius: '2px', background: 'var(--primary)' }} />
          <div style={{ width: '40px', height: '4px', borderRadius: '2px', background: step >= 2 ? 'var(--primary)' : '#e2e8f0', transition: '0.3s' }} />
        </div>

        {error && (
          <div style={{ background: '#fef2f2', color: '#dc2626', padding: '12px 16px', borderRadius: '12px', fontSize: '0.9rem', marginBottom: '24px', textAlign: 'center', border: '1px solid #fee2e2' }}>
            {error}
          </div>
        )}

        {step === 1 ? (
          <div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '32px' }}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  onFocus={handleOtpFocus}
                  onPaste={handleOtpPaste}
                  style={{
                    width: '52px',
                    height: '60px',
                    textAlign: 'center',
                    fontSize: '1.5rem',
                    fontWeight: '800',
                    borderRadius: '14px',
                    border: digit ? '2px solid var(--primary)' : '2px solid #e2e8f0',
                    outline: 'none',
                    transition: '0.2s',
                    background: digit ? '#f5f3ff' : 'white'
                  }}
                />
              ))}
            </div>
            <button 
              onClick={handleVerifyOtp}
              className="btn-primary" 
              style={{ width: '100%', height: '56px', justifyContent: 'center', fontSize: '1.1rem', borderRadius: '14px' }}
            >
              Xác nhận mã OTP
            </button>
          </div>
        ) : (
          <form onSubmit={handleResetPassword}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', fontSize: '0.9rem' }}>Mật khẩu mới</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  placeholder="Tối thiểu 6 ký tự"
                  style={{ width: '100%', padding: '14px 48px 14px 48px', borderRadius: '14px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '1rem' }}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div style={{ marginBottom: '28px' }}>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', fontSize: '0.9rem' }}>Xác nhận mật khẩu</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Nhập lại mật khẩu mới"
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
              {loading ? <Loader2 className="animate-spin" size={22} /> : 'Đặt lại mật khẩu'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default ResetPasswordPage
