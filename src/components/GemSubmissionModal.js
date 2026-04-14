import React, { useMemo, useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import * as ImagePicker from 'expo-image-picker';
import { Colors, Spacing, Typography } from '../theme/tokens';

/**
 * GemSubmissionModal Component
 * 
 * Features:
 * - Dynamic bottom sheet for gem contribution.
 * - Star rating (4-5 restriction).
 * - Image selection (expo-image-picker).
 * - Dev Moderation Bypass supported.
 */

const GemSubmissionModal = ({ bottomSheetRef, onSubmit }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [stars, setStars] = useState(0);
  const [image, setImage] = useState(null);
  
  const snapPoints = useMemo(() => ['50%', '85%'], []);

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.5,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const isSubmitDisabled = !name || !category || stars < 4;

  const handleLevelSubmit = () => {
    if (isSubmitDisabled) return;
    
    onSubmit({
      name,
      category,
      stars,
      image,
      timestamp: new Date().toISOString(),
    });

    // Reset and close
    setName('');
    setCategory('');
    setStars(0);
    setImage(null);
    bottomSheetRef.current?.close();
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
      backgroundStyle={styles.bottomSheetBackground}
      handleIndicatorStyle={styles.indicator}
    >
      <BottomSheetView style={styles.container}>
        <Text style={styles.title}>MARK A GEM</Text>
        <Text style={styles.subtitle}>Only 4+ Star Spots Allowed</Text>

        <TextInput
          style={styles.input}
          placeholder="Venue Name"
          placeholderTextColor={Colors.grayLow}
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={styles.input}
          placeholder="Category (e.g. Speakeasy, Rooftop)"
          placeholderTextColor={Colors.grayLow}
          value={category}
          onChangeText={setCategory}
        />

        <View style={styles.starContainer}>
          {[1, 2, 3, 4, 5].map((s) => (
            <TouchableOpacity key={s} onPress={() => setStars(s)}>
              <Text style={[
                styles.starText,
                stars >= s && styles.starActive
              ]}>
                ★
              </Text>
            </TouchableOpacity>
          ))}
          {stars > 0 && stars < 4 && (
            <Text style={styles.errorText}>Too Low for Radar</Text>
          )}
        </View>

        <TouchableOpacity 
          style={styles.imageButton} 
          onPress={handleImagePick}
        >
          {image ? (
            <Image source={{ uri: image }} style={styles.thumbnail} />
          ) : (
            <Text style={styles.imageButtonText}>+ ADD PHOTO</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.submitButton, isSubmitDisabled && styles.disabledButton]}
          onPress={handleLevelSubmit}
          disabled={isSubmitDisabled}
        >
          <Text style={styles.submitButtonText}>TRANSMIT SIGNAL</Text>
        </TouchableOpacity>
      </BottomSheetView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  bottomSheetBackground: {
    backgroundColor: Colors.dimBlack,
  },
  indicator: {
    backgroundColor: Colors.neonGreen,
  },
  container: {
    padding: Spacing.lg,
    flex: 1,
  },
  title: {
    ...Typography.header,
    color: Colors.neonGreen,
    fontSize: 24,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.subheader,
    color: Colors.grayLow,
    fontSize: 10,
    marginBottom: Spacing.lg,
  },
  input: {
    backgroundColor: Colors.grayHigh,
    color: Colors.white,
    padding: Spacing.md,
    borderRadius: 8,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.grayMid,
  },
  starContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  starText: {
    fontSize: 32,
    color: Colors.grayMid,
    marginRight: Spacing.sm,
  },
  starActive: {
    color: Colors.neonGreen,
  },
  errorText: {
    color: Colors.error,
    fontSize: 10,
    fontWeight: '800',
    marginLeft: Spacing.sm,
  },
  imageButton: {
    width: '100%',
    height: 100,
    backgroundColor: Colors.grayHigh,
    borderRadius: 8,
    borderStyle: 'dashed',
    borderWidth: 2,
    borderColor: Colors.grayMid,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  imageButtonText: {
    color: Colors.grayLow,
    fontWeight: '700',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  submitButton: {
    backgroundColor: Colors.neonGreen,
    padding: Spacing.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: Colors.grayMid,
    opacity: 0.5,
  },
  submitButtonText: {
    color: Colors.deepBlack,
    fontWeight: '900',
    letterSpacing: 1,
  },
});

export default GemSubmissionModal;
