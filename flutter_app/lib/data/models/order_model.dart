enum OrderStatusType {
  placed,
  confirmed,
  designing,
  printing,
  ready,
  completed,
  cancelled,
}

class OrderItemModel {
  final String id;
  final String title;
  final String type; // 'product' | 'service'
  final int quantity;
  final double unitPrice;
  final double totalPrice;
  final Map<String, dynamic>? specs;
  final List<String> fileUrls;

  OrderItemModel({
    required this.id,
    required this.title,
    required this.type,
    required this.quantity,
    required this.unitPrice,
    required this.totalPrice,
    this.specs,
    this.fileUrls = const [],
  });

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'title': title,
      'type': type,
      'quantity': quantity,
      'unitPrice': unitPrice,
      'totalPrice': totalPrice,
      'specs': specs,
      'fileUrls': fileUrls,
    };
  }

  factory OrderItemModel.fromMap(Map<String, dynamic> map) {
    return OrderItemModel(
      id: map['id'] ?? '',
      title: map['title'] ?? '',
      type: map['type'] ?? 'product',
      quantity: (map['quantity'] as num?)?.toInt() ?? 1,
      unitPrice: (map['unitPrice'] as num?)?.toDouble() ?? 0.0,
      totalPrice: (map['totalPrice'] as num?)?.toDouble() ?? 0.0,
      specs: map['specs'] != null ? Map<String, dynamic>.from(map['specs']) : null,
      fileUrls: List<String>.from(map['fileUrls'] ?? []),
    );
  }
}

class OrderModel {
  final String id;
  final String orderNumber;
  final String userId;
  final String customerName;
  final String phone;
  final String? whatsappNumber;
  final String deliveryMethod; // 'pickup' | 'delivery'
  final String? deliveryAddress;
  final String paymentMethod; // 'cod' | 'jazzcash' | 'easypaisa' | 'bank'
  final OrderStatusType status;
  final List<OrderItemModel> items;
  final double subtotal;
  final double deliveryFee;
  final double totalAmount;
  final String? adminNotes;
  final DateTime createdAt;
  final DateTime? updatedAt;

  OrderModel({
    required this.id,
    required this.orderNumber,
    required this.userId,
    required this.customerName,
    required this.phone,
    this.whatsappNumber,
    required this.deliveryMethod,
    this.deliveryAddress,
    required this.paymentMethod,
    this.status = OrderStatusType.placed,
    required this.items,
    required this.subtotal,
    required this.deliveryFee,
    required this.totalAmount,
    this.adminNotes,
    required this.createdAt,
    this.updatedAt,
  });

  Map<String, dynamic> toMap() {
    return {
      'orderNumber': orderNumber,
      'userId': userId,
      'customerName': customerName,
      'phone': phone,
      'whatsappNumber': whatsappNumber,
      'deliveryMethod': deliveryMethod,
      'deliveryAddress': deliveryAddress,
      'paymentMethod': paymentMethod,
      'status': status.name,
      'items': items.map((i) => i.toMap()).toList(),
      'subtotal': subtotal,
      'deliveryFee': deliveryFee,
      'totalAmount': totalAmount,
      'adminNotes': adminNotes,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt?.toIso8601String(),
    };
  }

  factory OrderModel.fromMap(String id, Map<String, dynamic> map) {
    return OrderModel(
      id: id,
      orderNumber: map['orderNumber'] ?? id,
      userId: map['userId'] ?? '',
      customerName: map['customerName'] ?? '',
      phone: map['phone'] ?? '',
      whatsappNumber: map['whatsappNumber'],
      deliveryMethod: map['deliveryMethod'] ?? 'pickup',
      deliveryAddress: map['deliveryAddress'],
      paymentMethod: map['paymentMethod'] ?? 'cod',
      status: OrderStatusType.values.firstWhere(
        (e) => e.name == map['status'],
        orElse: () => OrderStatusType.placed,
      ),
      items: (map['items'] as List<dynamic>?)
              ?.map((item) => OrderItemModel.fromMap(Map<String, dynamic>.from(item)))
              .toList() ??
          [],
      subtotal: (map['subtotal'] as num?)?.toDouble() ?? 0.0,
      deliveryFee: (map['deliveryFee'] as num?)?.toDouble() ?? 0.0,
      totalAmount: (map['totalAmount'] as num?)?.toDouble() ?? 0.0,
      adminNotes: map['adminNotes'],
      createdAt: map['createdAt'] != null
          ? DateTime.tryParse(map['createdAt']) ?? DateTime.now()
          : DateTime.now(),
      updatedAt: map['updatedAt'] != null ? DateTime.tryParse(map['updatedAt']) : null,
    );
  }
}
