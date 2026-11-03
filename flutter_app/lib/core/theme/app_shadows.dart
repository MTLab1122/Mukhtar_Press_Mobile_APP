import 'package:flutter/material.dart';
import 'app_colors.dart';

class AppShadows {
  static final List<BoxShadow> soft = [
    BoxShadow(
      color: AppColors.primary.withValues(alpha: 0.06),
      blurRadius: 18,
      spreadRadius: 0,
      offset: const Offset(0, 6),
    ),
  ];

  static final List<BoxShadow> card = [
    BoxShadow(
      color: const Color(0xFF1B3A6B).withValues(alpha: 0.08),
      blurRadius: 18,
      spreadRadius: 0,
      offset: const Offset(0, 6),
    ),
  ];

  static final List<BoxShadow> floating = [
    BoxShadow(
      color: AppColors.primary.withValues(alpha: 0.14),
      blurRadius: 28,
      spreadRadius: 0,
      offset: const Offset(0, 12),
    ),
  ];

  static final List<BoxShadow> glowAccent = [
    BoxShadow(
      color: AppColors.primaryAccent.withValues(alpha: 0.28),
      blurRadius: 16,
      spreadRadius: 0,
      offset: const Offset(0, 4),
    ),
  ];
}
