import React, { useEffect, useState, useRef } from 'react';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { VnPayService } from '../api';

const VnPayReturnPage = ({ onNavigate, onClearCart }) => {
  const [status, setStatus] = useState('processing'); // 'processing', 'success', 'error'
  const [message, setMessage] = useState('Đang xử lý kết quả thanh toán...');
  const hasVerified = useRef(false);

  useEffect(() => {
    const verifyPayment = async () => {
      if (hasVerified.current) return;
      hasVerified.current = true;

      const queryString = window.location.search;
      if (!queryString) {
        setStatus('error');
        setMessage('Không tìm thấy thông tin thanh toán.');
        return;
      }

      try {
        const res = await VnPayService.verifyPayment(queryString);
        setStatus('success');
        setMessage(res.data.message || 'Giao dịch thanh toán thành công!');
        // Ensure cart is cleared after successful VNPay payment
        if (onClearCart) onClearCart();
      } catch (err) {
        console.error(err);
        setStatus('error');
        setMessage(err.response?.data?.message || 'Có lỗi xảy ra trong quá trình xác thực thanh toán.');
      }
    };

    verifyPayment();
  }, [onClearCart]);

  return (
    <div className="animate-fade" style={{ padding: '100px 0', textAlign: 'center', background: '#f8fafc', minHeight: '100vh' }}>
      <div className="container">
        <div style={{ maxWidth: '600px', margin: '0 auto', background: 'white', padding: '60px', borderRadius: '40px', boxShadow: '0 20px 60px rgba(0,0,0,0.05)' }}>
          {status === 'processing' && (
            <>
              <div style={{ width: '100px', height: '100px', margin: '0 auto 32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Loader2 size={60} color="var(--primary)" style={{ animation: 'spin 1s linear infinite' }} />
                <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
              </div>
              <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '16px' }}>Đang xác thực...</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>{message}</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px' }}>
                <CheckCircle2 size={60} color="#22c55e" />
              </div>
              <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '16px', letterSpacing: '-1px' }}>Thanh toán thành công!</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '40px', lineHeight: '1.6' }}>
                {message} Cảm ơn bạn đã mua sắm tại THUSTORE.
              </p>
              <div style={{ display: 'flex', gap: '16px' }}>
                <button onClick={() => onNavigate('home')} className="btn-primary" style={{ flex: 1, height: '56px' }}>Tiếp tục mua sắm</button>
                <button onClick={() => onNavigate('profile')} className="btn-ghost" style={{ flex: 1, height: '56px', border: '1px solid #e2e8f0' }}>Xem đơn hàng</button>
              </div>
            </>
          )}

          {status === 'error' && (
            <>
              <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px' }}>
                <XCircle size={60} color="#ef4444" />
              </div>
              <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '16px', letterSpacing: '-1px', color: '#ef4444' }}>Thanh toán thất bại!</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '40px', lineHeight: '1.6' }}>
                {message}
              </p>
              <div style={{ display: 'flex', gap: '16px' }}>
                <button onClick={() => onNavigate('checkout')} className="btn-primary" style={{ flex: 1, height: '56px' }}>Thử lại</button>
                <button onClick={() => onNavigate('home')} className="btn-ghost" style={{ flex: 1, height: '56px', border: '1px solid #e2e8f0' }}>Về trang chủ</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VnPayReturnPage;
