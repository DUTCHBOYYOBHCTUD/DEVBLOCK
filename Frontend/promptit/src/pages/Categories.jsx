import React, { useState } from 'react';
import './Categories.css';

const Categories = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Categories', icon: '🌐', color: '#8d2be2' },
    { id: 'creative', name: 'Creative Writing', icon: '✍️', color: '#ff6b6b' },
    { id: 'technical', name: 'Technical', icon: '⚙️', color: '#4ecdc4' },
    { id: 'business', name: 'Business', icon: '💼', color: '#45b7d1' },
    { id: 'education', name: 'Education', icon: '📚', color: '#96ceb4' },
    { id: 'entertainment', name: 'Entertainment', icon: '🎭', color: '#feca57' },
    { id: 'health', name: 'Health & Wellness', icon: '🏥', color: '#ff9ff3' },
    { id: 'science', name: 'Science', icon: '🔬', color: '#54a0ff' },
    { id: 'art', name: 'Art & Design', icon: '🎨', color: '#5f27cd' }
  ];

  return (
    <div className="categories-container">
      <div className="categories-header">
        <h1>📂 Browse Categories</h1>
        <p>Discover prompts organized by topic and interest</p>
      </div>

      <div className="categories-grid">
        {categories.map((category) => (
          <div
            key={category.id}
            className={`category-card ${selectedCategory === category.id ? 'active' : ''}`}
            style={{ '--category-color': category.color }}
            onClick={() => setSelectedCategory(category.id)}
          >
            <div className="category-icon">{category.icon}</div>
            <h3 className="category-name">{category.name}</h3>
            <div className="category-count">
              {Math.floor(Math.random() * 50) + 10} prompts
            </div>
          </div>
        ))}
      </div>

      <div className="category-content">
        <h2>
          {categories.find(cat => cat.id === selectedCategory)?.icon} {' '}
          {categories.find(cat => cat.id === selectedCategory)?.name}
        </h2>
        <div className="coming-soon">
          <div className="coming-soon-content">
            <h3>🚧 Coming Soon!</h3>
            <p>Category-specific prompts are being organized and will be available soon.</p>
            <p>For now, check out all prompts on the <a href="/">Home page</a>!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;
