import 'package:dio/dio.dart';

typedef OnQuotaExhaustedCallback = void Function(
  String featureKey,
  String upgradeUrl,
);

class ApiClient {
  final Dio dio;
  final OnQuotaExhaustedCallback? onQuotaExhausted;

  ApiClient({
    required String baseUrl,
    String? authToken,
    this.onQuotaExhausted,
  }) : dio = Dio(
          BaseOptions(
            baseUrl: baseUrl,
            connectTimeout: const Duration(seconds: 15),
            receiveTimeout: const Duration(seconds: 20),
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              if (authToken != null) 'Authorization': 'Bearer $authToken',
            },
          ),
        ) {
    dio.interceptors.add(
      InterceptorsWrapper(
        onError: (DioException error, ErrorInterceptorHandler handler) {
          if (error.response?.statusCode == 402) {
            final data = error.response?.data;
            if (data is Map<String, dynamic>) {
              final featureKey = data['featureKey'] as String? ?? 'UNKNOWN';
              final upgradeUrl = data['upgradeUrl'] as String? ?? '/billing/upgrade';
              onQuotaExhausted?.call(featureKey, upgradeUrl);
            }
          }
          return handler.next(error);
        },
      ),
    );
  }

  void updateAuthToken(String token) {
    dio.options.headers['Authorization'] = 'Bearer $token';
  }

  void clearAuthToken() {
    dio.options.headers.remove('Authorization');
  }
}

