// ── TransVox App v2 — Voice/Text modes, 20+ languages, theme toggle, download ──

const LANG_NAMES = {
  en: 'English', es: 'Spanish', fr: 'French', hi: 'Hindi',
  de: 'German', ja: 'Japanese', zh: 'Chinese', ar: 'Arabic',
  pt: 'Portuguese', ru: 'Russian', it: 'Italian', ko: 'Korean',
  nl: 'Dutch', tr: 'Turkish', pl: 'Polish', vi: 'Vietnamese',
  th: 'Thai', id: 'Indonesian', bn: 'Bengali', mr: 'Marathi',
  ta: 'Tamil', te: 'Telugu', gu: 'Gujarati', ur: 'Urdu',
  sv: 'Swedish', el: 'Greek', auto: 'Auto Detect'
};

const SPEECH_LANG_MAP = {
  en: 'en-US', es: 'es-ES', fr: 'fr-FR', hi: 'hi-IN',
  de: 'de-DE', ja: 'ja-JP', zh: 'zh-CN', ar: 'ar-SA',
  pt: 'pt-BR', ru: 'ru-RU', it: 'it-IT', ko: 'ko-KR',
  nl: 'nl-NL', tr: 'tr-TR', pl: 'pl-PL', vi: 'vi-VN',
  th: 'th-TH', id: 'id-ID', bn: 'bn-IN', mr: 'mr-IN',
  ta: 'ta-IN', te: 'te-IN', gu: 'gu-IN', ur: 'ur-PK',
  sv: 'sv-SE', el: 'el-GR'
};

const LANG_FLAGS = {
  en: '🇬🇧', es: '🇪🇸', fr: '🇫🇷', hi: '🇮🇳', de: '🇩🇪',
  ja: '🇯🇵', zh: '🇨🇳', ar: '🇸🇦', pt: '🇧🇷', ru: '🇷🇺',
  it: '🇮🇹', ko: '🇰🇷', nl: '🇳🇱', tr: '🇹🇷', pl: '🇵🇱',
  vi: '🇻🇳', th: '🇹🇭', id: '🇮🇩', bn: '🇧🇩', mr: '🇮🇳',
  ta: '🇮🇳', te: '🇮🇳', gu: '🇮🇳', ur: '🇵🇰', sv: '🇸🇪', el: '🇬🇷'
};

// ── State ──
let recognition = null;
let isRecording = false;
let capturedText = '';
let history = JSON.parse(localStorage.getItem('vt_history') || '[]');
let currentMode = 'voice'; // 'voice' | 'text'

// ── DOM refs ──
const sourceLangSel  = document.getElementById('sourceLang');
const targetLangSel  = document.getElementById('targetLang');
const swapBtn        = document.getElementById('swapLangs');
const recordBtn      = document.getElementById('recordBtn');
const recordRing     = document.getElementById('recordRing');
const recordHint     = document.getElementById('recordHint');
const waveform       = document.getElementById('waveform');
const originalText   = document.getElementById('originalText');
const translationText= document.getElementById('translationText');
const detectedBadge  = document.getElementById('detectedLangBadge');
const targetBadge    = document.getElementById('targetLangBadge');
const subtitleRow    = document.getElementById('subtitleRow');
const subtitleText   = document.getElementById('subtitleText');
const statusDot      = document.getElementById('statusDot');
const statusMsg      = document.getElementById('statusMsg');
const playBtn        = document.getElementById('playTranslation');
const copyOrigBtn    = document.getElementById('copyOriginal');
const copyTransBtn   = document.getElementById('copyTranslation');
const historySection = document.getElementById('historySection');
const historyList    = document.getElementById('historyList');
const clearHistBtn   = document.getElementById('clearHistory');
const themeToggle    = document.getElementById('themeToggle');
const themeIcon      = document.getElementById('themeIcon');
const voiceModeTab   = document.getElementById('voiceModeTab');
const textModeTab    = document.getElementById('textModeTab');
const voiceSection   = document.getElementById('voiceSection');
const textInputSection = document.getElementById('textInputSection');
const textInputArea  = document.getElementById('textInputArea');
const translateTextBtn = document.getElementById('translateTextBtn');
const downloadBtn    = document.getElementById('downloadBtn');

// ── Init ──
window.addEventListener('DOMContentLoaded', () => {
  populateLanguageDropdowns();
  initTheme();
  updateTargetBadge();
  renderHistory();
  checkSpeechSupport();
});

