import React, { useState, useEffect } from 'react'
import { CategoryService } from './api'

// Components
import Navbar from './components/Layout/Navbar'
import Footer from './components/Layout/Footer'
import CartDrawer from './components/Cart/CartDrawer'

// Pages
import HomePage from './pages/HomePage'
import ProductDetail from './pages/ProductDetail'
import ProductListPage from './pages/ProductListPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

const App = () => {
  const [page, setPage] = useState('home')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [cart, setCart] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [categories, setCategories] = useState([])
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    // Initial data fetch
    const fetchData = async () => {
      try {
        const catRes = await CategoryService.getAll()
        setCategories(catRes.data)
        
        // Check if already logged in (retrieve from localStorage)
        const savedUser = localStorage.getItem('user')
        if (savedUser) {
          setCurrentUser(JSON.parse(savedUser))
        }
      } catch (e) {
        console.error(e)
      }
    }
    fetchData()
  }, [])

  const handleLoginSuccess = (user) => {
    setCurrentUser(user)
    setPage('home')
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    setCurrentUser(null)
    setPage('home')
  }

  const handleAddToCart = (product) => {
    setCart(prev => {
      const exists = prev.find(item => item.productId === product.productId)
      if (exists) {
        return prev.map(item => item.productId === product.productId ? { ...item, quantity: item.quantity + 1 } : item)
      }
      return [...prev, { ...product, quantity: 1 }]
    })
    setIsCartOpen(true)
  }

  const navigateToProduct = (product) => {
    setSelectedProduct(product)
    setPage('detail')
    window.scrollTo(0, 0)
  }

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0)

  const isAuthPage = page === 'login' || page === 'register'

  return (
    <div style={{ minHeight: '100vh' }}>
      {!isAuthPage && (
        <Navbar 
          cartCount={totalItems} 
          onNavigate={setPage} 
          onToggleCart={() => setIsCartOpen(true)} 
          categories={categories}
          currentUser={currentUser}
          onLogout={handleLogout}
        />
      )}
      
      <main style={{ minHeight: isAuthPage ? '0' : '80vh' }}>
        {page === 'home' && (
          <HomePage 
            onProductSelect={navigateToProduct} 
            onAddToCart={handleAddToCart} 
            categories={categories}
            onNavigate={setPage}
          />
        )}
        {page === 'shop' && (
          <ProductListPage 
            onProductSelect={navigateToProduct} 
            onAddToCart={handleAddToCart}
          />
        )}
        {page === 'detail' && (
          <ProductDetail 
            product={selectedProduct} 
            onClose={() => setPage('home')} 
            onAddToCart={handleAddToCart}
          />
        )}
        {page === 'login' && (
          <LoginPage 
            onLoginSuccess={handleLoginSuccess}
            onBack={() => setPage('home')}
            onGoToRegister={() => setPage('register')}
          />
        )}
        {page === 'register' && (
          <RegisterPage 
            onRegisterSuccess={() => setPage('login')}
            onBackToLogin={() => setPage('login')}
          />
        )}
      </main>

      {!isAuthPage && <Footer />}
      
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cart={cart}
        setCart={setCart}
      />
    </div>
  )
}

export default App
