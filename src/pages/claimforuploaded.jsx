import React, { useState, useEffect } from 'react';
import { Menu, X, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ChatSystem from './chat';
const UploadedClaimsPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [messageTimeout, setMessageTimeout] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [showChatModal, setShowChatModal] = useState(false);
const [chatData, setChatData] = useState(null);

const openChat = (claim) => {
  setChatData({
    claimId: claim._id,
    claimantName: claim.claimant.username,
    claimantEmail: claim.claimant.email,
    isClaimant: false
  });
  setShowChatModal(true);
};
const navigate=useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchUploadedClaims();
  }, []);

  const showMessage = (type, text) => {
    if (messageTimeout) clearTimeout(messageTimeout);
    setMessage({ type, text });
    const timeout = setTimeout(() => {
      setMessage({ type: '', text: '' });
    }, 3000);
    setMessageTimeout(timeout);
  };

  const fetchUploadedClaims = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:2120/api/claim/item/uploadedbyuser', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
      });
      const data = await response.json();
      if (response.ok) {
        setClaims(data);
      } else {
        showMessage('error', data.message || 'Failed to fetch claims');
      }
    } catch (error) {
      showMessage('error', 'Network error. Please try again.');
      console.error('Error fetching claims:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveClaim = async (claimId) => {
    setActionLoading(claimId);
    try {
      const response = await fetch(`http://localhost:2120/api/claim/approve/${claimId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
      });
      const data = await response.json();
      if (response.ok) {
        showMessage('success', 'Claim approved successfully!');
        setClaims(claims.map(claim => 
          claim._id === claimId ? { ...claim, status: 'approved' } : claim
        ));
      } else {
        showMessage('error', data.msg || 'Failed to approve claim');
      }
    } catch (error) {
      showMessage('error', 'Network error. Please try again.');
      console.error('Error approving claim:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectClaim = async (claimId) => {
    setActionLoading(claimId);
    try {
      const response = await fetch(`http://localhost:2120/api/claim/reject/${claimId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
      });
      const data = await response.json();
      if (response.ok) {
        showMessage('success', 'Claim rejected!');
        setClaims(claims.map(claim => 
          claim._id === claimId ? { ...claim, status: 'rejected' } : claim
        ));
      } else {
        showMessage('error', data.msg || 'Failed to reject claim');
      }
    } catch (error) {
      showMessage('error', 'Network error. Please try again.');
      console.error('Error rejecting claim:', error);
    } finally {
      setActionLoading(null);
    }
  };
    
  const handleCloseItem = async (itemId) => {
    setActionLoading(`close-${itemId}`);
    try {
      const response = await fetch(`http://localhost:2120/api/claim/item/close/${itemId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
      });
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        showMessage('success', 'Item marked as closed!');
        setClaims(claims.filter(claim => claim.itemId !== itemId));
      } else {
        showMessage('error', data.msg || 'Failed to close item');
      }
    } catch (error) {
      showMessage('error', 'Network error. Please try again.');
      console.error('Error closing item:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:2120/api/auth/logout', {
        headers: { 'Authorization': `Bearer ${token}` },
        credentials: 'include'
      });
      navigate('/');
 } catch (error) {
      console.error('Error logging out:', error);
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

    .page-title {
      font-family: var(--font-classy);
      font-size: 2.5rem;
      background: var(--accent-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 40px;
    }

    .claims-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 25px;
      animation: fadeIn 0.5s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .claim-card {
      background: rgba(255, 255, 255, 0.03);
      backdrop-filter: blur(10px);
      border: var(--glass-border);
      border-radius: 15px;
      overflow: hidden;
      transition: all 0.3s ease;
    }

    .claim-card:hover {
      transform: translateY(-8px);
      border-color: var(--accent-cyan);
      box-shadow: 0 10px 30px rgba(75, 203, 250, 0.2);
    }

    .claim-header {
      padding: 20px;
      background: rgba(75, 203, 250, 0.05);
      border-bottom: var(--glass-border);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .claim-title {
      font-size: 1.3rem;
      font-weight: 700;
      color: var(--accent-cyan);
    }

    .claim-status {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
      text-transform: capitalize;
    }

    .claim-status.requested {
      background: rgba(255, 193, 7, 0.2);
      color: #ffc107;
      border: 1px solid rgba(255, 193, 7, 0.3);
    }

    .claim-status.approved {
      background: rgba(34, 197, 94, 0.2);
      color: #22c55e;
      border: 1px solid rgba(34, 197, 94, 0.3);
    }

    .claim-status.rejected {
      background: rgba(255, 107, 107, 0.2);
      color: #ff6b6b;
      border: 1px solid rgba(255, 107, 107, 0.3);
    }

    .claim-content {
      padding: 20px;
    }

    .claim-detail {
      margin-bottom: 18px;
      padding-bottom: 18px;
      border-bottom: 1px solid rgba(75, 203, 250, 0.1);
    }

    .claim-detail:last-of-type {
      border-bottom: none;
      margin-bottom: 0;
      padding-bottom: 0;
    }

    .detail-label {
      font-size: 0.85rem;
      color: var(--text-secondary);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 6px;
    }

    .detail-value {
      font-size: 0.95rem;
      color: var(--text-primary);
      line-height: 1.5;
      word-break: break-word;
    }

    .claimant-info {
      background: rgba(75, 203, 250, 0.08);
      padding: 12px;
      border-radius: 8px;
    }

    .claimant-name {
      color: var(--accent-cyan);
      font-weight: 600;
      margin-bottom: 4px;
    }

    .claimant-email {
      font-size: 0.85rem;
      color: var(--text-secondary);
    }

    .action-buttons {
      display: flex;
      gap: 10px;
      margin-top: 20px;
    }

    .action-btn {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 12px;
      border: none;
      border-radius: 10px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 0.9rem;
      font-family: var(--font-body);
    }

    .approve-btn {
      background: rgba(34, 197, 94, 0.1);
      border: 1px solid rgba(34, 197, 94, 0.3);
      color: #22c55e;
    }

    .approve-btn:hover:not(:disabled) {
      background: rgba(34, 197, 94, 0.2);
      box-shadow: 0 0 15px rgba(34, 197, 94, 0.3);
    }

    .reject-btn {
      background: rgba(255, 107, 107, 0.1);
      border: 1px solid rgba(255, 107, 107, 0.3);
      color: #ff6b6b;
    }

    .reject-btn:hover:not(:disabled) {
      background: rgba(255, 107, 107, 0.2);
      box-shadow: 0 0 15px rgba(255, 107, 107, 0.3);
    }

    .close-btn {
      background: rgba(156, 163, 175, 0.1);
      border: 1px solid rgba(156, 163, 175, 0.3);
      color: #d1d5db;
    }

    .close-btn:hover:not(:disabled) {
      background: rgba(156, 163, 175, 0.2);
      box-shadow: 0 0 15px rgba(156, 163, 175, 0.3);
    }

    .action-btn:disabled {
      opacity: 0.5;
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
      padding: 80px 20px;
      color: var(--text-secondary);
    }

    .empty-state h3 {
      font-size: 1.8rem;
      margin-bottom: 10px;
      color: var(--text-primary);
    }

    .empty-state p {
      font-size: 1.1rem;
    }

    .loading-state {
      text-align: center;
      padding: 60px 20px;
    }

    .loading-spinner {
      display: inline-block;
      width: 40px;
      height: 40px;
      border: 3px solid rgba(75, 203, 250, 0.2);
      border-top-color: var(--accent-cyan);
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
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

      .claims-grid {
        grid-template-columns: 1fr;
      }

      .page-title {
        font-size: 1.8rem;
      }

      .action-buttons {
        flex-direction: column;
      }

      .action-btn {
        padding: 10px;
      }

      .claim-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
      }
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <div className="bg-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>

      <nav className="navbar">
        <div className="nav-brand" >
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
            onClick={() => {
              navigate('/dashboard');
              setMobileMenuOpen(false);
            }}
          >
            Home
          </button>
          <button
            className="nav-link active"
            onClick={() => setMobileMenuOpen(false)}
          >
            Claims For Uploaded Items
          </button>
          <button
            className="nav-link"
            onClick={() => {
              handleLogout();
              setMobileMenuOpen(false);
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

        <h1 className="page-title">Claims on Your Uploaded Items</h1>

        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p style={{ marginTop: '20px', color: 'var(--text-secondary)' }}>Loading claims...</p>
          </div>
        ) : claims.length === 0 ? (
          <div className="empty-state">
            <h3>No claims yet</h3>
            <p>When someone claims your uploaded items, they will appear here</p>
          </div>
        ) : (
          <div className="claims-grid">
            {claims.map(claim => (
              <div key={claim._id} className="claim-card">
                <div className="claim-header">
                  <div className="claim-title">Claim #{claim._id.slice(-6).toUpperCase()}</div>
                  <span className={`claim-status ${claim.status}`}>{claim.status}</span>
                </div>

                <div className="claim-content">
                  <div className="claim-detail">
                    <div className="detail-label">Claimant</div>
                    <div className="detail-value">
                      <div className="claimant-info">
                        <div className="claimant-name">{claim.claimant.username}</div>
                        <div className="claimant-email">{claim.claimant.email}</div>
                      </div>
                    </div>
                  </div>

                  <div className="claim-detail">
                    <div className="detail-label">Proof / Identifying Marks</div>
                    <div className="detail-value">{claim.proof}</div>
                  </div>

                  <div className="claim-detail">
                    <div className="detail-label">Claimed On</div>
                    <div className="detail-value">
                      {new Date(claim.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>

                  {claim.status === 'requested' && (
  <div className="action-buttons">
    <button
      className="action-btn approve-btn"
      onClick={() => handleApproveClaim(claim._id)}
      disabled={actionLoading === claim._id}
    >
      <CheckCircle size={18} />
      {actionLoading === claim._id ? 'Approving...' : 'Approve'}
    </button>
    <button
      className="action-btn reject-btn"
      onClick={() => handleRejectClaim(claim._id)}
      disabled={actionLoading === claim._id}
    >
      <XCircle size={18} />
      {actionLoading === claim._id ? 'Rejecting...' : 'Reject'}
    </button>
  </div>
)}

{claim.status === 'approved' && (
  <div className="action-buttons">
    <button
      className="action-btn approve-btn"
      onClick={() => openChat(claim)}
      style={{ flex: 1 }}
    >
      💬 Open Chat
    </button>
    <button
      className="action-btn close-btn"
      onClick={() => handleCloseItem(claim.itemId)}
      disabled={actionLoading === `close-${claim.itemId}`}
    >
      {actionLoading === `close-${claim.itemId}` ? 'Closing...' : 'Mark Item as Closed'}
    </button>
  </div>
)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
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

export default UploadedClaimsPage;