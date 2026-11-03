import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_radius.dart';
import '../../core/theme/app_shadows.dart';
import '../../core/constants/shop_location.dart';
import '../../core/widgets/animated_reveal.dart';

class AuthScreen extends StatefulWidget {
  final VoidCallback onLoginSuccess;

  const AuthScreen({super.key, required this.onLoginSuccess});

  @override
  State<AuthScreen> createState() => _AuthScreenState();
}

class _AuthScreenState extends State<AuthScreen> {
  bool _isRegister = false;
  bool _obscurePassword = true;
  bool _isLoading = false;

  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _phoneController = TextEditingController();
  final _passwordController = TextEditingController();

  @override
  void dispose() {
    _nameController.dispose();
    _phoneController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  void _handleSubmit() {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isLoading = true);
    Future.delayed(const Duration(milliseconds: 1000), () {
      if (mounted) {
        setState(() => _isLoading = false);
        widget.onLoginSuccess();
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.sizeOf(context);
    final isSmall = size.width < 360;

    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: EdgeInsets.symmetric(horizontal: isSmall ? 16 : 24, vertical: 20),
            physics: const BouncingScrollPhysics(),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // Top Logo
                AnimatedReveal(
                  delay: 50,
                  child: Container(
                    width: 72,
                    height: 72,
                    decoration: BoxDecoration(
                      color: AppColors.primary,
                      shape: BoxShape.circle,
                      boxShadow: AppShadows.card,
                    ),
                    child: const Center(
                      child: Icon(Icons.print_rounded, size: 36, color: Colors.white),
                    ),
                  ),
                ),
                const SizedBox(height: 16),

                // Title
                AnimatedReveal(
                  delay: 100,
                  child: Column(
                    children: [
                      Text(
                        'Mukhtar Printing & Store',
                        style: TextStyle(
                          fontSize: isSmall ? 18 : 22,
                          fontWeight: FontWeight.bold,
                          color: AppColors.primaryDark,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        _isRegister ? 'Create an account to order and track prints' : 'Sign in to order printing and store supplies',
                        textAlign: TextAlign.center,
                        style: const TextStyle(fontSize: 12, color: AppColors.mutedText),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 24),

                // Form Card
                AnimatedReveal(
                  delay: 150,
                  child: Container(
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: AppRadius.cardRadius,
                      border: Border.all(color: AppColors.border),
                      boxShadow: AppShadows.soft,
                    ),
                    child: Form(
                      key: _formKey,
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.stretch,
                        children: [
                          if (_isRegister) ...[
                            TextFormField(
                              controller: _nameController,
                              decoration: const InputDecoration(
                                labelText: 'Full Name',
                                prefixIcon: Icon(Icons.person_outline),
                              ),
                              validator: (v) => (v == null || v.isEmpty) ? 'Enter your full name' : null,
                            ),
                            const SizedBox(height: 14),
                          ],
                          TextFormField(
                            controller: _phoneController,
                            keyboardType: TextInputType.phone,
                            decoration: const InputDecoration(
                              labelText: 'Mobile Number',
                              hintText: '03149958963',
                              prefixIcon: Icon(Icons.phone_outlined),
                            ),
                            validator: (v) {
                              if (v == null || v.isEmpty) return 'Enter your phone number';
                              if (v.length < 10) return 'Enter a valid Pakistani mobile number';
                              return null;
                            },
                          ),
                          const SizedBox(height: 14),
                          TextFormField(
                            controller: _passwordController,
                            obscureText: _obscurePassword,
                            decoration: InputDecoration(
                              labelText: 'Password',
                              prefixIcon: const Icon(Icons.lock_outline),
                              suffixIcon: IconButton(
                                icon: Icon(_obscurePassword ? Icons.visibility_off : Icons.visibility),
                                onPressed: () => setState(() => _obscurePassword = !_obscurePassword),
                              ),
                            ),
                            validator: (v) {
                              if (v == null || v.isEmpty) return 'Enter password';
                              if (v.length < 6) return 'Password must be at least 6 characters';
                              return null;
                            },
                          ),
                          const SizedBox(height: 20),
                          ElevatedButton(
                            onPressed: _isLoading ? null : _handleSubmit,
                            style: ElevatedButton.styleFrom(
                              backgroundColor: AppColors.primaryAccent,
                              minimumSize: const Size.fromHeight(50),
                              shape: const RoundedRectangleBorder(borderRadius: AppRadius.buttonRadius),
                            ),
                            child: _isLoading
                                ? const SizedBox(
                                    width: 20,
                                    height: 20,
                                    child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                                  )
                                : Text(
                                    _isRegister ? 'Create Account' : 'Sign In',
                                    style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
                                  ),
                          ),
                          const SizedBox(height: 12),
                          TextButton(
                            onPressed: () => setState(() => _isRegister = !_isRegister),
                            child: Text(
                              _isRegister ? 'Already have an account? Sign In' : 'New customer? Create Account',
                              style: const TextStyle(fontSize: 13, color: AppColors.primary, fontWeight: FontWeight.w600),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 16),

                // Guest browse button
                TextButton.icon(
                  icon: const Icon(Icons.arrow_forward, size: 16),
                  label: const Text('Continue as Guest Customer'),
                  onPressed: widget.onLoginSuccess,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
