(() => {
    function showEmailSentOverlay() {
      if (document.getElementById('email-sent-overlay')) return;
  
      // Play Elden Ring sound effect
      const sound = new Audio(chrome.runtime.getURL('elden-ring-sound.mp3'));
      sound.play();
  
      const overlay = document.createElement('div');
      overlay.id = 'email-sent-overlay';
      overlay.style.position = 'fixed';
      overlay.style.top = 0;
      overlay.style.left = 0;
      overlay.style.width = '100%';
      overlay.style.height = '100%';
      overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
      overlay.style.display = 'flex';
      overlay.style.justifyContent = 'center';
      overlay.style.alignItems = 'center';
      overlay.style.zIndex = 9999;
      overlay.style.fontFamily = '"OptimusPrinceps", serif';
      overlay.style.fontSize = '80px';
      overlay.style.color = '#AA0000';
      overlay.style.textShadow = '2px 2px 4px black';
      overlay.innerText = 'EMAIL SENT';
  
      document.body.appendChild(overlay);
  
      setTimeout(() => {
        overlay.style.transition = 'opacity 2s';
        overlay.style.opacity = 0;
      }, 2000);
      setTimeout(() => {
        overlay.remove();
      }, 4000);
    }
  
    // Function to attach the send button listener (event delegation for dynamic elements)
    function attachSendButtonListener(selector, platform) {
      const sendButton = document.querySelector(selector);
      if (!sendButton) {
        console.log(`[${platform}] Send button not found, retrying...`);
        setTimeout(() => attachSendButtonListener(selector, platform), 1000);
        return;
      }
  
      console.log(`[${platform}] Send button found! Adding listener.`);
      // Event listener for the send button
      sendButton.addEventListener('click', () => {
        console.log(`[${platform}] Email sent detected!`);
        showEmailSentOverlay();
      });
    }
  
    // Function to setup event delegation for dynamic send buttons
    function setupOutlookListeners() {
      const observer = new MutationObserver(() => {
        // Detects the send button for both Outlook and Outlook 365
        attachSendButtonListener('#splitButton-r1b__primaryActionButton', 'Outlook 365'); // Outlook 365 button
        attachSendButtonListener('[aria-label^="Send"], [data-automation-id="send"]', 'Outlook'); // New Outlook button
      });
  
      observer.observe(document.body, {
        childList: true, // Observe for child elements being added
        subtree: true // Observe all descendants
      });
    }
  
    // Attach keyboard listener for Ctrl+Enter or Cmd+Enter for Gmail, Outlook, and Outlook 365
    function attachKeyboardListener(platform) {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  
      document.addEventListener('keydown', (e) => {
        if ((e.key === 'Enter' && e.ctrlKey) || (e.key === 'Enter' && (e.metaKey || e.ctrlKey))) {
          console.log(`[${platform}] Ctrl+Enter or Cmd+Enter detected!`);
          showEmailSentOverlay();
        }
      });
    }
  
    // Attach listeners for Gmail (via dynamic DOM elements) and both versions of Outlook
    function setupListeners() {
      // Gmail button (Gmail uses dynamic elements, so we use delegation)
      document.body.addEventListener('click', (e) => {
        const sendButton = e.target.closest('div[aria-label^="Send ‪(⌘Enter)‬"], div[data-tooltip^="Send ‪(⌘Enter)‬"]');
        if (sendButton) {
          console.log('[Gmail] Email sent detected via delegation!');
          showEmailSentOverlay();
        }
      });
  
      // Setup event delegation for Outlook and Outlook 365
      setupOutlookListeners();
  
      // Attach keyboard listener for Ctrl+Enter (works on Gmail, Outlook, and Outlook 365)
      attachKeyboardListener('Gmail/Outlook/Outlook 365');
    }
  
    // Initial setup when the page is ready
    setupListeners();
  })();
  