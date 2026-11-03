import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_radius.dart';
import '../../core/theme/app_shadows.dart';
import '../../core/theme/app_spacing.dart';
import '../../core/widgets/product_card.dart';
import '../../core/widgets/search_bar.dart';
import '../../core/widgets/empty_state.dart';
import '../../core/widgets/animated_reveal.dart';
import '../../data/models/product_model.dart';

class ProductsScreen extends StatefulWidget {
  final String? initialCategory;
  final VoidCallback? onCartPressed;

  const ProductsScreen({super.key, this.initialCategory, this.onCartPressed});

  @override
  State<ProductsScreen> createState() => _ProductsScreenState();
}

class _ProductsScreenState extends State<ProductsScreen> {
  String _searchQuery = '';
  String _selectedCategory = 'All';
  String _sortBy = 'featured';

  final List<String> _categories = [
    'All',
    'Toners & Cartridges',
    'Inks & Refills',
    'Paper & Reams',
    'Flex & Vinyl',
    'Computer Accessories',
    'Stationery',
  ];

  @override
  void initState() {
    super.initState();
    if (widget.initialCategory != null) {
      _selectedCategory = widget.initialCategory!;
    }
  }

  List<ProductModel> get _filteredProducts {
    var list = sampleProducts.where((p) {
      final matchQuery = _searchQuery.isEmpty ||
          p.name.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          (p.brand != null && p.brand!.toLowerCase().contains(_searchQuery.toLowerCase())) ||
          p.category.toLowerCase().contains(_searchQuery.toLowerCase());

      final matchCategory = _selectedCategory == 'All' ||
          p.category.toLowerCase().contains(_selectedCategory.toLowerCase());

      return matchQuery && matchCategory;
    }).toList();

    if (_sortBy == 'price_low') {
      list.sort((a, b) => a.price.compareTo(b.price));
    } else if (_sortBy == 'price_high') {
      list.sort((a, b) => b.price.compareTo(a.price));
    } else if (_sortBy == 'name') {
      list.sort((a, b) => a.name.compareTo(b.name));
    }

    return list;
  }

