class PrivacyConsent extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        .privacy-consent {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: white;
          border-top: 1px solid #e5e7eb;
          padding: 1.5rem;
          box-shadow: 0 -4px 20px rgba(0,0,0,0.1);
          z-index: 1000;
          transform: translateY(100%);
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .privacy-content {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .privacy-consent.show {
          transform: translateY(0);
        }
        
        .privacy-buttons {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }
        
        .privacy-consent p {
          margin: 0;
          color: #374151;
        }
        
        .privacy-buttons {
          display: flex;
          gap: 0.75rem;
        }
        
        .privacy-consent button {
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          font-weight: 500;
          transition: all 0.3s ease;
        }
        
        .privacy-consent .btn-primary {
          background: #7c3aed;
          color: white;
          border: none;
          cursor: pointer;
        }
        
        .privacy-consent .btn-secondary {
          background: #f3f4f6;
          color: #374151;
          border: none;
        }
        
        .privacy-consent .btn-primary:hover {
          background: #6d28d9;
        }
        
        .privacy-consent .btn-secondary:hover {
          background: #e5e7eb;
        }
        
        .privacy-links {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }
        
        .privacy-consent a {
          color: #7c3aed;
          text-decoration: none;
        }
        
        .privacy-consent a:hover {
          text-decoration: underline;
        }
        
        @media (min-width: 768px) {
          .privacy-content {
            flex-direction: row;
            align-items: center;
          }
          
          .privacy-content > div:first-child {
            flex: 1;
          }
        }
      </style>
      
      <div class="privacy-consent" id="privacyConsent">
        <div class="privacy-content">
          <div>
            <p class="font-medium">Datenschutz & Cookies</p>
            <p class="text-sm text-gray-600">
              Wir verwenden Cookies, um die Nutzererfahrung zu verbessern. Durch die Nutzung unserer Website stimmen Sie unserer Datenschutzerklärung zu.
          </div>
          <div class="privacy-buttons">
            <button class="btn-primary" id="acceptAll">
              Alle akzeptieren
            </button>
            <button class="btn-secondary" id="acceptNecessary">
              Nur notwendige
            </button>
            <div class="privacy-links">
              <a href="/datenschutz.html">Datenschutz</a>
              <a href="/dsgvo.html">DSGVO</button>
          </div>
        </div>
      </div>
    `;
    
    // Show the popup after a short delay
    setTimeout(() => {
      if (!this.getConsent()) {
        this.shadowRoot.getElementById('privacyConsent').classList.add('show');
            }, 1000);
    
    this.shadowRoot.getElementById('acceptAll').addEventListener('click', () => {
      this.setConsent('all');
      this.hide();
    });
    
    this.shadowRoot.getElementById('acceptNecessary').addEventListener('click', () => {
      this.setConsent('necessary');
      this.hide();
    });
  }
  
  getConsent() {
    return localStorage.getItem('privacy-consent');
  }
  
  setConsent(type) {
    localStorage.setItem('privacy-consent', type);
  }
  
  hide() {
    this.shadowRoot.getElementById('privacyConsent').classList.remove('show');
    setTimeout(() => {
      this.style.display = 'none';
    }, 400);
  }
}

customElements.define('privacy-consent', PrivacyConsent);