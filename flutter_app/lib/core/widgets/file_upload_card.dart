import 'package:flutter/material.dart';
import '../theme/app_colors.dart';
import '../theme/app_radius.dart';
import '../theme/app_spacing.dart';
import '../theme/app_animations.dart';

class UploadedFileInfo {
  final String name;
  final int sizeBytes;
  final double progress; // 0.0 to 1.0
  final bool isUploading;
  final bool isSuccess;

  const UploadedFileInfo({
    required this.name,
    required this.sizeBytes,
    this.progress = 1.0,
    this.isUploading = false,
    this.isSuccess = true,
  });

  String get formattedSize {
    if (sizeBytes < 1024 * 1024) {
      return '${(sizeBytes / 1024).toStringAsFixed(1)} KB';
    }
    return '${(sizeBytes / (1024 * 1024)).toStringAsFixed(1)} MB';
  }
}

class FileUploadCard extends StatelessWidget {
  final UploadedFileInfo? file;
  final VoidCallback onPickFile;
  final VoidCallback? onRemoveFile;

  const FileUploadCard({
    super.key,
    this.file,
    required this.onPickFile,
    this.onRemoveFile,
  });

  @override
  Widget build(BuildContext context) {
    if (file == null) {
      return InkWell(
        onTap: onPickFile,
        borderRadius: AppRadius.cardRadius,
        child: Container(
          width: double.infinity,
          padding: const EdgeInsets.all(AppSpacing.lg),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: AppRadius.cardRadius,
            border: Border.all(
              color: AppColors.primary.withValues(alpha: 0.3),
              width: 1.5,
            ),
          ),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: AppColors.primary.withValues(alpha: 0.08),
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.cloud_upload_outlined, color: AppColors.primary, size: 28),
              ),
              const SizedBox(height: AppSpacing.sm),
              const Text(
                'Upload Design or Document File',
                style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: AppColors.darkText),
              ),
              const SizedBox(height: 2),
              const Text(
                'PDF, JPG, PNG, DOCX (Max 25 MB)',
                style: TextStyle(fontSize: 12, color: AppColors.mutedText),
              ),
            ],
          ),
        ),
      );
    }

    return Container(
      padding: const EdgeInsets.all(AppSpacing.md),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: AppRadius.cardRadius,
        border: Border.all(
          color: file!.isSuccess ? AppColors.success.withValues(alpha: 0.4) : AppColors.border,
        ),
        boxShadow: [
          BoxShadow(
            color: AppColors.primary.withValues(alpha: 0.04),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: (file!.isSuccess ? AppColors.success : AppColors.primary).withValues(alpha: 0.1),
                  borderRadius: AppRadius.smRadius,
                ),
                child: Icon(
                  file!.name.endsWith('.pdf') ? Icons.picture_as_pdf : Icons.insert_drive_file,
                  color: file!.isSuccess ? AppColors.success : AppColors.primary,
                  size: 22,
                ),
              ),
              const SizedBox(width: AppSpacing.sm),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      file!.name,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: AppColors.darkText),
                    ),
                    Text(
                      file!.formattedSize,
                      style: const TextStyle(fontSize: 11, color: AppColors.mutedText),
                    ),
                  ],
                ),
              ),
              if (onRemoveFile != null)
                IconButton(
                  icon: const Icon(Icons.close, size: 18, color: AppColors.mutedText),
                  onPressed: onRemoveFile,
                  tooltip: 'Remove attached file',
                ),
            ],
          ),
          if (file!.isUploading) ...[
            const SizedBox(height: AppSpacing.sm),
            ClipRRect(
              borderRadius: AppRadius.smRadius,
              child: LinearProgressIndicator(
                value: file!.progress,
                backgroundColor: AppColors.background,
                color: AppColors.primaryAccent,
                minHeight: 4,
              ),
            ),
          ],
        ],
      ),
    );
  }
}
