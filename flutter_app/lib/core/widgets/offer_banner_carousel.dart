import 'dart:async';
import 'package:flutter/material.dart';
import '../theme/app_colors.dart';
import '../theme/app_radius.dart';
import '../theme/app_animations.dart';

class OfferBannerItem {
  final String title;
  final String subtitle;
  final String? code;
  final String? tag;
  final Color backgroundColor;

  const OfferBannerItem({
    required this.title,
    required this.subtitle,
    this.code,
    this.tag,
    this.backgroundColor = AppColors.primary,
  });
}

class OfferBannerCarousel extends StatefulWidget {
  final List<OfferBannerItem> offers;
  final ValueChanged<int>? onOfferTap;

  const OfferBannerCarousel({
    super.key,
    required this.offers,
    this.onOfferTap,
  });

  @override
  State<OfferBannerCarousel> createState() => _OfferBannerCarouselState();
}

class _OfferBannerCarouselState extends State<OfferBannerCarousel> {
  late final PageController _pageController;
  int _currentPage = 0;
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    _pageController = PageController();
    if (widget.offers.length > 1) {
      _timer = Timer.periodic(AppAnimations.carouselSlide, (timer) {
        if (_pageController.hasClients) {
          final next = (_currentPage + 1) % widget.offers.length;
          _pageController.animateToPage(
            next,
            duration: AppAnimations.medium,
            curve: AppAnimations.defaultCurve,
          );
        }
      });
    }
  }

  @override
  void dispose() {
    _timer?.cancel();
    _pageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (widget.offers.isEmpty) return const SizedBox.shrink();

    return Column(
      children: [
        SizedBox(
          height: 140,
          child: PageView.builder(
            controller: _pageController,
            itemCount: widget.offers.length,
            onPageChanged: (index) => setState(() => _currentPage = index),
            itemBuilder: (context, index) {
              final item = widget.offers[index];
              return InkWell(
                onTap: () => widget.onOfferTap?.call(index),
                borderRadius: AppRadius.cardRadius,
                child: Container(
                  margin: const EdgeInsets.symmetric(horizontal: 4),
                  padding: const EdgeInsets.all(18),
                  decoration: BoxDecoration(
                    color: item.backgroundColor,
                    borderRadius: AppRadius.cardRadius,
                    boxShadow: [
                      BoxShadow(
                        color: item.backgroundColor.withValues(alpha: 0.25),
                        blurRadius: 14,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: Stack(
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          if (item.tag != null)
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                              decoration: BoxDecoration(
                                color: Colors.white.withValues(alpha: 0.2),
                                borderRadius: AppRadius.smRadius,
                              ),
                              child: Text(
                                item.tag!.toUpperCase(),
                                style: const TextStyle(
                                  color: AppColors.primaryAccent,
                                  fontSize: 10,
                                  fontWeight: FontWeight.bold,
                                  letterSpacing: 0.5,
                                ),
                              ),
                            ),
                          const SizedBox(height: 6),
                          Text(
                            item.title,
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 17,
                              fontWeight: FontWeight.bold,
                              height: 1.2,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            item.subtitle,
                            style: TextStyle(
                              color: Colors.white.withValues(alpha: 0.85),
                              fontSize: 12,
                            ),
                          ),
                        ],
                      ),
                      Positioned(
                        right: 0,
                        bottom: 0,
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: AppColors.primaryAccent,
                            borderRadius: AppRadius.pillRadius,
                          ),
                          child: const Text(
                            'Order Now',
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 11,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
        ),
        if (widget.offers.length > 1) ...[
          const SizedBox(height: 8),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: List.generate(widget.offers.length, (index) {
              final isSelected = _currentPage == index;
              return AnimatedContainer(
                duration: AppAnimations.standard,
                curve: AppAnimations.defaultCurve,
                margin: const EdgeInsets.symmetric(horizontal: 3),
                width: isSelected ? 20 : 6,
                height: 6,
                decoration: BoxDecoration(
                  color: isSelected ? AppColors.primary : AppColors.border,
                  borderRadius: AppRadius.pillRadius,
                ),
              );
            }),
          ),
        ],
      ],
    );
  }
}
