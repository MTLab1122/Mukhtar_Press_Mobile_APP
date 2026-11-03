import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_radius.dart';
import '../../core/theme/app_shadows.dart';
import '../../core/constants/shop_location.dart';

class CheckoutScreen extends StatefulWidget {
  final double subtotal;
  final double deliveryFee;
  final double total;

  const CheckoutScreen({
    super.key,
    required this.subtotal,
    required this.deliveryFee,
    required this.total,
  });

  @override
  State<CheckoutScreen> createState() => _CheckoutScreenState();
}

class _CheckoutScreenState extends State<CheckoutScreen> {
  int _currentStep = 0;
  bool _isSubmitting = false;
  bool _isSuccess = false;

  // Delivery details
  String _deliveryType = 'delivery'; // 'delivery' or 'pickup'
  final _nameController = TextEditingController(text: 'Kamran Khan');
  final _phoneController = TextEditingController(text: '03149958963');
  final _addressController = TextEditingController(text: 'Near Jamia Masjid, Main Bazar Umarzai');
  final _notesController = TextEditingController();

  // Payment method
  String _paymentMethod = 'cod'; // 'cod', 'easypaisa', 'jazzcash', 'bank'

  @override
  void dispose() {
    _nameController.dispose();
    _phoneController.dispose();
    _addressController.dispose();
    _notesController.dispose();
    super.dispose();
  }

