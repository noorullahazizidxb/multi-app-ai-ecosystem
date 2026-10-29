import 'dart:convert';
import 'package:equatable/equatable.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:shared_preferences/shared_preferences.dart';

class AppThemeData extends Equatable {
  final String id;
  final String name;
  final String persona;
  final String defaultFor;
  final ThemeData themeData;

  const AppThemeData({
    required this.id,
    required this.name,
    required this.persona,
    required this.defaultFor,
    required this.themeData,
  });

  @override
  List<Object?> get props => [id, name, persona, defaultFor];
}

// Events
abstract class ThemeEvent extends Equatable {
  const ThemeEvent();
  @override
  List<Object?> get props => [];
}

class LoadThemesEvent extends ThemeEvent {
  final String? defaultAppId;
  const LoadThemesEvent({this.defaultAppId});
  @override
  List<Object?> get props => [defaultAppId];
}

class ChangeThemeEvent extends ThemeEvent {
  final String themeId;
  const ChangeThemeEvent(this.themeId);
  @override
  List<Object?> get props => [themeId];
}

// States
abstract class ThemeState extends Equatable {
  const ThemeState();
  @override
  List<Object?> get props => [];
}

class ThemeInitial extends ThemeState {}

class ThemeLoading extends ThemeState {}

class ThemeLoaded extends ThemeState {
  final AppThemeData currentTheme;
  final List<AppThemeData> availableThemes;

  const ThemeLoaded({
    required this.currentTheme,
    required this.availableThemes,
  });

  @override
  List<Object?> get props => [currentTheme, availableThemes];
}

class ThemeError extends ThemeState {
  final String message;
  const ThemeError(this.message);
  @override
  List<Object?> get props => [message];
}

// BLoC
class ThemeBloc extends Bloc<ThemeEvent, ThemeState> {
  static const String _prefKey = 'selected_theme_preset';

  ThemeBloc() : super(ThemeInitial()) {
    on<LoadThemesEvent>(_onLoadThemes);
    on<ChangeThemeEvent>(_onChangeTheme);
  }

  Future<void> _onLoadThemes(
    LoadThemesEvent event,
    Emitter<ThemeState> emit,
  ) async {
    emit(ThemeLoading());
    try {
      final jsonString = await rootBundle.loadString(
        'packages/flutter_core/assets/theme-tokens.json',
      );
      final List<dynamic> jsonList = jsonDecode(jsonString);

      final List<AppThemeData> themes = jsonList.map((item) {
        return _buildThemeFromJson(item as Map<String, dynamic>);
      }).toList();

      final prefs = await SharedPreferences.getInstance();
      final savedId = prefs.getString(_prefKey);

      AppThemeData activeTheme;
      if (savedId != null && themes.any((t) => t.id == savedId)) {
        activeTheme = themes.firstWhere((t) => t.id == savedId);
      } else if (event.defaultAppId != null &&
          themes.any((t) => t.defaultFor == event.defaultAppId)) {
        activeTheme = themes.firstWhere((t) => t.defaultFor == event.defaultAppId);
      } else {
        activeTheme = themes.first;
      }

      emit(ThemeLoaded(
        currentTheme: activeTheme,
        availableThemes: themes,
      ));
    } catch (e) {
      emit(ThemeError('Failed to load theme presets: $e'));
    }
  }

  Future<void> _onChangeTheme(
    ChangeThemeEvent event,
    Emitter<ThemeState> emit,
  ) async {
    if (state is ThemeLoaded) {
      final currentState = state as ThemeLoaded;
      final target = currentState.availableThemes.firstWhere(
        (t) => t.id == event.themeId,
        orElse: () => currentState.currentTheme,
      );

      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(_prefKey, target.id);

      emit(ThemeLoaded(
        currentTheme: target,
        availableThemes: currentState.availableThemes,
      ));
    }
  }

  static AppThemeData _buildThemeFromJson(Map<String, dynamic> json) {
    final colors = json['colors'] as Map<String, dynamic>;

    Color parseHex(String hex) {
      final clean = hex.replaceAll('#', '');
      return Color(int.parse('FF$clean', radix: 16));
    }

    final bg = parseHex(colors['bg'] as String);
    final primary = parseHex(colors['primary'] as String);
    final surface = parseHex(colors['surface'] as String);
    final text = parseHex(colors['text'] as String);
    final isDark = bg.computeLuminance() < 0.5;

    final themeData = ThemeData(
      useMaterial3: true,
      brightness: isDark ? Brightness.dark : Brightness.light,
      scaffoldBackgroundColor: bg,
      colorScheme: ColorScheme(
        brightness: isDark ? Brightness.dark : Brightness.light,
        primary: primary,
        onPrimary: isDark ? Colors.black : Colors.white,
        secondary: parseHex(colors['accent'] as String),
        onSecondary: Colors.white,
        error: parseHex(colors['error'] as String),
        onError: Colors.white,
        surface: surface,
        onSurface: text,
      ),
      cardTheme: CardTheme(
        color: surface,
        elevation: 0,
        shape: RoundedRectangleBorder(
          side: BorderSide(color: parseHex(colors['border'] as String)),
          borderRadius: BorderRadius.circular(12),
        ),
      ),
      appBarTheme: AppBarTheme(
        backgroundColor: surface,
        foregroundColor: text,
        elevation: 0,
      ),
    );

    return AppThemeData(
      id: json['id'] as String,
      name: json['name'] as String,
      persona: json['persona'] as String,
      defaultFor: json['defaultFor'] as String,
      themeData: themeData,
    );
  }
}

