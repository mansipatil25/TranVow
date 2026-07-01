# 🎙️ TransVox — Free Real-Time Voice & Text Translation App

TransVox lets you speak or type in any language and instantly get a spoken + written translation — completely free, no API key, no backend, no signup required.

🔗 **Live Demo:** _add your GitHub Pages link here after deploying_

## ✨ Features

- 🎤 **Voice Mode** — Hold the mic button, speak, release to translate
- ⌨️ **Type Text Mode** — Type instead of speak, great for noisy environments
- 🌍 **20+ Languages** — English, Spanish, French, Hindi, German, Japanese, Chinese, Arabic, Portuguese, Russian, Italian, Korean, Dutch, Turkish, Polish, Vietnamese, Thai, Indonesian, Bengali, Marathi, Tamil, Telugu, Gujarati, Urdu, Swedish, Greek
- 🌗 **Dark / Light Theme Toggle** — Saved automatically per visitor
- 🔊 **Audio Playback** — Hear your translation spoken aloud
- 📝 **English Subtitles** — Back-translation shown for verification
- 📥 **Download as .txt** — Save any translation locally
- 📋 **Copy to Clipboard** — One-click copy for original or translated text
- 🕒 **Translation History** — Last 20 translations saved locally in your browser
- 🔃 **Swap Languages** — Instantly flip source ↔ target

## 🛠️ Tech Stack

| Layer | Technology | Cost |
|---|---|---|
| Frontend | HTML5, CSS3, Vanilla JavaScript | Free |
| Speech-to-Text | Web Speech API (browser-native) | Free |
| Translation | MyMemory Translation API | Free, no key |
| Text-to-Speech | SpeechSynthesis API (browser-native) | Free |
| Hosting | GitHub Pages | Free |

**Total cost: $0 forever — for you and every visitor.**

## 📁 Project Structure

```
transvox/
├── index.html
├── LICENSE
├── .gitignore
├── README.md
├── css/
│   └── style.css
├── js/
│   └── app.js
└── docs/
    └── FEATURES.md
```

## 🚀 Run Locally

Open `index.html` directly in **Chrome or Edge** (Web Speech API isn't supported in Firefox/Safari — use Type Text mode there instead).

No installation, no API key, no build step — it just works.

## 🌍 Deploy Free on GitHub Pages

```bash
git init
git add .
git commit -m "Initial commit - TransVox"
git branch -M main
git remote add origin https://github.com/mansipatil25/transvox.git
git push -u origin main
```

Then on GitHub:
1. Go to your repo → **Settings → Pages**
2. Under "Branch", select `main` → folder `/ (root)` → Save
3. Your site goes live in 1–2 minutes at:
   `https://mansipatil25.github.io/transvox/`

## 🔧 How It Works

```
User speaks (Voice mode) or types (Text mode)
        ↓
Web Speech API transcribes voice → text (Voice mode only)
        ↓
MyMemory API translates the text
        ↓
Translation displayed + back-translated subtitle shown
        ↓
SpeechSynthesis API speaks the translation aloud
        ↓
Result saved to browser's localStorage (history)
        ↓
Optionally downloaded as a .txt file
```

See [docs/FEATURES.md](docs/FEATURES.md) for a full feature walkthrough.

## 📌 Notes

- Requires an internet connection (Web Speech API + MyMemory both need it)
- TTS voice quality depends on your OS's installed voices
- MyMemory free tier: ~1,000-5,000 words/day per IP — more than enough for personal/demo use

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

## 🧑‍💻 Built By

**Mansi Patil** — BE Computer Engineering, SVKM's Institute of Technology, Dhule
Portfolio: [mansipatil25.github.io/portfolio](https://mansipatil25.github.io/portfolio)
GitHub: [github.com/mansipatil25](https://github.com/mansipatil25)
