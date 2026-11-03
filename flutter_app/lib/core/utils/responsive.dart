import 'package:flutter/material.dart';

enum ScreenType {
  smallPhone, // < 360 dp
  normalPhone, // 360 - 599 dp
  largePhoneOrTablet, // 600 - 839 dp
  tablet, // 840+ dp
}

class ResponsiveHelper {
  static const double breakpointSmallPhone = 360.0;
  static const double breakpointLargePhone = 600.0;
  static const double breakpointTablet = 840.0;

  static ScreenType getScreenType(BuildContext context) {
    final width = MediaQuery.sizeOf(context).width;
    if (width < breakpointSmallPhone) return ScreenType.smallPhone;
    if (width < breakpointLargePhone) return ScreenType.normalPhone;
    if (width < breakpointTablet) return ScreenType.largePhoneOrTablet;
    return ScreenType.tablet;
  }

  static bool isSmallPhone(BuildContext context) =>
      MediaQuery.sizeOf(context).width < breakpointSmallPhone;

  static bool isNormalPhone(BuildContext context) {
    final width = MediaQuery.sizeOf(context).width;
    return width >= breakpointSmallPhone && width < breakpointLargePhone;
  }

  static bool isTabletOrLarger(BuildContext context) =>
      MediaQuery.sizeOf(context).width >= breakpointLargePhone;

  static double horizontalPadding(BuildContext context) {
    final width = MediaQuery.sizeOf(context).width;
    if (width < breakpointSmallPhone) return 12.0;
    if (width >= breakpointLargePhone) return 24.0;
    return 16.0;
  }

  static int getGridColumnCount(BuildContext context) {
    final width = MediaQuery.sizeOf(context).width;
    if (width < breakpointSmallPhone) return 2;
    if (width < breakpointLargePhone) return 2;
    if (width < breakpointTablet) return 3;
    return 4;
  }

  static double getProductCardAspectRatio(BuildContext context) {
    final width = MediaQuery.sizeOf(context).width;
    if (width < breakpointSmallPhone) return 0.68;
    if (width < breakpointLargePhone) return 0.72;
    return 0.78;
  }
}

class ResponsiveLayout extends StatelessWidget {
  final Widget mobile;
  final Widget? tablet;
  final Widget? smallPhone;

  const ResponsiveLayout({
    super.key,
    required this.mobile,
    this.tablet,
    this.smallPhone,
  });

  @override
  Widget build(BuildContext context) {
    final width = MediaQuery.sizeOf(context).width;

    if (width < ResponsiveHelper.breakpointSmallPhone && smallPhone != null) {
      return smallPhone!;
    }
    if (width >= ResponsiveHelper.breakpointLargePhone && tablet != null) {
      return tablet!;
    }
    return mobile;
  }
}
