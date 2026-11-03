import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_radius.dart';
import '../../core/theme/app_shadows.dart';
import '../../core/widgets/order_status_timeline.dart';
import '../../core/widgets/animated_reveal.dart';

class OrdersScreen extends StatefulWidget {
  const OrdersScreen({super.key});

  @override
  State<OrdersScreen> createState() => _OrdersScreenState();
}

class _OrdersScreenState extends State<OrdersScreen> {
  final List<Map<String, dynamic>> _sampleOrders = [
    {
      'id': 'MK-2026-0842',
      'date': 'Oct 30, 2026 • 11:20 AM',
      'status': 'Printing',
      'itemsCount': 3,
      'total': 3480.0,
      'fulfillment': 'Local Delivery (Main Bazar Umarzai)',
      'payment': 'Cash on Delivery',
      'items': [
        'HP LaserJet 85A Toner (Black) x 1',
        'Shop Front Panaflex Banner 6x3ft x 1',
        'Double A A4 Paper 80GSM x 1',
      ],
      'steps': [
        OrderStatusStep(title: 'Order Placed', time: '11:20 AM', isCompleted: true, isCurrent: false),
        OrderStatusStep(title: 'Confirmed by Shop', time: '11:35 AM', isCompleted: true, isCurrent: false),
        OrderStatusStep(title: 'Printing / Composing', time: '11:50 AM', isCompleted: true, isCurrent: true),
        OrderStatusStep(title: 'Quality Check & Packing', time: 'Pending', isCompleted: false, isCurrent: false),
        OrderStatusStep(title: 'Out for Delivery', time: 'Pending', isCompleted: false, isCurrent: false),
        OrderStatusStep(title: 'Delivered', time: 'Pending', isCompleted: false, isCurrent: false),
      ],
    },
    {
      'id': 'MK-2026-0810',
      'date': 'Oct 28, 2026 • 02:45 PM',
      'status': 'Delivered',
      'itemsCount': 2,
      'total': 1850.0,
      'fulfillment': 'Shop Pickup',
      'payment': 'EasyPaisa (Paid)',
      'items': [
        'Official Round Rubber Stamp x 1',
        'Glossy Photo Paper 200GSM (Pack of 50) x 1',
      ],
      'steps': [
        OrderStatusStep(title: 'Order Placed', time: '02:45 PM', isCompleted: true, isCurrent: false),
        OrderStatusStep(title: 'Confirmed by Shop', time: '03:00 PM', isCompleted: true, isCurrent: false),
        OrderStatusStep(title: 'Printing / Prepared', time: '03:40 PM', isCompleted: true, isCurrent: false),
        OrderStatusStep(title: 'Quality Checked', time: '04:10 PM', isCompleted: true, isCurrent: false),
        OrderStatusStep(title: 'Ready for Pickup', time: '04:30 PM', isCompleted: true, isCurrent: false),
        OrderStatusStep(title: 'Completed & Collected', time: '05:15 PM', isCompleted: true, isCurrent: false),
      ],
    },
  ];

  void _showOrderTimeline(Map<String, dynamic> order) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) {
        final steps = order['steps'] as List<OrderStatusStep>;
        final items = order['items'] as List<String>;

        return Container(
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
          ),
          padding: EdgeInsets.fromLTRB(20, 16, 20, MediaQuery.paddingOf(context).bottom + 20),
          child: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Center(
                  child: Container(
                    width: 40,
                    height: 4,
                    decoration: BoxDecoration(color: AppColors.border, borderRadius: BorderRadius.circular(2)),
                  ),
                ),
                const SizedBox(height: 16),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Order ${order['id']}', style: const TextStyle(fontSize: 17, fontWeight: FontWeight.bold, color: AppColors.primaryDark)),
                        Text('${order['date']}', style: const TextStyle(fontSize: 12, color: AppColors.mutedText)),
                      ],
                    ),
                    _buildStatusChip(order['status'] as String),
                  ],
                ),
                const SizedBox(height: 20),
                const Text('Live Progress Timeline', style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold)),
                const SizedBox(height: 12),
                OrderStatusTimeline(steps: steps),
                const SizedBox(height: 16),
                const Text('Items Ordered', style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold)),
                const SizedBox(height: 8),
                ...items.map((it) => Padding(
                      padding: const EdgeInsets.symmetric(vertical: 2),
                      child: Row(
                        children: [
                          const Icon(Icons.circle, size: 6, color: AppColors.primary),
                          const SizedBox(width: 8),
                          Expanded(child: Text(it, style: const TextStyle(fontSize: 12, color: AppColors.darkText))),
                        ],
                      ),
                    )),
                const Divider(height: 24),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('Total Amount:', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                    Text('Rs. ${(order['total'] as double).toStringAsFixed(0)}', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: AppColors.primary)),
                  ],
                ),
                const SizedBox(height: 20),
                Row(
                  children: [
                    Expanded(
                      child: OutlinedButton.icon(
                        icon: const Icon(Icons.phone, size: 18),
                        label: const Text('Call Shop'),
                        onPressed: () {},
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: ElevatedButton.icon(
                        icon: const Icon(Icons.chat, size: 18, color: Color(0xFF25D366)),
                        label: const Text('WhatsApp'),
                        onPressed: () {},
                        style: ElevatedButton.styleFrom(backgroundColor: AppColors.primaryDark),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildStatusChip(String status) {
    Color bg;
    Color fg;
    if (status == 'Delivered') {
      bg = const Color(0xFFDCFCE7);
      fg = const Color(0xFF166534);
    } else if (status == 'Printing') {
      bg = const Color(0xFFDBEAFE);
      fg = const Color(0xFF1E40AF);
    } else {
      bg = const Color(0xFFFEF3C7);
      fg = const Color(0xFF92400E);
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(color: bg, borderRadius: BorderRadius.circular(12)),
      child: Text(status, style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: fg)),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('My Orders & Tracking'),
        backgroundColor: AppColors.primary,
      ),
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: _sampleOrders.length,
        itemBuilder: (context, index) {
          final order = _sampleOrders[index];
          return AnimatedReveal(
            delay: index * 80,
            child: Container(
              margin: const EdgeInsets.only(bottom: 12),
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
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(order['id'] as String, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: AppColors.primaryDark)),
                      _buildStatusChip(order['status'] as String),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Text(order['date'] as String, style: const TextStyle(fontSize: 12, color: AppColors.mutedText)),
                  const Divider(height: 16),
                  Text('${order['itemsCount']} items • ${order['fulfillment']}', style: const TextStyle(fontSize: 12, color: AppColors.darkText)),
                  const SizedBox(height: 6),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text('Rs. ${(order['total'] as double).toStringAsFixed(0)}', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: AppColors.primary)),
                      TextButton.icon(
                        icon: const Icon(Icons.timeline_rounded, size: 16),
                        label: const Text('Track Order'),
                        onPressed: () => _showOrderTimeline(order),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
