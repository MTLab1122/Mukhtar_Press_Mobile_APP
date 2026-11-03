import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_radius.dart';
import '../../core/theme/app_shadows.dart';
import '../../core/theme/app_spacing.dart';
import '../../core/constants/shop_location.dart';
import '../../core/widgets/animated_reveal.dart';
import '../../core/widgets/search_bar.dart';
import '../../core/widgets/offer_banner_carousel.dart';
import '../../core/widgets/quick_action_tile.dart';
import '../../core/widgets/section_header.dart';
import '../../core/widgets/product_card.dart';
import '../../core/widgets/service_card.dart';
import '../../data/models/product_model.dart';
import '../../data/models/service_model.dart';

class HomeScreen extends StatefulWidget {
  final Function(int tabIndex)? onNavigateTab;
  final Function(String category)? onSelectCategory;

  const HomeScreen({super.key, this.onNavigateTab, this.onSelectCategory});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  String _selectedCategory = 'All';

  final List<String> _categories = [
    'All',
    'Photocopy & Print',
    'Flex & Banners',
    'Cards & Composing',
    'Stamps',
    'Printers & Ink',
    'Paper & Sheets',
    'Accessories',
  ];

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.sizeOf(context);
    final isSmall = size.width < 360;
    final isTablet = size.width >= 600;

