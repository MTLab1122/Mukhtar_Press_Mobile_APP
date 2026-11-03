# Flutter ProGuard Rules for Mukhtar Printing & Store

# Keep Flutter Wrapper & Engine Classes
-keep class io.flutter.app.** { *; }
-keep class io.flutter.plugin.**  { *; }
-keep class io.flutter.util.**  { *; }
-keep class io.flutter.view.**  { *; }
-keep class io.flutter.**  { *; }
-keep class io.flutter.plugins.**  { *; }

# Keep Firebase SDK classes
-keepattributes *Annotation*
-keepattributes SourceFile,LineNumberTable
-keep public class * extends java.lang.Exception
-dontwarn com.google.firebase.**
-keep class com.google.firebase.** { *; }

# Keep Google Play services
-dontwarn com.google.android.gms.**
-keep class com.google.android.gms.** { *; }

# Keep Data Models
-keep class com.mukhtarprinting.umarzai.models.** { *; }
