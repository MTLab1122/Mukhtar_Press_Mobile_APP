# Apple App Store Connect Submission Checklist

Follow this checklist step-by-step to submit **Mukhtar Printing & Store** (`com.mukhtarprinting.umarzai`) to the Apple App Store:

## Phase 1: Apple Developer Account & App Record
- [ ] Sign in to [App Store Connect](https://appstoreconnect.apple.com/) with an active Apple Developer Program membership ($99/year).
- [ ] Go to **Apps** > Click **+ (New App)**:
  - Platforms: `iOS`
  - Name: `Mukhtar Printing & Store`
  - Primary Language: `English (U.S.)`
  - Bundle ID: Select `com.mukhtarprinting.umarzai`
  - SKU: `MUKHTAR-PRINT-01`
  - User Access: `Full Access`

## Phase 2: App Store Metadata
- [ ] **Subtitle**: `Printing, Flex, Cards & More`
- [ ] **Category**: Primary: `Shopping` | Secondary: `Business`
- [ ] **Keywords**: `printing,flex,banner,business cards,wedding cards,photocopy,stamp,toner,ink,paper,poster,Umarzai,Charsadda`
- [ ] **Support URL**: Direct link to store support or WhatsApp link (`https://wa.me/923149958963`).
- [ ] **Marketing URL**: Shop profile or location link.
- [ ] **Description**: Copy full text from `app_store_listing.md`.

## Phase 3: Media & Screenshots
- [ ] **6.7" iPhone Display** (1290 × 2796 px or 1284 × 2778 px): Upload at least 6 screenshots.
- [ ] **6.5" iPhone Display** (1242 × 2688 px): Upload matching screenshots.
- [ ] **App Icon**: Ensure `1024 × 1024 px` PNG (no alpha / no rounded corners — iOS automatically clips to superellipse).

## Phase 4: App Privacy Questionnaire
- [ ] Go to **App Privacy** in App Store Connect.
- [ ] Under Data Types collected:
  - **Contact Info**: Name, Phone Number, Physical Address (used for App Functionality / Product Delivery).
  - **User Content**: Photos or Documents (uploaded voluntarily for printing).
  - **Identifiers**: User ID (for account authentication and order management).
- [ ] Confirm that collected data is **NOT** used for cross-app tracking.

## Phase 5: iOS Build & Upload
- [ ] On a Mac running Xcode:
  ```bash
  flutter clean
  flutter pub get
  cd ios
  pod install
  cd ..
  flutter build ipa --release
  ```
- [ ] Upload using **Transporter app** or Xcode Organizer (`Product` > `Archive` > `Distribute App` > `App Store Connect`).
- [ ] Wait for processing (usually 5–15 minutes).
- [ ] Select the uploaded build under **Build** in App Store Connect.

## Phase 6: App Review Information & Submission
- [ ] **Sign-In Information**:
  - Check "Sign-in required" or indicate guest mode is supported.
  - Test Account Phone: `03149958963`
  - Verification Code: `123456`
- [ ] **Contact Info**:
  - First Name: `Mukhtar`
  - Last Name: `Ahmed`
  - Phone: `+923149958963`
  - Email: `mukhtar.umarzai@gmail.com`
- [ ] **Review Notes**: Paste notes from `app_store_listing.md`.
- [ ] Click **Submit for Review**.
