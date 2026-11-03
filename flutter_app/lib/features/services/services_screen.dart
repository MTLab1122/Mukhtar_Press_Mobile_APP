import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_radius.dart';
import '../../core/theme/app_shadows.dart';
import '../../core/theme/app_spacing.dart';
import '../../core/widgets/service_card.dart';
import '../../core/widgets/file_upload_card.dart';
import '../../core/widgets/animated_reveal.dart';
import '../../data/models/service_model.dart';

class ServicesScreen extends StatefulWidget {
  final VoidCallback? onCartPressed;

  const ServicesScreen({super.key, this.onCartPressed});

  @override
  State<ServicesScreen> createState() => _ServicesScreenState();
}

class _ServicesScreenState extends State<ServicesScreen> {
  String _selectedCategory = 'All';

  final List<String> _categories = [
    'All',
    'Photocopy & Document Printing',
    'Flex & Large Format Printing',
    'Cards & Stationery',
    'Rubber Stamps & Seals',
    'Photography & Studio',
  ];

  List<ServiceModel> get _filteredServices {
    if (_selectedCategory == 'All') return sampleServices;
    return sampleServices.where((s) => s.category == _selectedCategory).toList();
  }

  void _openServiceConfig(ServiceModel service) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) {
        int copies = 1;
        int pages = 1;
        double width = 4;
        double height = 3;
        bool isColor = false;
        bool isLaminated = false;
        String? uploadedFileName;

        return StatefulBuilder(
          builder: (context, setModalState) {
            double calculatedPrice = service.basePrice;
            if (service.priceUnit == 'sqft') {
              calculatedPrice = (width * height * service.basePrice * copies);
            } else if (service.priceUnit == 'page') {
              double rate = isColor ? 25.0 : service.basePrice;
              if (isLaminated) rate += 20.0;
              calculatedPrice = rate * pages * copies;
            } else {
              calculatedPrice = service.basePrice * copies;
            }

            return Container(
              decoration: const BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
              ),
              padding: EdgeInsets.fromLTRB(
                20,
                16,
                20,
                MediaQuery.paddingOf(context).bottom + 20,
              ),
              child: SingleChildScrollView(
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
                      children: [
                        Container(
                          padding: const EdgeInsets.all(10),
                          decoration: BoxDecoration(
                            color: AppColors.primary.withValues(alpha: 0.08),
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: Icon(_getServiceIcon(service.category), color: AppColors.primary, size: 24),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                service.name,
                                style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.darkText),
                              ),
                              Text(
                                '${service.turnaroundTime} • From Rs. ${service.basePrice.toStringAsFixed(0)}/${service.priceUnit}',
                                style: const TextStyle(fontSize: 12, color: AppColors.mutedText),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    Text(
                      service.description,
                      style: const TextStyle(fontSize: 13, color: AppColors.mutedText, height: 1.3),
                    ),
                    const SizedBox(height: 16),
                    const Divider(),

                    // Flex banner size configuration
                    if (service.priceUnit == 'sqft') ...[
                      const Text('Banner Dimensions (Feet):', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                      const SizedBox(height: 8),
                      Row(
                        children: [
                          Expanded(
                            child: TextFormField(
                              initialValue: '4',
                              keyboardType: TextInputType.number,
                              decoration: const InputDecoration(labelText: 'Width (ft)', isDense: true),
                              onChanged: (v) {
                                final n = double.tryParse(v);
                                if (n != null && n > 0) setModalState(() => width = n);
                              },
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: TextFormField(
                              initialValue: '3',
                              keyboardType: TextInputType.number,
                              decoration: const InputDecoration(labelText: 'Height (ft)', isDense: true),
                              onChanged: (v) {
                                final n = double.tryParse(v);
                                if (n != null && n > 0) setModalState(() => height = n);
                              },
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),
                    ],

                    // Page count configuration
                    if (service.priceUnit == 'page') ...[
                      Row(
                        children: [
                          Expanded(
                            child: TextFormField(
                              initialValue: '1',
                              keyboardType: TextInputType.number,
                              decoration: const InputDecoration(labelText: 'Page Count', isDense: true),
                              onChanged: (v) {
                                final n = int.tryParse(v);
                                if (n != null && n > 0) setModalState(() => pages = n);
                              },
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: CheckboxListTile(
                              title: const Text('Color Print', style: TextStyle(fontSize: 12)),
                              value: isColor,
                              contentPadding: EdgeInsets.zero,
                              onChanged: (v) => setModalState(() => isColor = v ?? false),
                            ),
                          ),
                        ],
                      ),
                      CheckboxListTile(
                        title: const Text('Add Plastic Lamination (+Rs. 20/page)', style: TextStyle(fontSize: 12)),
                        value: isLaminated,
                        contentPadding: EdgeInsets.zero,
                        onChanged: (v) => setModalState(() => isLaminated = v ?? false),
                      ),
                    ],

                    // Quantity selector
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text('Copies / Quantity:', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
                        Row(
                          children: [
                            IconButton(
                              icon: const Icon(Icons.remove_circle_outline),
                              onPressed: copies > 1 ? () => setModalState(() => copies--) : null,
                            ),
                            Text('$copies', style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold)),
                            IconButton(
                              icon: const Icon(Icons.add_circle_outline),
                              onPressed: () => setModalState(() => copies++),
                            ),
                          ],
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),

                    // File Upload Card
                    FileUploadCard(
                      label: 'Upload Document / Design File (Optional)',
                      hint: 'PDF, DOCX, JPG, PNG up to 25MB',
                      uploadedFileName: uploadedFileName,
                      onFilePicked: (name, size) {
                        setModalState(() => uploadedFileName = name);
                      },
                      onFileRemoved: () {
                        setModalState(() => uploadedFileName = null);
                      },
                    ),
                    const SizedBox(height: 20),

                    // Add to cart button with live calculated price
                    ElevatedButton(
                      onPressed: () {
                        Navigator.pop(context);
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: Text('${service.name} added to cart (Rs. ${calculatedPrice.toStringAsFixed(0)})'),
                            backgroundColor: AppColors.primary,
                          ),
                        );
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.primaryAccent,
                        minimumSize: const Size.fromHeight(50),
                      ),
                      child: Text(
                        'Add to Cart • Rs. ${calculatedPrice.toStringAsFixed(0)}',
                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
                      ),
                    ),
                  ],
                ),
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
    final services = _filteredServices;

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Printing & Design Services'),
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
          // Category selector chips
          Container(
            color: Colors.white,
            padding: EdgeInsets.symmetric(horizontal: isSmall ? 12 : 16, vertical: 10),
            child: SizedBox(
              height: 36,
              child: ListView.separated(
                scrollDirection: Axis.horizontal,
                itemCount: _categories.length,
                separatorBuilder: (_, __) => const SizedBox(width: 8),
                itemBuilder: (context, index) {
                  final cat = _categories[index];
                  final isSel = _selectedCategory == cat;
                  return ChoiceChip(
                    label: Text(
                      cat,
                      style: TextStyle(fontSize: 11, color: isSel ? Colors.white : AppColors.darkText),
                    ),
                    selected: isSel,
                    selectedColor: AppColors.primary,
                    backgroundColor: AppColors.background,
                    onSelected: (_) => setState(() => _selectedCategory = cat),
                  );
                },
              ),
            ),
          ),

          // Services Grid/List
          Expanded(
            child: LayoutBuilder(
              builder: (context, constraints) {
                final isWide = constraints.maxWidth >= 600;
                return GridView.builder(
                  padding: EdgeInsets.all(isSmall ? 12 : 16),
                  physics: const BouncingScrollPhysics(),
                  itemCount: services.length,
                  gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: isWide ? 2 : 1,
                    mainAxisSpacing: 12,
                    crossAxisSpacing: 12,
                    childAspectRatio: isWide ? 2.3 : 2.1,
                  ),
                  itemBuilder: (context, index) {
                    final service = services[index];
                    return AnimatedReveal(
                      delay: (index * 40).clamp(0, 300),
                      child: ServiceCard(
                        title: service.name,
                        description: service.description,
                        basePrice: service.basePrice,
                        priceUnit: service.priceUnit,
                        turnaroundTime: service.turnaroundTime,
                        icon: _getServiceIcon(service.category),
                        onTap: () => _openServiceConfig(service),
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
