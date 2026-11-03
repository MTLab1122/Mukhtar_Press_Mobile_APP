/// Deep Linking Router for Custom Scheme: mukhtarprinting://
class DeepLinkRoutes {
  static const String scheme = "mukhtarprinting";

  static const String home = "mukhtarprinting://home";
  static const String products = "mukhtarprinting://products";
  static const String services = "mukhtarprinting://services";
  static const String cart = "mukhtarprinting://cart";
  static const String orders = "mukhtarprinting://orders";
  static const String contact = "mukhtarprinting://contact";
  static const String privacy = "mukhtarprinting://privacy";

  static int parseRouteToIndex(String uriString) {
    final uri = Uri.tryParse(uriString);
    if (uri == null) return 0;

    switch (uri.host.toLowerCase()) {
      case 'home':
        return 0;
      case 'products':
        return 1;
      case 'services':
        return 2;
      case 'cart':
        return 3;
      case 'profile':
      case 'orders':
        return 4;
      default:
        return 0;
    }
  }
}
