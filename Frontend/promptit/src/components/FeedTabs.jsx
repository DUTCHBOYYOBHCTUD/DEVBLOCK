import React from 'react';
import './FeedTabs.css';

const FeedTabs = ({ active, onChange }) => (
  <div className="feed-tabs">
    <button
      className={`feed-tab-btn${active === 'trending' ? ' active' : ''}`}
      onClick={() => onChange('trending')}
    >
      <span className="feed-tab-label trending">Trending</span>
    </button>
    <button
      className={`feed-tab-btn${active === 'recent' ? ' active' : ''}`}
      onClick={() => onChange('recent')}
    >
      <span className="feed-tab-label">Recent</span>
    </button>
    <button
      className={`feed-tab-btn${active === 'top' ? ' active' : ''}`}
      onClick={() => onChange('top')}
    >
      <span className="feed-tab-label">Top Rated</span>
    </button>
  </div>
);

export default FeedTabs;
