import React, { useState, useEffect } from 'react';
import { Menu, X, Plus, MapPin, AlertCircle, CheckCircle, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ChatSystem from './chat';
const HomePage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('found');
  const [showModal, setShowModal] = useState(false);
  const [activePage, setActivePage] = useState('home');
  const [items, setItems] = useState([]);
  const [myClaims, setMyClaims] = useState([]);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [selectedItem, setSelectedItem] = useState(null);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [reportType, setReportType] = useState(null);
  const [messageTimeout, setMessageTimeout] = useState(null);
  const [claimData, setClaimData] = useState({
    description: '',
    proof: ''
  });
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatData, setChatData] = useState(null);
  
  const navigate=useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    image: null,
    category: '',
    type: 'lost',
    date: new Date().toISOString().split('T')[0]
  });

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (activePage === 'home') {
      fetchItems(activeTab);
    }
  }, [activeTab, activePage]);

  const showMessage = (type, text) => {
    if (messageTimeout) clearTimeout(messageTimeout);
    setMessage({ type, text });
    const timeout = setTimeout(() => {
      setMessage({ type: '', text: '' });
    }, 2000);
    setMessageTimeout(timeout);
  };

  const fetchItems = async (type) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:2120/api/items/getall/${type}`,
        {
          headers: { 'Authorization': `Bearer ${token}` },
          credentials: 'include'
        }
      );
      const data = await response.json();
      if (response.ok) {
        setItems(data.Items || []);
      }
    } catch (error) {
      console.error('Error fetching items:', error);
      showMessage('error', 'Failed to fetch items');
    } finally {
      setLoading(false);
    }
  };

  const fetchMyClaims = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:2120/api/claim/my', {
        headers: { 'Authorization': `Bearer ${token}` },
        credentials: 'include'
      });
      const data = await response.json();
      if (response.ok) {
        setMyClaims(data || []);
      }
    } catch (error) {
      console.error('Error fetching claims:', error);
    } finally {
      setLoading(false);
    }
  };
  const Logout = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:2120/api/auth/logout', {
        headers: { 'Authorization': `Bearer ${token}` },
        credentials: 'include'
      });
     
    } catch (error) {
      console.error('Error fetching Logout:', error);
    } finally {
      setLoading(false);
    }
  };
 const fetchClaimsForuploaded= async () => {

  setLoading(true);
  try {
    const response = await fetch(`http://localhost:2120/api/claim/item/uploadedbyuser`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include',
    });
    const data = await response.json();
    console.log(data);
    if (response.ok) {
     // showMessage('success', 'Claim submitted successfully!');
      setShowClaimModal(false);
      //setClaimData({ description: '', proof: '' });
     // fetchItems(activeTab);
    
    } else {
      showMessage('error', data.message || 'Failed to Fetch claim');
    }
  } catch (error) {
    showMessage('error', 'Network error. Please try again.');
  } finally {
    setLoading(false);
  }
};
  const handleAIGenerate = async () => {
    if (!formData.image) {
      showMessage('error', 'Please select an image first');
      return;
    }

    setAiLoading(true);
    try {
      const formDataObj = new FormData();
      formDataObj.append('image', formData.image);

      const response = await fetch('http://localhost:2120/api/items/autofill', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        credentials: 'include',
        body: formDataObj
      });
      const data = await response.json();
      console.log(data);
      if (response.ok && data.data) {
        const today = new Date().toISOString().split('T')[0];
        setFormData(prev => ({
          ...prev,
          title: data.data.title || '',
          description: data.data.description || '',
          category: data.data.category || '',
          location: data.data.location || '',
          date: today
        }));
        showMessage('success', 'Content generated successfully!');
      } else {
        showMessage('error', 'Failed to generate content');
      }
    } catch (error) {
      showMessage('error', 'Network error. Please try again.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.location) {
      setMessage({ type: 'error', text: 'All fields are required' });
      return;
    }

    const formDataObj = new FormData();
    formDataObj.append('title', formData.title);
    formDataObj.append('description', formData.description);
    formDataObj.append('location', formData.location);
    formDataObj.append('type', reportType);
    formDataObj.append('category', formData.category || 'General');
    formDataObj.append('date', formData.date);
    if (formData.image) {
      formDataObj.append('image', formData.image);
    }

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:2120/api/items/report/${activeTab}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        credentials: 'include',
        body: formDataObj
      });
      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Item reported successfully!' });
        setFormData({ title: '', description: '', location: '', image: null, category: '', type: 'lost', date: new Date().toISOString().split('T')[0] });
        setShowModal(false);
        setReportType(null);
        fetchItems(reportType);
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to report item' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClaim = async () => {
    if (!claimData.description || !claimData.proof) {
      showMessage('error', 'All fields are required');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:2120/api/claim/item/${selectedItem._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify({
          description: claimData.description,
          proof: claimData.proof
        })
      });
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        showMessage('success', 'Claim submitted successfully!');
        setShowClaimModal(false);
        setClaimData({ description: '', proof: '' });
        fetchItems(activeTab);
      } else {
        showMessage('error', data.message || 'Failed to create claim');
      }
    } catch (error) {
      showMessage('error', 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    setFormData(prev => ({
      ...prev,
      image: e.target.files[0]
    }));
  };

  const handleClaimChange = (e) => {
    const { name, value } = e.target;
    setClaimData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const openReportModal = (type) => {
    setReportType(type);
    setActiveTab(type);
    setFormData(prev => ({
      ...prev,
      type: type,
      title: '',
      description: '',
      location: '',
      image: null,
      category: '',
      date: new Date().toISOString().split('T')[0]
    }));
    setShowModal(true);
    setMobileMenuOpen(false);
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

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: var(--font-body);
      background-color: var(--bg-dark);
      color: var(--text-primary);
      min-height: 100vh;
    }

    .bg-blobs {
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

    @keyframes float {
      0% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-30px) rotate(10deg); }
      100% { transform: translateY(0px) rotate(0deg); }
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
      border-bottom: var(--glass-border);
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
      cursor: pointer;
      background: none;
      border: none;
      transition: all 0.3s ease;
      position: relative;
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
      transition: width 0.3s ease;
    }

    .nav-link:hover {
      color: #fff;
    }

    .nav-link:hover::after {
      width: 100%;
    }

    .nav-link.active {
      color: var(--accent-cyan);
    }

    .nav-link.active::after {
      width: 100%;
    }

    .nav-link.add-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--accent-cyan);
      font-weight: 700;
      border: 1px solid var(--accent-cyan);
      padding: 8px 16px;
      border-radius: 20px;
    }

    .nav-link.add-btn::after {
      display: none;
    }

    .nav-link.add-btn:hover {
      background: rgba(75, 203, 250, 0.1);
      box-shadow: 0 0 20px rgba(75, 203, 250, 0.4);
    }

    .hamburger {
      display: none;
      background: none;
      border: none;
      color: var(--accent-cyan);
      cursor: pointer;
      z-index: 101;
    }

    .main-container {
      margin-top: 80px;
      min-height: calc(100vh - 80px);
      padding: 40px 5%;
    }

    .tabs {
      display: flex;
      gap: 20px;
      margin-bottom: 40px;
      border-bottom: var(--glass-border);
      padding-bottom: 20px;
    }

    .tab-btn {
      background: none;
      border: none;
      color: var(--text-secondary);
      font-size: 1.1rem;
      font-weight: 600;
      cursor: pointer;
      padding-bottom: 10px;
      transition: all 0.3s ease;
      position: relative;
      font-family: var(--font-body);
    }

    .tab-btn.active {
      color: var(--accent-cyan);
    }

    .tab-btn.active::after {
      content: '';
      position: absolute;
      width: 100%;
      height: 3px;
      bottom: -20px;
      left: 0;
      background: var(--accent-gradient);
    }

    .items-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 25px;
      animation: fadeIn 0.5s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .item-card {
      background: rgba(255, 255, 255, 0.03);
      backdrop-filter: blur(10px);
      border: var(--glass-border);
      border-radius: 15px;
      overflow: hidden;
      transition: all 0.3s ease;
    }

    .item-card:hover {
      transform: translateY(-8px);
      border-color: var(--accent-cyan);
      box-shadow: 0 10px 30px rgba(75, 203, 250, 0.2);
    }

    .item-image {
      width: 100%;
      height: 200px;
      object-fit: cover;
      background: rgba(75, 203, 250, 0.1);
    }

    .item-content {
      padding: 20px;
    }

    .item-title {
      font-size: 1.2rem;
      font-weight: 700;
      margin-bottom: 10px;
      color: var(--text-primary);
    }

    .item-location {
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--text-secondary);
      font-size: 0.9rem;
      margin-bottom: 15px;
    }

    .item-description {
      color: var(--text-secondary);
      font-size: 0.9rem;
      line-height: 1.5;
      margin-bottom: 15px;
    }

    .item-details {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-bottom: 15px;
      padding-top: 15px;
      border-top: var(--glass-border);
    }

    .item-detail-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.9rem;
    }

    .item-detail-label {
      color: var(--text-secondary);
      font-weight: 500;
    }

    .item-detail-value {
      color: var(--accent-cyan);
      font-weight: 600;
    }

    .status-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
      text-transform: capitalize;
    }

    .status-badge.pending {
      background: rgba(255, 193, 7, 0.2);
      color: #ffc107;
      border: 1px solid rgba(255, 193, 7, 0.3);
    }

    .status-badge.approved {
      background: rgba(34, 197, 94, 0.2);
      color: #22c55e;
      border: 1px solid rgba(34, 197, 94, 0.3);
    }

    .status-badge.rejected {
      background: rgba(255, 107, 107, 0.2);
      color: #ff6b6b;
      border: 1px solid rgba(255, 107, 107, 0.3);
    }

    .status-badge.closed {
      background: rgba(156, 163, 175, 0.2);
      color: #d1d5db;
      border: 1px solid rgba(156, 163, 175, 0.3);
    }

    .claim-btn {
      width: 100%;
      padding: 10px;
      background: var(--accent-gradient);
      border: none;
      border-radius: 10px;
      color: var(--text-primary);
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .claim-btn:hover {
      box-shadow: 0 0 20px rgba(75, 203, 250, 0.4);
      transform: translateY(-2px);
    }

    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      animation: fadeIn 0.3s ease;
    }

    .modal {
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(10px);
      border: var(--glass-border);
      border-radius: 20px;
      padding: 40px;
      width: 100%;
      max-width: 500px;
      max-height: 90vh;
      overflow-y: auto;
      animation: slideUp 0.3s ease;
    }

    @keyframes slideUp {
      from { transform: translateY(50px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
    }

    .modal-title {
      font-family: var(--font-classy);
      font-size: 2rem;
      background: var(--accent-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .close-btn {
      background: none;
      border: none;
      color: var(--accent-cyan);
      font-size: 1.5rem;
      cursor: pointer;
    }

    .form-group {
      margin-bottom: 20px;
    }

    label {
      display: block;
      margin-bottom: 8px;
      font-size: 0.9rem;
      font-weight: 500;
      color: var(--text-primary);
    }

    input, textarea, select {
      width: 100%;
      padding: 12px 15px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(75, 203, 250, 0.3);
      border-radius: 10px;
      color: var(--text-primary);
      font-family: var(--font-body);
      font-size: 0.95rem;
      resize: vertical;
      transition: all 0.3s ease;
    }

    input:focus, textarea:focus, select:focus {
      outline: none;
      border-color: var(--accent-cyan);
      background: rgba(75, 203, 250, 0.05);
      box-shadow: 0 0 20px rgba(75, 203, 250, 0.2);
    }

    textarea {
      min-height: 100px;
    }

    .ai-button-group {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
    }

    .ai-btn {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 10px;
      background: rgba(75, 203, 250, 0.1);
      border: 1px solid rgba(75, 203, 250, 0.3);
      border-radius: 10px;
      color: var(--accent-cyan);
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .ai-btn:hover:not(:disabled) {
      background: rgba(75, 203, 250, 0.2);
      box-shadow: 0 0 15px rgba(75, 203, 250, 0.3);
    }

    .ai-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .submit-btn {
      width: 100%;
      padding: 12px;
      background: var(--accent-gradient);
      border: none;
      border-radius: 10px;
      color: var(--text-primary);
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .submit-btn:hover:not(:disabled) {
      box-shadow: 0 0 30px rgba(75, 203, 250, 0.4);
    }

    .submit-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .message {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 15px;
      border-radius: 10px;
      margin-bottom: 20px;
      font-size: 0.9rem;
      animation: slideDown 0.4s ease;
      position: fixed;
      top: 100px;
      right: 20px;
      z-index: 2000;
      max-width: 350px;
      box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
    }

    .message.success {
      background: rgba(34, 197, 94, 0.1);
      border: 1px solid rgba(34, 197, 94, 0.3);
      color: #22c55e;
    }

    .message.error {
      background: rgba(255, 107, 107, 0.1);
      border: 1px solid rgba(255, 107, 107, 0.3);
      color: #ff6b6b;
    }

    .empty-state {
      text-align: center;
      padding: 60px 20px;
      color: var(--text-secondary);
    }

    .empty-state h3 {
      font-size: 1.5rem;
      margin-bottom: 10px;
      color: var(--text-primary);
    }

    @media (max-width: 768px) {
      .nav-links {
        position: absolute;
        top: 60px;
        left: 0;
        right: 0;
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
        max-height: 400px;
        padding: 1rem 5%;
      }

      .hamburger {
        display: block;
      }

      .items-grid {
        grid-template-columns: 1fr;
      }

      .modal {
        padding: 30px 20px;
      }
    }
  `;

  const openChat = (claim) => {
    // Only allow chat if claim is approved
    if (claim.status === 'approved') {
      setChatData({
        claimId: claim._id,
        claimantName: claim.claimant?.username || 'User',
        claimantEmail: claim.claimant?.email || '',
        isClaimant: true
      });
      setShowChatModal(true);
    }
  };
  return (
    <>
      <style>{styles}</style>
      <div className="bg-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>

      <nav className="navbar">
        <div className="nav-brand" onClick={() => window.location.href = '/'}>
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
            className={`nav-link ${activeTab === 'found' && activePage === 'home' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('found');
              setActivePage('home');
              setMobileMenuOpen(false);
            }}
          >
            Found Items
          </button>
          <button
            className="nav-link add-btn"
            onClick={() => openReportModal('found')}
          >
            <Plus size={20} />
            Report Found
          </button>
          <button
            className={`nav-link ${activeTab === 'lost' && activePage === 'home' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('lost');
              setActivePage('home');
              setMobileMenuOpen(false);
            }}
          >
            Lost Items
          </button>
          <button
            className="nav-link add-btn"
            onClick={() => openReportModal('lost')}
          >
            <Plus size={20} />
            Report Lost
          </button>
          <button
            className={`nav-link ${activePage === 'claims' ? 'active' : ''}`}
            onClick={() => {
              setActivePage('claims');
              fetchMyClaims();
              setMobileMenuOpen(false);
            }}
          >
            My Claims
          </button>
          <button
            className={`nav-link ${activePage === 'uploadedClaims' ? 'active' : ''}`}
            onClick={() => {
              setActivePage('uploadedClaims');
             // fetchClaimsForuploaded();
              setMobileMenuOpen(false);
              navigate('/Claims');
            }}
          >
           Claims For Uploaded items
          </button>
          <button
            className={`nav-link ${activePage === 'logut' ? 'active' : ''}`}
            onClick={() => {
              setActivePage('logout');
              Logout();
            
              setMobileMenuOpen(false);
              navigate('/');
            }}
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="main-container">
        {message.text && (
          <div className={`message ${message.type}`}>
            {message.type === 'success' ? (
              <CheckCircle size={20} />
            ) : (
              <AlertCircle size={20} />
            )}
            {message.text}
          </div>
        )}

        {activePage === 'home' ? (
          <>
            <div className="tabs">
              <button
                className={`tab-btn ${activeTab === 'found' ? 'active' : ''}`}
                onClick={() => {
                  setItems([]);
                  setActiveTab('found');
                }}
              >
                Found Items
              </button>
              <button
                className={`tab-btn ${activeTab === 'lost' ? 'active' : ''}`}
                onClick={() => {
                  setItems([]);
                  setActiveTab('lost');
                }}
              >
                Lost Items
              </button>
            </div>

            {loading ? (
              <div className="empty-state">
                <h3>Loading...</h3>
              </div>
            ) : items.length === 0 ? (
              <div className="empty-state">
                <h3>No {activeTab} items yet</h3>
                <p>Check back later for new items</p>
              </div>
            ) : (
              <div className="items-grid">
                {items.map(item => (
                  <div key={item._id} className="item-card">
                    {item.image && (
                      <img src={item.image} alt={item.title} className="item-image" />
                    )}
                    <div className="item-content">
                      <h3 className="item-title">{item.title}</h3>
                      <div className="item-location">
                        <MapPin size={18} />
                        {item.location}
                      </div>
                      <p className="item-description">{item.description}</p>
                      <div className="item-details">
                        <div className="item-detail-row">
                          <span className="item-detail-label">Category:</span>
                          <span className="item-detail-value">{item.category}</span>
                        </div>
                        <div className="item-detail-row">
                          <span className="item-detail-label">Date:</span>
                          <span className="item-detail-value">{new Date(item.date).toLocaleDateString()}</span>
                        </div>
                        <div className="item-detail-row">
                          <span className="item-detail-label">Status:</span>
                          <span className={`status-badge ${item.status}`}>{item.status}</span>
                        </div>
                      </div>
                      <button
                        className="claim-btn"
                        onClick={() => {
                          setSelectedItem(item);
                          setShowClaimModal(true);
                        }}
                      >
                        Claim Item
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
          {loading ? (
  <div className="empty-state">
    <h3>Loading...</h3>
  </div>
) : myClaims.length === 0 ? (
  <div className="empty-state">
    <h3>No claims yet</h3>
    <p>Claims you make will appear here</p>
  </div>
) : (
  <div className="items-grid">
    {myClaims.map(claim => (
      <div key={claim._id} className="item-card">
        {claim.itemId?.image && (
          <img src={claim.itemId.image} alt={claim.itemId.title} className="item-image" />
        )}
        <div className="item-content">
          <h3 className="item-title">{claim.itemId?.title}</h3>
          <div className="item-location">
            <MapPin size={18} />
            Item Type: {claim.itemId?.type}
          </div>
          <p className="item-description">
            <strong>Category:</strong> {claim.itemId?.category}
          </p>
          <div className="item-details">
            <div className="item-detail-row">
              <span className="item-detail-label">Your Proof:</span>
              <span className="item-detail-value" style={{ fontSize: '0.8rem' }}>{claim.proof}</span>
            </div>
            <div className="item-detail-row">
              <span className="item-detail-label">Item Status:</span>
              <span className={`status-badge ${claim.itemId?.status}`}>{claim.itemId?.status}</span>
            </div>
            <div className="item-detail-row">
              <span className="item-detail-label">Claim Status:</span>
              <span className={`status-badge ${claim.status}`}>{claim.status}</span>
            </div>
            <div className="item-detail-row">
              <span className="item-detail-label">Claimed On:</span>
              <span className="item-detail-value">{new Date(claim.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          {/* CHAT BUTTON - ADD THIS SECTION */}
          {claim.status === 'approved' && (
            <button
              className="claim-btn"
              onClick={() => {
                setChatData({
                  claimId: claim._id,
                  claimantName: claim.itemId?.user?.username || 'Item Owner',
                  claimantEmail: claim.itemId?.user?.email || '',
                  isClaimant: true
                });
                setShowChatModal(true);
              }}
              style={{
                marginTop: '15px',
                background: 'rgba(75, 203, 250, 0.1)',
                border: '1px solid rgba(75, 203, 250, 0.3)',
                color: '#4bcbfa'
              }}
            >
              💬 Chat with Owner
            </button>
          )}
        </div>
      </div>
    ))}
  </div>
)}
          </>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Report {reportType === 'found' ? 'Found' : 'Lost'} Item</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>✕</button>
            </div>

            <div className="form-group">
              <label>Image *</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>

            <div className="ai-button-group">
              <button
                className="ai-btn"
                onClick={handleAIGenerate}
                disabled={aiLoading || !formData.image}
              >
                <Sparkles size={18} />
                {aiLoading ? 'Generating...' : 'Generate by AI'}
              </button>
            </div>

            <div className="form-group">
              <label>Item Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleFormChange}
                placeholder="e.g., Black Wallet"
              />
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                placeholder="Describe the item in detail"
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleFormChange}
                placeholder="e.g., Wallet, Phone, Keys"
              />
            </div>

            <div className="form-group">
              <label>Location *</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleFormChange}
                placeholder="Where was it found/lost?"
              />
            </div>

            <div className="form-group">
              <label>Date *</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleFormChange}
              />
            </div>

            <button
              className="submit-btn"
              onClick={handleAddItem}
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Report Item'}
            </button>
          </div>
        </div>
      )}

      {showClaimModal && selectedItem && (
        <div className="modal-overlay" onClick={() => setShowClaimModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Claim Item</h2>
              <button className="close-btn" onClick={() => setShowClaimModal(false)}>✕</button>
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea
                name="description"
                value={claimData.description}
                onChange={handleClaimChange}
                placeholder="Why do you think this is your item?"
              />
            </div>

            <div className="form-group">
              <label>Claim Details *</label>
              <textarea
                name="proof"
                value={claimData.proof}
                onChange={handleClaimChange}
                placeholder="Provide proof or identifying marks"
              />
            </div>

            <button
              className="submit-btn"
              onClick={handleCreateClaim}
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Claim'}
            </button>
          </div>
        </div>
      )}
       {showChatModal && chatData && (
  <ChatSystem
    claimId={chatData.claimId}
    claimantName={chatData.claimantName}
    claimantEmail={chatData.claimantEmail}
    isClaimant={chatData.isClaimant}
    onClose={() => setShowChatModal(false)}
  />
)}
    </>
  );
};

export default HomePage;
