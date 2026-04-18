import React, { useState, useEffect } from 'react'
import { ProductService } from '../api'
import ProductCard from '../components/Product/ProductCard'

const ProductListPage = ({ onProductSelect, onAddToCart }) => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('newest')

  useEffect(() => {
    fetchData()
  }, [])

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

  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price
    if (sortBy === 'price-desc') return b.price - a.price
    return 0 // newest (default)
  })

  return (
    <div className="animate-fade" style={{ padding: '40px 0' }}>
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px' }}>
          <div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '8px' }}>Tất Cả Sản Phẩm</h2>
            <p style={{ color: 'var(--text-muted)' }}>Khám phá đầy đủ các thiết kế hiện đại nhất</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Sắp xếp:</span>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              style={{ padding: '10px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none', cursor: 'pointer', background: 'white' }}
            >
              <option value="newest">Mới nhất</option>
              <option value="price-asc">Giá: Thấp đến Cao</option>
              <option value="price-desc">Giá: Cao đến Thấp</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '100px 0' }}>Đang tải sản phẩm...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '32px' }}>
            {sortedProducts.map(prod => (
              <ProductCard 
                key={prod.productId} 
                product={prod} 
                onAddToCart={onAddToCart}
                onClick={() => onProductSelect(prod)}
              />
            ))}
          </div>
        )}

        {!loading && sortedProducts.length === 0 && (
          <div style={{ textAlign: 'center', padding: '100px 0', border: '2px dashed #e2e8f0', borderRadius: '24px' }}>
            <p style={{ color: 'var(--text-muted)' }}>Không tìm thấy sản phẩm nào.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductListPage
