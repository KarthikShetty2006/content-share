import React from 'react';
import { AppRoutes } from './routes/AppRoutes';
import './styles/global.css';
import './styles/theme.css';
import './styles/Profile.css';

const App = () => {
  return (
    <div className="app-container">
      <AppRoutes />
    </div>
  );
};

export default App;