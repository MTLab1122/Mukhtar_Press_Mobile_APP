import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'core/theme/app_theme.dart';
import 'core/theme/app_colors.dart';
import 'core/constants/shop_location.dart';
import 'core/widgets/bottom_nav_bar.dart';
import 'features/splash/splash_screen.dart';
import 'features/home/home_screen.dart';
import 'features/products/products_screen.dart';
import 'features/services/services_screen.dart';
import 'features/cart/cart_screen.dart';
import 'features/orders/orders_screen.dart';
import 'features/profile/profile_screen.dart';
import 'features/admin/admin_screen.dart';
import 'features/auth/auth_screen.dart';
import 'features/privacy/privacy_policy_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Global Crash Boundary: Catch and log Flutter errors gracefully
  FlutterError.onError = (FlutterErrorDetails details) {
    FlutterError.presentError(details);
  };

  PlatformDispatcher.instance.onError = (error, stack) {
    return true;
  };

  runApp(
    const ProviderScope(
      child: MukhtarPrintingApp(),
    ),
  );
}

class MukhtarPrintingApp extends StatelessWidget {
  const MukhtarPrintingApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Mukhtar Printing & Store',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      routes: {
        '/privacy': (context) => const PrivacyPolicyScreen(),
        '/home': (context) => const MainNavigationScreen(),
        '/auth': (context) => AuthScreen(
              onLoginSuccess: () {
                Navigator.pushReplacementNamed(context, '/home');
              },
            ),
      },
      home: const SplashContainer(),
    );
  }
}

class SplashContainer extends StatefulWidget {
  const SplashContainer({super.key});

  @override
  State<SplashContainer> createState() => _SplashContainerState();
}

class _SplashContainerState extends State<SplashContainer> {
  bool _showMain = false;

  @override
  Widget build(BuildContext context) {
    return AnimatedSwitcher(
      duration: const Duration(milliseconds: 400),
      switchInCurve: Curves.easeInOut,
      switchOutCurve: Curves.easeInOut,
      child: _showMain
          ? const MainNavigationScreen(key: ValueKey('main_nav'))
          : SplashScreen(
              key: const ValueKey('splash_screen'),
              onComplete: () {
                if (mounted) {
                  setState(() => _showMain = true);
                }
              },
            ),
    );
  }
}

class MainNavigationScreen extends StatefulWidget {
  const MainNavigationScreen({super.key});

  @override
  State<MainNavigationScreen> createState() => _MainNavigationScreenState();
}

class _MainNavigationScreenState extends State<MainNavigationScreen> {
  int _currentIndex = 0;
  int _cartCount = 2;

  void _navigateToTab(int index) {
    setState(() => _currentIndex = index);
  }

  @override
  Widget build(BuildContext context) {
    final List<Widget> screens = [
      HomeScreen(
        onNavigateTab: _navigateToTab,
      ),
      ProductsScreen(
        onCartPressed: () => _navigateToTab(3),
      ),
      ServicesScreen(
        onCartPressed: () => _navigateToTab(3),
      ),
      CartScreen(
        onBrowsePressed: () => _navigateToTab(1),
      ),
      const OrdersScreen(),
    ];

    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: screens,
      ),
      bottomNavigationBar: CustomBottomNavBar(
        currentIndex: _currentIndex,
        onTap: _navigateToTab,
        cartItemCount: _cartCount,
      ),
    );
  }
}
