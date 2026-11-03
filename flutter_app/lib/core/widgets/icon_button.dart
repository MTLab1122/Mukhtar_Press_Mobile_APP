import 'package:flutter/material.dart';
import '../theme/app_colors.dart';
import '../theme/app_radius.dart';

class CustomIconButton extends StatelessWidget {
  final IconData icon;
  final VoidCallback? onPressed;
  final String? tooltip;
  final Color? color;
  final Color? backgroundColor;
  final double size;
  final double minTouchTarget;

  const CustomIconButton({
    super.key,
    required this.icon,
    required this.onPressed,
    this.tooltip,
    this.color,
    this.backgroundColor,
    this.size = 22,
    this.minTouchTarget = 48.0,
  });

  @override
  Widget build(BuildContext context) {
    return Semantics(
      label: tooltip ?? 'Action button',
      button: true,
      child: ConstrainedBox(
        constraints: BoxConstraints(
          minWidth: minTouchTarget,
          minHeight: minTouchTarget,
        ),
        child: Material(
          color: backgroundColor ?? Colors.transparent,
          borderRadius: AppRadius.smRadius,
          child: InkWell(
            onTap: onPressed,
            borderRadius: AppRadius.smRadius,
            child: Tooltip(
              message: tooltip ?? '',
              child: Center(
                child: Icon(
                  icon,
                  size: size,
                  color: color ?? AppColors.darkText,
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
