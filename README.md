# Mukhtar Printing & Computer Store — E-Commerce & Production Platform

[![Platform](https://img.shields.io/badge/Platform-Flutter_%7C_Android_%7C_iOS_%7C_Web-02569B?style=flat-square&logo=flutter&logoColor=white)](https://flutter.dev)
[![Language](https://img.shields.io/badge/Language-Dart_%26_TypeScript-0175C2?style=flat-square&logo=dart&logoColor=white)](https://dart.dev)
[![Web Showcase](https://img.shields.io/badge/Web_Showcase-React_19_%2B_Vite-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![Styling](https://img.shields.io/badge/Styling-Tailwind_CSS_v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Backend](https://img.shields.io/badge/Backend-Firebase_Firestore-FFCA28?style=flat-square&logo=firebase&logoColor=black)](https://firebase.google.com)
[![Test Suite](https://img.shields.io/badge/Tests-10%20Passed-brightgreen?style=flat-square)](#testing--verification)

**Mukhtar Printing & Computer Store** (Main Bazar, Umarzai, Charsadda) is a full-featured commercial print management and e-commerce ecosystem. It bridges physical commercial printing operations with modern digital ordering via a cross-platform **Flutter mobile app**, an interactive **React 19 / Vite web showcase**, and production **Firebase** backend security rules.

---

## Problem & Solution

Traditional local printing press businesses rely on physical visits, unstandardized pricing, paper ledger tracking, and delayed order estimates. This platform digitizes the entire commercial print workflow:
- **Instant Price Estimations**: Algorithmic calculators for outdoor flex banners (per square foot), high-volume document printing, lamination, and visiting cards.
- **Digital Artwork & File Uploads**: Cloud-backed file submission directly with order specifications.
- **Multi-Channel Ordering**: Customers can order stationery, computer accessories, and printing services with home delivery or shop pickup.
- **Dual Architecture**: Native performance on Android & iOS via Flutter, paired with a web emulator and management dashboard built in React & Vite.

---

## Core System Architecture

The repository is organized into three major production components:

```
Mukhtar_Press_Mobile_APP/
├── flutter_app/                       # Native Flutter Mobile Application
│   ├── android/                       # Android native build files & Gradle configuration
│   ├── ios/                           # iOS native Xcode Runner project
│   ├── lib/
│   │   ├── core/                      # Constants, app theme & utility helpers
│   │   ├── data/                      # Data models & Firebase repositories
│   │   ├── features/                  # UI screens (Home, Catalog, Calculator, Orders, Profile)
│   │   └── main.dart                  # Flutter entry point
│   ├── firestore.rules                # Production Cloud Firestore Security Rules
│   ├── storage.rules                  # Production Firebase Cloud Storage Rules
│   └── pubspec.yaml                   # Flutter dependencies & assets
├── src/                               # Interactive React 19 + Vite Web Application
│   ├── components/                    # HomeTab, ServicesTab, ProductsTab, CartTab, AdminPanel
│   ├── context/                       # Global AppContext & cart state management
│   ├── data/                          # Initial catalog, pricing tiers & service categories
│   ├── theme/                         # Design system tokens & animations
│   ├── utils/
│   │   ├── priceCalculator.ts         # Pure TypeScript pricing calculation engine
│   │   └── priceCalculator.test.ts    # 10 comprehensive unit tests
│   ├── App.tsx                        # Root layout & tab router
│   └── main.tsx                       # Web entry point
├── store_release/                     # App Store & Play Store Release Package
│   ├── play_store_listing.md          # Google Play title, short/full descriptions, keywords
│   ├── app_store_listing.md           # Apple App Store metadata & release notes
│   ├── play_console_checklist.md      # Launch verification checklist
│   ├── privacy_policy.md              # Complete legal privacy policy
│   └── screenshot_plan.md             # Store visual asset blueprint
└── package.json                       # Web showcase build & test scripts
```

---

## Key Features & Capabilities

### 1. Algorithmic Price Calculation Engine (`priceCalculator.ts`)
- **Flex & Banner Printing**: Calculates dynamic pricing by dimensions ($W \times H$ sq.ft), per-sqft rates (standard Rs. 35/sqft), and quantity multipliers.
- **Document & Page Printing**: Custom calculations for black-and-white vs. full-color, page counts, multi-copy multipliers, and optional thermal lamination (Rs. 25/page).
- **Custom Design Services**: Configurable base prices with modular add-ons (urgent 2-hour rush delivery, source CDR/PSD file delivery).
- **Cart & Delivery Optimization**: Free delivery threshold verification (e.g., free above Rs. 3,000) and shop pickup fee elimination.
- **Pakistani Phone Validation**: Validates all standard Pakistani mobile formats (`03XX`, `+923XX`, dashed).

### 2. Stationery & Computer Store Catalog
- Full e-commerce catalog featuring toners, paper reams, printers, keyboards, USB flash drives, and computer accessories.
- Real-time stock status, sale prices, and instant cart additions.

### 3. Order Tracking & Shop Administration
- Unique year-padded order numbering (`MA-2026-0001`).
- Real-time status progression (`RECEIVED` $\rightarrow$ `IN_DESIGN` $\rightarrow$ `PRINTING` $\rightarrow$ `READY` $\rightarrow$ `COMPLETED`).
- Admin panel for shopkeepers to update order states and inventory.

---

## Technology Stack

| Component | Technologies |
| :--- | :--- |
| **Mobile App** | Flutter 3.x, Dart 3.x, Provider |
| **Backend & Cloud** | Firebase Cloud Firestore, Firebase Storage |
| **Web Showcase** | React 19, TypeScript, Vite, Tailwind CSS v4 |
| **Icons & Motion** | Lucide React, Motion (Framer Motion) |
| **Unit Testing** | Node.js Test Runner (`node:test`), TypeScript execution via `tsx` |
| **Package Management**| Bun / npm |

---

## Getting Started

### Option A: Running the Web Showcase & Emulator
```bash
# Navigate to repository root
cd Mukhtar_Press_Mobile_APP

# Install dependencies
npm install

# Start Vite development server
npm run dev
# Server runs on: http://localhost:3000
```

### Option B: Running the Flutter Mobile App
```bash
# Navigate into the flutter application directory
cd Mukhtar_Press_Mobile_APP/flutter_app

# Fetch Flutter dependencies
flutter pub get

# Run on connected Android / iOS device or emulator
flutter run
```

---

## Testing & Verification

The pricing engine and checkout rules are covered by automated unit tests using Node's native test runner:

```bash
# Execute unit test suite
npx tsx --test src/utils/priceCalculator.test.ts
```

### Test Results
```
✔ calculateFlexBannerPrice calculates standard 4x3 banner at Rs. 35/sqft for 2 pieces
✔ calculateFlexBannerPrice handles single piece and zero dimensions gracefully
✔ calculatePagePrintingPrice calculates 20 pages B&W at Rs. 10 for 2 copies
✔ calculatePagePrintingPrice handles color printing and lamination correctly
✔ calculateDesignPrice adds addons correctly
✔ calculateProductPrice applies discount price when available
✔ calculateCartTotals calculates subtotal, free delivery threshold and delivery charge
✔ isValidPakistaniPhone validates standard Pakistani mobile numbers
✔ generateOrderNumber generates clean year-padded format
✔ formatPKR formats currency cleanly
ℹ tests 10 | pass 10 | fail 0
```

---

## Author & Contact

**Muhammad Talha**
- **GitHub**: [@MTLab1122](https://github.com/MTLab1122)
- **LinkedIn**: [Muhammad Talha](https://www.linkedin.com/in/mtlabs1122/)
- **Email**: [muhammadtalhapro1@gmail.com](mailto:muhammadtalhapro1@gmail.com)
- **Portfolio**: [talha-portfolio-gules.vercel.app](https://talha-portfolio-gules.vercel.app/)

---

## License

This project is licensed under the [MIT License](LICENSE) — see repository for details.
