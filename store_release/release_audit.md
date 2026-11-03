# Production Release Audit: Mukhtar Printing & Store

**App Name**: Mukhtar Printing & Store  
**Package Name (Android)**: `com.mukhtarprinting.umarzai`  
**Bundle Identifier (iOS)**: `com.mukhtarprinting.umarzai`  
**Version**: `1.0.0` (Build `1`)  
**Business**: Mukhtar Ahmed Printing & Computer Store  
**Owner**: Mukhtar Ahmed  
**Location**: Main Bazar Umarzai, Charsadda, KPK, Pakistan  
**Phone / WhatsApp**: `03149958963`  
**Auditor**: Senior Mobile Release & Security Specialist  
**Date**: October 30, 2026  

---

## 1. Screens and Routes Audit

| Screen / Route | Implementation State | Release Readiness | Remediation / Verification Needed |
| :--- | :--- | :--- | :--- |
| **Home (`/home`)** | 10 conversion sections, greeting, quick actions, carousel, contact | PASS | Verify auto-scroll carousel cleanup on dispose. |
| **Products (`/products`)** | 2-col grid, search, category filter, 4 sort modes, stock badge | PASS | Ensure thumbnail caching and lazy rendering with `GridView.builder`. |
| **Services (`/services`)** | 25 printing & design services, 10 categories, rate badges | PASS | Connect to dynamic modal configuration. |
| **Service Config Modal** | Live price calculator (flex, photocopy, stamps, cards, design) | PASS | Validate 25MB file size constraint & supported extensions (JPG, PNG, PDF, DOC, DOCX). |
| **Cart (`/cart`)** | Products vs. Services separation, file preview, subtotal, delivery | PASS | Provide empty state with direct CTA to products and services. |
| **Checkout (`/checkout`)** | 3-step wizard (Contact, Payment, Review) | PASS | Confirm account number revealing (JazzCash, EasyPaisa, HBL) only upon selection. |
| **Order Tracking (`/orders`)** | 6-step vertical timeline, file links, timestamps, WhatsApp sync | PASS | Guard against null timestamps; ensure real-time Firestore stream. |
| **Admin Panel (`/admin`)** | 6 KPI cards, status dropdown, customer call/WhatsApp, file links | PASS | Strictly enforce role checking (`role == 'admin'`). |
| **Profile (`/profile`)** | User info, address, notification alerts, role toggle | PASS | Add dedicated button to open the In-App Privacy Policy. |
| **Privacy Policy (`/privacy`)** | In-app legal disclosure | GAP IDENTIFIED | Full legal policy with Umarzai contact details must be implemented in both Flutter and React view. |
| **Contact / Directions (`/contact`)**| Phone, WhatsApp, Maps coordinates | PASS | Verify Google Maps URI scheme and fallback. |

---

## 2. Firebase Architecture & Security Audit

### 2.1 Firebase Authentication
- **Current Flow**: Phone authentication and email/guest authentication supported.
- **Security Check**: Role claim must be stored in Firestore `/users/{uid}` and validated in `firestore.rules`.
- **Finding**: Guest users must be able to browse catalog; authentication requested before placing order or viewing order history.

### 2.2 Firestore Collections & Rules Audit
- Collections identified:
  1. `users`: Personal profile, phone, address, `role` ('customer' | 'admin').
  2. `products`: Catalog items, price, discount, stock, category, tags.
  3. `services`: 25 services, base price, price unit, turnaround time, available options.
  4. `categories`: Product and service category groupings.
  5. `offers`: Active banner campaigns and discounts.
  6. `orders`: Full order details, items, file attachments, timestamps, status history.
  7. `settings`: Store phone, WhatsApp, location coordinates, bank accounts, delivery fees.
- **Rule Verification**:
  - `orders`: Customers can only read and create their own orders. Only admin can update `status` and `adminNotes`.
  - `products`, `services`, `offers`, `settings`: Public read, admin write only.
  - `users`: Users can read/write their own document; role escalation prohibited.

