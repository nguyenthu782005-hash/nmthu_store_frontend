import React from 'react'
import { ShoppingBag, Search, User, LogOut } from 'lucide-react'

const Navbar = ({ cartCount, onNavigate, onToggleCart, categories, currentUser, onLogout }) => {
  return (
    <nav className="glass-header">
      <div className="container" style={{ height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
          <h1 
            onClick={() => onNavigate('home')} 
            style={{ fontSize: '1.5rem', fontWeight: '800', cursor: 'pointer', letterSpacing: '-0.5px' }}
          >
            CLOTH<span className="grad-text">STORE</span>
          </h1>
          <div style={{ display: 'flex', gap: '24px' }}>
            <button 
              className="btn-ghost" 
              style={{ fontWeight: '500' }}
              onClick={() => onNavigate('shop')}
            >
              Cửa hàng
            </button>
            {categories && categories.map(cat => (
              <button 
                key={cat.categoryId} 
                className="btn-ghost" 
                style={{ fontWeight: '500' }}
                onClick={() => onNavigate('home')}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ position: 'relative' }}>
            <Search size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Tìm sản phẩm..." 
              style={{ padding: '10px 16px 10px 40px', borderRadius: '99px', border: '1px solid #e2e8f0', width: '200px', outline: 'none', fontSize: '0.9rem' }}
            />
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 8px', borderRight: '1px solid #e2e8f0' }}>
            {currentUser ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: '700' }}>
                    {(currentUser.name || currentUser.username || currentUser.email)?.charAt(0).toUpperCase()}
                  </div>
                  <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>{currentUser.name || currentUser.username || currentUser.email}</span>
                </div>
                <button 
                  onClick={onLogout}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#ef4444', display: 'flex', alignItems: 'center', padding: '4px' }}
                  title="Đăng xuất"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <button 
                className="btn-ghost" 
                style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600' }}
                onClick={() => onNavigate('login')}
              >
                <User size={20} />
                Đăng nhập
              </button>
            )}
          </div>

          <button 
            onClick={onToggleCart}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', position: 'relative', padding: '8px' }}
          >
            <ShoppingBag size={24} />
            {cartCount > 0 && (
              <span style={{ position: 'absolute', top: '0', right: '0', background: 'var(--secondary)', color: 'white', width: '18px', height: '18px', borderRadius: '50%', fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
