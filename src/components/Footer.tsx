const Footer = () => {
  return (
    <footer className="bg-dark-bg border-t border-dark-border py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-center md:text-left">
          <div>
            <h2 className="text-xl font-bold text-gradient mb-2">Thoughtline</h2>
            <p className="text-gray-400 text-sm max-w-xs">
              แบ่งปันความรู้ ความคิด และแรงบันดาลใจ เพื่อสร้างสรรค์สิ่งใหม่ในโลกดิจิทัล
            </p>
          </div>
          
          <div className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Thoughtline. All rights reserved.
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-white/5 flex justify-center space-x-6">
          <a href="#" className="text-gray-400 hover:text-brand-light transition-colors">
            Twitter
          </a>
          <a href="#" className="text-gray-400 hover:text-brand-light transition-colors">
            GitHub
          </a>
          <a href="#" className="text-gray-400 hover:text-brand-light transition-colors">
            Facebook
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
