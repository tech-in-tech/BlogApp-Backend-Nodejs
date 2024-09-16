import { createContext, StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

export const Context = createContext({
  isAuthenticated: false,
});

const AppWrapper = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState({});
  const [blogs, setBlogs] = useState([]);
  const [mode, setMode] = useState("dark");

  return (
    <Context.Provider
      value={{
        user,
        setUser,
        blogs,
        setBlogs,
        mode,
        setMode,
        isAuthenticated,
        setIsAuthenticated,
      }}
    >
      <App />
    </Context.Provider>
  );
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppWrapper/>
  </StrictMode>,
)
