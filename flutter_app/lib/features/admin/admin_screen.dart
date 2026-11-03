import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_radius.dart';
import '../../core/theme/app_shadows.dart';
import '../../core/widgets/animated_reveal.dart';

class AdminScreen extends StatefulWidget {
  const AdminScreen({super.key});

  @override
  State<AdminScreen> createState() => _AdminScreenState();
}

class _AdminScreenState extends State<AdminScreen> {
  int _activeTab = 0; // 0: Orders, 1: Inventory, 2: Services

  final List<Map<String, dynamic>> _adminOrders = [
    {
      'id': 'MK-2026-0842',
      'customer': 'Kamran Khan',
      'phone': '0314-9958963',
      'service': 'Flex Banner (6x3ft) + HP 85A Toner',
      'status': 'Printing',
      'amount': 3480.0,
      'time': '11:20 AM Today',
    },
    {
      'id': 'MK-2026-0841',
      'customer': 'Saeed Jan',
      'phone': '0300-1234567',
      'service': '100 Copies B&W + 2 Plastic Lamination',
      'status': 'Pending',
      'amount': 1040.0,
      'time': '10:05 AM Today',
    },
    {
      'id': 'MK-2026-0840',
      'customer': 'Tariq Mehmood',
      'phone': '0333-9876543',
      'service': '2 Official Round Rubber Stamps',
      'status': 'Completed',
      'amount': 1500.0,
      'time': '09:15 AM Today',
    },
  ];

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.sizeOf(context);
    final isSmall = size.width < 360;

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Shop Owner Admin Panel'),
        backgroundColor: AppColors.primaryDark,
      ),
      body: SingleChildScrollView(
        padding: EdgeInsets.all(isSmall ? 12 : 16),
        physics: const BouncingScrollPhysics(),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // KPI Stat Cards Grid
            AnimatedReveal(
              delay: 50,
              child: LayoutBuilder(
                builder: (context, constraints) {
                  final cols = constraints.maxWidth >= 600 ? 4 : 2;
                  return GridView.count(
                    crossAxisCount: cols,
                    crossAxisSpacing: 10,
                    mainAxisSpacing: 10,
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    childAspectRatio: 1.4,
                    children: [
                      _buildStatCard('Today Revenue', 'Rs. 42,850', Icons.account_balance_wallet_rounded, const Color(0xFF16A34A)),
                      _buildStatCard('Active Orders', '12 Orders', Icons.pending_actions_rounded, AppColors.primaryAccent),
                      _buildStatCard('Printing Queue', '5 Jobs', Icons.print_rounded, AppColors.primary),
                      _buildStatCard('Low Stock Items', '3 Products', Icons.warning_amber_rounded, const Color(0xFFDC2626)),
                    ],
                  );
                },
              ),
            ),
            const SizedBox(height: 20),

            // Tab Navigation (Orders / Products)
            Row(
              children: [
                _buildFilterTab(0, 'Customer Orders'),
                const SizedBox(width: 8),
                _buildFilterTab(1, 'Product Stock'),
              ],
            ),
            const SizedBox(height: 14),

            // Order List
            ..._adminOrders.asMap().entries.map((entry) {
              final index = entry.key;
              final order = entry.value;
              return AnimatedReveal(
                delay: 100 + (index * 60),
                child: Container(
                  margin: const EdgeInsets.only(bottom: 10),
                  padding: const EdgeInsets.all(14),
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
                          Text(order['id'] as String, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: AppColors.primaryDark)),
                          _buildStatusBadge(order['status'] as String),
                        ],
                      ),
                      const SizedBox(height: 4),
                      Text('${order['customer']} • ${order['phone']}', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600)),
                      Text(order['service'] as String, style: const TextStyle(fontSize: 12, color: AppColors.mutedText)),
                      const Divider(height: 16),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text('Rs. ${(order['amount'] as double).toStringAsFixed(0)}', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: AppColors.primary)),
                          Row(
                            children: [
                              OutlinedButton(
                                onPressed: () {
                                  setState(() => order['status'] = 'Printing');
                                },
                                style: OutlinedButton.styleFrom(
                                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                                  minimumSize: Size.zero,
                                ),
                                child: const Text('Mark Printing', style: TextStyle(fontSize: 11)),
                              ),
                              const SizedBox(width: 6),
                              ElevatedButton(
                                onPressed: () {
                                  setState(() => order['status'] = 'Completed');
                                },
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: AppColors.success,
                                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                                  minimumSize: Size.zero,
                                ),
                                child: const Text('Complete', style: TextStyle(fontSize: 11)),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              );
            }),
            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }

  Widget _buildFilterTab(int index, String label) {
    final isSelected = _activeTab == index;
    return GestureDetector(
      onTap: () => setState(() => _activeTab = index),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        decoration: BoxDecoration(
          color: isSelected ? AppColors.primary : Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: isSelected ? AppColors.primary : AppColors.border),
        ),
        child: Text(
          label,
          style: TextStyle(
            fontSize: 12,
            fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
            color: isSelected ? Colors.white : AppColors.darkText,
          ),
        ),
      ),
    );
  }

  Widget _buildStatCard(String title, String value, IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: AppRadius.cardRadius,
        border: Border.all(color: AppColors.border),
        boxShadow: AppShadows.soft,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(title, style: const TextStyle(fontSize: 11, color: AppColors.mutedText)),
              Icon(icon, size: 18, color: color),
            ],
          ),
          const SizedBox(height: 6),
          Text(value, style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: color)),
        ],
      ),
    );
  }

  Widget _buildStatusBadge(String status) {
    Color bg;
    Color fg;
    if (status == 'Completed') {
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
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
      decoration: BoxDecoration(color: bg, borderRadius: BorderRadius.circular(8)),
      child: Text(status, style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: fg)),
    );
  }
}
