import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {
  BrowserRouter,
  useLocation,
  useRoutes
} from 'react-router-dom';
import App from './App.jsx'
import routes from './routes.jsx';
import React from 'react';

function AppWrapper() {
  const location = useLocation();
  const element = useRoutes(routes);

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="app-wrapper" style={{ position: 'relative', width: '100%', height: '100%' }}>
      {element}
    </div>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AppWrapper />
    </BrowserRouter>
  </StrictMode>,
)
