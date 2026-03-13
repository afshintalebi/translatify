# 🌐 Translatify

**Translatify** is a modern, fast, and accessible language translation web application built with **Next.js 13/14 (App Router)** and **Tailwind CSS**. It leverages the MyMemory API for seamless translations and utilizes browser-native Web APIs for voice interaction.

## ✨ Key Features

- 🔍 **Auto-Detection:** Automatically identifies the source language.
- ⚡ **Live Translation:** Translates text in real-time as you type using a debounced input mechanism.
- 🎙️ **Speech-to-Text (STT):** Integrated microphone support for voice-activated input.
- 🔊 **Text-to-Speech (TTS):** High-quality audio playback of the translated text.
- 📥 **Audio Download:** Specialized functionality to download translations as `.mp3` files via a custom API bridge.
- 🔄 **Smart Swap:** Quickly swap between source and target languages with a single click.
- 📱 **Responsive Design:** Clean, mobile-friendly UI built with Tailwind CSS and Lucide icons.

## 🛠️ Tech Stack

- **Framework:** Next.js (Client Components)
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **API:** [MyMemory Translation API](https://mymemory.translated.net)
- **Native APIs:** 
  - Web Speech API (Recognition)
  - SpeechSynthesis (Playback)

## 🚀 Getting Started

### 1. Installation
  Clone the repository and install the dependencies:

  ```bash
  git clone https://github.com
  cd translatify
  npm install
  ```

###  2. Configure the API Route
To enable the Audio Download feature, ensure you have an API route located at `/app/api/tts/route.ts` to handle the Text-to-Speech stream. This bypasses CORS restrictions and allows file generation.

###  3. Run Development Server
```bash
npm run dev
```
Open (http://localhost:3000)[http://localhost:3000] with your browser to see the result.

## 🌍 Supported Languages
The app currently supports:
- English, French, German, Spanish, Arabic, and Turkish (with Auto-Detect feature).

You can edit the available languages.

## 📄 License
This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## ⚖️ Legal & Attribution
- **Translation Engine:** This app uses the [MyMemory API](https://mymemory.translated.net). Please respect their usage limits and terms of service.
- **Privacy:** Voice recognition and text-to-speech are handled by native browser APIs (Web Speech API). No audio data will be store.
- **Disclaimer:** This project is intended for educational and portfolio purposes.
