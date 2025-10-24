# FinBridge 🌉

> **A scalable AI-driven digital platform empowering 190 million informal sector workers in India with secure financial identities, micro-loans, savings, and insurance access.**

[![TypeScript](https://img.shields.io/badge/TypeScript-99.2%25-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.19-646CFF.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 🚀 Overview

FinBridge is a comprehensive financial inclusion platform designed to bridge the gap between India's informal sector workers and formal financial services. The platform combines alternative credit scoring, Aadhaar-based KYC, and a hybrid online/offline architecture to provide accessible financial services to underserved communities.

### 🎯 Mission
To democratize financial services and empower 190 million informal sector workers across India with:
- **Secure Financial Identities** - Aadhaar-based KYC integration
- **Micro-loans** - Alternative credit scoring for quick approvals
- **Savings Solutions** - Digital wallet with goal-based savings
- **Insurance Access** - Affordable insurance products
- **Financial Education** - AI-powered learning resources

## ✨ Key Features

### 🌍 **Multi-Language Support (14 Languages)**
- English, Hindi, Bengali, Telugu, Tamil, Marathi, Gujarati
- Kannada, Malayalam, Punjabi, Assamese, Odia, Nepali, Urdu
- Complete UI translation including navigation, dashboard, and notifications

### 💰 **Digital Wallet**
- **Passcode Protection** - Secure 6-digit PIN authentication
- **Goal-Based Savings** - Set and track financial goals
- **Transaction Management** - Deposit, withdraw, and transfer funds
- **Real-time Balance** - Live balance updates and notifications

### 📊 **Financial Dashboard**
- **Comprehensive Overview** - Income, expenses, savings, and debt tracking
- **Payment Calendar** - Visual calendar for upcoming payments and bills
- **Recent Notifications** - Real-time alerts and updates
- **Financial Health Score** - AI-powered financial wellness assessment

### 🏦 **Loan Management**
- **Quick Applications** - Streamlined loan application process
- **EMI Calculator** - Built-in EMI calculation and planning
- **Application Tracking** - Real-time status updates
- **Multiple Loan Types** - Personal, business, and emergency loans

### 💳 **Debt Repayment**
- **Debt Tracking** - Comprehensive debt management system
- **Repayment Strategies** - Snowball and avalanche methods
- **Payment Scheduling** - Automated payment reminders
- **Progress Visualization** - Interactive charts and progress tracking

### 🛡️ **Insurance Services**
- **Policy Management** - View and manage insurance policies
- **Quick Activation** - One-click policy activation
- **Claims Tracking** - Monitor claim status and history
- **Premium Reminders** - Automated payment notifications

### 📚 **Financial Education**
- **AI-Powered Learning** - Personalized financial education content
- **Video Tutorials** - Expert-led financial literacy courses
- **Interactive Modules** - Hands-on learning experiences
- **Progress Tracking** - Monitor learning achievements

### 📰 **Financial News**
- **Curated Content** - Latest financial news and updates
- **Personalized Feed** - AI-recommended articles
- **Bookmark System** - Save articles for later reading
- **Multi-language Support** - News in user's preferred language

## 🛠️ Technology Stack

### **Frontend**
- **React 18.3.1** - Modern UI library with hooks and context
- **TypeScript** - Type-safe development
- **Vite 5.4.19** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful and accessible component library

### **State Management**
- **React Context API** - Global state management
- **React Query** - Server state management and caching
- **Local Storage** - Persistent data storage

### **Internationalization**
- **i18next** - Internationalization framework
- **react-i18next** - React integration for i18n
- **Language Detection** - Automatic language detection

### **UI Components**
- **Radix UI** - Headless UI components
- **Lucide React** - Beautiful icon library
- **Sonner** - Toast notifications
- **React Router DOM** - Client-side routing

### **Development Tools**
- **ESLint** - Code linting and formatting
- **PostCSS** - CSS processing
- **Hot Module Replacement** - Fast development experience

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **npm** or **yarn** - Package manager
- **Git** - Version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/aryamansingh04/FinBridge.git
   cd FinBridge
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000` to view the application.

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint

# Production
npm run build:dev    # Build in development mode
```

## 📱 Application Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── DashboardHeader.tsx
│   ├── ProfileDropdown.tsx
│   └── ...
├── contexts/           # React Context providers
│   ├── WalletContext.tsx
│   ├── NotificationContext.tsx
│   ├── PasscodeContext.tsx
│   └── DebtContext.tsx
├── hooks/              # Custom React hooks
├── i18n/               # Internationalization
│   ├── index.ts
│   └── locales/        # Language files
├── lib/                # Utility functions
├── pages/              # Application pages
│   ├── Dashboard.tsx
│   ├── DigitalWallet.tsx
│   ├── Transactions.tsx
│   └── ...
└── assets/             # Static assets
```

## 🌐 Language Support

FinBridge supports 14 languages with complete UI translation:

| Language | Code | Status |
|----------|------|--------|
| English | `en` | ✅ Complete |
| Hindi | `hi` | ✅ Complete |
| Bengali | `bn` | ✅ Complete |
| Telugu | `te` | ✅ Complete |
| Tamil | `ta` | ✅ Complete |
| Marathi | `mr` | ✅ Complete |
| Gujarati | `gu` | ✅ Complete |
| Kannada | `kn` | ✅ Complete |
| Malayalam | `ml` | ✅ Complete |
| Punjabi | `pa` | ✅ Complete |
| Assamese | `as` | ✅ Complete |
| Odia | `or` | ✅ Complete |
| Nepali | `ne` | ✅ Complete |
| Urdu | `ur` | ✅ Complete |

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
VITE_APP_NAME=FinBridge
VITE_APP_VERSION=1.0.0
VITE_API_URL=your_api_url_here
```

### Vite Configuration
The project uses Vite with the following configuration:
- **Port**: 3000 (development)
- **Host**: All interfaces (::)
- **HMR**: Hot Module Replacement enabled
- **Aliases**: `@` points to `src/` directory

## 📊 Features in Detail

### 🏠 Dashboard
- **Financial Overview** - Complete financial health summary
- **Recent Transactions** - Latest financial activities
- **Upcoming Payments** - Payment calendar and reminders
- **Quick Actions** - Fast access to common tasks
- **AI Insights** - Personalized financial recommendations

### 💳 Digital Wallet
- **Secure Access** - 6-digit passcode protection
- **Balance Management** - Real-time balance tracking
- **Transaction History** - Complete transaction records
- **Goal Setting** - Savings goals with progress tracking
- **Notifications** - Real-time alerts and updates

### 📈 Financial Tools
- **Loan Calculator** - EMI calculation and planning
- **Debt Tracker** - Comprehensive debt management
- **Savings Planner** - Goal-based savings strategies
- **Budget Tracker** - Income and expense management
- **Credit Score** - Financial health assessment

## 🤝 Contributing

We welcome contributions to FinBridge! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Use meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Follow the existing code style

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** - For the amazing React framework
- **Vite Team** - For the fast build tool
- **Tailwind CSS** - For the utility-first CSS framework
- **shadcn/ui** - For the beautiful component library
- **i18next** - For internationalization support

## 📞 Support

For support, email support@finbridge.in or join our community discussions.

## 🔗 Links

- **Repository**: [https://github.com/aryamansingh04/FinBridge](https://github.com/aryamansingh04/FinBridge)
- **Documentation**: [Coming Soon]
- **Live Demo**: [Coming Soon]
- **Issues**: [GitHub Issues](https://github.com/aryamansingh04/FinBridge/issues)

---

<div align="center">
  <strong>Built with ❤️ for financial inclusion in India</strong>
</div>