  void _submitOrder() {
    setState(() => _isSubmitting = true);
    Future.delayed(const Duration(milliseconds: 1400), () {
      if (mounted) {
        setState(() {
          _isSubmitting = false;
          _isSuccess = true;
        });
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    if (_isSuccess) {
      return _buildSuccessScreen();
    }

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Checkout'),
        backgroundColor: AppColors.primary,
      ),
      body: Column(
        children: [
          // Step progress indicator
          Container(
            color: Colors.white,
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
            child: Row(
              children: [
                _buildStepBubble(0, 'Delivery'),
                _buildStepConnector(0),
                _buildStepBubble(1, 'Payment'),
                _buildStepConnector(1),
                _buildStepBubble(2, 'Confirm'),
              ],
            ),
          ),

          // Step content
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              physics: const BouncingScrollPhysics(),
              child: _currentStep == 0
                  ? _buildDeliveryStep()
                  : _currentStep == 1
                      ? _buildPaymentStep()
                      : _buildReviewStep(),
            ),
          ),

          // Bottom navigation actions
          Container(
            color: Colors.white,
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                if (_currentStep > 0) ...[
                  OutlinedButton(
                    onPressed: () => setState(() => _currentStep--),
                    style: OutlinedButton.styleFrom(
                      minimumSize: const Size(100, 50),
                    ),
                    child: const Text('Back'),
                  ),
                  const SizedBox(width: 12),
                ],
                Expanded(
                  child: ElevatedButton(
                    onPressed: _isSubmitting
                        ? null
                        : () {
                            if (_currentStep < 2) {
                              setState(() => _currentStep++);
                            } else {
                              _submitOrder();
                            }
                          },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.primaryAccent,
                      minimumSize: const Size.fromHeight(50),
                    ),
                    child: _isSubmitting
                        ? const SizedBox(
                            width: 20,
                            height: 20,
                            child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                          )
                        : Text(_currentStep < 2 ? 'Continue' : 'Place Order • Rs. ${widget.total.toStringAsFixed(0)}'),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStepBubble(int stepIndex, String title) {
    final isActive = _currentStep >= stepIndex;
    return Column(
      children: [
        CircleAvatar(
          radius: 14,
          backgroundColor: isActive ? AppColors.primary : AppColors.border,
          child: Text(
            '${stepIndex + 1}',
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.bold,
              color: isActive ? Colors.white : AppColors.mutedText,
            ),
          ),
        ),
        const SizedBox(height: 4),
        Text(
          title,
          style: TextStyle(
            fontSize: 11,
            fontWeight: isActive ? FontWeight.bold : FontWeight.normal,
            color: isActive ? AppColors.primary : AppColors.mutedText,
          ),
        ),
      ],
    );
  }

  Widget _buildStepConnector(int stepIndex) {
    final isDone = _currentStep > stepIndex;
    return Expanded(
      child: Container(
        height: 2,
        margin: const EdgeInsets.symmetric(horizontal: 8),
        color: isDone ? AppColors.primary : AppColors.border,
      ),
    );
  }

  Widget _buildDeliveryStep() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Choose Fulfillment Option',
          style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.primaryDark),
        ),
        const SizedBox(height: 12),
        Row(
          children: [
            Expanded(
              child: GestureDetector(
                onTap: () => setState(() => _deliveryType = 'delivery'),
                child: Container(
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: _deliveryType == 'delivery' ? const Color(0xFFEFF6FF) : Colors.white,
                    border: Border.all(
                      color: _deliveryType == 'delivery' ? AppColors.primary : AppColors.border,
                      width: _deliveryType == 'delivery' ? 2 : 1,
                    ),
                    borderRadius: AppRadius.cardRadius,
                  ),
                  child: Column(
                    children: [
                      Icon(Icons.local_shipping_rounded, color: _deliveryType == 'delivery' ? AppColors.primary : AppColors.mutedText),
                      const SizedBox(height: 6),
                      const Text('Local Delivery', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                      Text('Umarzai / Charsadda', style: TextStyle(fontSize: 11, color: AppColors.mutedText)),
                    ],
                  ),
                ),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: GestureDetector(
                onTap: () => setState(() => _deliveryType = 'pickup'),
                child: Container(
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: _deliveryType == 'pickup' ? const Color(0xFFEFF6FF) : Colors.white,
                    border: Border.all(
                      color: _deliveryType == 'pickup' ? AppColors.primary : AppColors.border,
                      width: _deliveryType == 'pickup' ? 2 : 1,
                    ),
                    borderRadius: AppRadius.cardRadius,
                  ),
                  child: Column(
                    children: [
                      Icon(Icons.storefront_rounded, color: _deliveryType == 'pickup' ? AppColors.primary : AppColors.mutedText),
                      const SizedBox(height: 6),
                      const Text('Shop Pickup', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                      Text('Free • Main Bazar', style: TextStyle(fontSize: 11, color: AppColors.mutedText)),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 20),
        const Text('Contact & Location Information', style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold)),
        const SizedBox(height: 12),
        TextFormField(
          controller: _nameController,
          decoration: const InputDecoration(labelText: 'Full Name *', prefixIcon: Icon(Icons.person_outline)),
        ),
        const SizedBox(height: 12),
        TextFormField(
          controller: _phoneController,
          keyboardType: TextInputType.phone,
          decoration: const InputDecoration(labelText: 'Phone / WhatsApp Number *', prefixIcon: Icon(Icons.phone_outlined)),
        ),
        if (_deliveryType == 'delivery') ...[
          const SizedBox(height: 12),
          TextFormField(
            controller: _addressController,
            maxLines: 2,
            decoration: const InputDecoration(labelText: 'Delivery Address in Umarzai *', prefixIcon: Icon(Icons.location_on_outlined)),
          ),
        ],
        const SizedBox(height: 12),
        TextFormField(
          controller: _notesController,
          decoration: const InputDecoration(labelText: 'Special Instructions / Notes (Optional)', prefixIcon: Icon(Icons.note_alt_outlined)),
        ),
      ],
    );
  }

  Widget _buildPaymentStep() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Select Payment Method',
          style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.primaryDark),
        ),
        const SizedBox(height: 12),
        _buildPaymentOption('cod', 'Cash on Delivery / Pickup', 'Pay cash directly when receiving items at your door or shop.', Icons.payments_outlined),
        const SizedBox(height: 10),
        _buildPaymentOption('easypaisa', 'EasyPaisa Mobile Account', '0314-9958963 (Mukhtar Ahmed). Instant mobile verification.', Icons.account_balance_wallet_outlined),
        const SizedBox(height: 10),
        _buildPaymentOption('jazzcash', 'JazzCash Account', '0314-9958963 (Mukhtar Ahmed). Send screenshot on WhatsApp.', Icons.phone_android_outlined),
        const SizedBox(height: 10),
        _buildPaymentOption('bank', 'Direct Bank Transfer', 'Habib Bank Limited (HBL) / Meezan Bank Pakistan.', Icons.account_balance_outlined),
      ],
    );
  }

