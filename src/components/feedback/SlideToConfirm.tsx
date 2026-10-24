import React from "react";
import { View, StyleSheet } from "react-native";
import {
  GestureDetector,
  Gesture,
} from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Radius, FontSize, FontWeight, Shadows } from "@/constants/theme";
import { triggerHaptic } from "@/utils/haptics";

interface SlideToConfirmProps {
  onConfirm: () => void;
  label?: string;
  confirmedLabel?: string;
}

const SLIDER_WIDTH = 320;
const THUMB_SIZE = 52;
const MAX_TRANSLATE = SLIDER_WIDTH - THUMB_SIZE - 8;

export function SlideToConfirm({
  onConfirm,
  label = "Slide to pick up the order",
  confirmedLabel = "Order Picked Up!",
}: SlideToConfirmProps) {
  const translateX = useSharedValue(0);
  const isConfirmed = useSharedValue(false);

  const handleSuccess = () => {
    void triggerHaptic.success();
    onConfirm();
  };

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (isConfirmed.value) return;
      if (event.translationX > 0 && event.translationX <= MAX_TRANSLATE) {
        translateX.value = event.translationX;
      }
    })
    .onEnd(() => {
      if (isConfirmed.value) return;
      if (translateX.value > MAX_TRANSLATE * 0.75) {
        translateX.value = withSpring(MAX_TRANSLATE, { damping: 15 });
        isConfirmed.value = true;
        runOnJS(handleSuccess)();
      } else {
        translateX.value = withSpring(0, { damping: 15 });
      }
    });

  const animatedThumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const animatedFillStyle = useAnimatedStyle(() => ({
    width: translateX.value + THUMB_SIZE + 4,
  }));

  const animatedTextStyle = useAnimatedStyle(() => ({
    opacity: 1 - translateX.value / (MAX_TRANSLATE * 0.8),
  }));

  return (
    <View style={styles.track}>
      {/* Background Fill */}
      <Animated.View style={[styles.activeFill, animatedFillStyle]} />

      {/* Center Label */}
      <Animated.Text style={[styles.label, animatedTextStyle]}>
        {label}
      </Animated.Text>

      {/* Draggable Thumb */}
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.thumb, animatedThumbStyle]}>
          <Ionicons name="arrow-forward" size={22} color={Colors.surface} />
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: "100%",
    height: 60,
    backgroundColor: Colors.neutral900,
    borderRadius: Radius.pill,
    padding: 4,
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
    ...Shadows.card,
  },
  activeFill: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: Colors.accentPink,
    borderRadius: Radius.pill,
  },
  label: {
    position: "absolute",
    alignSelf: "center",
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.surface,
    letterSpacing: 0.5,
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: Radius.pill,
    backgroundColor: Colors.accentPink,
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.sm,
  },
});
