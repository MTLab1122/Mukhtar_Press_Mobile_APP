import 'package:flutter/material.dart';
import '../theme/app_colors.dart';
import '../theme/app_radius.dart';
import '../theme/app_animations.dart';

class QuantitySelector extends StatelessWidget {
  final int quantity;
  final ValueChanged<int> onChanged;
  final int min;
  final int max;

  const QuantitySelector({
    super.key,
    required this.quantity,
    required this.onChanged,
    this.min = 1,
    this.max = 999,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.background,
        borderRadius: AppRadius.buttonRadius,
        border: Border.all(color: AppColors.border),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          _buildButton(
            icon: Icons.remove,
            onTap: quantity > min ? () => onChanged(quantity - 1) : null,
            tooltip: 'Decrease quantity',
          ),
          Container(
            constraints: const BoxConstraints(minWidth: 36),
            padding: const EdgeInsets.symmetric(horizontal: 8),
            child: AnimatedSwitcher(
              duration: AppAnimations.quick,
              transitionBuilder: (child, animation) => ScaleTransition(scale: animation, child: child),
              child: Text(
                '$quantity',
                key: ValueKey<int>(quantity),
                textAlign: TextAlign.center,
                style: const TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.bold,
                  color: AppColors.darkText,
                ),
              ),
            ),
          ),
          _buildButton(
            icon: Icons.add,
            onTap: quantity < max ? () => onChanged(quantity + 1) : null,
            tooltip: 'Increase quantity',
          ),
        ],
      ),
    );
  }

  Widget _buildButton({
    required IconData icon,
    required VoidCallback? onTap,
    required String tooltip,
  }) {
    return Semantics(
      label: tooltip,
      button: true,
      child: InkWell(
        onTap: onTap,
        borderRadius: AppRadius.smRadius,
        child: Container(
          width: 38,
          height: 38,
          alignment: Alignment.center,
          child: Icon(
            icon,
            size: 18,
            color: onTap != null ? AppColors.darkText : AppColors.mutedText.withValues(alpha: 0.5),
          ),
        ),
      ),
    );
  }
}
