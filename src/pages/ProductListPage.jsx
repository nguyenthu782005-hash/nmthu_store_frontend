import React, { useState, useEffect, useMemo } from 'react'
import { ProductService } from '../api'
import ProductCard from '../components/Product/ProductCard'
import { Filter, ChevronDown, Check, X, SlidersHorizontal, ArrowUpDown } from 'lucide-react'

const ProductListPage = ({ filter, categories, brands, onProductSelect, onAddToCart }) => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('newest')
  
  // Filter states
  const [priceRange, setPriceRange] = useState([0, 2000000])
  const [selectedBrands, setSelectedBrands] = useState([])
  const [selectedCategories, setSelectedCategories] = useState(filter?.type === 'category' ? [filter.id] : [])
  const [showFilters, setShowFilters] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (filter?.type === 'category') {
      setSelectedCategories([filter.id])
    } else if (filter?.type === 'brand') {
      setSelectedBrands([filter.id])
    }
  }, [filter])

  const fetchData = async () => {
    try {
      const res = await ProductService.getAll()
      setProducts(res.data)
      setLoading(false)
    } catch (err) {
      console.error(err)
      setLoading(false)
    }
  }

  const filteredProducts = useMemo(() => {
    return products.filter(prod => {
      // Category filter
      if (selectedCategories.length > 0 && !selectedCategories.includes(prod.categoryId)) return false
      
      // Brand filter
      if (selectedBrands.length > 0 && !selectedBrands.includes(prod.brandId)) return false
      
      // Price filter
      const price = prod.salePrice || prod.price
      if (price < priceRange[0] || price > priceRange[1]) return false
      
      return true
    })
  }, [products, selectedCategories, selectedBrands, priceRange])

  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts]
    if (sortBy === 'price-asc') sorted.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price))
    else if (sortBy === 'price-desc') sorted.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price))
    else if (sortBy === 'popular') sorted.sort((a, b) => b.views - a.views)
    else sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // newest
    return sorted
  }, [filteredProducts, sortBy])

  const toggleItem = (list, setList, item) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item))
    } else {
      setList([...list, item])
    }
  }

  const clearFilters = () => {
    setSelectedBrands([])
    setSelectedCategories([])
    setPriceRange([0, 2000000])
  }

  return (
    <div className="animate-fade" style={{ padding: '40px 0', background: '#f8fafc', minHeight: '100vh' }}>
      <div className="container">
        {/* Header Section */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '40px' }}>
          <div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '8px', letterSpacing: '-1px' }}>
              {filter?.name ? `Bộ sưu tập ${filter.name}` : 'Tất cả sản phẩm'}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
              Hiển thị {sortedProducts.length} sản phẩm thời trang cao cấp
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '16px' }}>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="btn-ghost"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', borderRadius: '14px', border: '1px solid #e2e8f0', background: 'white' }}
            >
              <SlidersHorizontal size={18} />
              {showFilters ? 'Ẩn bộ lọc' : 'Hiện bộ lọc'}
            </button>
            
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '12px', background: 'white', padding: '0 20px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
              <ArrowUpDown size={18} color="var(--text-muted)" />
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                style={{ height: '48px', border: 'none', outline: 'none', cursor: 'pointer', background: 'transparent', fontWeight: '600', fontSize: '0.95rem' }}
              >
                <option value="newest">Mới nhất</option>
                <option value="popular">Phổ biến nhất</option>
                <option value="price-asc">Giá: Thấp đến Cao</option>
                <option value="price-desc">Giá: Cao đến Thấp</option>
              </select>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '40px' }}>
          {/* Sidebar Filters */}
          {showFilters && (
            <div style={{ width: '280px', flexShrink: 0 }}>
              <div style={{ background: 'white', borderRadius: '24px', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', position: 'sticky', top: '100px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '800' }}>Bộ lọc</h3>
                  <button onClick={clearFilters} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.85rem', fontWeight: '700', cursor: 'pointer' }}>Xóa tất cả</button>
                </div>

                {/* Categories */}
                <div style={{ marginBottom: '32px' }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px', color: 'var(--text-muted)' }}>Danh mục</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {categories?.map(cat => (
                      <label key={cat.categoryId} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', fontSize: '0.95rem' }}>
                        <input 
                          type="checkbox" 
                          checked={selectedCategories.includes(cat.categoryId)}
                          onChange={() => toggleItem(selectedCategories, setSelectedCategories, cat.categoryId)}
                          style={{ width: '18px', height: '18px', borderRadius: '4px', border: '2px solid #e2e8f0', cursor: 'pointer' }}
                        />
                        {cat.name}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Brands */}
                <div style={{ marginBottom: '32px' }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px', color: 'var(--text-muted)' }}>Thương hiệu</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {brands?.map(brand => (
                      <label key={brand.brandId} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', fontSize: '0.95rem' }}>
                        <input 
                          type="checkbox" 
                          checked={selectedBrands.includes(brand.brandId)}
                          onChange={() => toggleItem(selectedBrands, setSelectedBrands, brand.brandId)}
                          style={{ width: '18px', height: '18px', borderRadius: '4px', border: '2px solid #e2e8f0', cursor: 'pointer' }}
                        />
                        {brand.name}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div style={{ marginBottom: '8px' }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px', color: 'var(--text-muted)' }}>Giá (VNĐ)</h4>
                  <input 
                    type="range" 
                    min="0" 
                    max="5000000" 
                    step="100000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                    style={{ width: '100%', accentColor: 'var(--primary)', marginBottom: '12px' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: '600' }}>
                    <span>0đ</span>
                    <span style={{ color: 'var(--primary)' }}>{priceRange[1].toLocaleString()}đ</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Product Grid */}
          <div style={{ flex: 1 }}>
            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '100px 0', gap: '20px' }}>
                <div className="animate-spin" style={{ width: '40px', height: '40px', border: '4px solid #e2e8f0', borderTopColor: 'var(--primary)', borderRadius: '50%' }}></div>
                <p style={{ color: 'var(--text-muted)', fontWeight: '600' }}>Đang tìm kiếm phong cách cho bạn...</p>
              </div>
            ) : (
              <>
                {sortedProducts.length > 0 ? (
                  <div style={{ display: 'grid', gridTemplateColumns: showFilters ? 'repeat(3, 1fr)' : 'repeat(4, 1fr)', gap: '32px' }}>
                    {sortedProducts.map(prod => (
                      <ProductCard 
                        key={prod.productId} 
                        product={prod} 
                        onAddToCart={onAddToCart}
                        onClick={() => onProductSelect(prod)}
                      />
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '120px 40px', background: 'white', borderRadius: '32px', border: '2px dashed #e2e8f0' }}>
                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                      <X size={40} color="#94a3b8" />
                    </div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '12px' }}>Không tìm thấy sản phẩm nào</h3>
                    <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto 24px' }}>
                      Rất tiếc, chúng tôi không tìm thấy sản phẩm nào phù hợp với các tiêu chí lọc của bạn. Thử thay đổi bộ lọc nhé!
                    </p>
                    <button onClick={clearFilters} className="btn-primary">Xóa tất cả bộ lọc</button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductListPage
