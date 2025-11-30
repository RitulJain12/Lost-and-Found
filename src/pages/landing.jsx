import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
 function LostFoundApp() {
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
        const navigate=useNavigate();
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=Poppins:wght@300;400;500;600&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    const handleScroll = () => {
      const sections = ['home', 'about'];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigate = (section) => {
    setActiveSection(section);
    setMobileMenuOpen(false);
    const element = document.getElementById(section);
    if (element) {
        console.log(element);
      element.scrollIntoView({ behavior: 'smooth' });
    }
    else{
       
       navigate('/signup');
    }
  };

  const styles = `
    :root {
      --bg-dark: #0f0f13;
      --bg-card: rgba(255, 255, 255, 0.05);
      --text-primary: #ffffff;
      --text-secondary: #b0b0b0;
      --accent-cyan: #4bcbfa;
      --accent-deep: #2575fc;
      --accent-gradient: linear-gradient(90deg, #4bcbfa 0%, #2575fc 100%);
      --glass-border: 1px solid rgba(75, 203, 250, 0.2);
      --blur-amount: 15px;
      --font-classy: 'Playfair Display', serif;
      --font-body: 'Poppins', sans-serif;
    }

    html {
      scroll-behavior: smooth;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: var(--font-body);
      background-color: var(--bg-dark);
      color: var(--text-primary);
      overflow-x: hidden;
      min-height: 100vh;
    }

    .background-blobs {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      pointer-events: none;
    }

    .blob {
      position: absolute;
      border-radius: 50%;
      filter: blur(90px);
    }

    .blob-1 {
      top: -10%;
      left: -10%;
      width: 500px;
      height: 500px;
      background: rgba(75, 203, 250, 0.3);
      animation: float 8s ease-in-out infinite;
    }

    .blob-2 {
      bottom: 10%;
      right: -5%;
      width: 400px;
      height: 400px;
      background: rgba(37, 117, 252, 0.25);
      animation: float 10s ease-in-out infinite reverse;
    }
    
    .blob-3 {
      top: 50%;
      left: 30%;
      width: 300px;
      height: 300px;
      background: rgba(75, 203, 250, 0.15);
      animation: float 12s ease-in-out infinite;
    }

    .navbar {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 5%;
      z-index: 100;
      background: rgba(15, 15, 19, 0.7);
      backdrop-filter: blur(var(--blur-amount));
      -webkit-backdrop-filter: blur(var(--blur-amount));
      border-bottom: var(--glass-border);
      animation: slideDown 1s ease forwards;
    }

    @keyframes slideDown {
      from { transform: translateY(-100%); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }

    .nav-brand {
      font-family: var(--font-classy);
      font-weight: 700;
      font-size: 1.8rem;
      letter-spacing: 1px;
      background: var(--accent-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      cursor: pointer;
    }

    .nav-links {
      display: flex;
      gap: 2.5rem;
      align-items: center;
    }

    .nav-link {
      text-decoration: none;
      color: var(--text-secondary);
      font-weight: 500;
      font-size: 0.95rem;
      transition: all 0.3s ease;
      position: relative;
      cursor: pointer;
      background: none;
      border: none;
      font-family: var(--font-body);
    }

    .nav-link::after {
      content: '';
      position: absolute;
      width: 0;
      height: 2px;
      bottom: -5px;
      left: 0;
      background: var(--accent-cyan);
      box-shadow: 0 0 10px var(--accent-cyan);
      transition: width 0.3s ease;
    }

    .nav-link:hover {
      color: #fff;
      text-shadow: 0 0 10px rgba(75, 203, 250, 0.6);
    }

    .nav-link:hover::after {
      width: 100%;
    }

    .nav-link.signup-btn {
      color: var(--accent-cyan);
      font-weight: 700;
      border: 1px solid var(--accent-cyan);
      padding: 5px 20px;
      border-radius: 20px;
      transition: 0.3s;
    }
    
    .nav-link.signup-btn::after {
      display: none;
    }
    
    .nav-link.signup-btn:hover {
      background: rgba(75, 203, 250, 0.1);
      box-shadow: 0 0 20px rgba(75, 203, 250, 0.4);
      color: #fff;
      border-color: #fff;
    }

    .hero {
      min-height: 100vh;
      display: flex;
      align-items: center;
      padding: 100px 5% 40px;
    }

    .hero-container {
      display: flex;
      width: 100%;
      gap: 4rem;
    }

    .hero-left-animation {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      min-height: 400px;
    }

    .floating-item {
      position: absolute;
      font-size: 4rem;
      opacity: 0.9;
      filter: drop-shadow(0 0 15px rgba(75, 203, 250, 0.5));
    }

    .fi-1 { top: 20%; left: 20%; animation: float 6s ease-in-out infinite; }
    .fi-2 { top: 50%; left: 50%; animation: float 7s ease-in-out infinite 1s; font-size: 3rem;}
    .fi-3 { bottom: 30%; left: 30%; animation: float 5s ease-in-out infinite 2s; font-size: 5rem;}
    .fi-4 { top: 30%; right: 20%; animation: float 8s ease-in-out infinite 0.5s; font-size: 3.5rem;}

    @keyframes float {
      0% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-30px) rotate(10deg); }
      100% { transform: translateY(0px) rotate(0deg); }
    }

    .hero-right-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    h1 {
      font-family: var(--font-classy);
      font-size: 3.8rem;
      line-height: 1.2;
      margin-bottom: 1.5rem;
    }

    h1 span {
      background: var(--accent-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      filter: drop-shadow(0 0 5px rgba(75, 203, 250, 0.3));
    }

    .description {
      font-size: 1.1rem;
      color: var(--text-secondary);
      margin-bottom: 3rem;
      max-width: 500px;
      line-height: 1.6;
      font-weight: 300;
    }

    .recently-found-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 15px;
    }

    .item-card {
      position: relative;
      height: 120px;
      border-radius: 12px;
      overflow: hidden;
      background: var(--bg-card);
      backdrop-filter: blur(5px);
      -webkit-backdrop-filter: blur(5px);
      border: var(--glass-border);
      transition: transform 0.3s ease;
    }

    .item-card:hover {
      transform: translateY(-5px);
      border-color: var(--accent-cyan);
      box-shadow: 0 5px 20px rgba(75, 203, 250, 0.15);
    }

    .item-card img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0.7;
      transition: opacity 0.3s ease;
    }

    .item-card:hover img {
      opacity: 1;
    }

    .item-tag {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      padding: 5px 10px;
      font-size: 0.75rem;
      font-weight: 500;
      background: linear-gradient(to top, rgba(0,0,0,0.9), transparent);
      color: #fff;
    }

    .about-section {
      padding: 100px 5%;
      position: relative;
    }

    .about-container {
      display: flex;
      align-items: center;
      gap: 4rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .about-text {
      flex: 1;
      padding: 40px;
      background: rgba(255, 255, 255, 0.03);
      backdrop-filter: blur(10px);
      border-radius: 20px;
      border: var(--glass-border);
      box-shadow: 0 0 30px rgba(0,0,0,0.2);
    }

    .about-text h2 {
      font-family: var(--font-classy);
      font-size: 2.8rem;
      margin-bottom: 20px;
    }
    
    .about-text h2 span {
      color: var(--accent-cyan);
      text-shadow: 0 0 15px rgba(75, 203, 250, 0.4);
    }

    .about-text p {
      color: var(--text-secondary);
      line-height: 1.8;
      margin-bottom: 15px;
    }

    .about-image {
      flex: 1;
      position: relative;
      height: 400px;
      border-radius: 20px;
      overflow: hidden;
      border: var(--glass-border);
      box-shadow: 0 0 30px rgba(75, 203, 250, 0.1);
    }

    .about-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      filter: brightness(0.8) contrast(1.1);
      transition: transform 0.5s ease, filter 0.5s ease;
    }

    .about-image:hover img {
      transform: scale(1.05);
      filter: brightness(1) contrast(1);
    }

    .hamburger {
      display: none;
      background: none;
      border: none;
      color: var(--accent-cyan);
      cursor: pointer;
      z-index: 101;
    }

    @media (max-width: 900px) {
      .hero-container, .about-container {
        flex-direction: column;
      }
      .hero-left-animation {
        min-height: 300px;
        order: 2;
      }
      .hero-right-content {
        order: 1;
        text-align: center;
        align-items: center;
      }
      .about-container {
        flex-direction: column-reverse;
      }
      h1 { font-size: 2.5rem; }
      .nav-links { gap: 1rem; }

      .hamburger {
        display: block;
      }

      .nav-links {
        position: absolute;
        top: 60px;
        left: 0;
        right: 0;
        width: 100%;
        flex-direction: column;
        gap: 0;
        background: rgba(15, 15, 19, 0.95);
        border-bottom: var(--glass-border);
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.3s ease;
        padding: 0;
      }

      .nav-links.active {
        max-height: 300px;
        padding: 1rem 5%;
      }

      .nav-link {
        padding: 12px 0;
        border-bottom: 1px solid rgba(75, 203, 250, 0.1);
      }

      .recently-found-grid {
        grid-template-columns: 1fr;
      }
    }
  `;

  return (
    <>
      <style>{styles}</style>
      
      <div className="background-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      <nav className="navbar">
        <div className="nav-brand" onClick={() => handleNavigate('home')}>
          LNCT Lost Found
        </div>
        <button 
          className="hamburger"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <div className={`nav-links ${mobileMenuOpen ? 'active' : ''}`}>
          <button 
            className="nav-link"
            onClick={() => handleNavigate('about')}
          >
            About
          </button>
          <button 
            className="nav-link"
            onClick={() => handleNavigate('report-lost')}
          >
            Lost Report
          </button>
          <button 
            className="nav-link"
            onClick={() => handleNavigate('report-found')}
          >
            Found Report
          </button>
          <button 
            className="nav-link signup-btn"
            onClick={() => handleNavigate('signup')}
          >
            Signup
          </button>
        </div>
      </nav>

      <section id="home" className="hero">
        <div className="hero-container">
          <div className="hero-left-animation">
            <div className="floating-item fi-1">🔑</div>
            <div className="floating-item fi-2">🎧</div>
            <div className="floating-item fi-3">👜</div>
            <div className="floating-item fi-4">📱</div>
          </div>

          <div className="hero-right-content">
            <h1>Lost something?<br /> Let's <span>find it together.</span></h1>
            
            <p className="description">
              The official LNCT app to reconnect students with their belongings. 
              Report lost items instantly or browse recently found items securely 
              within our college network.
            </p>

            <p style={{ marginBottom: '15px', color: 'var(--accent-cyan)', fontWeight: 600, fontSize: '0.9rem', letterSpacing: '0.5px' }}>
              RECENTLY FOUND ITEMS:
            </p>
            
            <div className="recently-found-grid">
              <div className="item-card">
                <img src="https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&auto=format&fit=crop&q=60" alt="Lost Keys" />
                <div className="item-tag">Keys at C-Block</div>
              </div>
              <div className="item-card">
                <img src="https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&auto=format&fit=crop&q=60" alt="Lost Headphones" />
                <div className="item-tag">Headphones (Library)</div>
              </div>
              <div className="item-card">
                <img src="https://images.unsplash.com/photo-1600857062241-98e5dba03b15?w=400&auto=format&fit=crop&q=60" alt="Lost Water Bottle" />
                <div className="item-tag">Water Bottle (Canteen)</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="about-section">
        <div className="about-container">
          <div className="about-text">
            <h2>Why use <span>this App?</span></h2>
            <p>
              Gone are the days of spamming WhatsApp groups or sticking posters on walls. We have built a <strong>centralized digital hub</strong> specifically for the LNCT community to manage lost and found queries efficiently.
            </p>
            <p>
              Our platform uses smart categorization and real-time notifications to match lost items with found reports. It is secure, fast, and ensures that your contact details are only shared when a match is verified.
            </p>
            <p style={{ color: 'var(--accent-cyan)', fontWeight: 700, textShadow: '0 0 10px rgba(75, 203, 250, 0.3)' }}>
              Simple. Secure. Student-friendly.
            </p>
          </div>

          <div className="about-image">
            <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=60" alt="Students using the app" />
          </div>
        </div>
      </section>
    </>
  );
}
export default LostFoundApp;