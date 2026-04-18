import React, { useState, useEffect } from 'react'
import { ProductService } from '../api'
import Hero from '../components/Home/Hero'
import ProductCard from '../components/Product/ProductCard'
import CategoryCard from '../components/Category/CategoryCard'

const HomePage = ({ onProductSelect, onAddToCart, categories, onNavigate }) => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const prods = await ProductService.getAll()
      setProducts(prods.data)
      setLoading(false)
    } catch (err) {
      console.error(err)
      setLoading(false)
    }
  }

  return (
    <div className="animate-fade">
      <Hero onExplore={() => {
        const element = document.getElementById('featured');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }} />
      
      <section style={{ padding: '60px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
            <h3 style={{ fontSize: '1.8rem', fontWeight: '800' }}>Danh Mục Nổi Bật</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
            {categories && categories.slice(0, 4).map(cat => (
              <CategoryCard key={cat.categoryId} category={cat} />
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
            <button 
              className="btn-ghost" 
              style={{ border: '1px solid #e2e8f0', borderRadius: '12px' }}
              onClick={() => onNavigate('shop')}
            >
              Xem tất cả
            </button>
          </div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '100px 0' }}>Đang tải sản phẩm...</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '32px' }}>
              {products.map(prod => (
                <ProductCard 
                  key={prod.productId} 
                  product={prod} 
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

export default HomePage
