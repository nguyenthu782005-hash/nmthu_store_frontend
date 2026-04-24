import React, { useState, useEffect, useRef } from 'react'
import { MessageSquare, X, Send, Bot, User, Sparkles } from 'lucide-react'

const removeTones = (str) => {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D');
}

const ChatAI = ({ onNavigate, onProductSelect, onAddToCart, allProducts }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { id: 1, text: 'Xin chào! Tôi là trợ lý ảo THU STORE. Tôi có thể giúp gì cho bạn?', sender: 'ai', time: new Date() }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (isOpen) scrollToBottom()
  }, [messages, isOpen, isTyping])

  const findProduct = (text) => {
    if (!allProducts || allProducts.length === 0) {
      console.warn('ChatAI: Sản phẩm chưa được tải hoặc danh sách trống.');
      return null
    }
    
    const query = text.toLowerCase().trim()
    const queryNoTones = removeTones(query)
    
    // 1. Kiểm tra khớp hoàn toàn
    let match = allProducts.find(p => p.name.toLowerCase() === query || removeTones(p.name.toLowerCase()) === queryNoTones)
    if (match) return match
    
    // 2. Kiểm tra chứa từ khóa
    match = allProducts.find(p => {
      const name = p.name.toLowerCase()
      const nameNoTones = removeTones(name)
      return query.includes(name) || name.includes(query) || queryNoTones.includes(nameNoTones) || nameNoTones.includes(queryNoTones)
    })
    if (match) return match
    
    // 3. Tách từ khóa và chấm điểm (Scoring)
    const stopWords = ['xem', 'thong', 'tin', 'tim', 'cho', 'toi', 'vao', 'gio', 'hang', 'mua', 'chi', 'tiet', 'ban', 'cai', 'chiec', 'mau', 'thu']
    const keywords = queryNoTones.split(' ').filter(w => w.length > 1 && !stopWords.includes(w))
    
    if (keywords.length > 0) {
      const results = allProducts.map(p => {
        const nameNoTones = removeTones(p.name.toLowerCase())
        const score = keywords.reduce((acc, k) => acc + (nameNoTones.includes(k) ? 1 : 0), 0)
        return { product: p, score }
      })
      .filter(r => r.score > 0)
      .sort((a, b) => b.score - a.score)

      if (results.length > 0 && results[0].score >= (keywords.length / 2)) {
        return results[0].product
      }
    }
    
    return null
  }

  const handleAction = (text) => {
    const query = text.toLowerCase()
    
    // 1. Add to cart (High priority)
    if (query.includes('thêm') && (query.includes('giỏ hàng') || query.includes('mua') || query.includes('giỏ'))) {
      const product = findProduct(text)
      if (product) {
        onAddToCart(product, 1)
        return `Tuyệt vời! Tôi đã thêm sản phẩm "${product.name}" vào giỏ hàng cho bạn rồi ạ.`
      }
      return 'Tôi chưa tìm thấy sản phẩm bạn muốn thêm vào giỏ hàng. Bạn có thể ghi rõ tên sản phẩm hơn được không?'
    }

    // 2. View all products / categories
    if (query.includes('xem') && (query.includes('sản phẩm') || query.includes('hàng'))) {
      // If it mentions a specific product, detail view takes precedence
      const product = findProduct(text)
      if (!product || query.includes('tất cả') || query.includes('danh sách')) {
        onNavigate('products')
        return 'Dạ, tôi đã mở trang danh sách tất cả sản phẩm cho bạn rồi đây ạ!'
      }
    }

    if (query.includes('tất cả sản phẩm') || query.includes('danh sách sản phẩm') || query.includes('cửa hàng có gì')) {
      onNavigate('products')
      return 'Dạ, mời bạn xem toàn bộ sản phẩm của cửa hàng chúng tôi ạ!'
    }

    // 3. View detail (Explicit)
    if (query.includes('xem') || query.includes('chi tiết') || query.includes('tìm') || query.includes('thông tin về')) {
      const product = findProduct(text)
      if (product) {
        onProductSelect(product)
        return `Dạ, đây là thông tin chi tiết về sản phẩm "${product.name}" mà bạn đang tìm kiếm ạ.`
      }
    }

    // 4. Fallback: If user just types a product name without an action verb
    const productMatch = findProduct(text)
    if (productMatch && query.length < 30) {
      onProductSelect(productMatch)
      return `Dạ, có phải bạn đang muốn xem sản phẩm "${productMatch.name}" không ạ? Tôi đã mở nó cho bạn rồi nhé!`
    }

    return null
  }

  const getAIResponse = (text) => {
    const query = text.toLowerCase()
    
    // CHECK ACTIONS FIRST
    const actionMsg = handleAction(text)
    if (actionMsg) return actionMsg

    if (query.includes('vận chuyển') || query.includes('ship') || query.includes('bao lâu')) {
      return 'Chúng tôi miễn phí vận chuyển cho đơn hàng từ 500.000₫. Thời gian giao hàng dự kiến từ 2-4 ngày làm việc tùy khu vực.'
    }
    if (query.includes('thanh toán') || query.includes('vnpay') || query.includes('cod')) {
      return 'Bạn có thể thanh toán online qua VNPay (ATM, Visa, QR Code) hoặc thanh toán khi nhận hàng (COD) nhé.'
    }
    if (query.includes('đổi trả') || query.includes('hoàn tiền') || query.includes('lỗi')) {
      return 'Sản phẩm được hỗ trợ đổi trả trong vòng 7 ngày nếu còn nguyên tem mác hoặc có lỗi từ nhà sản xuất. Bạn hãy liên hệ hotline để được hỗ trợ nhanh nhất.'
    }
    if (query.includes('giá') || query.includes('rẻ') || query.includes('khuyến mãi')) {
      return 'Giá sản phẩm tại THU STORE luôn cạnh tranh nhất. Bạn có thể xem các sản phẩm đang giảm giá tại mục "Giá Tốt Hôm Nay" trên trang chủ.'
    }
    if (query.includes('địa chỉ') || query.includes('ở đâu') || query.includes('cửa hàng')) {
      return 'THU STORE hiện có hệ thống cửa hàng tại Hà Nội và TP.HCM. Bạn có thể kéo xuống phần chân trang để xem địa chỉ chính xác nhé.'
    }
    if (query.includes('chào') || query.includes('hi') || query.includes('hello')) {
      return 'Chào bạn! Chúc bạn một ngày mua sắm vui vẻ. Bạn cần tôi hỗ trợ tìm sản phẩm hay giải đáp thắc mắc gì không?'
    }
    return 'Cảm ơn bạn đã quan tâm! Hiện tại tôi đang học hỏi thêm. Bạn có thể hỏi tôi về: vận chuyển, thanh toán, đổi trả hoặc các cửa hàng của THU STORE nhé.'
  }

  const handleSend = () => {
    if (!input.trim()) return

    const userMsg = { id: Date.now(), text: input, sender: 'user', time: new Date() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    // Simulate AI thinking
    setTimeout(() => {
      const aiMsg = { 
        id: Date.now() + 1, 
        text: getAIResponse(input), 
        sender: 'ai', 
        time: new Date() 
      }
      setMessages(prev => [...prev, aiMsg])
      setIsTyping(false)
    }, 1000)
  }

  return (
    <div style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 1000 }}>
      {/* Chat Bubble */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="btn-primary"
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '24px',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 10px 30px rgba(99, 102, 241, 0.4)',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px) scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}
        >
          <MessageSquare size={28} />
          <span style={{ position: 'absolute', top: '-5px', right: '-5px', background: '#ef4444', width: '12px', height: '12px', borderRadius: '50%', border: '2px solid white' }}></span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div 
          className="animate-fade"
          style={{
            width: '380px',
            height: '550px',
            background: 'white',
            borderRadius: '32px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            border: '1px solid #f1f5f9'
          }}
        >
          {/* Header */}
          <div style={{ padding: '24px', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', color: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '14px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Sparkles size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: '800' }}>AI Assistant</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4ade80' }}></div>
                    <span style={{ fontSize: '0.75rem', opacity: 0.9 }}>Đang trực tuyến</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '10px', padding: '6px', color: 'white', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', background: '#f8fafc' }}>
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  gap: '6px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row' }}>
                  <div style={{ 
                    width: '32px', height: '32px', borderRadius: '10px', 
                    background: msg.sender === 'ai' ? 'var(--primary)' : 'white', 
                    color: msg.sender === 'ai' ? 'white' : 'var(--text-main)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
                    border: msg.sender === 'user' ? '1px solid #e2e8f0' : 'none'
                  }}>
                    {msg.sender === 'ai' ? <Bot size={18} /> : <User size={18} />}
                  </div>
                  <div style={{ 
                    maxWidth: '260px', 
                    padding: '12px 16px', 
                    borderRadius: msg.sender === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                    background: msg.sender === 'user' ? 'var(--primary)' : 'white',
                    color: msg.sender === 'user' ? 'white' : 'var(--text-main)',
                    fontSize: '0.9rem',
                    lineHeight: '1.5',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
                    fontWeight: '500'
                  }}>
                    {msg.text}
                  </div>
                </div>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8', margin: '0 40px' }}>
                  {msg.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
            {isTyping && (
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Bot size={18} />
                </div>
                <div style={{ background: 'white', padding: '12px 16px', borderRadius: '20px 20px 20px 4px', display: 'flex', gap: '4px' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#cbd5e1', animation: 'bounce 1s infinite' }}></div>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#cbd5e1', animation: 'bounce 1s infinite 0.2s' }}></div>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#cbd5e1', animation: 'bounce 1s infinite 0.4s' }}></div>
                  <style>{`@keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }`}</style>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div style={{ padding: '20px', background: 'white', borderTop: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <input 
                type="text" 
                placeholder="Nhập câu hỏi của bạn..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                style={{ 
                  flex: 1, 
                  height: '48px', 
                  padding: '0 20px', 
                  borderRadius: '16px', 
                  border: '1px solid #e2e8f0', 
                  outline: 'none',
                  fontSize: '0.9rem',
                  transition: 'all 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim()}
                style={{ 
                  width: '48px', 
                  height: '48px', 
                  borderRadius: '16px', 
                  background: input.trim() ? 'var(--primary)' : '#f1f5f9', 
                  color: 'white', 
                  border: 'none', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  cursor: input.trim() ? 'pointer' : 'default',
                  transition: 'all 0.2s'
                }}
              >
                <Send size={20} />
              </button>
            </div>
            <p style={{ fontSize: '0.7rem', color: '#94a3b8', textAlign: 'center', marginTop: '12px' }}>
              Trợ lý ảo có thể nhầm lẫn. Vui lòng kiểm tra lại thông tin quan trọng.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default ChatAI