  Widget _buildPaymentOption(String id, String title, String subtitle, IconData icon) {
    final isSelected = _paymentMethod == id;
    return GestureDetector(
      onTap: () => setState(() => _paymentMethod = id),
      child: Container(
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: isSelected ? const Color(0xFFEFF6FF) : Colors.white,
          borderRadius: AppRadius.cardRadius,
          border: Border.all(
            color: isSelected ? AppColors.primary : AppColors.border,
            width: isSelected ? 2 : 1,
          ),
          boxShadow: AppShadows.soft,
        ),
        child: Row(
          children: [
            Icon(icon, color: isSelected ? AppColors.primary : AppColors.mutedText, size: 26),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                  const SizedBox(height: 2),
                  Text(subtitle, style: const TextStyle(fontSize: 11, color: AppColors.mutedText)),
                ],
              ),
            ),
            Radio<String>(
              value: id,
              groupValue: _paymentMethod,
              activeColor: AppColors.primary,
              onChanged: (v) => setState(() => _paymentMethod = v!),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildReviewStep() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Order Confirmation Summary',
          style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.primaryDark),
        ),
        const SizedBox(height: 14),
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: AppRadius.cardRadius,
            border: Border.all(color: AppColors.border),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text('Customer:', style: TextStyle(color: AppColors.mutedText, fontSize: 13)),
                  Text(_nameController.text, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                ],
              ),
              const SizedBox(height: 6),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text('Phone:', style: TextStyle(color: AppColors.mutedText, fontSize: 13)),
                  Text(_phoneController.text, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                ],
              ),
              const SizedBox(height: 6),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text('Fulfillment:', style: TextStyle(color: AppColors.mutedText, fontSize: 13)),
                  Text(_deliveryType == 'delivery' ? 'Home Delivery' : 'Shop Pickup', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                ],
              ),
              const SizedBox(height: 6),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text('Payment:', style: TextStyle(color: AppColors.mutedText, fontSize: 13)),
                  Text(_paymentMethod.toUpperCase(), style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                ],
              ),
              const Divider(height: 24),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text('Subtotal:'),
                  Text('Rs. ${widget.subtotal.toStringAsFixed(0)}'),
                ],
              ),
              const SizedBox(height: 4),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text('Delivery Fee:'),
                  Text(
                    widget.deliveryFee == 0 ? 'FREE' : 'Rs. ${widget.deliveryFee.toStringAsFixed(0)}',
                    style: TextStyle(color: widget.deliveryFee == 0 ? AppColors.success : null),
                  ),
                ],
              ),
              const Divider(height: 16),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text('Total Amount:', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
                  Text(
                    'Rs. ${widget.total.toStringAsFixed(0)}',
                    style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 17, color: AppColors.primary),
                  ),
                ],
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildSuccessScreen() {
    return Scaffold(
      backgroundColor: Colors.white,
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(28.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                width: 80,
                height: 80,
                decoration: const BoxDecoration(
                  color: Color(0xFFDCFCE7),
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.check_rounded, color: AppColors.success, size: 48),
              ),
              const SizedBox(height: 20),
              const Text(
                'Order Placed Successfully!',
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: AppColors.primaryDark),
              ),
              const SizedBox(height: 8),
              const Text(
                'Order #MK-2026-0842 has been received by Mukhtar Ahmed. We are preparing your printing and store supplies.',
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 13, color: AppColors.mutedText, height: 1.4),
              ),
              const SizedBox(height: 24),
              ElevatedButton.icon(
                icon: const Icon(Icons.chat, color: Color(0xFF25D366)),
                label: const Text('Send Details via WhatsApp'),
                onPressed: () {
                  // Direct WhatsApp message with order summary
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primaryDark,
                  foregroundColor: Colors.white,
                  minimumSize: const Size.fromHeight(50),
                ),
              ),
              const SizedBox(height: 12),
              OutlinedButton(
                onPressed: () {
                  Navigator.pop(context);
                },
                style: OutlinedButton.styleFrom(minimumSize: const Size.fromHeight(50)),
                child: const Text('Back to Home'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
