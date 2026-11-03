import 'package:flutter/material.dart';
import '../theme/app_colors.dart';
import '../theme/app_radius.dart';
import '../theme/app_spacing.dart';

class CustomDropdown<T> extends StatelessWidget {
  final String label;
  final T value;
  final List<DropdownMenuItem<T>> items;
  final ValueChanged<T?> onChanged;
  final String? hint;

  const CustomDropdown({
    super.key,
    required this.label,
    required this.value,
    required this.items,
    required this.onChanged,
    this.hint,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: const TextStyle(
            fontSize: 13,
            fontWeight: FontWeight.w600,
            color: AppColors.darkText,
          ),
        ),
        const SizedBox(height: AppSpacing.xs),
        Container(
          height: AppSpacing.inputHeight,
          padding: const EdgeInsets.symmetric(horizontal: 16),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: AppRadius.buttonRadius,
            border: Border.all(color: AppColors.border),
          ),
          child: DropdownButtonHideUnderline(
            child: DropdownButton<T>(
              value: value,
              items: items,
              onChanged: onChanged,
              hint: hint != null
                  ? Text(hint!, style: const TextStyle(fontSize: 14, color: AppColors.mutedText))
                  : null,
              icon: const Icon(Icons.keyboard_arrow_down, color: AppColors.mutedText),
              isExpanded: true,
              style: const TextStyle(fontSize: 14, color: AppColors.darkText, fontWeight: FontWeight.w500),
            ),
          ),
        ),
      ],
    );
  }
}
