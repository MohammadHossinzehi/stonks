# Stonks - Congressional Stock Trading Dashboard

[![Live Site](https://img.shields.io/badge/Live-Demo-blue?style=for-the-badge&logo=vercel)](https://main.d3mjnwrqvz2taq.amplifyapp.com/)

Stonks is a web application that visualizes stock trades made by U.S. politicians, using data scraped from [CapitolTrades](https://www.capitoltrades.com/). 
It helps users identify trends, high-volume trades, and ownership patterns among elected officials.

## 🚀 Features
- 📊 Interactive charts for:
  - Top Politicians by Trade Volume
  - High-Volume Trades
  - Price Trends by Company
  - Ownership Patterns (Self, Spouse, Undisclosed)
- 🔄 Real-time data refresh via AWS Lambda + API Gateway
- 🧠 Automatically formats and cleans scraped data
- 💡 Responsive, mobile-friendly layout built with Tailwind CSS
- ☁️ Hosted on AWS Amplify

## 🛠 Tech Stack
- Frontend: Next.js 15, React, TypeScript
- Styling: Tailwind CSS
- Backend: AWS Lambda, API Gateway
- Hosting: AWS Amplify
- Data Source: CapitolTrades (web scraping)

## ⚙️ Getting Started (Local Dev)

```bash
# Clone the repository:
git clone https://github.com/your-username/stonks.git
cd stonks
# Install dependencies:
npm install
# Run the app:
npm run dev
```

## 👤👤 Developers
- [Adilet Ishenbekov](https://github.com/AdiletIshenbekov)
- [David Nong-Ang](https://github.com/DavidNongAng)
- [Mohammad Hossinzehi](https://github.com/MohammadHossinzehi)