import 'package:flutter/material.dart';

/// Reusable entrance animation widget for cards, sections, and items.
/// Provides smooth fade-in, slide-up, and optional scale with configurable delay and duration.
class AnimatedReveal extends StatefulWidget {
  final Widget child;
  final int delay; // Delay in milliseconds
  final int duration; // Duration in milliseconds
  final double slideOffset; // Vertical offset to slide up from (e.g., 0.15)
  final bool enableScale; // Whether to also smoothly scale from 0.95 -> 1.0
  final Curve curve;

  const AnimatedReveal({
    super.key,
    required this.child,
    this.delay = 0,
    this.duration = 350,
    this.slideOffset = 0.15,
    this.enableScale = false,
    this.curve = Curves.easeOutCubic,
  });

  @override
  State<AnimatedReveal> createState() => _AnimatedRevealState();
}

class _AnimatedRevealState extends State<AnimatedReveal>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _fadeAnimation;
  late Animation<Offset> _slideAnimation;
  late Animation<double> _scaleAnimation;
  bool _isDisposed = false;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: Duration(milliseconds: widget.duration),
    );

    _fadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _controller, curve: widget.curve),
    );

    _slideAnimation = Tween<Offset>(
      begin: Offset(0, widget.slideOffset),
      end: Offset.zero,
    ).animate(
      CurvedAnimation(parent: _controller, curve: widget.curve),
    );

    _scaleAnimation = Tween<double>(
      begin: widget.enableScale ? 0.94 : 1.0,
      end: 1.0,
    ).animate(
      CurvedAnimation(parent: _controller, curve: widget.curve),
    );

    if (widget.delay <= 0) {
      if (mounted) _controller.forward();
    } else {
      Future.delayed(Duration(milliseconds: widget.delay), () {
        if (!_isDisposed && mounted) {
          _controller.forward();
        }
      });
    }
  }

  @override
  void dispose() {
    _isDisposed = true;
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return FadeTransition(
      opacity: _fadeAnimation,
      child: SlideTransition(
        position: _slideAnimation,
        child: widget.enableScale
            ? ScaleTransition(
                scale: _scaleAnimation,
                child: widget.child,
              )
            : widget.child,
      ),
    );
  }
}