    return Scaffold(
      backgroundColor: AppColors.background,
      body: CustomScrollView(
        physics: const BouncingScrollPhysics(),
        slivers: [
          // Animated App Bar Header
          SliverAppBar(
            floating: true,
            pinned: false,
            backgroundColor: AppColors.primary,
            expandedHeight: 120,
            flexibleSpace: FlexibleSpaceBar(
              background: Container(
                decoration: const BoxDecoration(
                  gradient: LinearGradient(
                    colors: [AppColors.primaryDark, AppColors.primary],
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                  ),
                ),
                padding: EdgeInsets.fromLTRB(
                  isSmall ? 12 : 16,
                  MediaQuery.paddingOf(context).top + 8,
                  isSmall ? 12 : 16,
                  12,
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Mukhtar Printing & Store',
                              style: TextStyle(
                                fontSize: isSmall ? 16 : 18,
                                fontWeight: FontWeight.bold,
                                color: Colors.white,
                              ),
                            ),
                            Text(
                              'Main Bazar Umarzai • 0314-9958963',
                              style: TextStyle(
                                fontSize: isSmall ? 10 : 12,
                                color: Colors.white.withValues(alpha: 0.8),
                              ),
                            ),
                          ],
                        ),
                        Row(
                          children: [
                            IconButton(
                              onPressed: () {
                                // Direct Phone Call to Mukhtar Ahmed
                              },
                              icon: const Icon(Icons.phone, color: Colors.white, size: 20),
                              tooltip: 'Call Mukhtar Ahmed',
                              style: IconButton.styleFrom(
                                backgroundColor: Colors.white.withValues(alpha: 0.15),
                                padding: const EdgeInsets.all(8),
                              ),
                            ),
                            const SizedBox(width: 6),
                            IconButton(
                              onPressed: () {
                                // Direct WhatsApp Shop
                              },
                              icon: const Icon(Icons.chat, color: Color(0xFF25D366), size: 20),
                              tooltip: 'WhatsApp Shop',
                              style: IconButton.styleFrom(
                                backgroundColor: Colors.white.withValues(alpha: 0.15),
                                padding: const EdgeInsets.all(8),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ),

          // Main Home Body
          SliverToBoxAdapter(
            child: Padding(
              padding: EdgeInsets.symmetric(horizontal: isSmall ? 12 : 16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const SizedBox(height: 12),

                  // Search Bar
                  AnimatedReveal(
                    delay: 50,
                    child: CustomSearchBar(
                      hintText: 'Search printing services, paper, toner, ink...',
                      onSubmitted: (query) {
                        if (widget.onNavigateTab != null) {
                          widget.onNavigateTab!(1); // Go to Products
                        }
                      },
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Offer Banner Carousel
                  AnimatedReveal(
                    delay: 100,
                    child: OfferBannerCarousel(
                      banners: [
                        OfferBannerItem(
                          title: 'Special Flex Banner Discount',
                          subtitle: 'High-res Panaflex at Rs. 35/sqft with metal eyelets.',
                          tag: 'LOCAL DEAL',
                          color: AppColors.primary,
                          actionText: 'Order Flex',
                          onAction: () => widget.onNavigateTab?.call(2),
                        ),
                        OfferBannerItem(
                          title: 'Free Delivery in Umarzai',
                          subtitle: 'On orders above Rs. 3,000 across Umarzai & nearby areas.',
                          tag: 'FREE DELIVERY',
                          color: const Color(0xFF166534),
                          actionText: 'View Supplies',
                          onAction: () => widget.onNavigateTab?.call(1),
                        ),
                        OfferBannerItem(
                          title: 'Custom Official Stamps',
                          subtitle: 'Ready in 30 minutes! Computerized & self-inking stamps.',
                          tag: 'FAST 30 MIN',
                          color: const Color(0xFF7C2D12),
                          actionText: 'Order Stamp',
                          onAction: () => widget.onNavigateTab?.call(2),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 20),

                  // Quick Action Tiles
                  AnimatedReveal(
                    delay: 150,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const SectionHeader(
                          title: 'Quick Services',
                          subtitle: 'Instant ordering with WhatsApp/upload',
                        ),
                        const SizedBox(height: 8),
                        SingleChildScrollView(
                          scrollDirection: Axis.horizontal,
                          physics: const BouncingScrollPhysics(),
                          child: Row(
                            children: [
                              QuickActionTile(
                                icon: Icons.description_rounded,
                                label: 'Print Document',
                                color: AppColors.primary,
                                onTap: () => widget.onNavigateTab?.call(2),
                              ),
                              const SizedBox(width: 10),
                              QuickActionTile(
                                icon: Icons.view_carousel_rounded,
                                label: 'Flex Banner',
                                color: AppColors.primaryAccent,
                                onTap: () => widget.onNavigateTab?.call(2),
                              ),
                              const SizedBox(width: 10),
                              QuickActionTile(
                                icon: Icons.badge_rounded,
                                label: 'Visiting Cards',
                                color: const Color(0xFF0D9488),
                                onTap: () => widget.onNavigateTab?.call(2),
                              ),
                              const SizedBox(width: 10),
                              QuickActionTile(
                                icon: Icons.approval_rounded,
                                label: 'Rubber Stamps',
                                color: const Color(0xFF9333EA),
                                onTap: () => widget.onNavigateTab?.call(2),
                              ),
                              const SizedBox(width: 10),
                              QuickActionTile(
                                icon: Icons.photo_camera_front_rounded,
                                label: 'Passport Photo',
                                color: const Color(0xFFE11D48),
                                onTap: () => widget.onNavigateTab?.call(2),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 24),

                  // Category Filter Chips
                  AnimatedReveal(
                    delay: 200,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const SectionHeader(
                          title: 'Browse Categories',
                          subtitle: 'Products and shop services',
                        ),
                        const SizedBox(height: 8),
                        SizedBox(
                          height: 38,
                          child: ListView.separated(
                            scrollDirection: Axis.horizontal,
                            physics: const BouncingScrollPhysics(),
                            itemCount: _categories.length,
                            separatorBuilder: (_, __) => const SizedBox(width: 8),
                            itemBuilder: (context, index) {
                              final cat = _categories[index];
                              final isSelected = _selectedCategory == cat;
                              return GestureDetector(
                                onTap: () {
                                  setState(() => _selectedCategory = cat);
                                  widget.onSelectCategory?.call(cat);
                                },
                                child: AnimatedContainer(
                                  duration: const Duration(milliseconds: 200),
                                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                                  decoration: BoxDecoration(
                                    color: isSelected ? AppColors.primary : Colors.white,
                                    borderRadius: AppRadius.buttonRadius,
                                    border: Border.all(
                                      color: isSelected ? AppColors.primary : AppColors.border,
                                    ),
                                    boxShadow: isSelected ? AppShadows.soft : null,
                                  ),
                                  child: Center(
                                    child: Text(
                                      cat,
                                      style: TextStyle(
                                        fontSize: 12,
                                        fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
                                        color: isSelected ? Colors.white : AppColors.darkText,
                                      ),
                                    ),
                                  ),
                                ),
                              );
                            },
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 24),

                  // Popular Services Section
                  AnimatedReveal(
                    delay: 250,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        SectionHeader(
                          title: 'Popular Services',
                          subtitle: 'Direct pricing from Main Bazar Umarzai',
                          actionText: 'See All Services',
                          onAction: () => widget.onNavigateTab?.call(2),
                        ),
                        const SizedBox(height: 10),
                        SizedBox(
                          height: 185,
                          child: ListView.separated(
                            scrollDirection: Axis.horizontal,
                            physics: const BouncingScrollPhysics(),
                            itemCount: sampleServices.take(5).length,
                            separatorBuilder: (_, __) => const SizedBox(width: 12),
                            itemBuilder: (context, index) {
                              final service = sampleServices[index];
                              return SizedBox(
                                width: isSmall ? 210 : 230,
                                child: ServiceCard(
                                  title: service.name,
                                  description: service.description,
                                  basePrice: service.basePrice,
                                  priceUnit: service.priceUnit,
                                  turnaroundTime: service.turnaroundTime,
                                  icon: _getServiceIcon(service.category),
                                  onTap: () => widget.onNavigateTab?.call(2),
                                ),
                              );
                            },
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 24),

                  // Featured Products Grid
                  AnimatedReveal(
                    delay: 300,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        SectionHeader(
                          title: 'Featured Store Products',
                          subtitle: 'Genuine toners, paper, and computer supplies',
                          actionText: 'View All Products',
                          onAction: () => widget.onNavigateTab?.call(1),
                        ),
                        const SizedBox(height: 10),
                        LayoutBuilder(
                          builder: (context, constraints) {
                            final cols = constraints.maxWidth >= 600 ? 3 : 2;
                            final aspectRatio = constraints.maxWidth < 360 ? 0.62 : 0.68;
                            return GridView.builder(
                              shrinkWrap: true,
                              physics: const NeverScrollableScrollPhysics(),
                              itemCount: sampleProducts.take(4).length,
                              gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                                crossAxisCount: cols,
                                crossAxisSpacing: 10,
                                mainAxisSpacing: 10,
                                childAspectRatio: aspectRatio,
                              ),
                              itemBuilder: (context, index) {
                                final prod = sampleProducts[index];
                                return ProductCard(
                                  title: prod.name,
                                  brand: prod.brand,
                                  price: prod.price,
                                  originalPrice: prod.originalPrice,
                                  unit: prod.unit,
                                  stockQuantity: prod.stockQuantity,
                                  imageUrl: prod.imageUrl,
                                  onTap: () => widget.onNavigateTab?.call(1),
                                  onAddToCart: () {
                                    ScaffoldMessenger.of(context).showSnackBar(
                                      SnackBar(
                                        content: Text('${prod.name} added to cart!'),
                                        duration: const Duration(seconds: 1),
                                        backgroundColor: AppColors.primary,
                                      ),
                                    );
                                  },
                                );
                              },
                            );
                          },
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 28),

                  // Why Choose Us Section
                  AnimatedReveal(
                    delay: 350,
                    child: Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: AppRadius.cardRadius,
                        border: Border.all(color: AppColors.border),
                        boxShadow: AppShadows.soft,
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Why Choose Mukhtar Printing Store?',
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                              color: AppColors.primaryDark,
                            ),
                          ),
                          const SizedBox(height: 12),
                          _buildFeatureRow(Icons.flash_on_rounded, 'Fast Local Turnaround', 'Urgent documents printed and stamped in minutes.'),
                          const SizedBox(height: 8),
                          _buildFeatureRow(Icons.verified_rounded, 'Genuine Quality Consumables', 'Double A & PaperOne A4 pages, original HP toners.'),
                          const SizedBox(height: 8),
                          _buildFeatureRow(Icons.local_shipping_rounded, 'Delivery in Umarzai & Charsadda', 'Fast door-to-door delivery or quick shop pickup.'),
                        ],
                      ),
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

  Widget _buildFeatureRow(IconData icon, String title, String desc) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          padding: const EdgeInsets.all(6),
          decoration: BoxDecoration(
            color: AppColors.primary.withValues(alpha: 0.08),
            borderRadius: BorderRadius.circular(8),
          ),
          child: Icon(icon, color: AppColors.primary, size: 18),
        ),
        const SizedBox(width: 10),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: AppColors.darkText),
              ),
              Text(
                desc,
                style: const TextStyle(fontSize: 11, color: AppColors.mutedText),
              ),
            ],
          ),
        ),
      ],
    );
  }

  IconData _getServiceIcon(String category) {
    switch (category) {
      case 'Photocopy & Document Printing':
        return Icons.copy_rounded;
      case 'Flex & Large Format Printing':
        return Icons.view_carousel_rounded;
      case 'Cards & Stationery':
        return Icons.badge_rounded;
      case 'Rubber Stamps & Seals':
        return Icons.approval_rounded;
      case 'Photography & Studio':
        return Icons.photo_camera_rounded;
      default:
        return Icons.print_rounded;
    }
  }
}
