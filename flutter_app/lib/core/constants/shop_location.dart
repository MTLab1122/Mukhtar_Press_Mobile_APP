/// Shop Location & Business Constants
/// Mukhtar Ahmed Printing & Computer Store - Main Bazar Umarzai
class ShopLocation {
  // Real coordinates for Main Bazar Umarzai, Charsadda, Khyber Pakhtunkhwa, Pakistan
  static const double latitude = 34.2052;
  static const double longitude = 71.7451;

  static const String businessName = "Mukhtar Ahmed Printing & Computer Store";
  static const String appName = "Mukhtar Printing & Store";
  static const String ownerName = "Mukhtar Ahmed";
  static const String address = "Main Bazar Umarzai, Tehsil & District Charsadda, Khyber Pakhtunkhwa, Pakistan";
  static const String shortAddress = "Main Bazar Umarzai";
  static const String landmark = "Main Bazar Market, Umarzai";

  static const String phone = "03149958963";
  static const String internationalPhone = "+923149958963";
  static const String whatsapp = "03149958963";
  static const String whatsappLink = "https://wa.me/923149958963";

  static const String shopTiming = "Saturday – Thursday: 8:00 AM – 9:00 PM | Friday: 2:00 PM – 9:00 PM";
  static const String googleMapsUrl = "https://www.google.com/maps/search/?api=1&query=34.2052,71.7451";

  // Bank & Payment Accounts
  static const String jazzCashAccount = "03149958963";
  static const String jazzCashTitle = "Mukhtar Ahmed";
  static const String easyPaisaAccount = "03149958963";
  static const String easyPaisaTitle = "Mukhtar Ahmed";
  static const String bankName = "Habib Bank Limited (HBL) Umarzai Branch";
  static const String bankAccountTitle = "Mukhtar Ahmed Printing Store";
  static const String bankIban = "PK36HABB0000427991823903";

  // Pre-filled WhatsApp message generator
  static String buildOrderInquiryMessage({
    required String orderNumber,
    required String customerName,
    required double totalAmount,
  }) {
    return "Assalam-o-Alaikum, I want to ask about my order.\n"
        "Order Number: $orderNumber\n"
        "Name: $customerName\n"
        "Total: Rs. ${totalAmount.toStringAsFixed(0)}";
  }

  static String buildGeneralInquiryMessage() {
    return "Assalam-o-Alaikum, I want to place an order at Mukhtar Printing & Store.\n"
        "Name: \n"
        "Service/Product: \n"
        "Details: \n"
        "Delivery Method: ";
  }
}
