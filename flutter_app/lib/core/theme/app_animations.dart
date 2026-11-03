import 'package:flutter/material.dart';

class AppAnimations {
  // Durations
  static const Duration quick = Duration(milliseconds: 150);
  static const Duration standard = Duration(milliseconds: 250);
  static const Duration medium = Duration(milliseconds: 350);
  static const Duration slow = Duration(milliseconds: 500);
  static const Duration carouselSlide = Duration(seconds: 5);
  static const Duration pulse = Duration(milliseconds: 1200);

  // Curves
  static const Curve defaultCurve = Curves.easeOutCubic;
  static const Curve smooth = Curves.easeInOutCubic;
  static const Curve bounce = Curves.easeOutBack;
  static const Curve sharp = Curves.easeOutQuad;

  // Stagger helper
  static Duration stagger(int index, {int baseMs = 50}) {
    return Duration(milliseconds: index * baseMs);
  }
}
