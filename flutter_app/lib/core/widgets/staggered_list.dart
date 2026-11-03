import 'package:flutter/material.dart';
import 'animated_reveal.dart';

/// Renders children with staggered entrance animations
class StaggeredList extends StatelessWidget {
  final List<Widget> children;
  final int baseDelay;
  final int stepDelay;
  final Axis direction;
  final ScrollPhysics? physics;
  final EdgeInsetsGeometry? padding;
  final bool shrinkWrap;

  const StaggeredList({
    super.key,
    required this.children,
    this.baseDelay = 50,
    this.stepDelay = 80,
    this.direction = Axis.vertical,
    this.physics,
    this.padding,
    this.shrinkWrap = false,
  });

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      scrollDirection: direction,
      physics: physics,
      padding: padding,
      shrinkWrap: shrinkWrap,
      itemCount: children.length,
      itemBuilder: (context, index) {
        return AnimatedReveal(
          delay: baseDelay + (index * stepDelay),
          duration: 350,
          child: children[index],
        );
      },
    );
  }
}
