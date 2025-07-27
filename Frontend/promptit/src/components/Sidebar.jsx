import React from 'react';
import './Sidebar.css';

const Sidebar = () => (
  <aside className="sidebar">
    <nav className="sidebar-nav">
      <ul className="sidebar-list">
        <li className="sidebar-item active"><span style={{marginRight:8}} role="img" aria-label="home">🏠</span>Home</li>
        <li className="sidebar-item"><span style={{marginRight:8}} role="img" aria-label="popular">🔥</span>Popular</li>
        <li className="sidebar-item"><span style={{marginRight:8}} role="img" aria-label="explore">🔍</span>Explore</li>
        <li className="sidebar-item"><span style={{marginRight:8}} role="img" aria-label="all">🌐</span>All</li>
        <li className="sidebar-item"><span style={{marginRight:8}} role="img" aria-label="following">👥</span>Following</li>
      </ul>
      <hr className="sidebar-divider" style={{ margin: '0 0 12px 0' }} />
      <ul className="sidebar-list">
        <li className="sidebar-item"><span style={{marginRight:8}} role="img" aria-label="create">➕</span>Create Community</li>
        <li className="sidebar-item"><span style={{marginRight:8}} role="img" aria-label="add">📚</span>Add Communities</li>
      </ul>
      <hr className="sidebar-divider" />
      <ul className="sidebar-list sidebar-secondary">
        <li className="sidebar-item"><span style={{marginRight:8}} role="img" aria-label="about">ℹ️</span>About Prompt.It</li>
        <li className="sidebar-item"><span style={{marginRight:8}} role="img" aria-label="help">❓</span>Help</li>
        <li className="sidebar-item"><span style={{marginRight:8}} role="img" aria-label="blog">📝</span>Blog</li>
      </ul>
    </nav>
  </aside>
);

export default Sidebar;
