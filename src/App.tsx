import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ArticleList from './pages/ArticleList';
import ArticleDetail from './pages/ArticleDetail';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<ArticleList />} />
            <Route path="/article/:id" element={<ArticleDetail />} />
            {/* Fallback for categories and about since they are just requested as menus */}
            <Route path="/categories" element={<div className="pt-32 pb-20 text-center text-white">หน้านี้กำลังอยู่ระหว่างการพัฒนา</div>} />
            <Route path="/about" element={<div className="pt-32 pb-20 text-center text-white">หน้านี้กำลังอยู่ระหว่างการพัฒนา</div>} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
