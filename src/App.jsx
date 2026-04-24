import React, { useState, useEffect } from 'react'
import { 
  LogOut,
  User,
  Heart,
  Star,
  ShoppingBag,
  Search,
  Menu,
  X,
  ArrowRight,
  ChevronRight,
  Plus,
  Minus,
  CheckCircle2,
  Package,
  ChevronDown,
  Layers,
  Facebook,
  Instagram,
  Twitter
} from 'lucide-react'
import api, { ProductService, CategoryService, CouponService, ContentService, BrandService } from './api'
import ProductListPage from './pages/ProductListPage'
import WishlistPage from './pages/WishlistPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import ProductCard from './components/Product/ProductCard'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import ProfilePage from './pages/ProfilePage'
import OrderDetailPage from './pages/OrderDetailPage'
import ProductDetailPage from './pages/ProductDetailPage'
import VnPayReturnPage from './pages/VnPayReturnPage'
import ChatAI from './components/Chat/ChatAI'

const COLOR_MAP = {
  'xanh': '#3b82f6',
  'đỏ': '#ef4444',
  'đen': '#18181b',
  'trắng': '#ffffff',
  'vàng': '#eab308',
  'hồng': '#ec4899',
  'xám': '#71717a',
  'tím': '#8b5cf6',
  'cam': '#f97316',
  'nâu': '#78350f',
  'xanh lá': '#22c55e',
  'navy': '#1e3a8a',
  'be': '#f5f5dc',
  'kem': '#fffdd0'
}

const splitValues = (val) => {
  if (!val) return []
  return val.split(/[,\/;<]+/).map(s => s.trim()).filter(Boolean)
}

// --- COMPONENTS ---

