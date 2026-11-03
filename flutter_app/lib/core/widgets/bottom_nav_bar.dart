import 'package:flutter/material.dart';
import '../theme/app_colors.dart';
import '../theme/app_animations.dart';

class CustomBottomNavBar extends StatelessWidget {
  final int currentIndex;
  final ValueChanged<int> onTap;
  final int cartItemCount;

  const CustomBottomNavBar({
    super.key,
    required this.currentIndex,
    required this.onTap,
    this.cartItemCount = 0,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF1B3A6B).withValues(alpha: 0.08),
            blurRadius: 18,
            offset: const Offset(0, -4),
          ),
        ],
      ),
      child: SafeArea(
        child: SizedBox(
          height: 64,
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _buildNavItem(0, Icons.home_rounded, Icons.home_outlined, 'Home'),
              _buildNavItem(1, Icons.inventory_2_rounded, Icons.inventory_2_outlined, 'Products'),
              _buildNavItem(2, Icons.print_rounded, Icons.print_outlined, 'Services'),
              _buildCartItem(3),
              _buildNavItem(4, Icons.person_rounded, Icons.person_outline_rounded, 'Profile'),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildNavItem(int index, IconData activeIcon, IconData inactiveIcon, String label) {
    final isSelected = currentIndex == index;

    return Semantics(
      label: '$label tab',
      selected: isSelected,
      button: true,
      child: ConstrainedBox(
        constraints: const BoxConstraints(minWidth: 54, minHeight: 48),
        child: InkWell(
          onTap: () => onTap(index),
          splashColor: Colors.transparent,
          highlightColor: Colors.transparent,
          child: AnimatedContainer(
            duration: AppAnimations.standard,
            curve: AppAnimations.defaultCurve,
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
            decoration: BoxDecoration(
              color: isSelected ? AppColors.primary.withValues(alpha: 0.08) : Colors.transparent,
              borderRadius: BorderRadius.circular(16),
            ),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                AnimatedScale(
                  scale: isSelected ? 1.1 : 1.0,
                  duration: AppAnimations.quick,
                  child: Icon(
                    isSelected ? activeIcon : inactiveIcon,
                    color: isSelected ? AppColors.primary : AppColors.mutedText,
                    size: 22,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  label,
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
                    color: isSelected ? AppColors.primary : AppColors.mutedText,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildCartItem(int index) {
    final isSelected = currentIndex == index;

    return Semantics(
      label: 'Cart tab with $cartItemCount items',
      selected: isSelected,
      button: true,
      child: ConstrainedBox(
        constraints: const BoxConstraints(minWidth: 54, minHeight: 48),
        child: InkWell(
          onTap: () => onTap(index),
          splashColor: Colors.transparent,
          highlightColor: Colors.transparent,
          child: AnimatedContainer(
            duration: AppAnimations.standard,
            curve: AppAnimations.defaultCurve,
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
            decoration: BoxDecoration(
              color: isSelected ? AppColors.primary.withValues(alpha: 0.08) : Colors.transparent,
              borderRadius: BorderRadius.circular(16),
            ),
            child: Stack(
              clipBehavior: Clip.none,
              children: [
                Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    AnimatedScale(
                      scale: isSelected ? 1.1 : 1.0,
                      duration: AppAnimations.quick,
                      child: Icon(
                        isSelected ? Icons.shopping_cart_rounded : Icons.shopping_cart_outlined,
                        color: isSelected ? AppColors.primary : AppColors.mutedText,
                        size: 22,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      'Cart',
                      style: TextStyle(
                        fontSize: 11,
                        fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
                        color: isSelected ? AppColors.primary : AppColors.mutedText,
                      ),
                    ),
                  ],
                ),
                if (cartItemCount > 0)
                  Positioned(
                    top: -2,
                    right: -8,
                    child: AnimatedScale(
                      scale: cartItemCount > 0 ? 1.0 : 0.0,
                      duration: AppAnimations.standard,
                      curve: AppAnimations.bounce,
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 1),
                        decoration: BoxDecoration(
                          color: AppColors.primaryAccent,
                          borderRadius: BorderRadius.circular(10),
                          border: Border.all(color: Colors.white, width: 1.5),
                        ),
                        child: Text(
                          cartItemCount > 9 ? '9+' : '$cartItemCount',
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 9,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ),
                  ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