  void _showProductDetails(ProductModel product) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) {
        int qty = 1;
        return StatefulBuilder(
          builder: (context, setModalState) {
            final hasDiscount = product.originalPrice != null && product.originalPrice! > product.price;
            return Container(
              decoration: const BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
              ),
              padding: EdgeInsets.fromLTRB(20, 16, 20, MediaQuery.paddingOf(context).bottom + 20),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Center(
                    child: Container(
                      width: 40,
                      height: 4,
                      decoration: BoxDecoration(
                        color: AppColors.border,
                        borderRadius: BorderRadius.circular(2),
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      ClipRRect(
                        borderRadius: AppRadius.cardRadius,
                        child: Image.network(
                          product.imageUrl,
                          width: 80,
                          height: 80,
                          fit: BoxFit.cover,
                          errorBuilder: (_, __, ___) => Container(
                            width: 80,
                            height: 80,
                            color: AppColors.background,
                            child: const Icon(Icons.inventory_2_outlined, color: AppColors.mutedText),
                          ),
                        ),
                      ),
                      const SizedBox(width: 14),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            if (product.brand != null)
                              Text(
                                product.brand!.toUpperCase(),
                                style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: AppColors.mutedText),
                              ),
                            Text(
                              product.name,
                              style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.darkText),
                            ),
                            const SizedBox(height: 4),
                            Row(
                              children: [
                                Text(
                                  'Rs. ${product.price.toStringAsFixed(0)}',
                                  style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.primary),
                                ),
                                if (hasDiscount) ...[
                                  const SizedBox(width: 8),
                                  Text(
                                    'Rs. ${product.originalPrice!.toStringAsFixed(0)}',
                                    style: const TextStyle(fontSize: 12, decoration: TextDecoration.lineThrough, color: AppColors.mutedText),
                                  ),
                                ],
                              ],
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  Text(
                    product.description,
                    style: const TextStyle(fontSize: 13, color: AppColors.mutedText, height: 1.4),
                  ),
                  const SizedBox(height: 16),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text('Quantity:', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600)),
                      Row(
                        children: [
                          IconButton(
                            icon: const Icon(Icons.remove_circle_outline),
                            onPressed: qty > 1 ? () => setModalState(() => qty--) : null,
                          ),
                          Text('$qty', style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                          IconButton(
                            icon: const Icon(Icons.add_circle_outline),
                            onPressed: qty < product.stockQuantity ? () => setModalState(() => qty++) : null,
                          ),
                        ],
                      ),
                    ],
                  ),
                  const SizedBox(height: 20),
                  ElevatedButton(
                    onPressed: product.stockQuantity <= 0
                        ? null
                        : () {
                            Navigator.pop(context);
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(
                                content: Text('Added $qty x ${product.name} to cart!'),
                                backgroundColor: AppColors.primary,
                              ),
                            );
                          },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.primaryAccent,
                      minimumSize: const Size.fromHeight(50),
                    ),
                    child: Text('Add to Cart • Rs. ${(product.price * qty).toStringAsFixed(0)}'),
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.sizeOf(context);
    final isSmall = size.width < 360;
    final filtered = _filteredProducts;

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Store Products & Supplies'),
        backgroundColor: AppColors.primary,
        actions: [
          IconButton(
            icon: const Icon(Icons.shopping_cart_outlined, color: Colors.white),
            tooltip: 'Shopping Cart',
            onPressed: widget.onCartPressed,
          ),
        ],
      ),
      body: Column(
        children: [
          // Search & Filter header
          Container(
            color: Colors.white,
            padding: EdgeInsets.symmetric(horizontal: isSmall ? 12 : 16, vertical: 10),
            child: Column(
              children: [
                CustomSearchBar(
                  hintText: 'Search toners, paper, cables...',
                  onChanged: (q) => setState(() => _searchQuery = q),
                ),
                const SizedBox(height: 8),
                Row(
                  children: [
                    Expanded(
                      child: SizedBox(
                        height: 32,
                        child: ListView.separated(
                          scrollDirection: Axis.horizontal,
                          itemCount: _categories.length,
                          separatorBuilder: (_, __) => const SizedBox(width: 6),
                          itemBuilder: (context, index) {
                            final cat = _categories[index];
                            final isSel = _selectedCategory == cat;
                            return ChoiceChip(
                              label: Text(cat, style: TextStyle(fontSize: 11, color: isSel ? Colors.white : AppColors.darkText)),
                              selected: isSel,
                              selectedColor: AppColors.primary,
                              backgroundColor: AppColors.background,
                              onSelected: (_) => setState(() => _selectedCategory = cat),
                            );
                          },
                        ),
                      ),
                    ),
                    PopupMenuButton<String>(
                      icon: const Icon(Icons.sort, size: 20, color: AppColors.primary),
                      tooltip: 'Sort Products',
                      onSelected: (val) => setState(() => _sortBy = val),
                      itemBuilder: (context) => [
                        const PopupMenuItem(value: 'featured', child: Text('Featured')),
                        const PopupMenuItem(value: 'price_low', child: Text('Price: Low to High')),
                        const PopupMenuItem(value: 'price_high', child: Text('Price: High to Low')),
                        const PopupMenuItem(value: 'name', child: Text('Alphabetical')),
                      ],
                    ),
                  ],
                ),
              ],
            ),
          ),

          // Product Grid
          Expanded(
            child: filtered.isEmpty
                ? EmptyState(
                    title: 'No products found',
                    subtitle: 'Try searching for other printer inks, toners, or paper types.',
                    icon: Icons.search_off_rounded,
                    actionText: 'Reset Filters',
                    onAction: () => setState(() {
                      _searchQuery = '';
                      _selectedCategory = 'All';
                    }),
                  )
                : LayoutBuilder(
                    builder: (context, constraints) {
                      final cols = constraints.maxWidth >= 700
                          ? 4
                          : constraints.maxWidth >= 500
                              ? 3
                              : 2;
                      final aspect = constraints.maxWidth < 360 ? 0.62 : 0.68;
                      return GridView.builder(
                        padding: EdgeInsets.all(isSmall ? 10 : 14),
                        physics: const BouncingScrollPhysics(),
                        itemCount: filtered.length,
                        gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                          crossAxisCount: cols,
                          crossAxisSpacing: 10,
                          mainAxisSpacing: 10,
                          childAspectRatio: aspect,
                        ),
                        itemBuilder: (context, index) {
                          final prod = filtered[index];
                          return AnimatedReveal(
                            delay: (index * 40).clamp(0, 300),
                            child: ProductCard(
                              title: prod.name,
                              brand: prod.brand,
                              price: prod.price,
                              originalPrice: prod.originalPrice,
                              unit: prod.unit,
                              stockQuantity: prod.stockQuantity,
                              imageUrl: prod.imageUrl,
                              onTap: () => _showProductDetails(prod),
                              onAddToCart: () {
                                ScaffoldMessenger.of(context).showSnackBar(
                                  SnackBar(
                                    content: Text('${prod.name} added to cart!'),
                                    duration: const Duration(seconds: 1),
                                    backgroundColor: AppColors.primary,
                                  ),
                                );
                              },
                            ),
                          );
                        },
                      );
                    },
                  ),
          ),
        ],
      ),
    );
  }
}
