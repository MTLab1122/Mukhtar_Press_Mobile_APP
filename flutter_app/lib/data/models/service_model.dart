class ServiceModel {
  final String id;
  final String name;
  final String shortDescription;
  final String detailedDescription;
  final String category;
  final double basePrice;
  final String priceUnit; // per piece, per sq ft, per page, per design, per stamp, per card
  final String estimatedDeliveryTime;
  final List<String> availableOptions;
  final bool requiresFileUpload;
  final String? iconName;
  final DateTime createdAt;

  ServiceModel({
    required this.id,
    required this.name,
    required this.shortDescription,
    required this.detailedDescription,
    required this.category,
    required this.basePrice,
    required this.priceUnit,
    required this.estimatedDeliveryTime,
    required this.availableOptions,
    this.requiresFileUpload = true,
    this.iconName,
    required this.createdAt,
  });

  Map<String, dynamic> toMap() {
    return {
      'name': name,
      'shortDescription': shortDescription,
      'detailedDescription': detailedDescription,
      'category': category,
      'basePrice': basePrice,
      'priceUnit': priceUnit,
      'estimatedDeliveryTime': estimatedDeliveryTime,
      'availableOptions': availableOptions,
      'requiresFileUpload': requiresFileUpload,
      'iconName': iconName,
      'createdAt': createdAt.toIso8601String(),
    };
  }

  factory ServiceModel.fromMap(String id, Map<String, dynamic> map) {
    return ServiceModel(
      id: id,
      name: map['name'] ?? '',
      shortDescription: map['shortDescription'] ?? '',
      detailedDescription: map['detailedDescription'] ?? '',
      category: map['category'] ?? 'Printing',
      basePrice: (map['basePrice'] as num?)?.toDouble() ?? 0.0,
      priceUnit: map['priceUnit'] ?? 'per piece',
      estimatedDeliveryTime: map['estimatedDeliveryTime'] ?? 'Same Day',
      availableOptions: List<String>.from(map['availableOptions'] ?? []),
      requiresFileUpload: map['requiresFileUpload'] ?? true,
      iconName: map['iconName'],
      createdAt: map['createdAt'] != null
          ? DateTime.tryParse(map['createdAt']) ?? DateTime.now()
          : DateTime.now(),
    );
  }
}
