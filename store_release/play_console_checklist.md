# Google Play Console Submission Checklist

Follow this checklist step-by-step to submit **Mukhtar Printing & Store** (`com.mukhtarprinting.umarzai`) to Google Play:

## Phase 1: Google Play Console Account Setup
- [ ] Sign in to Google Play Console with your developer account ($25 one-time registration).
- [ ] Click **Create App**:
  - App Name: `Mukhtar Printing & Store`
  - Default Language: `English (United States)` or `English (Pakistan)`
  - App or Game: `App`
  - Free or Paid: `Free`
  - Accept Developer Program Policies and US export laws.

## Phase 2: App Content & Policy Disclosures
- [ ] **Privacy Policy**: Enter the hosted URL or link to the in-app privacy policy markdown.
- [ ] **App Access**: Select "All functionality is available without special access restrictions" or provide demo login (Phone: 03149958963).
- [ ] **Ads**: Select "No, my app does not contain ads".
- [ ] **Content Rating**:
  - Fill out questionnaire (Utility / Shopping category).
  - Confirm Everyone / PEGI 3 rating certificate.
- [ ] **Target Audience & Content**:
  - Target age: 18 and over (or 13+).
  - Unintentional appeal to children: No.
- [ ] **News Apps**: Select "No".
- [ ] **COVID-19 Contact Tracing**: Select "No".
- [ ] **Data Safety**:
  - Disclose collection of Name, Phone Number, Address for App Functionality.
  - Disclose User Content (Photos/Documents uploaded for printing).
  - Mark data encrypted in transit (Yes).
  - Mark data deletion mechanism available (Yes).
- [ ] **Government Apps**: Select "No".
- [ ] **Financial Features**: Select "None" (app offers manual local payment references like JazzCash/EasyPaisa/COD, not lending/banking).

## Phase 3: Store Presence & Graphics
- [ ] **App Category**: `Shopping`.
- [ ] **Store Contact Information**:
  - Email: `mukhtar.umarzai@gmail.com`
  - Phone: `+923149958963`
- [ ] **App Icon**: Upload 512 × 512 px PNG (32-bit color with alpha).
- [ ] **Feature Graphic**: Upload 1024 × 500 px PNG / JPEG.
- [ ] **Phone Screenshots**: Upload at least 6 screenshots (from `screenshot_plan.md`).
- [ ] **Short Description**: `Order printing, flex, cards, stamps, toner, ink & more in Umarzai.`
- [ ] **Full Description**: Paste text from `play_store_listing.md`.

## Phase 4: Production Release & Signing
- [ ] Run release build:
  ```bash
  flutter clean
  flutter pub get
  flutter build appbundle --release
  ```
- [ ] Locate release file: `build/app/outputs/bundle/release/app-release.aab`.
- [ ] In Play Console, go to **Release** > **Production** > **Create new release**.
- [ ] Upload `app-release.aab`.
- [ ] Release Name: `1.0.0 (1)`.
- [ ] Release Notes (en-US):
  ```text
  Initial release of Mukhtar Printing & Store!
  - Browse genuine toner, ink, paper, and computer supplies.
  - Order 25+ printing services (flex banners, cards, stamps, photocopy).
  - Live price calculation for custom banners & documents.
  - Track orders with real-time progress updates.
  - Direct WhatsApp & phone support with Mukhtar Ahmed in Umarzai.
  ```
- [ ] Click **Review Release** and **Start Rollout to Production**.
