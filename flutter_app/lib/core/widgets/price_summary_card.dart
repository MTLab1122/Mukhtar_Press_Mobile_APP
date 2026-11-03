import 'package:flutter/material.dart';
import '../theme/app_colors.dart';
import '../theme/app_radius.dart';
import '../theme/app_shadows.dart';
import '../theme/app_spacing.dart';
import '../theme/app_animations.dart';

class PriceSummaryCard extends StatelessWidget {
  final double subtotal;
  final double deliveryFee;
  final double total;
  final String? deliveryType;
  final double freeDeliveryThreshold;

  const PriceSummaryCard({
    super.key,
    required this.subtotal,
    required this.deliveryFee,
    required this.total,
    this.deliveryType,
    this.freeDeliveryThreshold = 3000.0,
  });

  @override
  Widget build(BuildContext context) {
    final progress = (subtotal / freeDeliveryThreshold).clamp(0.0, 1.0);
    final remainingForFree = (freeDeliveryThreshold - subtotal).clamp(0.0, freeDeliveryThreshold);

    return Container(
      padding: const EdgeInsets.all(AppSpacing.md),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: AppRadius.cardRadius,
        border: Border.all(color: AppColors.border),
        boxShadow: AppShadows.soft,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Order Summary',
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.darkText),
              ),
              if (deliveryFee == 0)
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                  decoration: BoxDecoration(
                    color: AppColors.success.withValues(alpha: 0.12),
                    borderRadius: AppRadius.smRadius,
                  ),
                  child: const Text(
                    'FREE DELIVERY',
                    style: TextStyle(
                      color: AppColors.success,
                      fontSize: 10,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
            ],
          ),

          // Free delivery progress bar
          if (deliveryType != 'pickup') ...[
            const SizedBox(height: AppSpacing.sm),
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: AppColors.background,
                borderRadius: AppRadius.buttonRadius,
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Icon(
                        progress >= 1.0 ? Icons.check_circle : Icons.local_shipping_outlined,
                        size: 15,
                        color: progress >= 1.0 ? AppColors.success : AppColors.primary,
                      ),
                      const SizedBox(width: 6),
                      Expanded(
                        child: Text(
                          progress >= 1.0
                              ? '🎉 You unlocked FREE delivery in Umarzai!'
                              : 'Add Rs. ${remainingForFree.toStringAsFixed(0)} more for FREE delivery',
                          style: TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.w600,
                            color: progress >= 1.0 ? AppColors.success : AppColors.darkText,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 6),
                  ClipRRect(
                    borderRadius: AppRadius.pillRadius,
                    child: TweenAnimationBuilder<double>(
                      duration: AppAnimations.medium,
                      curve: AppAnimations.defaultCurve,
                      tween: Tween<double>(begin: 0.0, end: progress),
                      builder: (context, value, child) {
                        return LinearProgressIndicator(
                          value: value,
                          backgroundColor: AppColors.border,
                          color: progress >= 1.0 ? AppColors.success : AppColors.primaryAccent,
                          minHeight: 4,
                        );
                      },
                    ),
                  ),
                ],
              ),
            ),
          ],

          const SizedBox(height: AppSpacing.sm),
          const Divider(color: AppColors.divider),
          const SizedBox(height: AppSpacing.xs),
          _buildRow('Subtotal', 'Rs. ${subtotal.toStringAsFixed(0)}'),
          const SizedBox(height: AppSpacing.xs),
          _buildRow(
            deliveryFee == 0 ? 'Delivery (Shop Pickup)' : 'Home Delivery',
            deliveryFee == 0 ? 'FREE' : 'Rs. ${deliveryFee.toStringAsFixed(0)}',
            valueColor: deliveryFee == 0 ? AppColors.success : null,
          ),
          const SizedBox(height: AppSpacing.xs),
          const Divider(color: AppColors.divider),
          const SizedBox(height: AppSpacing.xs),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Grand Total',
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.darkText),
              ),
              TweenAnimationBuilder<double>(
                duration: AppAnimations.standard,
                tween: Tween<double>(begin: total, end: total),
                builder: (context, val, child) {
                  return Text(
                    'Rs. ${val.toStringAsFixed(0)}',
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: AppColors.primary,
                    ),
                  );
                },
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildRow(String label, String value, {Color? valueColor}) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: const TextStyle(fontSize: 14, color: AppColors.mutedText)),
        Text(
          value,
          style: TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w600,
            color: valueColor ?? AppColors.darkText,
          ),
        ),
      ],
    );
  }
}
