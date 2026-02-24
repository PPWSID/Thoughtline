import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import { AuthProvider } from './AuthContext';
import Footer from './components/Footer';
import ArticleList from './pages/ArticleList';
import ArticleDetail from './pages/ArticleDetail';
import CreateArticle from './pages/CreateArticle';
import MyArticles from './pages/MyArticles';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import Favorites from './pages/Favorites';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<ArticleList />} />
              <Route path="/my-articles" element={
                <ProtectedRoute>
                  <MyArticles />
                </ProtectedRoute>
              } />
              <Route path="/article/:id" element={
                <ProtectedRoute>
                  <ArticleDetail />
                </ProtectedRoute>
              } />
              <Route path="/create" element={
                <ProtectedRoute>
                  <CreateArticle />
                </ProtectedRoute>
              } />
              <Route path="/edit/:id" element={
                <ProtectedRoute>
                  <CreateArticle />
                </ProtectedRoute>
              } />
              <Route path="/login" element={<Auth />} />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/favorites" element={
                <ProtectedRoute>
                  <Favorites />
                </ProtectedRoute>
              } />
              {/* Fallback for categories and about since they are just requested as menus */}
              <Route path="/categories" element={<div className="pt-32 pb-20 text-center text-white">หน้านี้กำลังอยู่ระหว่างการพัฒนา</div>} />
              <Route path="/about" element={<div className="pt-32 pb-20 text-center text-white">หน้านี้กำลังอยู่ระหว่างการพัฒนา</div>} />
            </Routes>
          </main>

          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
