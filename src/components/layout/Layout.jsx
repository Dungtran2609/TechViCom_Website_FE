import React from 'react';
import Header from './Header';
import Footer from './Footer';
import ChatBox from '../ChatBox';
import './Layout.css';

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <Header />
      <main className="main-content">
        {children}
      </main>
      <Footer />
      <ChatBox />
    </div>
  );
};

export default Layout;