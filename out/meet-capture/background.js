// BMFFFL Meeting Capture — background.js (Service Worker)
// Receives caption chunks from content script, POSTs to Bimfle's droplet
// Background service workers bypass mixed-content restrictions → can call http://

const WEBHOOK_BASE = 'http://64.23.235.14:3002/meeting';

async function post(path, body) {
  try {
    const res = await fetch(`${WEBHOOK_BASE}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return res.ok;
  } catch (err) {
    console.error('[BMFFFL] Webhook error:', err.message);
    return false;
  }
}

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === 'CAPTION_CHUNK') {
    post('/transcript', {
      meeting_id: msg.meetingId,
      chunks: msg.chunks,
      total_chunks: msg.totalChunks,
    });
  }

  if (msg.type === 'FLUSH_RESULT') {
    post('/transcript-full', {
      meeting_id: msg.meetingId,
      transcript: msg.transcript,
    });
  }
});