const Navbar = ({ categories, brands, allProducts, cartCount, wishlistCount, user, onLogout, onNavigate, onProductSelect, onToggleCart }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const searchResults = searchQuery.trim() === '' ? [] : allProducts?.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))?.slice(0, 5) || []

  return (
    <nav className="glass-header">
      <div className="container" style={{ height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
          <h1 
            onClick={() => onNavigate('home')} 
            style={{ fontSize: '1.5rem', fontWeight: '800', cursor: 'pointer', letterSpacing: '-0.5px' }}
          >
            THU<span className="grad-text">STORE</span>
          </h1>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <button 
              className="btn-ghost" 
              style={{ fontWeight: '600', color: 'var(--text-main)' }}
              onClick={() => onNavigate('home')}
            >
              Trang chủ
            </button>
            <button 
              className="btn-ghost" 
              style={{ fontWeight: '600', color: 'var(--text-main)' }}
              onClick={() => onNavigate('products')}
            >
              Sản phẩm
            </button>
            
            <div style={{ position: 'relative' }}>
              <button 
                className="btn-ghost" 
                style={{ fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)' }}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                Danh mục
                <ChevronDown size={16} style={{ transform: isMenuOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }} />
              </button>

              {isMenuOpen && (
                <>
                  <div 
                    onClick={() => setIsMenuOpen(false)}
                    style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 90 }}
                  />
                  <div className="animate-fade" style={{ 
                    position: 'absolute', 
                    top: '100%', 
                    left: 0, 
                    marginTop: '12px', 
                    background: 'white', 
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)', 
                    borderRadius: '24px', 
                    width: '600px', 
                    padding: '32px', 
                    zIndex: 100,
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '40px'
                  }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                        <Layers size={18} color="var(--primary)" />
                        <h4 style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>Theo Danh Mục</h4>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {categories.map(cat => (
                          <button 
                            key={cat.categoryId} 
                            className="btn-ghost" 
                            style={{ justifyContent: 'flex-start', padding: '10px 16px', borderRadius: '12px' }}
                            onClick={() => { onNavigate('products', { type: 'category', id: cat.categoryId, name: cat.name }); setIsMenuOpen(false); }}
                          >
                            {cat.name}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div style={{ borderLeft: '1px solid #f1f5f9', paddingLeft: '40px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                        <Star size={18} color="var(--secondary)" />
                        <h4 style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>Thương Hiệu</h4>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
                        {brands.map(brand => (
                          <button 
                            key={brand.brandId} 
                            className="btn-ghost" 
                            style={{ justifyContent: 'flex-start', padding: '10px 16px', borderRadius: '12px', fontSize: '0.9rem' }}
                            onClick={() => { onNavigate('products', { type: 'brand', id: brand.brandId, name: brand.name }); setIsMenuOpen(false); }}
                          >
                            {brand.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: isSearchOpen ? 'white' : 'transparent',
              border: isSearchOpen ? '1px solid var(--primary)' : '1px solid transparent',
              borderRadius: '16px',
              padding: isSearchOpen ? '0 16px' : '0',
              width: isSearchOpen ? '240px' : '48px',
              height: '48px',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: isSearchOpen ? '0 4px 12px rgba(99, 102, 241, 0.1)' : 'none'
            }}>
              <Search 
                size={20} 
                style={{ cursor: 'pointer', color: isSearchOpen ? 'var(--primary)' : 'var(--text-main)', minWidth: '20px' }} 
                onClick={() => { setIsSearchOpen(!isSearchOpen); if(isSearchOpen) setSearchQuery(''); }}
              />
              <input 
                type="text" 
                placeholder="Tìm kiếm sản phẩm..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); if(!isSearchOpen) setIsSearchOpen(true); }}
                style={{
                  width: isSearchOpen ? '100%' : '0',
                  opacity: isSearchOpen ? 1 : 0,
                  marginLeft: isSearchOpen ? '12px' : '0',
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  fontSize: '0.95rem',
                  color: 'var(--text-main)',
                  transition: 'all 0.3s'
                }}
              />
              {isSearchOpen && searchQuery && (
                <X 
                  size={16} 
                  style={{ cursor: 'pointer', color: 'var(--text-muted)' }} 
                  onClick={() => setSearchQuery('')}
                />
              )}
            </div>
            
            {/* Search Suggestions Dropdown */}
            {isSearchOpen && searchQuery.trim() !== '' && (
              <>
                <div onClick={() => setIsSearchOpen(false)} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 90 }} />
                <div className="animate-fade" style={{ position: 'absolute', top: '100%', right: 0, marginTop: '12px', width: '320px', background: 'white', borderRadius: '20px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', padding: '12px', zIndex: 100, maxHeight: '400px', overflowY: 'auto' }}>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px', padding: '0 8px' }}>Kết quả tìm kiếm cho "{searchQuery}"</p>
                  {searchResults.length > 0 ? (
                    searchResults.map(product => (
                      <div 
                        key={product.productId}
                        onClick={() => {
                          onProductSelect(product)
                          setIsSearchOpen(false)
                          setSearchQuery('')
                        }}
                        style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px', borderRadius: '12px', cursor: 'pointer', transition: 'background 0.2s' }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <img src={product.image || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=100'} alt={product.name} style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontWeight: '600', fontSize: '0.85rem', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.name}</p>
                          <p style={{ fontWeight: '700', fontSize: '0.85rem', color: 'var(--primary)' }}>{product.salePrice ? product.salePrice.toLocaleString() : product.price.toLocaleString()}đ</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ padding: '24px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                      Không tìm thấy sản phẩm nào
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
          

          {user ? (
            <div style={{ position: 'relative' }}>
              <div 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '6px 12px', borderRadius: '14px', background: '#f8fafc', border: '1px solid #e2e8f0' }}
              >
                <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.9rem', overflow: 'hidden' }}>
                  {user.avatar ? <img src={user.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : user.name?.charAt(0)}
                </div>
                <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>{user.name}</span>
                <ChevronDown size={14} />
              </div>

              {isUserMenuOpen && (
                <>
                  <div onClick={() => setIsUserMenuOpen(false)} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 90 }} />
                  <div className="animate-fade" style={{ position: 'absolute', top: '100%', right: 0, marginTop: '12px', width: '220px', background: 'white', borderRadius: '20px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', padding: '12px', zIndex: 100 }}>
                    <div style={{ padding: '12px', borderBottom: '1px solid #f1f5f9', marginBottom: '8px' }}>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Tài khoản</p>
                      <p style={{ fontWeight: '700', fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email}</p>
                    </div>
                    <button onClick={() => onNavigate('profile')} className="btn-ghost" style={{ width: '100%', justifyContent: 'flex-start', padding: '10px 12px', borderRadius: '10px', fontSize: '0.9rem' }}>
                      <User size={16} style={{ marginRight: '10px' }} /> Thông tin cá nhân
                    </button>
                    <button onClick={onLogout} className="btn-ghost" style={{ width: '100%', justifyContent: 'flex-start', padding: '10px 12px', borderRadius: '10px', fontSize: '0.9rem', color: '#ef4444' }}>
                      <LogOut size={16} style={{ marginRight: '10px' }} /> Đăng xuất
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button 
              className="btn-ghost" 
              style={{ fontWeight: '700', fontSize: '0.9rem', padding: '10px 20px', borderRadius: '12px', background: 'var(--bg-main)', border: '1px solid #e2e8f0' }}
              onClick={() => onNavigate('login')}
            >
              Đăng nhập
            </button>
          )}

          <button 
            onClick={() => onNavigate('wishlist')}
            style={{ position: 'relative', width: '48px', height: '48px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white', border: '1px solid #e2e8f0', cursor: 'pointer', transition: '0.2s' }}
          >
            <Heart size={20} color="#64748b" />
            {wishlistCount > 0 && (
              <span style={{ position: 'absolute', top: '-5px', right: '-5px', background: '#e11d48', color: 'white', width: '20px', height: '20px', borderRadius: '50%', fontSize: '0.75rem', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid white' }}>
                {wishlistCount}
              </span>
            )}
          </button>

          <button 
            onClick={onToggleCart}
            style={{ position: 'relative', width: '48px', height: '48px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white', border: '1px solid #e2e8f0', cursor: 'pointer', transition: '0.2s' }}
          >
            <ShoppingBag size={20} color="var(--text-main)" />
            {cartCount > 0 && (
              <span style={{ position: 'absolute', top: '-6px', right: '-6px', background: '#ef4444', color: 'white', fontSize: '0.7rem', fontWeight: '800', width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid white', boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)' }}>
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  )
}

const Hero = ({ banners, onExplore }) => {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!banners || banners.length <= 1) return
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % banners.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [banners])

  const activeBanner = banners && banners.length > 0 ? banners[current] : null

  return (
    <section style={{ padding: '80px 0', background: 'white', position: 'relative', overflow: 'hidden' }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', alignItems: 'center', gap: '60px' }}>
        <div className="animate-fade" key={current}>
          <span className="badge" style={{ color: 'var(--primary)', background: 'rgba(99, 102, 241, 0.1)', marginBottom: '16px' }}>BST Mới 2024</span>
          <h2 style={{ fontSize: '4.5rem', fontWeight: '800', lineHeight: '1.1', marginBottom: '24px', letterSpacing: '-2px' }}>
            {activeBanner ? activeBanner.title : <>Nâng Tầm <br /> <span className="grad-text">Phong Cách</span> Bản Thân</>}
          </h2>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '40px', maxWidth: '500px' }}>
            Khám phá bộ sưu tập thời trang cao cấp với thiết kế hiện đại, tinh tế và chất liệu bền vững giúp bạn tự tin tỏa sáng mỗi ngày.
          </p>
          <div style={{ display: 'flex', gap: '16px' }}>
            <button className="btn-primary" onClick={onExplore}>
              Mua ngay thôi <ArrowRight size={20} />
            </button>
            <button className="btn-ghost" style={{ padding: '12px 24px', border: '1px solid #e2e8f0' }}>Xem Lookbook</button>
          </div>
        </div>
        <div style={{ position: 'relative' }}>
          <div style={{ width: '100%', aspectRatio: '4/5', background: '#f8fafc', borderRadius: '32px', overflow: 'hidden', transform: 'rotate(2deg)' }}>
             <img 
               src={activeBanner ? activeBanner.imageUrl : "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800"} 
               alt={activeBanner ? activeBanner.title : "Hero"} 
               style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
             />
          </div>
          <div style={{ position: 'absolute', bottom: '40px', left: '-40px', background: 'white', padding: '24px', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', transform: 'rotate(-2deg)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <div style={{ display: 'flex' }}>
                {[1,2,3,4,5].map(i => <Star key={i} size={14} fill="#fca311" color="#fca311" />)}
              </div>
              <span style={{ fontWeight: '700' }}>4.9/5</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Hơn 10k+ khách hàng tin dùng</p>
          </div>
        </div>
      </div>
      {banners && banners.length > 1 && (
        <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px' }}>
          {banners.map((_, idx) => (
            <div 
              key={idx} 
              onClick={() => setCurrent(idx)}
              style={{ 
                width: idx === current ? '24px' : '8px', 
                height: '8px', 
                borderRadius: '4px', 
                background: idx === current ? 'var(--primary)' : '#cbd5e1', 
                cursor: 'pointer',
                transition: 'all 0.3s'
              }} 
            />
          ))}
        </div>
      )}
    </section>
  )
}

// --- PAGES ---

const HomePage = ({ categories, brands, wishlist, onToggleWishlist, onProductSelect, onAddToCart }) => {
  const [products, setProducts] = useState([])
  const [banners, setBanners] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [prods, bans] = await Promise.all([
        ProductService.getAll(),
        ContentService.getBanners()
      ])
      setProducts(prods.data)
      setBanners(bans.data.filter(b => b.isActive))
      setLoading(false)
    } catch (err) {
      console.error(err)
      setLoading(false)
    }
  }

  return (
    <div className="animate-fade">
      <Hero 
        banners={banners}
        onExplore={() => {
          document.getElementById('promo').scrollIntoView({ behavior: 'smooth' })
        }} 
      />

      <section id="promo" style={{ padding: '80px 0', background: 'linear-gradient(180deg, #fff 0%, #fff5f5 100%)' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#fff1f2', color: '#e11d48', padding: '6px 12px', borderRadius: '99px', fontSize: '0.8rem', fontWeight: '700', marginBottom: '12px' }}>
                <Star size={14} fill="#e11d48" /> Ưu Đãi Độc Quyền
              </div>
              <h3 style={{ fontSize: '2.2rem', fontWeight: '800' }}>Giá Tốt Hôm Nay</h3>
              <p style={{ color: 'var(--text-muted)' }}>Những sản phẩm đang được giảm giá mạnh nhất</p>
            </div>
            <button className="btn-ghost" style={{ border: '1px solid #fecaca', borderRadius: '12px', color: '#e11d48' }}>Xem tất cả deal</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '32px' }}>
            {products.filter(p => p.salePrice && p.salePrice < p.price).slice(0, 4).map(prod => (
              <ProductCard 
                key={prod.productId} 
                product={prod} 
                wishlist={wishlist}
                onToggleWishlist={onToggleWishlist}
                onAddToCart={onAddToCart}
                onClick={() => onProductSelect(prod)}
              />
            ))}
          </div>
        </div>
      </section>
      
      <section id="featured" style={{ padding: '80px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px' }}>
            <div>
              <h3 style={{ fontSize: '2.2rem', fontWeight: '800' }}>Sản Phẩm Mới Nhất</h3>
              <p style={{ color: 'var(--text-muted)' }}>Những thiết kế vừa ra mắt trong tuần này</p>
            </div>
            <button className="btn-ghost" style={{ border: '1px solid #e2e8f0', borderRadius: '12px' }}>Xem tất cả</button>
          </div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '100px 0' }}>Đang tải sản phẩm...</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '32px' }}>
              {products.map(prod => (
                <ProductCard 
                  key={prod.productId} 
                  product={prod} 
                  wishlist={wishlist}
                  onToggleWishlist={onToggleWishlist}
                  onAddToCart={onAddToCart}
                  onClick={() => onProductSelect(prod)}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

// ProductDetail component moved to ProductDetailPage.jsx
const ProductDetail = ({ product, wishlist, onToggleWishlist, onClose, onAddToCart, onProductSelect }) => {
  const [qty, setQty] = useState(1)
  const [activeImg, setActiveImg] = useState(product?.image)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [selectedColor, setSelectedColor] = useState(null)
  const [selectedSize, setSelectedSize] = useState(null)

  useEffect(() => {
    if (product) {
      setActiveImg(product.image)
      fetchRelated()
      window.scrollTo(0, 0)
      
      // Default selections
      if (product.variants?.length > 0) {
        setSelectedColor(product.variants[0].color)
        setSelectedSize(product.variants[0].size)
      }
    }
  }, [product])

  const fetchRelated = async () => {
    try {
      const res = await ProductService.getAll()
      const filtered = res.data.filter(p => p.categoryId === product.categoryId && p.productId !== product.productId)
      setRelatedProducts(filtered.slice(0, 4))
    } catch (e) {
      console.error(e)
    }
  }

  if (!product) return null

  const allColors = [...new Set(product.variants?.flatMap(v => splitValues(v.color)) || [])]
  const availableSizes = [...new Set(
    product.variants?.filter(v => {
      const vColors = splitValues(v.color)
      return !selectedColor || vColors.includes(selectedColor)
    }).flatMap(v => splitValues(v.size)) || []
  )]

  return (
    <div className="animate-fade" style={{ background: 'white', minHeight: '100vh', padding: '60px 0' }}>
      <div className="container">
        <button className="btn-ghost" onClick={onClose} style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '8px' }}>
           <ChevronRight size={18} style={{ transform: 'rotate(180deg)' }} /> Quay lại
        </button>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '80px', marginBottom: '80px' }}>
          <div style={{ display: 'flex', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[product.image, product.image1, product.image2, product.image3].filter(img => img && img !== "").map((img, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setActiveImg(img)}
                  style={{ 
                    width: '80px', 
                    height: '100px', 
                    borderRadius: '12px', 
                    overflow: 'hidden', 
                    cursor: 'pointer', 
                    border: activeImg === img ? '2px solid var(--primary)' : '2px solid transparent',
                    transition: '0.2s'
                  }}
                >
                  <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
            <div style={{ flex: 1, borderRadius: '32px', overflow: 'hidden', background: '#f8fafc', height: '600px' }}>
              <img 
                src={activeImg || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=600'} 
                alt={product.name} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>
          
          <div style={{ padding: '20px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <span className="badge">{product.category?.name || 'Mới nhất'}</span>
              {product.brand && (
                <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--secondary)' }}>{product.brand.name}</span>
              )}
            </div>
            <h2 style={{ fontSize: '3rem', fontWeight: '800', lineHeight: '1.1', marginBottom: '20px', letterSpacing: '-1px' }}>{product.name}</h2>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
              {product.salePrice ? (
                <>
                  <span style={{ fontSize: '2.2rem', fontWeight: '800', color: '#ef4444' }}>{product.salePrice?.toLocaleString('vi-VN')}₫</span>
                  <span style={{ fontSize: '1.2rem', color: '#94a3b8', textDecoration: 'line-through' }}>{product.price?.toLocaleString('vi-VN')}₫</span>
                </>
              ) : (
                <span style={{ fontSize: '2.2rem', fontWeight: '800', color: 'var(--primary)' }}>{product.price?.toLocaleString('vi-VN')}₫</span>
              )}
            </div>

            {/* Variant Selection */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '40px' }}>
              {allColors.length > 0 && (
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '12px' }}>Màu sắc: <span style={{ color: 'var(--text-main)' }}>{selectedColor}</span></h4>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    {allColors.map(color => (
                      <button 
                        key={color}
                        onClick={() => {
                          setSelectedColor(color)
                          const filteredSizes = [...new Set(
                            product.variants?.filter(v => splitValues(v.color).includes(color))
                              .flatMap(v => splitValues(v.size)) || []
                          )]
                          if (!filteredSizes.includes(selectedSize)) setSelectedSize(filteredSizes[0])
                        }}
                        style={{ 
                          width: '40px', 
                          height: '40px', 
                          borderRadius: '50%', 
                          background: COLOR_MAP[color.toLowerCase()] || color.toLowerCase(), 
                          border: selectedColor === color ? '3px solid var(--primary)' : '1px solid #e2e8f0',
                          cursor: 'pointer',
                          boxShadow: selectedColor === color ? '0 0 10px rgba(99, 102, 241, 0.4)' : 'none'
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {availableSizes.length > 0 && (
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '12px' }}>Kích thước: <span style={{ color: 'var(--text-main)' }}>{selectedSize}</span></h4>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    {availableSizes.map(size => (
                      <button 
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        style={{ 
                          minWidth: '50px', 
                          height: '50px', 
                          borderRadius: '12px', 
                          background: selectedSize === size ? 'var(--primary)' : 'white', 
                          color: selectedSize === size ? 'white' : 'var(--text-main)',
                          border: '1px solid #e2e8f0',
                          fontWeight: '700',
                          cursor: 'pointer',
                          transition: '0.2s'
                        }}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '32px', marginBottom: '32px' }}>
              <h4 style={{ fontWeight: '700', marginBottom: '12px', fontSize: '1.1rem' }}>Mô tả sản phẩm</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: '1.7' }}>{product.description || 'Sản phẩm cao cấp chất lượng tuyệt hảo với thiết kế hiện đại, phù hợp cho mọi dịp.'}</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--text-muted)' }}>SỐ LƯỢNG:</span>
                <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', borderRadius: '12px', padding: '6px' }}>
                  <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                    <Minus size={16} />
                  </button>
                  <span style={{ width: '50px', textAlign: 'center', fontWeight: '700', fontSize: '1.1rem' }}>{qty}</span>
                  <button onClick={() => setQty(qty + 1)} style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <button 
                  className="btn-primary" 
                  style={{ flex: 1, height: '64px', fontSize: '1.1rem', borderRadius: '16px' }}
                  onClick={() => {
                    const variant = product.variants?.find(v => v.color === selectedColor && v.size === selectedSize);
                    onAddToCart({ 
                      ...product, 
                      selectedColor, 
                      selectedSize,
                      variantId: variant?.variantId 
                    }, qty);
                  }}
                >
                  <ShoppingBag size={20} style={{ marginRight: '10px' }} />
                  Thêm vào giỏ hàng
                </button>
                <button 
                  className="btn-ghost" 
                  onClick={() => onToggleWishlist(product)}
                  style={{ 
                    border: '1px solid #e2e8f0', 
                    width: '64px', 
                    height: '64px', 
                    borderRadius: '16px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    background: isWishlisted ? '#fff1f2' : 'white',
                    borderColor: isWishlisted ? '#fecaca' : '#e2e8f0'
                  }}
                >
                  <Heart size={24} color={isWishlisted ? '#e11d48' : '#64748b'} fill={isWishlisted ? '#e11d48' : 'none'} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '80px' }}>
            <h3 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '40px' }}>Sản Phẩm Liên Quan</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '32px' }}>
              {relatedProducts.map(prod => (
                <ProductCard 
                  key={prod.productId} 
                  product={prod} 
                  wishlist={wishlist}
                  onToggleWishlist={onToggleWishlist}
                  onAddToCart={onAddToCart}
                  onClick={() => {
                    onProductSelect(prod)
                    setQty(1)
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const CartDrawer = ({ isOpen, onClose, cart, setCart }) => {
  const [discount, setDiscount] = useState(0)
  const [couponCode, setCouponCode] = useState('')

  const total = cart.reduce((acc, item) => acc + ((item.salePrice || item.price) * item.quantity), 0)

  const handleUpdateQty = (cartId, delta) => {
    setCart(prev => prev.map(item => 
      item.cartId === cartId ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ))
  }

  const handleRemove = (cartId) => {
    setCart(prev => prev.filter(item => item.cartId !== cartId))
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
                <div key={item.cartId} style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ width: '80px', height: '100px', borderRadius: '12px', background: '#f8fafc', overflow: 'hidden' }}>
                     <img src={item.image || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=600'} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '4px' }}>{item.name}</h4>
                    {(item.selectedColor || item.selectedSize) && (
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                        {item.selectedColor}{item.selectedColor && item.selectedSize ? ' / ' : ''}{item.selectedSize}
                      </p>
                    )}
                    <p style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: '700', marginBottom: '8px' }}>{(item.salePrice || item.price)?.toLocaleString('vi-VN')}₫</p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '4px' }}>
                        <button onClick={() => handleUpdateQty(item.cartId, -1)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px' }}><Minus size={14} /></button>
                        <span style={{ padding: '0 12px', fontWeight: '600' }}>{item.quantity}</span>
                        <button onClick={() => handleUpdateQty(item.cartId, 1)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px' }}><Plus size={14} /></button>
                      </div>
                      <button onClick={() => handleRemove(item.cartId)} style={{ color: '#ef4444', fontSize: '0.8rem', background: 'transparent', border: 'none', cursor: 'pointer' }}>Xóa</button>
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

const Footer = () => (
    <footer style={{ padding: '80px 0', borderTop: '1px solid #f1f5f9' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '40px' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '24px' }}>THU<span className="grad-text">STORE</span></h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Trải nghiệm mua sắm thời trang trực tuyến hiện đại và chuyên nghiệp nhất.</p>
            <div style={{ display: 'flex', gap: '16px' }}>
              {[Facebook, Instagram, Twitter].map((Icon, idx) => (
                <div key={idx} style={{ width: '40px', height: '40px', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <Icon size={18} />
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 style={{ fontWeight: '800', marginBottom: '24px' }}>Mua sắm</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', color: 'var(--text-muted)' }}>
              <li>Thanh toán</li>
              <li>Vận chuyển</li>
              <li>Chính sách đổi trả</li>
              <li>Câu hỏi thường gặp</li>
            </ul>
          </div>
          <div>
            <h4 style={{ fontWeight: '800', marginBottom: '24px' }}>Thông tin</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', color: 'var(--text-muted)' }}>
              <li>Về chúng tôi</li>
              <li>Liên hệ</li>
              <li>Hệ thống cửa hàng</li>
              <li>Blog thời trang</li>
            </ul>
          </div>
          <div>
            <h4 style={{ fontWeight: '800', marginBottom: '24px' }}>Bản tin</h4>
            <p style={{ color: 'var(--text-muted)', marginBottom: '16px', fontSize: '0.9rem' }}>Đăng ký nhận thông tin khuyến mãi mới nhất.</p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input type="text" placeholder="Email của bạn..." style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none' }} />
              <button style={{ background: 'black', color: 'white', border: 'none', padding: '0 16px', borderRadius: '12px' }}><ArrowRight size={18} /></button>
            </div>
          </div>
        </div>
        <div style={{ marginTop: '60px', paddingTop: '40px', borderTop: '1px solid #f1f5f9', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          &copy; 2024 THU STORE - Bản quyền thuộc về Nguyen Minh Thu
        </div>
      </div>
    </footer>
)

// --- MAIN APP ---

const App = () => {
  const [page, setPage] = useState(() => {
    const path = window.location.pathname.replace('/', '')
    if (path === 'vnpay-return') return 'vnpay-return'
    
    // Try to get from localStorage if it's a generic refresh
    const saved = localStorage.getItem('currentPage')
    if (saved && saved !== 'vnpay-return') return saved
    
    // Fallback to path mapping
    const validPages = ['products', 'wishlist', 'cart', 'checkout', 'login', 'register', 'profile', 'order-detail', 'detail']
    if (validPages.includes(path)) return path
    
    return 'home'
  })

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user')
    return saved ? JSON.parse(saved) : null
  })
  const [activeFilter, setActiveFilter] = useState(null)
  const [resetEmail, setResetEmail] = useState('')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart')
    return saved ? JSON.parse(saved) : []
  })
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('wishlist')
    return saved ? JSON.parse(saved) : []
  })
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])
  const [allProducts, setAllProducts] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist))
  }, [wishlist])

  useEffect(() => {
    localStorage.setItem('currentPage', page)
  }, [page])

  useEffect(() => {
    const handlePopState = (e) => {
      if (e.state?.page) {
        setPage(e.state.page)
      } else {
        const path = window.location.pathname.replace('/', '') || 'home'
        setPage(path)
      }
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const handleToggleWishlist = (product) => {
    setWishlist(prev => {
      const exists = prev.find(item => item.productId === product.productId)
      if (exists) {
        return prev.filter(item => item.productId !== product.productId)
      }
      return [...prev, product]
    })
  }

  const handleNavigate = (target, filter = null) => {
    setPage(target)
    setActiveFilter(filter)
    window.scrollTo(0, 0)
    
    // Sync URL
    const path = target === 'home' ? '/' : `/${target}`
    if (window.location.pathname !== path) {
      window.history.pushState({ page: target }, '', path)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    setUser(null)
    setPage('home')
  }

  const handleLoginSuccess = (userData) => {
    setUser(userData)
    setPage('home')
  }

  const handleProfileUpdate = (updatedUserData) => {
    setUser(updatedUserData)
    localStorage.setItem('user', JSON.stringify(updatedUserData))
  }

  useEffect(() => {
    fetchInitialData()
  }, [])

  const fetchInitialData = async () => {
    try {
      const [cats, brs, prods] = await Promise.all([
        CategoryService.getAll(),
        BrandService.getAll(),
        ProductService.getAll()
      ])
      setCategories(cats.data)
      setBrands(brs.data)
      setAllProducts(prods.data)
    } catch (e) {
      console.error(e)
    }
  }

  const handleAddToCart = (product, quantity = 1) => {
    const cartId = `${product.productId}-${product.selectedColor || ''}-${product.selectedSize || ''}`
    setCart(prev => {
      const exists = prev.find(item => item.cartId === cartId)
      if (exists) {
        return prev.map(item => item.cartId === cartId ? { ...item, quantity: item.quantity + quantity } : item)
      }
      return [...prev, { ...product, cartId, quantity }]
    })
    
    // Sync with DB if logged in
    if (user) {
      api.post(`/Cart/add?userId=${user.userId}&productId=${product.productId}&quantity=${quantity}${product.variantId ? `&variantId=${product.variantId}` : ''}`).catch(console.error);
    }
    // No longer auto-opening drawer, user wants a separate page.
    // But we could show a toast or brief notification here.
  }

  const navigateToProduct = (product) => {
    setSelectedProduct(product)
    setPage('detail')
    window.scrollTo(0, 0)
  }

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0)

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar 
        categories={categories}
        brands={brands}
        allProducts={allProducts}
        cartCount={totalItems} 
        wishlistCount={wishlist.length}
        user={user}
        onLogout={handleLogout}
        onNavigate={handleNavigate} 
        onProductSelect={navigateToProduct}
        onToggleCart={() => handleNavigate('cart')} 
      />
      
      <main style={{ minHeight: '80vh' }}>
        {page === 'home' && (
          <HomePage 
            categories={categories}
            brands={brands}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
            onProductSelect={navigateToProduct} 
            onAddToCart={handleAddToCart} 
          />
        )}
        {page === 'products' && (
          <ProductListPage 
            filter={activeFilter}
            categories={categories}
            brands={brands}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
            onProductSelect={navigateToProduct} 
            onAddToCart={handleAddToCart} 
          />
        )}
        {page === 'wishlist' && (
          <WishlistPage 
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
            onAddToCart={handleAddToCart}
            onProductSelect={navigateToProduct}
            onNavigate={handleNavigate}
          />
        )}
        {page === 'cart' && (
          <CartPage 
            cart={cart}
            setCart={setCart}
            onNavigate={handleNavigate}
          />
        )}
        {page === 'checkout' && (
          <CheckoutPage 
            cart={cart}
            user={user}
            onNavigate={handleNavigate}
            onClearCart={() => setCart([])}
          />
        )}
        {page === 'vnpay-return' && (
          <VnPayReturnPage 
            onNavigate={(p) => {
              window.history.pushState({}, '', '/');
              handleNavigate(p);
            }}
            onClearCart={() => setCart([])}
          />
        )}
        {page === 'login' && (
          <LoginPage 
            onLoginSuccess={handleLoginSuccess}
            onBack={() => setPage('home')}
            onGoToRegister={() => setPage('register')}
            onGoToForgotPassword={() => setPage('forgot-password')}
          />
        )}
        {page === 'register' && (
          <RegisterPage 
            onRegisterSuccess={() => setPage('login')}
            onBackToLogin={() => setPage('login')}
          />
        )}
        {page === 'forgot-password' && (
          <ForgotPasswordPage 
            onBack={() => setPage('login')}
            onGoToReset={(email) => { setResetEmail(email); setPage('reset-password'); }}
          />
        )}
        {page === 'reset-password' && (
          <ResetPasswordPage 
            email={resetEmail}
            onBack={() => setPage('forgot-password')}
            onSuccess={() => setPage('login')}
          />
        )}
        {page === 'detail' && (
          <ProductDetailPage
            product={selectedProduct}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
            onClose={() => setPage('home')}
            onAddToCart={handleAddToCart}
            onProductSelect={navigateToProduct}
          />
        )}
        {page === 'profile' && user && (
          <ProfilePage 
            user={user} 
            onUpdate={(type, data) => {
              if (type === 'order-detail') {
                setSelectedOrder(data)
                setPage('order-detail')
              } else {
                handleProfileUpdate(data)
              }
            }} 
            onBack={() => setPage('home')} 
          />
        )}
        {page === 'order-detail' && selectedOrder && (
          <OrderDetailPage 
            order={selectedOrder}
            onBack={() => setPage('profile')}
          />
        )}
      </main>

      <Footer />
      <ChatAI 
        onNavigate={handleNavigate}
        onProductSelect={navigateToProduct}
        onAddToCart={handleAddToCart}
        allProducts={allProducts}
      />
    </div>
  )
}

export default App