// ── Populate language dropdowns dynamically ──
function populateLanguageDropdowns() {
  const sourceOptions = ['auto', ...Object.keys(LANG_NAMES).filter(k => k !== 'auto')];
  sourceLangSel.innerHTML = sourceOptions.map(code => {
    const label = code === 'auto' ? 'Auto Detect' : `${LANG_FLAGS[code] || ''} ${LANG_NAMES[code]}`;
    const selected = code === 'en' ? 'selected' : '';
    return `<option value="${code}" ${selected}>${label}</option>`;
  }).join('');

  const targetOptions = Object.keys(LANG_NAMES).filter(k => k !== 'auto');
  targetLangSel.innerHTML = targetOptions.map(code => {
    const label = `${LANG_FLAGS[code] || ''} ${LANG_NAMES[code]}`;
    const selected = code === 'es' ? 'selected' : '';
    return `<option value="${code}" ${selected}>${label}</option>`;
  }).join('');
}

// ── Theme Toggle ──
function initTheme() {
  const saved = localStorage.getItem('vt_theme') || 'dark';
  applyTheme(saved);
}

function applyTheme(theme) {
  if (theme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    themeIcon.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>'; // moon icon
  } else {
    document.documentElement.removeAttribute('data-theme');
    themeIcon.innerHTML = `<circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/>
      <line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/>
      <line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>`; // sun icon
  }
  localStorage.setItem('vt_theme', theme);
}

themeToggle.addEventListener('click', () => {
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  themeToggle.classList.add('spin');
  setTimeout(() => themeToggle.classList.remove('spin'), 400);
  applyTheme(isLight ? 'dark' : 'light');
});

// ── Mode Tabs (Voice / Text) ──
voiceModeTab.addEventListener('click', () => switchMode('voice'));
textModeTab.addEventListener('click', () => switchMode('text'));

function switchMode(mode) {
  currentMode = mode;
  if (mode === 'voice') {
    voiceModeTab.classList.add('active');
    textModeTab.classList.remove('active');
    voiceSection.style.display = 'flex';
    textInputSection.classList.remove('active');
  } else {
    textModeTab.classList.add('active');
    voiceModeTab.classList.remove('active');
    voiceSection.style.display = 'none';
    textInputSection.classList.add('active');
  }
}

// ── Text Mode Translation ──
translateTextBtn.addEventListener('click', () => {
  const text = textInputArea.value.trim();
  if (!text) {
    showToast('Type something to translate first');
    return;
  }
  translate(text);
});

textInputArea.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
    translateTextBtn.click();
  }
});

// ── Language ──
targetLangSel.addEventListener('change', updateTargetBadge);

function updateTargetBadge() {
  const lang = targetLangSel.value;
  targetBadge.textContent = LANG_NAMES[lang] || lang;
}

swapBtn.addEventListener('click', () => {
  const src = sourceLangSel.value;
  const tgt = targetLangSel.value;
  if (src === 'auto') return showToast('Cannot swap when source is Auto Detect');
  const srcOpt = [...sourceLangSel.options].find(o => o.value === tgt);
  const tgtOpt = [...targetLangSel.options].find(o => o.value === src);
  if (srcOpt) sourceLangSel.value = tgt;
  if (tgtOpt) targetLangSel.value = src;
  updateTargetBadge();

  const origVal = originalText.dataset.value || '';
  const transVal = translationText.dataset.value || '';
  if (origVal && transVal) {
    setOriginalText(transVal, LANG_NAMES[tgt]);
    setTranslationText(origVal, LANG_NAMES[src]);
  }
});

// ── Speech Recognition check ──
function checkSpeechSupport() {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    setStatus('Speech recognition not supported. Use Chrome/Edge, or switch to Type Text mode.', 'error');
    recordBtn.disabled = true;
    recordBtn.style.opacity = '0.4';
    recordHint.textContent = 'Speech API not available — try Type Text mode instead';
  }
}

// ── Recording ──
recordBtn.addEventListener('mousedown', startRecording);
recordBtn.addEventListener('touchstart', (e) => { e.preventDefault(); startRecording(); });
document.addEventListener('mouseup', () => { if (isRecording) stopRecording(); });
document.addEventListener('touchend', () => { if (isRecording) stopRecording(); });

