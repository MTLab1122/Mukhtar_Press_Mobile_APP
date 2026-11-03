import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_radius.dart';
import '../../core/theme/app_shadows.dart';
import '../../core/constants/shop_location.dart';
import '../privacy/privacy_policy_screen.dart';

class ProfileScreen extends StatelessWidget {
  final VoidCallback? onLogout;

  const ProfileScreen({super.key, this.onLogout});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('My Account & Shop Info'),
        backgroundColor: AppColors.primary,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        physics: const BouncingScrollPhysics(),
        child: Column(
          children: [
            // User Header Card
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: AppRadius.cardRadius,
                border: Border.all(color: AppColors.border),
                boxShadow: AppShadows.soft,
              ),
              child: Row(
                children: [
                  CircleAvatar(
                    radius: 28,
                    backgroundColor: AppColors.primary,
                    child: const Text('MK', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 18)),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('Muhammad Kamran', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.darkText)),
                        const Text('+92 314 9958963', style: TextStyle(fontSize: 12, color: AppColors.mutedText)),
                        const SizedBox(height: 4),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                          decoration: BoxDecoration(
                            color: const Color(0xFFDCFCE7),
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: const Text('Verified Customer', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Color(0xFF166534))),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Shop Information Card
            Container(
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
                  const Text('Shop Contact & Location', style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: AppColors.primaryDark)),
                  const SizedBox(height: 10),
                  _buildShopRow(Icons.storefront_rounded, ShopLocation.shopName),
                  const SizedBox(height: 8),
                  _buildShopRow(Icons.person_outline, 'Owner: ${ShopLocation.ownerName}'),
                  const SizedBox(height: 8),
                  _buildShopRow(Icons.location_on_outlined, ShopLocation.fullAddress),
                  const SizedBox(height: 8),
                  _buildShopRow(Icons.access_time_rounded, 'Opening Hours: 8:00 AM - 9:00 PM (Mon-Sat)'),
                  const SizedBox(height: 8),
                  _buildShopRow(Icons.phone_outlined, 'Helpline: ${ShopLocation.phone}'),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Settings & Legal List
            Container(
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: AppRadius.cardRadius,
                border: Border.all(color: AppColors.border),
                boxShadow: AppShadows.soft,
              ),
              child: Column(
                children: [
                  ListTile(
                    leading: const Icon(Icons.shield_outlined, color: AppColors.primary),
                    title: const Text('In-App Privacy Policy', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600)),
                    subtitle: const Text('Google Play & App Store compliant', style: TextStyle(fontSize: 11, color: AppColors.mutedText)),
                    trailing: const Icon(Icons.chevron_right, size: 20),
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (context) => const PrivacyPolicyScreen()),
                      );
                    },
                  ),
                  const Divider(height: 1),
                  ListTile(
                    leading: const Icon(Icons.notifications_outlined, color: AppColors.primary),
                    title: const Text('Order Push Notifications', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600)),
                    trailing: Switch(value: true, activeColor: AppColors.primary, onChanged: (_) {}),
                  ),
                  const Divider(height: 1),
                  ListTile(
                    leading: const Icon(Icons.call_outlined, color: Color(0xFF16A34A)),
                    title: const Text('Direct Call to Mukhtar Ahmed', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600)),
                    trailing: const Icon(Icons.chevron_right, size: 20),
                    onTap: () {},
                  ),
                  const Divider(height: 1),
                  ListTile(
                    leading: const Icon(Icons.chat_bubble_outline, color: Color(0xFF25D366)),
                    title: const Text('WhatsApp Chat Support', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600)),
                    trailing: const Icon(Icons.chevron_right, size: 20),
                    onTap: () {},
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Logout Button
            OutlinedButton.icon(
              icon: const Icon(Icons.logout, size: 18, color: AppColors.error),
              label: const Text('Sign Out', style: TextStyle(color: AppColors.error)),
              onPressed: onLogout,
              style: OutlinedButton.styleFrom(
                minimumSize: const Size.fromHeight(50),
                side: const BorderSide(color: AppColors.error),
              ),
            ),
            const SizedBox(height: 32),
          ],
        ),
      ),
    );
  }

  Widget _buildShopRow(IconData icon, String text) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Icon(icon, size: 16, color: AppColors.primary),
        const SizedBox(width: 8),
        Expanded(child: Text(text, style: const TextStyle(fontSize: 12, color: AppColors.darkText))),
      ],
    );
  }
}