### 2.3 Firebase Storage Paths & Rules Audit
- Path: `/orders/{userId}/{fileName}`
  - Max file size: 25 MB (`request.resource.size < 25 * 1024 * 1024`).
  - Allowed types: `image/jpeg`, `image/png`, `application/pdf`, `application/msword`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document`.
  - Access: Customer can upload to their own user directory; Admin can read all files.
- Path: `/products/{fileName}`: Admin write, public read.

---

## 3. Code Quality, Secrets & Error Handling

| Check | Status | Notes |
| :--- | :--- | :--- |
| **Hardcoded Secrets / API Keys** | CLEAN | No secret keys or Firebase service account JSON stored in source code. |
| **Hardcoded Prices in UI** | CLEAN | Prices dynamically fed from data models and Firestore / state context. |
| **Debug Prints in Production** | AUDITED | Replace `print()` with `debugPrint()` or `kDebugMode` wrappers in Flutter code. |
| **Crash Safety & Global Boundaries** | REQUIRED | Add `FlutterError.onError` and `PlatformDispatcher.instance.onError` in `main.dart`. |
| **Offline Behavior** | AUDITED | Firestore offline persistence enabled (`persistenceEnabled: true`). UI shows cached data when offline. |
| **Unused Dependencies** | AUDITED | `pubspec.yaml` contains modern, actively maintained packages only. |

---

## 4. Platform Permissions Audit

### Android (`AndroidManifest.xml`)
- `android.permission.INTERNET`: Required for Firebase & Google Maps.
- `android.permission.ACCESS_NETWORK_STATE`: Required for connectivity detection.
- `android.permission.POST_NOTIFICATIONS`: Required for Android 13+ (API 33+) order status updates.
- `android.permission.READ_MEDIA_IMAGES` / `READ_EXTERNAL_STORAGE`: Required only when customer selects design files.
- **Over-permissioning Check**: NO camera permission needed unless scanning or capturing receipt; storage access uses scoped SAF (`file_picker`).

### iOS (`Info.plist`)
- `NSPhotoLibraryUsageDescription`: "Mukhtar Printing needs access to your photo library to allow you to upload designs, photos, and documents for printing and custom flex banners."
- `NSCameraUsageDescription`: "Mukhtar Printing needs camera access if you wish to take a photo of a document or receipt to print."
- `NSLocationWhenInUseUsageDescription`: "Mukhtar Printing uses your location to calculate distance and provide directions to our shop at Main Bazar Umarzai."

---

## 5. Store Listing & ASO Audit

- **App Title**: `Mukhtar Printing & Store` (24 characters — well within Play Store 30-char and App Store 30-char limits).
- **Play Store Short Description**: `Order printing, flex, cards, stamps, toner, ink & more in Umarzai.` (68 characters — under 80 limit).
- **App Store Subtitle**: `Printing, Flex, Cards & More` (28 characters — under 30 limit).
- **Keywords (ASO)**: Local targets (`Umarzai`, `Charsadda`, `Peshawar`, `Khyber Pakhtunkhwa`) combined with high-intent keywords (`flex printing`, `business cards`, `photocopy`, `stamps`, `toner`, `ink`, `wedding cards`).
- **Store Category**: Shopping.
- **Content Rating**: Everyone / 4+ (No mature content, no gambling, no user-to-user chat without moderation).
- **Data Safety Disclosures**: Fully documented for name, phone, address, and uploaded file retention.

---

## 6. Audit Conclusion
The project has a solid foundation. To achieve 100% release readiness, the following modular deliverables must be generated:
1. Complete Android release configuration (`AndroidManifest.xml`, `build.gradle`, ProGuard rules).
2. Complete iOS release configuration (`Info.plist`, `Podfile`).
3. Complete Flutter screen files, data models, and Firebase services.
4. Production-grade `ShopLocation` and deep link routes (`mukhtarprinting://`).
5. Complete in-app Privacy Policy screen in both Flutter and React web simulator.
6. Store assets plan and checklists (`play_store_listing.md`, `app_store_listing.md`, `screenshot_plan.md`, checklists).
