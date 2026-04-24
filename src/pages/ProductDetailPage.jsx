import React, { useState, useEffect } from 'react'
import { Heart, ShoppingBag, ChevronRight, Star, Minus, Plus, Truck, RotateCcw, Shield, Share2, CheckCircle2, Package } from 'lucide-react'
import { ProductService } from '../api'
import ProductCard from '../components/Product/ProductCard'

const TABS = ['Mô tả', 'Chính sách', 'Đánh giá']

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
  'kem': '#fffdd0',
  'đen ': '#18181b',
  ' trắng': '#ffffff'
}

const splitValues = (val) => {
  if (!val) return []
  // Split by common delimiters: comma, slash, less than, or semicolon
  return val.split(/[,\/;<]+/).map(s => s.trim()).filter(Boolean)
}

const ProductDetailPage = ({ product, wishlist, onToggleWishlist, onClose, onAddToCart, onProductSelect }) => {
  const [qty, setQty] = useState(1)
  const [activeImg, setActiveImg] = useState(0)
  const [selectedColor, setSelectedColor] = useState(null)
  const [selectedSize, setSelectedSize] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [activeTab, setActiveTab] = useState('Mô tả')
  const [added, setAdded] = useState(false)

  const isWishlisted = wishlist?.some(item => item.productId === product?.productId)

  useEffect(() => {
    if (!product) return
    setActiveImg(0)
    setQty(1)
    setAdded(false)
    
    const colors = product.variants?.flatMap(v => splitValues(v.color)) || []
    const uniqueCols = [...new Set(colors)]
    const sizes = product.variants?.flatMap(v => splitValues(v.size)) || []
    const uniqueSizes = [...new Set(sizes)]

    setSelectedColor(uniqueCols[0] || null)
    setSelectedSize(uniqueSizes[0] || null)

    window.scrollTo({ top: 0, behavior: 'smooth' })
    fetchRelated()
  }, [product])

  const fetchRelated = async () => {
    try {
      const res = await ProductService.getAll()
      const filtered = res.data.filter(p => p.categoryId === product.categoryId && p.productId !== product.productId)
      setRelatedProducts(filtered.slice(0, 4))
    } catch (e) { console.error(e) }
  }

  if (!product) return null

  const gallery = [product.image, product.image1, product.image2, product.image3].filter(img => img && img !== '')
  if (gallery.length === 0) gallery.push('https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=600')

  // Process variants to get unique individual colors and sizes
  const allColors = [...new Set(product.variants?.flatMap(v => splitValues(v.color)) || [])]
  
  // Available sizes should be filtered by selected color
  const availableSizes = [...new Set(
    product.variants?.filter(v => {
      const vColors = splitValues(v.color)
      return !selectedColor || vColors.includes(selectedColor)
    }).flatMap(v => splitValues(v.size)) || []
  )]

  const hasDiscount = product.salePrice && product.salePrice < product.price
  const discountPct = hasDiscount ? Math.round((1 - product.salePrice / product.price) * 100) : 0
  const displayPrice = product.salePrice || product.price

  const handleAddToCart = () => {
    // Find the variant that matches the selection
    const variant = product.variants?.find(v => {
      const vColors = splitValues(v.color)
      const vSizes = splitValues(v.size)
      return vColors.includes(selectedColor) && vSizes.includes(selectedSize)
    })
    
    onAddToCart({ ...product, selectedColor, selectedSize, variantId: variant?.variantId || variant?.id }, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="animate-fade" style={{ background: '#f8fafc', minHeight: '100vh' }}>
      {/* Breadcrumb */}
      <div style={{ background: 'white', borderBottom: '1px solid #f1f5f9', padding: '16px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)', fontWeight: '600', fontSize: '0.9rem' }}>
              Trang chủ
            </button>
            <ChevronRight size={14} />
            <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>{product.category?.name || 'Sản phẩm'}</span>
            <ChevronRight size={14} />
            <span style={{ color: 'var(--text-muted)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.name}</span>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '48px 0' }}>
        {/* Main Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '64px', marginBottom: '80px', background: 'white', borderRadius: '32px', padding: '48px', boxShadow: '0 4px 24px rgba(0,0,0,0.04)' }}>
          {/* Left: Image Gallery */}
          <div style={{ display: 'flex', gap: '16px' }}>
            {/* Thumbnails */}
            {gallery.length > 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {gallery.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => setActiveImg(idx)}
                    style={{
                      width: '72px', height: '88px', borderRadius: '12px', overflow: 'hidden', cursor: 'pointer',
                      border: activeImg === idx ? '2.5px solid var(--primary)' : '2px solid transparent',
                      background: '#f8fafc', transition: 'all 0.2s',
                      boxShadow: activeImg === idx ? '0 4px 12px rgba(99,102,241,0.2)' : 'none'
                    }}
                  >
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            )}

            {/* Main Image */}
            <div style={{ flex: 1, position: 'relative', borderRadius: '24px', overflow: 'hidden', background: '#f8fafc', aspectRatio: '3/4' }}>
              {hasDiscount && (
                <div style={{ position: 'absolute', top: '20px', left: '20px', background: '#ef4444', color: 'white', padding: '6px 14px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: '800', zIndex: 10, boxShadow: '0 4px 12px rgba(239,68,68,0.3)' }}>
                  -{discountPct}%
                </div>
              )}
              <img
                src={gallery[activeImg]}
                alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.3s' }}
              />
            </div>
          </div>

          {/* Right: Info */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            {/* Badges */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <span className="badge">{product.category?.name || 'Mới nhất'}</span>
              {product.brand && (
                <span style={{ fontSize: '0.78rem', fontWeight: '800', color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {product.brand.name}
                </span>
              )}
            </div>

            <h1 style={{ fontSize: '2.4rem', fontWeight: '800', lineHeight: '1.15', marginBottom: '20px', letterSpacing: '-0.5px', color: '#0f172a' }}>
              {product.name}
            </h1>

            {/* Stars placeholder */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', gap: '2px' }}>
                {[1,2,3,4,5].map(i => <Star key={i} size={16} fill={i <= 4 ? '#fca311' : 'none'} color="#fca311" />)}
              </div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>4.0 (128 đánh giá)</span>
            </div>

            {/* Price */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px', marginBottom: '32px', padding: '20px', background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)', borderRadius: '16px' }}>
              <span style={{ fontSize: '2.4rem', fontWeight: '900', color: hasDiscount ? '#ef4444' : 'var(--primary)', letterSpacing: '-1px' }}>
                {displayPrice?.toLocaleString('vi-VN')}₫
              </span>
              {hasDiscount && (
                <span style={{ fontSize: '1.2rem', color: '#94a3b8', textDecoration: 'line-through', fontWeight: '600' }}>
                  {product.price?.toLocaleString('vi-VN')}₫
                </span>
              )}
              {hasDiscount && (
                <span style={{ fontSize: '0.85rem', fontWeight: '800', color: '#10b981', background: '#dcfce7', padding: '4px 10px', borderRadius: '8px' }}>
                  Tiết kiệm {(product.price - product.salePrice)?.toLocaleString('vi-VN')}₫
                </span>
              )}
            </div>

            {/* Color Selection */}
            {allColors.length > 0 && (
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                  Màu sắc: <span style={{ color: 'var(--text-main)', textTransform: 'none', letterSpacing: 0 }}>{selectedColor}</span>
                </h4>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {allColors.map(color => (
                    <button
                      key={color}
                      title={color}
                      onClick={() => {
                        setSelectedColor(color)
                        const filteredSizes = [...new Set(
                          product.variants?.filter(v => splitValues(v.color).includes(color))
                            .flatMap(v => splitValues(v.size)) || []
                        )]
                        if (!filteredSizes.includes(selectedSize)) setSelectedSize(filteredSizes[0])
                      }}
                      style={{
                        width: '38px', height: '38px', borderRadius: '50%',
                        background: COLOR_MAP[color.toLowerCase()] || color.toLowerCase(),
                        border: selectedColor === color ? '3px solid var(--primary)' : '2px solid #e2e8f0',
                        cursor: 'pointer',
                        boxShadow: selectedColor === color ? '0 0 0 3px rgba(99,102,241,0.2)' : 'none',
                        transition: 'all 0.2s'
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {availableSizes.length > 0 && (
              <div style={{ marginBottom: '32px' }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                  Kích thước: <span style={{ color: 'var(--text-main)', textTransform: 'none', letterSpacing: 0 }}>{selectedSize}</span>
                </h4>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {availableSizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      style={{
                        minWidth: '52px', height: '52px', borderRadius: '12px',
                        background: selectedSize === size ? 'var(--primary)' : 'white',
                        color: selectedSize === size ? 'white' : 'var(--text-main)',
                        border: selectedSize === size ? '2px solid var(--primary)' : '2px solid #e2e8f0',
                        fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s',
                        fontSize: '0.9rem',
                        boxShadow: selectedSize === size ? '0 4px 12px rgba(99,102,241,0.3)' : 'none'
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '28px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)' }}>Số lượng:</span>
              <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', borderRadius: '14px', padding: '6px', border: '1px solid #e2e8f0' }}>
                <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.06)', transition: '0.2s' }}>
                  <Minus size={16} />
                </button>
                <span style={{ width: '52px', textAlign: 'center', fontWeight: '800', fontSize: '1.1rem' }}>{qty}</span>
                <button onClick={() => setQty(qty + 1)} style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.06)', transition: '0.2s' }}>
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* CTA Buttons */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
              <button
                className="btn-primary"
                onClick={handleAddToCart}
                style={{ flex: 1, height: '60px', fontSize: '1rem', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', transition: 'all 0.3s', background: added ? '#10b981' : undefined }}
              >
                {added ? <><CheckCircle2 size={20} /> Đã thêm vào giỏ!</> : <><ShoppingBag size={20} /> Thêm vào giỏ hàng</>}
              </button>
              <button
                onClick={() => onToggleWishlist(product)}
                style={{
                  width: '60px', height: '60px', borderRadius: '16px',
                  background: isWishlisted ? '#fff1f2' : 'white',
                  border: isWishlisted ? '2px solid #fecaca' : '2px solid #e2e8f0',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s'
                }}
              >
                <Heart size={22} color={isWishlisted ? '#e11d48' : '#64748b'} fill={isWishlisted ? '#e11d48' : 'none'} />
              </button>
              <button
                style={{ width: '60px', height: '60px', borderRadius: '16px', background: 'white', border: '2px solid #e2e8f0', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
              >
                <Share2 size={20} color="#64748b" />
              </button>
            </div>

            {/* Trust Badges */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              {[
                { icon: Truck, label: 'Miễn phí vận chuyển', sub: 'Đơn từ 500k' },
                { icon: RotateCcw, label: 'Đổi trả 30 ngày', sub: 'Miễn phí' },
                { icon: Shield, label: 'Bảo hành chính hãng', sub: '12 tháng' }
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} style={{ background: '#f8fafc', borderRadius: '14px', padding: '14px', textAlign: 'center', border: '1px solid #f1f5f9' }}>
                  <Icon size={20} color="var(--primary)" style={{ marginBottom: '6px' }} />
                  <p style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '2px' }}>{label}</p>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div style={{ background: 'white', borderRadius: '32px', padding: '40px', boxShadow: '0 4px 24px rgba(0,0,0,0.04)', marginBottom: '80px' }}>
          <div style={{ display: 'flex', gap: '4px', borderBottom: '2px solid #f1f5f9', marginBottom: '32px' }}>
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '14px 28px', background: 'none', border: 'none', cursor: 'pointer',
                  fontWeight: '700', fontSize: '0.95rem',
                  color: activeTab === tab ? 'var(--primary)' : 'var(--text-muted)',
                  borderBottom: activeTab === tab ? '2px solid var(--primary)' : '2px solid transparent',
                  marginBottom: '-2px', transition: 'all 0.2s', borderRadius: '8px 8px 0 0'
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === 'Mô tả' && (
            <div style={{ maxWidth: '700px', lineHeight: '1.8', color: 'var(--text-muted)', fontSize: '1.05rem' }}>
              <p>{product.description || 'Sản phẩm cao cấp chất lượng tuyệt hảo với thiết kế hiện đại, tinh tế và chất liệu bền vững. Phù hợp cho mọi dịp từ công sở đến dạo phố, giúp bạn tự tin tỏa sáng mỗi ngày.'}</p>
            </div>
          )}
          {activeTab === 'Chính sách' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              {[
                { icon: Truck, title: 'Vận chuyển', desc: 'Miễn phí ship cho đơn hàng từ 500.000₫. Giao hàng trong 2-3 ngày làm việc.' },
                { icon: RotateCcw, title: 'Đổi trả', desc: 'Đổi trả miễn phí trong 30 ngày kể từ ngày nhận hàng. Sản phẩm còn nguyên tem.' },
                { icon: Shield, title: 'Bảo hành', desc: 'Bảo hành chính hãng 12 tháng. Hỗ trợ bảo hành tại tất cả cửa hàng.' },
                { icon: Package, title: 'Đóng gói', desc: 'Sản phẩm được đóng gói cẩn thận, đảm bảo an toàn trong suốt quá trình vận chuyển.' }
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} style={{ display: 'flex', gap: '16px', padding: '24px', background: '#f8fafc', borderRadius: '16px', border: '1px solid #f1f5f9' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={22} color="var(--primary)" />
                  </div>
                  <div>
                    <h4 style={{ fontWeight: '700', marginBottom: '6px' }}>{title}</h4>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          {activeTab === 'Đánh giá' && (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
              <Star size={48} color="#fca311" fill="#fca311" style={{ marginBottom: '16px' }} />
              <h3 style={{ fontSize: '3rem', fontWeight: '900', color: '#0f172a', marginBottom: '8px' }}>4.0 / 5</h3>
              <p style={{ marginBottom: '4px' }}>Dựa trên 128 đánh giá</p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginTop: '12px' }}>
                {[1,2,3,4,5].map(i => <Star key={i} size={24} fill={i <= 4 ? '#fca311' : 'none'} color="#fca311" />)}
              </div>
            </div>
          )}
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
              <div>
                <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '6px' }}>Sản phẩm liên quan</h2>
                <p style={{ color: 'var(--text-muted)' }}>Có thể bạn cũng thích</p>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '28px' }}>
              {relatedProducts.map(prod => (
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
        )}
      </div>
    </div>
  )
}

export default ProductDetailPage
