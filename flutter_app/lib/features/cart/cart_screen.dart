import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_radius.dart';
import '../../core/theme/app_shadows.dart';
import '../../core/theme/app_spacing.dart';
import '../../core/widgets/price_summary_card.dart';
import '../../core/widgets/empty_state.dart';
import '../../core/widgets/animated_reveal.dart';
import '../checkout/checkout_screen.dart';

class CartScreen extends StatefulWidget {
  final VoidCallback? onBrowsePressed;

  const CartScreen({super.key, this.onBrowsePressed});

  @override
  State<CartScreen> createState() => _CartScreenState();
}

class _CartScreenState extends State<CartScreen> {
  // Sample initial cart items (Products & Services separated)
  List<Map<String, dynamic>> _productItems = [
    {
      'id': 'prod_hp_85a',
      'name': 'HP LaserJet 85A Toner (Black)',
      'brand': 'HP',
      'price': 2850.0,
      'quantity': 1,
      'image': 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=400&q=80',
    },
    {
      'id': 'prod_a4_reams',
      'name': 'Double A A4 Paper 80GSM (Box of 5)',
      'brand': 'Double A',
      'price': 1450.0,
      'quantity': 2,
      'image': 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=400&q=80',
    },
  ];

  List<Map<String, dynamic>> _serviceItems = [
    {
      'id': 'serv_flex_1',
      'name': 'Shop Front Panaflex Banner',
      'details': 'Dimensions: 6ft x 3ft (18 sqft) • Metal Eyelets',
      'price': 630.0,
      'file': 'umarzai_shop_banner_v2.pdf',
    },
  ];

  double get _subtotal {
    double total = 0;
    for (var p in _productItems) {
      total += (p['price'] as double) * (p['quantity'] as int);
    }
    for (var s in _serviceItems) {
      total += (s['price'] as double);
    }
    return total;
  }

