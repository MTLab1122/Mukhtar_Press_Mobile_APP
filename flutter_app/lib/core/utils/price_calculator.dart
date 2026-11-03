/// Central Price Calculator Engine for Mukhtar Ahmed Printing & Computer Store
class PriceCalculator {
  /// Flex & Banner: width (ft) * height (ft) * pricePerSqFt * quantity
  static double calculateFlexPrice({
    required double widthFeet,
    required double heightFeet,
    required double pricePerSqFt,
    int quantity = 1,
    bool designRequired = false,
  }) {
    if (widthFeet <= 0 || heightFeet <= 0 || pricePerSqFt <= 0 || quantity <= 0) {
      return 0.0;
    }
    double total = widthFeet * heightFeet * pricePerSqFt * quantity;
    if (designRequired) {
      total += 300.0; // Rs. 300 basic design composing charge
    }
    return total;
  }

  /// Page / Photocopy / Document Printing
  static double calculatePagePrice({
    required int pages,
    required double pricePerPage,
    int copies = 1,
    bool isColor = false,
    bool hasLamination = false,
  }) {
    if (pages <= 0 || pricePerPage <= 0 || copies <= 0) return 0.0;
    double rate = pricePerPage;
    if (isColor && pricePerPage < 15) {
      rate = 20.0; // Standard color print baseline in PKR
    }
    double base = pages * rate * copies;
    if (hasLamination) {
      base += pages * copies * 25.0; // Rs. 25 per sheet lamination
    }
    return base;
  }

  /// Design Services with Add-ons
  static double calculateDesignPrice({
    required double basePrice,
    double addonsTotal = 0.0,
  }) {
    return basePrice + addonsTotal;
  }

  /// Product Price with Discount
  static double calculateProductPrice({
    required double price,
    double? discountPrice,
    int quantity = 1,
  }) {
    final effective = (discountPrice != null && discountPrice > 0 && discountPrice < price)
        ? discountPrice
        : price;
    return effective * quantity;
  }

  /// Format PKR
  static String formatPKR(double amount) {
    return 'Rs. \${amount.toStringAsFixed(0)}';
  }

  /// Validate Pakistani Mobile Numbers
  static bool isValidPakistaniPhone(String phone) {
    final regex = RegExp(r'^((\\+92)|(0092)|(92)|(0))?3[0-9]{9}\$');
    final cleaned = phone.replaceAll(RegExp(r'[\\s\\-\\(\\)]'), '');
    return regex.hasMatch(cleaned);
  }
}