function startRecording() {
  if (isRecording) return;

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();

  const srcLang = sourceLangSel.value;
  recognition.lang = srcLang === 'auto' ? 'en-US' : (SPEECH_LANG_MAP[srcLang] || 'en-US');
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;

  recognition.onstart = () => {
    isRecording = true;
    capturedText = '';
    recordBtn.classList.add('recording');
    recordRing.classList.add('recording');
    waveform.classList.add('active');
    recordHint.textContent = '🔴 Recording… release to translate';
    setStatus('Listening — speak now', 'recording');
    setOriginalText('', '');
    setTranslationText('', '');
    subtitleRow.style.display = 'none';
  };

  recognition.onresult = (e) => {
    let interim = '', final = '';
    for (let i = e.resultIndex; i < e.results.length; i++) {
      if (e.results[i].isFinal) final += e.results[i][0].transcript;
      else interim += e.results[i][0].transcript;
    }
    const display = final || interim;
    if (display) {
      originalText.textContent = display;
      originalText.classList.remove('placeholder-text');
      originalText.dataset.value = display;
    }
    if (final) capturedText = final;
  };

  recognition.onerror = (e) => {
    stopRecording();
    const msgs = {
      'no-speech': 'No speech detected — try again',
      'audio-capture': 'Microphone not found',
      'not-allowed': 'Microphone permission denied',
      'network': 'Network error during recognition'
    };
    setStatus(msgs[e.error] || 'Error: ' + e.error, 'error');
    showToast('⚠️ ' + (msgs[e.error] || e.error));
  };

  recognition.onend = () => {
    stopRecording();
    if (capturedText.trim()) {
      translate(capturedText.trim());
    } else if (!originalText.dataset.value) {
      setStatus('No speech detected — try again', 'error');
    }
  };

  try {
    recognition.start();
  } catch (err) {
    setStatus('Could not start microphone: ' + err.message, 'error');
  }
}

function stopRecording() {
  if (!isRecording) return;
  isRecording = false;
  recordBtn.classList.remove('recording');
  recordRing.classList.remove('recording');
  waveform.classList.remove('active');
  recordHint.textContent = 'Hold to record · Release to translate';
  try { if (recognition) recognition.stop(); } catch(e) {}
}

