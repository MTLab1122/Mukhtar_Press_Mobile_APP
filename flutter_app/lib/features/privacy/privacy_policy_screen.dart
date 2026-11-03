import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import '../../core/constants/shop_location.dart';

class PrivacyPolicyScreen extends StatelessWidget {
  const PrivacyPolicyScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Privacy Policy'),
        backgroundColor: AppColors.primary,
        foregroundColor: Colors.white,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(AppSpacing.lg),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Privacy Policy for Mukhtar Printing & Store',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppColors.darkText),
            ),
            const SizedBox(height: 4),
            Text(
              'Last Updated: October 30, 2026 • Main Bazar Umarzai',
              style: TextStyle(fontSize: 12, color: AppColors.mutedText),
            ),
            const Divider(height: 24),

            _buildSection(
              title: '1. Introduction',
              content:
                  'Mukhtar Ahmed Printing & Computer Store ("we", "our", or "us"), located at Main Bazar Umarzai, Tehsil & District Charsadda, Khyber Pakhtunkhwa, Pakistan, operates the "Mukhtar Printing & Store" mobile application. We respect your privacy and are committed to protecting the personal data you share with us.',
            ),

            _buildSection(
              title: '2. Information We Collect',
              content:
                  'We only collect information necessary to process your printing and product orders:\n\n'
                  '• Personal Details: Your full name, delivery address, and Pakistani mobile number (for order verification and dispatch).\n'
                  '• Uploaded Files: Design documents, images (JPG, PNG), and PDF files you upload for printing, photocopy, flex, card, or stamp making.\n'
                  '• Transaction Information: Order history, items purchased, chosen payment method (Cash on Delivery, Shop Pickup, JazzCash, EasyPaisa, or Bank Transfer), and payment references.\n'
                  '• Device & Diagnostic Data: Standard anonymous crash reports and FCM notification tokens to send order status updates.',
            ),

            _buildSection(
              title: '3. How We Use Your Information',
              content:
                  'Your data is strictly used for:\n\n'
                  '• Fulfilling and delivering your printing and product orders.\n'
                  '• Contacting you via call or WhatsApp regarding proof approvals, corrections, or collection.\n'
                  '• Sending real-time order status notifications (e.g., Designing, Printing, Ready for Pickup).\n'
                  '• Providing shop directions and customer support.',
            ),

            _buildSection(
              title: '4. File Uploads & Security',
              content:
                  'Files uploaded for printing (up to 25 MB per order) are stored securely in Google Firebase Cloud Storage with strict access rules. Only you and authorized shop staff (Mukhtar Ahmed) can access your files to print your work. We do not use your personal designs, photos, or confidential documents for any advertising or public display without your explicit written consent.',
            ),

            _buildSection(
              title: '5. Data Sharing & Third Parties',
              content:
                  'We do not sell, rent, or trade your personal information. We utilize trusted infrastructure providers solely for app operations:\n\n'
                  '• Google Firebase (Authentication, Firestore Database, Cloud Storage) hosted with encryption in transit (HTTPS/TLS) and at rest.\n'
                  '• WhatsApp (Meta) when you voluntarily choose to contact or send order references through WhatsApp.',
            ),

            _buildSection(
              title: '6. Data Retention & Account Deletion',
              content:
                  'We retain order records for accounting and repeat printing requests. You have the right to request deletion of your account and uploaded files at any time by contacting Mukhtar Ahmed directly at 03149958963 or through the in-app support chat.',
            ),

            _buildSection(
              title: '7. Contact Us',
              content:
                  'If you have questions or concerns regarding this Privacy Policy:\n\n'
                  'Shop Owner: Mukhtar Ahmed\n'
                  'Business: Mukhtar Ahmed Printing & Computer Store\n'
                  'Location: Main Bazar Umarzai, Charsadda, Khyber Pakhtunkhwa, Pakistan\n'
                  'Phone / WhatsApp: 03149958963',
            ),
            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }

  Widget _buildSection({required String title, required String content}) {
    return Padding(
      padding: const EdgeInsets.only(bottom: AppSpacing.md),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: AppColors.primary),
          ),
          const SizedBox(height: 6),
          Text(
            content,
            style: const TextStyle(fontSize: 13, color: AppColors.darkText, height: 1.5),
          ),
        ],
      ),
    );
  }
}
