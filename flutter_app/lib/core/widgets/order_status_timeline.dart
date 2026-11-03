import 'package:flutter/material.dart';
import '../theme/app_colors.dart';
import '../theme/app_spacing.dart';

class OrderTimelineStep {
  final String title;
  final String description;
  final String? time;
  final bool isCompleted;
  final bool isCurrent;

  const OrderTimelineStep({
    required this.title,
    required this.description,
    this.time,
    this.isCompleted = false,
    this.isCurrent = false,
  });
}

class OrderStatusTimeline extends StatefulWidget {
  final List<OrderTimelineStep> steps;

  const OrderStatusTimeline({super.key, required this.steps});

  @override
  State<OrderStatusTimeline> createState() => _OrderStatusTimelineState();
}

class _OrderStatusTimelineState extends State<OrderStatusTimeline> with SingleTickerProviderStateMixin {
  late final AnimationController _pulseController;
  late final Animation<double> _pulseAnimation;

  @override
  void initState() {
    super.initState();
    _pulseController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1400),
    )..repeat(reverse: true);

    _pulseAnimation = Tween<double>(begin: 1.0, end: 1.25).animate(
      CurvedAnimation(parent: _pulseController, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _pulseController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: List.generate(widget.steps.length, (index) {
        final step = widget.steps[index];
        final isLast = index == widget.steps.length - 1;

        Color dotColor;
        Color lineColor;
        if (step.isCompleted) {
          dotColor = AppColors.success;
          lineColor = AppColors.success;
        } else if (step.isCurrent) {
          dotColor = AppColors.primaryAccent;
          lineColor = AppColors.border;
        } else {
          dotColor = AppColors.border;
          lineColor = AppColors.border;
        }

        return Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Column(
              children: [
                step.isCurrent
                    ? AnimatedBuilder(
                        animation: _pulseAnimation,
                        builder: (context, child) {
                          return Transform.scale(
                            scale: _pulseAnimation.value,
                            child: Container(
                              width: 22,
                              height: 22,
                              decoration: BoxDecoration(
                                color: dotColor,
                                shape: BoxShape.circle,
                                border: Border.all(color: Colors.white, width: 3),
                                boxShadow: [
                                  BoxShadow(
                                    color: dotColor.withValues(alpha: 0.45),
                                    blurRadius: 8,
                                    spreadRadius: 2,
                                  ),
                                ],
                              ),
                            ),
                          );
                        },
                      )
                    : Container(
                        width: 22,
                        height: 22,
                        decoration: BoxDecoration(
                          color: dotColor,
                          shape: BoxShape.circle,
                          border: Border.all(color: Colors.white, width: 3),
                          boxShadow: [
                            BoxShadow(
                              color: dotColor.withValues(alpha: 0.25),
                              blurRadius: 6,
                              spreadRadius: 1,
                            ),
                          ],
                        ),
                        child: step.isCompleted
                            ? const Icon(Icons.check, size: 12, color: Colors.white)
                            : null,
                      ),
                if (!isLast)
                  Container(
                    width: 2,
                    height: 52,
                    color: lineColor,
                  ),
              ],
            ),
            const SizedBox(width: AppSpacing.md),
            Expanded(
              child: Padding(
                padding: const EdgeInsets.only(bottom: AppSpacing.md),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          step.title,
                          style: TextStyle(
                            fontSize: 14,
                            fontWeight: step.isCurrent || step.isCompleted ? FontWeight.bold : FontWeight.normal,
                            color: step.isCurrent
                                ? AppColors.primaryAccent
                                : step.isCompleted
                                    ? AppColors.darkText
                                    : AppColors.mutedText,
                          ),
                        ),
                        if (step.time != null)
                          Text(
                            step.time!,
                            style: const TextStyle(fontSize: 11, color: AppColors.mutedText),
                          ),
                      ],
                    ),
                    const SizedBox(height: 2),
                    Text(
                      step.description,
                      style: const TextStyle(fontSize: 12, color: AppColors.mutedText, height: 1.3),
                    ),
                  ],
                ),
              ),
            ),
          ],
        );
      }),
    );
  }
}
