class ProductModel {
  final String id;
  final String name;
  final String description;
  final String category;
  final String? brand;
  final double price;
  final double? discountPrice;
  final int stockQuantity;
  final String imageUrl;
  final String unit;
  final bool isAvailable;
  final List<String> tags;
  final DateTime createdAt;
  final DateTime? updatedAt;

  ProductModel({
    required this.id,
    required this.name,
    required this.description,
    required this.category,
    this.brand,
    required this.price,
    this.discountPrice,
    required this.stockQuantity,
    required this.imageUrl,
    required this.unit,
    this.isAvailable = true,
    required this.tags,
    required this.createdAt,
    this.updatedAt,
  });

  double get effectivePrice => discountPrice ?? price;
  bool get isOutOfStock => stockQuantity <= 0;
  bool get isLowStock => stockQuantity > 0 && stockQuantity <= 5;

  Map<String, dynamic> toMap() {
    return {
      'name': name,
      'description': description,
      'category': category,
      'brand': brand,
      'price': price,
      'discountPrice': discountPrice,
      'stockQuantity': stockQuantity,
      'imageUrl': imageUrl,
      'unit': unit,
      'isAvailable': isAvailable,
      'tags': tags,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt?.toIso8601String(),
    };
  }

  factory ProductModel.fromMap(String id, Map<String, dynamic> map) {
    return ProductModel(
      id: id,
      name: map['name'] ?? '',
      description: map['description'] ?? '',
      category: map['category'] ?? 'General',
      brand: map['brand'],
      price: (map['price'] as num?)?.toDouble() ?? 0.0,
      discountPrice: (map['discountPrice'] as num?)?.toDouble(),
      stockQuantity: (map['stockQuantity'] as num?)?.toInt() ?? 0,
      imageUrl: map['imageUrl'] ?? '',
      unit: map['unit'] ?? 'piece',
      isAvailable: map['isAvailable'] ?? true,
      tags: List<String>.from(map['tags'] ?? []),
      createdAt: map['createdAt'] != null
          ? DateTime.tryParse(map['createdAt']) ?? DateTime.now()
          : DateTime.now(),
      updatedAt: map['updatedAt'] != null ? DateTime.tryParse(map['updatedAt']) : null,
    );
  }
}
