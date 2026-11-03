import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_radius.dart';
import '../../core/theme/app_shadows.dart';
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
}

class _SplashScreenState extends State<SplashScreen>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;

  // Step 1: Logo
  late Animation<double> _logoScale;
  late Animation<double> _logoOpacity;

  // Step 2: App Name
  late Animation<double> _nameOpacity;
  late Animation<Offset> _nameSlide;

  // Step 3: Tagline
  late Animation<double> _taglineOpacity;
  late Animation<Offset> _taglineSlide;

  // Step 4: Loading Indicator
  late Animation<double> _loadingOpacity;

  // Step 5: Component Reveal items
  late Animation<double> _compRevealOpacity;
  late Animation<Offset> _compRevealSlide;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 2400),
    );

    // Total duration: 2400ms
    // Step 1: 0 - 700ms => interval [0.0, 700/2400 = 0.291]
    _logoScale = Tween<double>(begin: 0.6, end: 1.0).animate(
      CurvedAnimation(
        parent: _controller,
        curve: const Interval(0.0, 0.291, curve: Curves.easeOutBack),
      ),
    );
    _logoOpacity = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _controller,
        curve: const Interval(0.0, 0.25, curve: Curves.easeOut),
      ),
    );

    // Step 2: 500 - 1000ms => interval [500/2400 = 0.208, 1000/2400 = 0.416]
    _nameOpacity = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _controller,
        curve: const Interval(0.208, 0.416, curve: Curves.easeOut),
      ),
    );
    _nameSlide = Tween<Offset>(
      begin: const Offset(0, 0.35),
      end: Offset.zero,
    ).animate(
      CurvedAnimation(
        parent: _controller,
        curve: const Interval(0.208, 0.416, curve: Curves.easeOutCubic),
      ),
    );

    // Step 3: 900 - 1400ms => interval [900/2400 = 0.375, 1400/2400 = 0.583]
    _taglineOpacity = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _controller,
        curve: const Interval(0.375, 0.583, curve: Curves.easeOut),
      ),
    );
    _taglineSlide = Tween<Offset>(
      begin: const Offset(0, 0.35),
      end: Offset.zero,
    ).animate(
      CurvedAnimation(
        parent: _controller,
        curve: const Interval(0.375, 0.583, curve: Curves.easeOutCubic),
      ),
    );

    // Step 4: 1300 - 1700ms => interval [1300/2400 = 0.541, 1700/2400 = 0.708]
    _loadingOpacity = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _controller,
        curve: const Interval(0.541, 0.708, curve: Curves.easeIn),
      ),
    );

    // Step 5: 1600 - 2200ms => interval [1600/2400 = 0.666, 2200/2400 = 0.916]
    _compRevealOpacity = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _controller,
        curve: const Interval(0.666, 0.916, curve: Curves.easeOut),
      ),
    );
    _compRevealSlide = Tween<Offset>(
      begin: const Offset(0, 0.25),
      end: Offset.zero,
    ).animate(
      CurvedAnimation(
        parent: _controller,
        curve: const Interval(0.666, 0.916, curve: Curves.easeOutCubic),
      ),
    );

    // Forward animation and trigger navigation callback at end
    _controller.forward().then((_) {
      if (mounted) {
        widget.onComplete();
      }
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.sizeOf(context);
    final isSmall = size.width < 360;

    return Scaffold(
      backgroundColor: AppColors.primaryDark,
      body: SafeArea(
        child: Stack(
          children: [
            // Subtle ambient background circles
            Positioned(
              top: -60,
              right: -60,
              child: Container(
                width: 220,
                height: 220,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: AppColors.primaryLight.withValues(alpha: 0.15),
                ),
              ),
            ),
            Positioned(
              bottom: -40,
              left: -40,
              child: Container(
                width: 180,
                height: 180,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: AppColors.primaryAccent.withValues(alpha: 0.08),
                ),
              ),
            ),

            // Main center content
            Center(
              child: SingleChildScrollView(
                physics: const ClampingScrollPhysics(),
                padding: EdgeInsets.symmetric(horizontal: isSmall ? 16 : 24),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    // Step 1: Animated Logo
                    ScaleTransition(
                      scale: _logoScale,
                      child: FadeTransition(
                        opacity: _logoOpacity,
                        child: Container(
                          width: isSmall ? 90 : 108,
                          height: isSmall ? 90 : 108,
                          decoration: BoxDecoration(
                            gradient: const LinearGradient(
                              colors: [Color(0xFF264E8C), AppColors.primaryAccent],
                              begin: Alignment.topLeft,
                              end: Alignment.bottomRight,
                            ),
                            shape: BoxShape.circle,
                            boxShadow: [
                              BoxShadow(
                                color: AppColors.primaryAccent.withValues(alpha: 0.35),
                                blurRadius: 24,
                                spreadRadius: 4,
                                offset: const Offset(0, 8),
                              ),
                            ],
                          ),
                          child: Center(
                            child: Icon(
                              Icons.print_rounded,
                              size: isSmall ? 48 : 58,
                              color: Colors.white,
                            ),
                          ),
                        ),
                      ),
                    ),
                    SizedBox(height: isSmall ? 20 : 28),

                    // Step 2: Animated App Name
                    SlideTransition(
                      position: _nameSlide,
                      child: FadeTransition(
                        opacity: _nameOpacity,
                        child: Column(
                          children: [
                            Text(
                              'Mukhtar Printing & Store',
                              textAlign: TextAlign.center,
                              style: TextStyle(
                                fontSize: isSmall ? 20 : 25,
                                fontWeight: FontWeight.bold,
                                color: Colors.white,
                                letterSpacing: 0.3,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              'مختار احمد پرنٹنگ اینڈ کمپیوٹر سٹور',
                              textAlign: TextAlign.center,
                              style: TextStyle(
                                fontSize: isSmall ? 13 : 15,
                                color: const Color(0xFFFFB800),
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 12),

                    // Step 3: Animated Tagline
                    SlideTransition(
                      position: _taglineSlide,
                      child: FadeTransition(
                        opacity: _taglineOpacity,
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                          decoration: BoxDecoration(
                            color: Colors.white.withValues(alpha: 0.08),
                            borderRadius: AppRadius.buttonRadius,
                            border: Border.all(
                              color: Colors.white.withValues(alpha: 0.15),
                            ),
                          ),
                          child: Text(
                            'Printing • Designing • Computer Accessories',
                            textAlign: TextAlign.center,
                            style: TextStyle(
                              fontSize: isSmall ? 11 : 12,
                              color: Colors.white.withValues(alpha: 0.9),
                              fontWeight: FontWeight.w500,
                              letterSpacing: 0.5,
                            ),
                          ),
                        ),
                      ),
                    ),
                    SizedBox(height: isSmall ? 24 : 32),

                    // Step 4: Loading Indicator (Animated Dots)
                    FadeTransition(
                      opacity: _loadingOpacity,
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          _buildDot(0),
                          const SizedBox(width: 8),
                          _buildDot(1),
                          const SizedBox(width: 8),
                          _buildDot(2),
                        ],
                      ),
                    ),
                    SizedBox(height: isSmall ? 24 : 32),

                    // Step 5: Staggered Component Reveal Preview Cards
                    SlideTransition(
                      position: _compRevealSlide,
                      child: FadeTransition(
                        opacity: _compRevealOpacity,
                        child: Container(
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: Colors.white.withValues(alpha: 0.06),
                            borderRadius: AppRadius.cardRadius,
                            border: Border.all(
                              color: Colors.white.withValues(alpha: 0.12),
                            ),
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'READY TO SERVE YOU',
                                style: TextStyle(
                                  fontSize: 10,
                                  fontWeight: FontWeight.bold,
                                  color: AppColors.primaryAccent,
                                  letterSpacing: 1,
                                ),
                              ),
                              const SizedBox(height: 8),
                              Wrap(
                                spacing: 8,
                                runSpacing: 6,
                                children: [
                                  _buildSectionPill(Icons.home_rounded, 'Home'),
                                  _buildSectionPill(Icons.inventory_2_rounded, 'Products'),
                                  _buildSectionPill(Icons.print_rounded, 'Services'),
                                  _buildSectionPill(Icons.shopping_cart_rounded, 'Cart'),
                                  _buildSectionPill(Icons.person_rounded, 'Profile'),
                                ],
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // Footer location branding
            Positioned(
              bottom: 12,
              left: 0,
              right: 0,
              child: Center(
                child: Text(
                  '${ShopLocation.shortAddress} • ${ShopLocation.phone}',
                  style: TextStyle(
                    fontSize: 11,
                    color: Colors.white.withValues(alpha: 0.6),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDot(int index) {
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        final double progress = (_controller.value * 5 - index).clamp(0.0, 1.0);
        return Container(
          width: 8,
          height: 8,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            color: progress > 0.4 ? AppColors.primaryAccent : Colors.white.withValues(alpha: 0.3),
          ),
        );
      },
    );
  }

  Widget _buildSectionPill(IconData icon, String label) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 14, color: Colors.white),
          const SizedBox(width: 4),
          Text(
            label,
            style: const TextStyle(fontSize: 11, color: Colors.white, fontWeight: FontWeight.w600),
          ),
        ],
      ),
    );
  }
}
