import 'package:flutter/material.dart';

class AppRadius {
  static const double sm = 8.0;
  static const double md = 12.0;
  static const double button = 14.0;
  static const double image = 16.0;
  static const double card = 18.0;
  static const double bottomSheet = 24.0;
  static const double searchBar = 30.0;
  static const double pill = 999.0;

  static const BorderRadius smRadius = BorderRadius.all(Radius.circular(sm));
  static const BorderRadius mdRadius = BorderRadius.all(Radius.circular(md));
  static const BorderRadius buttonRadius = BorderRadius.all(Radius.circular(button));
  static const BorderRadius imageRadius = BorderRadius.all(Radius.circular(image));
  static const BorderRadius cardRadius = BorderRadius.all(Radius.circular(card));
  static const BorderRadius bottomSheetRadius = BorderRadius.only(
    topLeft: Radius.circular(bottomSheet),
    topRight: Radius.circular(bottomSheet),
  );
  static const BorderRadius searchBarRadius = BorderRadius.all(Radius.circular(searchBar));
  static const BorderRadius pillRadius = BorderRadius.all(Radius.circular(pill));
}
