import React, { useState } from 'react';
import { 
  Code2, 
  Copy, 
  Check, 
  FolderTree, 
  Layers, 
  Palette, 
  CheckSquare, 
  Download 
} from 'lucide-react';

export const FlutterCodeTab: React.FC = () => {
  const [activeCodeTab, setActiveCodeTab] = useState<
    'overview' | 'splash_screen' | 'animated_reveal' | 'shop_location' | 'android_manifest' | 'ios_plist' | 'privacy_policy' | 'play_store' | 'app_store' | 'app_colors' | 'app_theme'
  >('overview');
  const [copied, setCopied] = useState(false);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const splashScreenDart = `import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';
import '../../core/constants/shop_location.dart';

/// Premium animated splash/opening experience following the 6-step sequence:
/// Step 1 (0-700ms): Logo entrance (scale 0.6->1.0, opacity 0->1, easeOutBack)
/// Step 2 (500-1000ms): App Name fade in & slide up
/// Step 3 (900-1400ms): Tagline fade in & slide up
/// Step 4 (1300-1700ms): Animated loading dots fade in
/// Step 5 (1600-2200ms): Staggered component reveal (Home, Products, Services, Cart, Profile)
/// Step 6 (2400ms): Navigate smoothly to Home/Login
class SplashScreen extends StatefulWidget {
  final VoidCallback onComplete;
  const SplashScreen({super.key, required this.onComplete});
  @override
  State<SplashScreen> createState() => _SplashScreenState();
}`;

  const animatedRevealDart = `import 'package:flutter/material.dart';

/// Reusable entrance animation widget for cards, sections, and items.
/// Provides smooth fade-in, slide-up, and optional scale with configurable delay and duration.
class AnimatedReveal extends StatefulWidget {
  final Widget child;
  final int delay; // Delay in milliseconds
  final int duration; // Duration in milliseconds
  final double slideOffset; // Vertical offset to slide up from (e.g., 0.15)
  final bool enableScale; // Whether to also smoothly scale from 0.94 -> 1.0
  final Curve curve;

  const AnimatedReveal({
    super.key,
    required this.child,
    this.delay = 0,
    this.duration = 350,
    this.slideOffset = 0.15,
    this.enableScale = false,
    this.curve = Curves.easeOutCubic,
  });
  @override
  State<AnimatedReveal> createState() => _AnimatedRevealState();
}`;

  const shopLocationDart = `/// Shop Location & Business Constants
/// Mukhtar Ahmed Printing & Computer Store - Main Bazar Umarzai
class ShopLocation {
  // Real coordinates for Main Bazar Umarzai, Charsadda, KPK, Pakistan
  static const double latitude = 34.2052;
  static const double longitude = 71.7451;

  static const String businessName = "Mukhtar Ahmed Printing & Computer Store";
  static const String appName = "Mukhtar Printing & Store";
  static const String ownerName = "Mukhtar Ahmed";
  static const String address = "Main Bazar Umarzai, Tehsil & District Charsadda, KPK, Pakistan";
  static const String phone = "03149958963";
  static const String whatsapp = "03149958963";
  static const String whatsappLink = "https://wa.me/923149958963";
  static const String googleMapsUrl = "https://www.google.com/maps/search/?api=1&query=34.2052,71.7451";
}`;

  const androidManifestXml = `<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.mukhtarprinting.umarzai">

    <uses-permission android:name="android.permission.INTERNET"/>
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE"/>
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS"/>
    <uses-permission android:name="android.permission.READ_MEDIA_IMAGES"/>

    <application
        android:label="Mukhtar Printing &amp; Store"
        android:name="\${applicationName}"
        android:icon="@mipmap/launcher_icon">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:launchMode="singleTop">

            <intent-filter>
                <action android:name="android.intent.action.MAIN"/>
                <category android:name="android.intent.category.LAUNCHER"/>
            </intent-filter>

            <!-- Custom URI Scheme: mukhtarprinting:// -->
            <intent-filter>
                <action android:name="android.intent.action.VIEW" />
                <category android:name="android.intent.category.DEFAULT" />
                <category android:name="android.intent.category.BROWSABLE" />
                <data android:scheme="mukhtarprinting" />
            </intent-filter>
        </activity>
    </application>
</manifest>`;

  const iosPlistXml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>CFBundleDisplayName</key>
	<string>Mukhtar Printing &amp; Store</string>
	<key>CFBundleIdentifier</key>
	<string>com.mukhtarprinting.umarzai</string>
	<key>CFBundleShortVersionString</key>
	<string>1.0.0</string>
	<key>CFBundleVersion</key>
	<string>1</string>

	<!-- Apple App Store Purpose Strings -->
	<key>NSPhotoLibraryUsageDescription</key>
	<string>Mukhtar Printing requires access to your photos to allow you to upload designs, certificates, banners, and documents for printing.</string>
	<key>NSCameraUsageDescription</key>
	<string>Mukhtar Printing needs camera access to let you capture physical documents or book pages for photocopy and printing.</string>
	<key>NSLocationWhenInUseUsageDescription</key>
	<string>Mukhtar Printing uses your location to provide directions and route estimates to our printing shop at Main Bazar Umarzai.</string>

	<!-- Custom URI Scheme: mukhtarprinting:// -->
	<key>CFBundleURLTypes</key>
	<array>
		<dict>
			<key>CFBundleURLSchemes</key>
			<array>
				<string>mukhtarprinting</string>
			</array>
		</dict>
	</array>
</dict>
</plist>`;

  const privacyPolicyText = `# Privacy Policy for Mukhtar Printing & Store
Effective Date: October 30, 2026
Business: Mukhtar Ahmed Printing & Computer Store
Location: Main Bazar Umarzai, Charsadda, KPK, Pakistan
Phone: 03149958963

1. Information We Collect:
- Name, Pakistani phone number, and physical delivery address (used strictly for order fulfillment).
- Files uploaded for printing (up to 25 MB): PDF, JPG, PNG, DOC, DOCX.

2. Security & Storage:
- Uploaded files are encrypted in transit via TLS and stored in Google Firebase Cloud Storage.
- Accessible only by the customer and shop owner (Mukhtar Ahmed).
- Never shared, sold, or used for advertising.

3. Account & File Deletion:
- Users can request permanent deletion of their account and uploaded files anytime by contacting Mukhtar Ahmed at 03149958963.`;

  const playStoreText = `# Google Play Store Listing
App Title: Mukhtar Printing & Store (24 chars)
Short Description: Order printing, flex, cards, stamps, toner, ink & more in Umarzai. (68 chars)
Category: Shopping
Content Rating: Everyone (3+) / PEGI 3

Full Description Highlights:
- Order printing supplies: HP & Canon toners, ink bottles, A4 paper reams.
- 25+ printing services: Panaflex banners, visiting cards, wedding cards, stamps.
- Live price calculator: Calculate square-foot banner prices and document copies.
- 25 MB file uploads: Attach PDFs and graphics directly from mobile.
- Shop pickup at Main Bazar Umarzai or doorstep delivery.
- Direct contact: Call or WhatsApp 03149958963.`;

  const appStoreText = `# Apple App Store Listing
App Name: Mukhtar Printing & Store (24 chars)
Subtitle: Printing, Flex, Cards & More (28 chars)
Primary Category: Shopping
Secondary Category: Business
Keywords: printing,flex,banner,business cards,wedding cards,photocopy,stamp,toner,ink,paper,poster,Umarzai,Charsadda

Review Notes for Apple Team:
- Business: Mukhtar Ahmed Printing & Computer Store, Main Bazar Umarzai, Pakistan.
- Demo Account: Phone: 03149958963 / Code: 123456 (or Guest Mode).
- Purpose: Physical document, banner, card, and stamp printing with in-store pickup or local delivery.`;

  const appColorsDart = `import 'package:flutter/material.dart';

class AppColors {
  static const Color primary = Color(0xFF1B3A6B); // Deep Royal Blue
  static const Color primaryDark = Color(0xFF122748);
  static const Color primaryAccent = Color(0xFFFF7A00); // Vibrant Orange
  static const Color secondary = Color(0xFF00897B); // Teal
  static const Color background = Color(0xFFF6F7FB);
  static const Color surface = Color(0xFFFFFFFF);
  static const Color darkText = Color(0xFF111827);
  static const Color mutedText = Color(0xFF6B7280);
  static const Color success = Color(0xFF16A34A);
  static const Color warning = Color(0xFFF59E0B);
  static const Color error = Color(0xFFDC2626);
}`;

  const appThemeDart = `import 'package:flutter/material.dart';
import 'app_colors.dart';

class AppTheme {
  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      colorScheme: const ColorScheme(
        brightness: Brightness.light,
        primary: AppColors.primary,
        onPrimary: Colors.white,
        secondary: AppColors.secondary,
        onSecondary: Colors.white,
        tertiary: AppColors.primaryAccent,
        onTertiary: Colors.white,
        error: AppColors.error,
        onError: Colors.white,
        surface: AppColors.surface,
        onSurface: AppColors.darkText,
      ),
      scaffoldBackgroundColor: AppColors.background,
    );
  }
}`;

  const getActiveCode = () => {
    switch (activeCodeTab) {
      case 'splash_screen':
        return splashScreenDart;
      case 'animated_reveal':
        return animatedRevealDart;
      case 'shop_location':
        return shopLocationDart;
      case 'android_manifest':
        return androidManifestXml;
      case 'ios_plist':
        return iosPlistXml;
      case 'privacy_policy':
        return privacyPolicyText;
      case 'play_store':
        return playStoreText;
      case 'app_store':
        return appStoreText;
      case 'app_colors':
        return appColorsDart;
      case 'app_theme':
        return appThemeDart;
      default:
        return splashScreenDart;
    }
  };

  return (
    <div className="space-y-4 pb-24 font-body">
      {/* Header */}
      <div className="bg-[#1B3A6B] text-white rounded-[20px] p-5 shadow-card">
        <span className="text-[#FF7A00] text-[10px] font-heading font-black uppercase tracking-wider">
          Store Release &amp; Production Architecture
        </span>
        <h1 className="font-heading text-xl sm:text-2xl font-black mt-0.5">
          Mobile App Store Readiness
        </h1>
        <p className="text-xs text-slate-200 mt-1">
          Explore complete production code, Android &amp; iOS configurations, store listings, and legal privacy policies
        </p>
      </div>

      {/* Code Navigation Tabs */}
      <div className="flex border-b border-[#E5E7EB] space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'overview', label: 'Release Architecture' },
          { id: 'splash_screen', label: 'splash_screen.dart (6-Step)' },
          { id: 'animated_reveal', label: 'animated_reveal.dart' },
          { id: 'shop_location', label: 'shop_location.dart' },
          { id: 'android_manifest', label: 'AndroidManifest.xml' },
          { id: 'ios_plist', label: 'Info.plist' },
          { id: 'privacy_policy', label: 'Privacy Policy' },
          { id: 'play_store', label: 'Play Store Listing' },
          { id: 'app_store', label: 'App Store Listing' },
          { id: 'app_colors', label: 'app_colors.dart' },
          { id: 'app_theme', label: 'app_theme.dart' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveCodeTab(tab.id as any)}
            className={`px-3 py-1.5 rounded-[12px] text-xs font-heading font-semibold whitespace-nowrap transition-all ${
              activeCodeTab === tab.id
                ? 'bg-[#1B3A6B] text-white shadow-xs'
                : 'bg-white border border-[#E5E7EB] text-[#6B7280] hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* OVERVIEW TAB */}
      {activeCodeTab === 'overview' && (
        <div className="bg-white border border-[#E5E7EB] rounded-[20px] p-5 shadow-card space-y-4">
          <h2 className="font-heading text-sm font-bold text-[#111827] flex items-center space-x-2">
            <FolderTree className="w-4 h-4 text-[#1B3A6B]" />
            <span>Store Release &amp; Architecture Structure</span>
          </h2>

          <div className="bg-[#122748] text-emerald-400 p-4 rounded-[16px] font-mono text-xs overflow-x-auto">
            <pre>{`flutter_app/
├── android/
│   ├── app/
│   │   ├── build.gradle              # Application ID: com.mukhtarprinting.umarzai (Target SDK 34)
│   │   ├── proguard-rules.pro        # R8 / ProGuard rules for release build optimization
│   │   └── src/main/AndroidManifest.xml # Permissions & mukhtarprinting:// deep links
├── ios/
│   ├── Runner/Info.plist             # iOS Bundle ID, deep links, permission purpose strings
│   └── Podfile                       # iOS deployment target 13.0+
├── lib/
│   ├── core/
│   │   ├── constants/
│   │   │   ├── shop_location.dart    # Umarzai coordinates (34.2052° N, 71.7451° E) & WhatsApp
│   │   │   └── deep_links.dart       # mukhtarprinting:// router
│   │   ├── theme/
│   │   │   ├── app_colors.dart       # #1B3A6B, #FF7A00, #00897B
│   │   │   └── app_theme.dart        # Material 3 ColorScheme & typography
│   │   └── widgets/                  # 15 modular design system widgets
│   ├── data/models/                  # Product, Service, Order models
│   ├── features/
│   │   └── privacy/                  # In-app Privacy Policy screen
│   └── main.dart                     # Global Crash Safety boundary & route config
└── store_release/
    ├── release_audit.md              # Full release audit
    ├── play_store_listing.md         # Play Store title, short/full description, data safety
    ├── app_store_listing.md          # App Store subtitle, keywords, review notes
    ├── screenshot_plan.md            # 8 official phone screenshots plan
    └── privacy_policy.md             # Complete legal privacy policy`}</pre>
          </div>
        </div>
      )}

      {/* CODE VIEWER */}
      {activeCodeTab !== 'overview' && (
        <div className="bg-[#122748] rounded-[20px] overflow-hidden shadow-card border border-[#264E8C]">
          <div className="bg-[#1B3A6B] px-4 py-3 flex items-center justify-between border-b border-[#264E8C]">
            <span className="text-xs font-mono text-amber-300">
              {activeCodeTab}
            </span>

            <button
              onClick={() => copyCode(getActiveCode())}
              className="flex items-center space-x-1.5 bg-white/10 hover:bg-white/20 text-white text-xs px-3 py-1.5 rounded-[10px] transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#16A34A]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy File Content'}</span>
            </button>
          </div>

          <pre className="p-4 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed max-h-[480px]">
            {getActiveCode()}
          </pre>
        </div>
      )}
    </div>
  );
};
