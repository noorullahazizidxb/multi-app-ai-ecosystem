import 'dart:async';
import 'dart:convert';
import 'package:web_socket_channel/web_socket_channel.dart';

class WebSocketService {
  final String url;
  WebSocketChannel? _channel;
  StreamSubscription? _subscription;
  final _eventController = StreamController<Map<String, dynamic>>.broadcast();

  Stream<Map<String, dynamic>> get events => _eventController.stream;

  WebSocketService({required this.url});

  void connect() {
    disconnect();
    _channel = WebSocketChannel.connect(Uri.parse(url));
    _subscription = _channel?.stream.listen(
      (data) {
        try {
          final decoded = jsonDecode(data as String) as Map<String, dynamic>;
          _eventController.add(decoded);
        } catch (_) {}
      },
      onError: (_) {
        reconnect();
      },
      onDone: () {},
    );
  }

  void send(Map<String, dynamic> message) {
    _channel?.sink.add(jsonEncode(message));
  }

  void reconnect() {
    Timer(const Duration(seconds: 3), () {
      connect();
    });
  }

  void disconnect() {
    _subscription?.cancel();
    _channel?.sink.close();
    _channel = null;
  }

  void dispose() {
    disconnect();
    _eventController.close();
  }
}

