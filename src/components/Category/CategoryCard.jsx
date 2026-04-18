import React from 'react'
import { Package } from 'lucide-react'

const CategoryCard = ({ category }) => {
  return (
    <div style={{ position: 'relative', height: '180px', borderRadius: '24px', overflow: 'hidden', cursor: 'pointer', background: '#f8fafc' }}>
      <div style={{ padding: '24px', position: 'relative', zIndex: 1 }}>
        <h4 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-main)' }}>{category.name}</h4>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Khám phá ngay</p>
      </div>
      <Package size={80} style={{ position: 'absolute', right: '-10px', bottom: '-10px', opacity: 0.1, transform: 'rotate(-15deg)' }} />
    </div>
  )
}

export default CategoryCard