  double get _deliveryFee => _subtotal >= 3000 ? 0.0 : 150.0;
  double get _total => _subtotal + _deliveryFee;

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.sizeOf(context);
    final isSmall = size.width < 360;
    final isEmpty = _productItems.isEmpty && _serviceItems.isEmpty;

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Shopping Cart'),
        backgroundColor: AppColors.primary,
      ),
      body: isEmpty
          ? EmptyState(
              title: 'Your cart is empty',
              subtitle: 'Add toners, printing supplies, or custom design services.',
              icon: Icons.remove_shopping_cart_rounded,
              actionText: 'Browse Store',
              onAction: widget.onBrowsePressed,
            )
          : CustomScrollView(
              physics: const BouncingScrollPhysics(),
              slivers: [
                SliverToBoxAdapter(
                  child: Padding(
                    padding: EdgeInsets.all(isSmall ? 12 : 16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Free delivery progress bar
                        Container(
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: _subtotal >= 3000 ? const Color(0xFFDCFCE7) : const Color(0xFFFEF3C7),
                            borderRadius: AppRadius.cardRadius,
                            border: Border.all(
                              color: _subtotal >= 3000 ? const Color(0xFF86EFAC) : const Color(0xFFFDE68A),
                            ),
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  Icon(
                                    _subtotal >= 3000 ? Icons.check_circle_rounded : Icons.local_shipping_rounded,
                                    size: 18,
                                    color: _subtotal >= 3000 ? const Color(0xFF166534) : const Color(0xFF92400E),
                                  ),
                                  const SizedBox(width: 8),
                                  Expanded(
                                    child: Text(
                                      _subtotal >= 3000
                                          ? 'Congratulations! You unlocked FREE Delivery in Umarzai!'
                                          : 'Add Rs. ${(3000 - _subtotal).toStringAsFixed(0)} more for FREE Delivery!',
                                      style: TextStyle(
                                        fontSize: 12,
                                        fontWeight: FontWeight.bold,
                                        color: _subtotal >= 3000 ? const Color(0xFF166534) : const Color(0xFF92400E),
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 8),
                              LinearProgressIndicator(
                                value: (_subtotal / 3000).clamp(0.0, 1.0),
                                backgroundColor: Colors.white.withValues(alpha: 0.6),
                                valueColor: AlwaysStoppedAnimation<Color>(
                                  _subtotal >= 3000 ? AppColors.success : AppColors.primaryAccent,
                                ),
                                minHeight: 6,
                                borderRadius: BorderRadius.circular(3),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(height: 20),

                        // Store Products Section
                        if (_productItems.isNotEmpty) ...[
                          const Text(
                            'Store Products & Supplies',
                            style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: AppColors.primaryDark),
                          ),
                          const SizedBox(height: 10),
                          ..._productItems.asMap().entries.map((entry) {
                            final index = entry.key;
                            final item = entry.value;
                            return AnimatedReveal(
                              delay: index * 60,
                              child: Container(
                                margin: const EdgeInsets.only(bottom: 10),
                                padding: const EdgeInsets.all(12),
                                decoration: BoxDecoration(
                                  color: Colors.white,
                                  borderRadius: AppRadius.cardRadius,
                                  border: Border.all(color: AppColors.border),
                                  boxShadow: AppShadows.soft,
                                ),
                                child: Row(
                                  children: [
                                    ClipRRect(
                                      borderRadius: BorderRadius.circular(10),
                                      child: Image.network(
                                        item['image'] as String,
                                        width: 60,
                                        height: 60,
                                        fit: BoxFit.cover,
                                        errorBuilder: (_, __, ___) => Container(
                                          width: 60,
                                          height: 60,
                                          color: AppColors.background,
                                          child: const Icon(Icons.inventory_2_outlined),
                                        ),
                                      ),
                                    ),
                                    const SizedBox(width: 12),
                                    Expanded(
                                      child: Column(
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        children: [
                                          Text(
                                            item['name'] as String,
                                            maxLines: 2,
                                            overflow: TextOverflow.ellipsis,
                                            style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold),
                                          ),
                                          Text(
                                            'Rs. ${(item['price'] as double).toStringAsFixed(0)} each',
                                            style: const TextStyle(fontSize: 12, color: AppColors.primary, fontWeight: FontWeight.w600),
                                          ),
                                        ],
                                      ),
                                    ),
                                    Row(
                                      children: [
                                        IconButton(
                                          icon: const Icon(Icons.remove_circle_outline, size: 20),
                                          onPressed: () {
                                            setState(() {
                                              if ((item['quantity'] as int) > 1) {
                                                item['quantity'] = (item['quantity'] as int) - 1;
                                              } else {
                                                _productItems.removeAt(index);
                                              }
                                            });
                                          },
                                        ),
                                        Text('${item['quantity']}', style: const TextStyle(fontWeight: FontWeight.bold)),
                                        IconButton(
                                          icon: const Icon(Icons.add_circle_outline, size: 20),
                                          onPressed: () {
                                            setState(() {
                                              item['quantity'] = (item['quantity'] as int) + 1;
                                            });
                                          },
                                        ),
                                      ],
                                    ),
                                  ],
                                ),
                              ),
                            );
                          }),
                          const SizedBox(height: 16),
                        ],

                        // Printing & Design Services Section
                        if (_serviceItems.isNotEmpty) ...[
                          const Text(
                            'Custom Printing & Design Orders',
                            style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: AppColors.primaryDark),
                          ),
                          const SizedBox(height: 10),
                          ..._serviceItems.asMap().entries.map((entry) {
                            final index = entry.key;
                            final item = entry.value;
                            return AnimatedReveal(
                              delay: (index + 2) * 60,
                              child: Container(
                                margin: const EdgeInsets.only(bottom: 10),
                                padding: const EdgeInsets.all(12),
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
                                        Expanded(
                                          child: Text(
                                            item['name'] as String,
                                            style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold),
                                          ),
                                        ),
                                        IconButton(
                                          icon: const Icon(Icons.delete_outline, size: 18, color: AppColors.error),
                                          onPressed: () {
                                            setState(() => _serviceItems.removeAt(index));
                                          },
                                        ),
                                      ],
                                    ),
                                    Text(
                                      item['details'] as String,
                                      style: const TextStyle(fontSize: 12, color: AppColors.mutedText),
                                    ),
                                    if (item['file'] != null) ...[
                                      const SizedBox(height: 6),
                                      Container(
                                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                        decoration: BoxDecoration(
                                          color: AppColors.background,
                                          borderRadius: BorderRadius.circular(6),
                                        ),
                                        child: Row(
                                          mainAxisSize: MainAxisSize.min,
                                          children: [
                                            const Icon(Icons.attach_file, size: 14, color: AppColors.primary),
                                            const SizedBox(width: 4),
                                            Text(
                                              item['file'] as String,
                                              style: const TextStyle(fontSize: 11, color: AppColors.primary, fontWeight: FontWeight.w500),
                                            ),
                                          ],
                                        ),
                                      ),
                                    ],
                                    const SizedBox(height: 8),
                                    Text(
                                      'Rs. ${(item['price'] as double).toStringAsFixed(0)}',
                                      style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: AppColors.primary),
                                    ),
                                  ],
                                ),
                              ),
                            );
                          }),
                          const SizedBox(height: 16),
                        ],

                        // Price Summary Card
                        PriceSummaryCard(
                          subtotal: _subtotal,
                          deliveryFee: _deliveryFee,
                          total: _total,
                        ),
                        const SizedBox(height: 20),

                        // Proceed to Checkout Button
                        ElevatedButton(
                          onPressed: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (context) => CheckoutScreen(
                                  subtotal: _subtotal,
                                  deliveryFee: _deliveryFee,
                                  total: _total,
                                ),
                              ),
                            );
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppColors.primaryAccent,
                            minimumSize: const Size.fromHeight(52),
                            shape: const RoundedRectangleBorder(borderRadius: AppRadius.buttonRadius),
                          ),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Text(
                                'Proceed to Checkout • Rs. ${_total.toStringAsFixed(0)}',
                                style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
                              ),
                              const SizedBox(width: 8),
                              const Icon(Icons.arrow_forward_rounded, size: 18),
                            ],
                          ),
                        ),
                        const SizedBox(height: 32),
                      ],
                    ),
                  ),
                ),
              ],
            ),
    );
  }
}
