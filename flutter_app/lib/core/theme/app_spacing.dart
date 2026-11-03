import 'package:flutter/material.dart';

class AppSpacing {
  static const double xs = 4.0;
  static const double sm = 8.0;
  static const double md = 12.0;
  static const double lg = 16.0;
  static const double xl = 20.0;
  static const double xxl = 24.0;
  static const double section = 32.0;
  static const double huge = 40.0;
}

class AppRadius {
  static const double sm = 8.0;
  static const double button = 14.0;
  static const double image = 16.0;
  static const double card = 18.0;
  static const double sheet = 24.0;
  static const double search = 30.0;
}

class AppShadows {
  static const BoxShadow soft = BoxShadow(
    color: Color(0x141B3A6B),
    blurRadius: 18,
    offset: Offset(0, 6),
  );

  static const BoxShadow card = BoxShadow(
    color: Color(0x0F1B3A6B),
    blurRadius: 14,
    offset: Offset(0, 4),
  );
}
