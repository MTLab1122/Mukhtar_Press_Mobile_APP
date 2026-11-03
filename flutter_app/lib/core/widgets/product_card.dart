import 'package:flutter/material.dart';
import '../theme/app_colors.dart';
import '../theme/app_radius.dart';
import '../theme/app_shadows.dart';
import '../theme/app_spacing.dart';

class ProductCard extends StatelessWidget {
  final String title;
  final String? brand;
  final double price;
  final double? originalPrice;
  final String unit;
  final int stockQuantity;
  final String imageUrl;
  final VoidCallback onTap;
  final VoidCallback onAddToCart;

  const ProductCard({
    super.key,
    required this.title,
    this.brand,
    required this.price,
    this.originalPrice,
    required this.unit,
    required this.stockQuantity,
    required this.imageUrl,
    required this.onTap,
    required this.onAddToCart,
  });

  @override
  Widget build(BuildContext context) {
    final isOutOfStock = stockQuantity <= 0;
    final isLowStock = stockQuantity > 0 && stockQuantity <= 5;
    final hasDiscount = originalPrice != null && originalPrice! > price;

    return Semantics(
      label: '$title, Rs. ${price.toStringAsFixed(0)} per $unit',
      button: true,
      child: InkWell(
        onTap: onTap,
        borderRadius: AppRadius.cardRadius,
        child: Container(
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: AppRadius.cardRadius,
            border: Border.all(color: AppColors.border),
            boxShadow: AppShadows.soft,
          ),
          clipBehavior: Clip.antiAlias,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Stack(
                children: [
                  AspectRatio(
                    aspectRatio: 1.15,
                    child: Hero(
                      tag: 'product_img_$title',
                      child: Image.network(
                        imageUrl,
                        fit: BoxFit.cover,
                        errorBuilder: (context, error, stackTrace) => Container(
                          color: AppColors.background,
                          child: const Center(
                            child: Icon(Icons.inventory_2_outlined, color: AppColors.mutedText, size: 36),
                          ),
                        ),
                      ),
                    ),
                  ),
                  Positioned(
                    top: 8,
                    left: 8,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(
                        color: isOutOfStock
                            ? AppColors.error
                            : isLowStock
                                ? AppColors.warning
                                : AppColors.success,
                        borderRadius: AppRadius.smRadius,
                      ),
                      child: Text(
                        isOutOfStock
                            ? 'Out of Stock'
                            : isLowStock
                                ? 'Low Stock ($stockQuantity)'
                                : 'In Stock',
                        style: const TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold),
                      ),
                    ),
                  ),
                  if (hasDiscount)
                    Positioned(
                      top: 8,
                      right: 8,
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 3),
                        decoration: BoxDecoration(
                          color: AppColors.primaryAccent,
                          borderRadius: AppRadius.smRadius,
                        ),
                        child: Text(
                          '-${(((originalPrice! - price) / originalPrice!) * 100).round()}%',
                          style: const TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold),
                        ),
                      ),
                    ),
                ],
              ),
              Padding(
                padding: const EdgeInsets.all(AppSpacing.md),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    if (brand != null)
                      Text(
                        brand!.toUpperCase(),
                        style: const TextStyle(
                          color: AppColors.mutedText,
                          fontSize: 10,
                          fontWeight: FontWeight.bold,
                          letterSpacing: 0.5,
                        ),
                      ),
                    const SizedBox(height: 2),
                    Text(
                      title,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w600,
                        color: AppColors.darkText,
                        height: 1.25,
                      ),
                    ),
                    const SizedBox(height: AppSpacing.sm),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Rs. ${price.toStringAsFixed(0)}',
                                style: const TextStyle(
                                  fontSize: 15,
                                  fontWeight: FontWeight.bold,
                                  color: AppColors.primary,
                                ),
                              ),
                              if (hasDiscount)
                                Text(
                                  'Rs. ${originalPrice!.toStringAsFixed(0)}',
                                  style: const TextStyle(
                                    fontSize: 11,
                                    color: AppColors.mutedText,
                                    decoration: TextDecoration.lineThrough,
                                  ),
                                ),
                              Text(
                                'per $unit',
                                style: const TextStyle(fontSize: 10, color: AppColors.mutedText),
                              ),
                            ],
                          ),
                        ),
                        ConstrainedBox(
                          constraints: const BoxConstraints(minWidth: 48, minHeight: 48),
                          child: IconButton(
                            onPressed: isOutOfStock ? null : onAddToCart,
                            icon: const Icon(Icons.add_shopping_cart, size: 18),
                            tooltip: 'Add to cart',
                            style: IconButton.styleFrom(
                              backgroundColor: isOutOfStock ? AppColors.border : AppColors.primaryAccent,
                              foregroundColor: Colors.white,
                              padding: const EdgeInsets.all(12),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
