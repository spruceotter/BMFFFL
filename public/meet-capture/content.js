// BMFFFL Meeting Capture — content.js
// Reads Google Meet live captions and ships them to Bimfle's webhook
// Runs inside the meet.google.com tab

(function () {
  const SEND_INTERVAL_MS = 30000; // ship captions every 30s
  const meetingId = window.location.pathname.replace(/\//g, '') || 'unknown';

  let captionBuffer = [];
  let lastText = '';

  // ── Caption selectors (try all, use first that returns text) ──────────────
  // Google Meet's DOM changes with updates; multiple fallbacks improve resilience
  const CAPTION_SELECTORS = [
    '[aria-live="polite"] span',       // W3C aria-live (most stable)
    '[aria-live="off"] span',          // some Meet versions use aria-live="off"
    '.a4cQT span',                     // Meet 2024 captions container
    '.iOzk7',                          // earlier 2024 class
    '.CNusmb',                         // 2023 class
    '.TBMuR',                          // older class
    '.bj2O9',                          // another variant
  ];

  function extractCaptionText() {
    for (const sel of CAPTION_SELECTORS) {
      const els = document.querySelectorAll(sel);
      if (els.length === 0) continue;
      const text = Array.from(els)
        .map(el => el.textContent.trim())
        .filter(t => t.length > 0)
        .join(' ')
        .trim();
      if (text.length > 8) return text;
    }
    return null;
  }

  // ── MutationObserver watches for DOM changes ───────────────────────────────
  const observer = new MutationObserver(() => {
    const text = extractCaptionText();
    if (!text || text === lastText) return;

    // Only add if meaningfully different (not just a character or two)
    if (text.length > 8 && text !== lastText) {
      captionBuffer.push({ ts: new Date().toISOString(), text });
      lastText = text;
    }
  });

  // Start watching once the page is interactive
  function startObserver() {
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      characterDataOldValue: true,
    });
    console.log('[BMFFFL] Meeting capture active — meeting:', meetingId);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startObserver);
  } else {
    startObserver();
  }

  // ── Send buffered captions to background service worker every 30s ──────────
  let sentCount = 0;
  setInterval(() => {
    if (captionBuffer.length <= sentCount) return; // nothing new

    const newChunks = captionBuffer.slice(sentCount);
    sentCount = captionBuffer.length;

    chrome.runtime.sendMessage({
      type: 'CAPTION_CHUNK',
      meetingId,
      chunks: newChunks,
      totalChunks: captionBuffer.length,
    });
  }, SEND_INTERVAL_MS);

  // ── Immediate send on demand (Stream Deck GET request triggers this) ────────
  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === 'FLUSH_NOW') {
      const allText = captionBuffer.map(c => `[${c.ts}] ${c.text}`).join('\n');
      chrome.runtime.sendMessage({
        type: 'FLUSH_RESULT',
        meetingId,
        transcript: allText,
      });
    }
  });
})();