// ── Translation — uses MyMemory (100% free, no key) ──
async function translate(text) {
  const srcLang = sourceLangSel.value === 'auto' ? 'en' : sourceLangSel.value;
  const tgtLang = targetLangSel.value;
  const tgtName = LANG_NAMES[tgtLang];

  setStatus('Translating…', 'processing');
  translationText.innerHTML = '<span class="spinner"></span>';
  translationText.classList.remove('placeholder-text');

  try {
    const langPair = `${srcLang}|${tgtLang}`;
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langPair}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error(`Translation service error (${res.status})`);

    const data = await res.json();
    if (data.responseStatus !== 200 && data.responseStatus !== '200') {
      throw new Error(data.responseDetails || 'Translation failed');
    }

    const translatedText = data.responseData.translatedText;
    if (!translatedText) throw new Error('No translation returned');

    setOriginalText(text, LANG_NAMES[srcLang] || srcLang);
    setTranslationText(translatedText, tgtName);

    let subtitle = '';
    if (tgtLang !== 'en') {
      try {
        const backUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(translatedText)}&langpair=${tgtLang}|en`;
        const backRes = await fetch(backUrl);
        const backData = await backRes.json();
        subtitle = backData?.responseData?.translatedText || '';
      } catch (e) { /* optional, fail silently */ }
    }

    if (subtitle && subtitle.toLowerCase() !== text.toLowerCase()) {
      subtitleText.textContent = `English: "${subtitle}"`;
      subtitleRow.style.display = 'block';
    } else {
      subtitleRow.style.display = 'none';
    }

    setStatus(`Translated to ${tgtName} · ${text.split(' ').length} words`, 'done');

    speakText(translatedText, tgtLang);
    addToHistory(text, LANG_NAMES[srcLang] || srcLang, translatedText, tgtName);

  } catch (err) {
    translationText.textContent = 'Translation failed.';
    translationText.classList.add('placeholder-text');
    setStatus('Error: ' + err.message, 'error');
    showToast('❌ ' + err.message);
    console.error('Translation error:', err);
  }
}

// ── Display helpers ──
function setOriginalText(text, langName) {
  if (text) {
    originalText.textContent = text;
    originalText.classList.remove('placeholder-text');
    originalText.dataset.value = text;
    document.getElementById('originalCard').classList.add('has-content');
  } else {
    originalText.innerHTML = '<span class="placeholder-text">Your speech will appear here…</span>';
    originalText.dataset.value = '';
  }
  if (langName) detectedBadge.textContent = langName;
}

function setTranslationText(text, langName) {
  if (text) {
    translationText.textContent = text;
    translationText.classList.remove('placeholder-text');
    translationText.dataset.value = text;
    document.getElementById('translationCard').classList.add('has-content');
  } else {
    translationText.innerHTML = '<span class="placeholder-text">Translation will appear here…</span>';
    translationText.dataset.value = '';
  }
  if (langName) targetBadge.textContent = langName;
}

// ── Text-to-Speech (free, browser-native) ──
function speakText(text, langCode) {
  if (!window.speechSynthesis || !text) return;
  window.speechSynthesis.cancel();

  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = SPEECH_LANG_MAP[langCode] || langCode;
  utter.rate = 0.88;
  utter.pitch = 1;

  playBtn.classList.add('playing');
  utter.onend = () => playBtn.classList.remove('playing');
  utter.onerror = () => playBtn.classList.remove('playing');

  window.speechSynthesis.speak(utter);
}

playBtn.addEventListener('click', () => {
  const text = translationText.dataset.value || translationText.textContent;
  const lang = targetLangSel.value;
  if (text && text !== 'Translation will appear here…') {
    speakText(text, lang);
  } else {
    showToast('No translation to play yet');
  }
});

// ── Copy buttons ──
copyOrigBtn.addEventListener('click', () => {
  const text = originalText.dataset.value || originalText.textContent;
  copyToClipboard(text, 'Original text copied!');
});

copyTransBtn.addEventListener('click', () => {
  const text = translationText.dataset.value || translationText.textContent;
  copyToClipboard(text, 'Translation copied!');
});

async function copyToClipboard(text, msg) {
  if (!text || text.includes('will appear here')) {
    showToast('Nothing to copy yet');
    return;
  }
  try {
    await navigator.clipboard.writeText(text);
    showToast('✅ ' + msg);
  } catch (e) {
    showToast('❌ Copy failed');
  }
}

// ── Download as .txt ──
downloadBtn.addEventListener('click', () => {
  const orig = originalText.dataset.value || '';
  const trans = translationText.dataset.value || '';

  if (!orig || !trans) {
    showToast('Nothing to download yet — translate something first');
    return;
  }

  const srcName = detectedBadge.textContent;
  const tgtName = targetBadge.textContent;
  const timestamp = new Date().toLocaleString();

  const content = `TransVox Translation
Generated: ${timestamp}
─────────────────────────────

Original (${srcName}):
${orig}

Translation (${tgtName}):
${trans}

─────────────────────────────
Generated by TransVox — transvox.app
`;

  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `transvox-translation-${Date.now()}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  showToast('✅ Downloaded as .txt');
});

// ── Status ──
function setStatus(msg, state) {
  statusMsg.textContent = msg;
  statusDot.className = 'status-dot';
  if (state) statusDot.classList.add(state);
}

// ── Toast ──
let toastTimeout;
function showToast(msg) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove('show'), 3000);
}

// ── History ──
function addToHistory(original, srcLang, translation, tgtLang) {
  const entry = {
    id: Date.now(),
    original,
    srcLang,
    translation,
    tgtLang,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
  history.unshift(entry);
  if (history.length > 20) history.pop();
  localStorage.setItem('vt_history', JSON.stringify(history));
  renderHistory();
}

function renderHistory() {
  if (history.length === 0) {
    historySection.style.display = 'none';
    return;
  }
  historySection.style.display = 'block';
  historyList.innerHTML = history.map(h => `
    <div class="history-item">
      <div>
        <div class="history-original">${escapeHtml(h.original)}</div>
        <div class="history-meta">
          <span class="history-lang-tag">${h.srcLang}</span>
          <span style="font-size:10px;color:var(--text-dim)">${h.time}</span>
        </div>
      </div>
      <div class="history-arrow">→</div>
      <div>
        <div class="history-translation">${escapeHtml(h.translation)}</div>
        <div class="history-meta">
          <span class="history-lang-tag" style="color:var(--accent);background:rgba(124,106,255,0.1)">${h.tgtLang}</span>
        </div>
      </div>
    </div>
  `).join('');
}

clearHistBtn.addEventListener('click', () => {
  history = [];
  localStorage.removeItem('vt_history');
  renderHistory();
  showToast('History cleared');
});

function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
