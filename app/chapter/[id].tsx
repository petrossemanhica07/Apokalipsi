import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
  TextInput,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { chapters } from '@/lib/chapters';
import { isFavorite, toggleFavorite } from '@/lib/favorites';
import { addComment, getComments, type Comment } from '@/lib/firebase';
import AudioPlayer from '@/components/AudioPlayer';
import Colors from '@/constants/colors';

export default function ChapterDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const chapterId = parseInt(id || '1', 10);
  const chapter = chapters.find(c => c.id === chapterId);
  const [isFav, setIsFav] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const webTopInset = Platform.OS === 'web' ? 67 : 0;

  useEffect(() => {
    if (chapterId) {
      isFavorite(chapterId).then(setIsFav);
      loadComments();
    }
  }, [chapterId]);

  const loadComments = useCallback(async () => {
    setLoadingComments(true);
    try {
      const data = await getComments(chapterId);
      setComments(data);
    } catch (e) {
      console.log('Error loading comments:', e);
    }
    setLoadingComments(false);
  }, [chapterId]);

  const handleToggleFavorite = async () => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const result = await toggleFavorite(chapterId);
    setIsFav(result);
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !authorName.trim()) {
      Alert.alert('Aviso', 'Por favor, preencha o nome e o comentario.');
      return;
    }
    setSubmitting(true);
    try {
      await addComment(chapterId, authorName.trim(), newComment.trim());
      setNewComment('');
      if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await loadComments();
    } catch (e) {
      Alert.alert('Erro', 'Nao foi possivel enviar o comentario.');
    }
    setSubmitting(false);
  };

  const navigateChapter = (direction: number) => {
    const nextId = chapterId + direction;
    if (nextId >= 1 && nextId <= chapters.length) {
      if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      router.replace({ pathname: '/chapter/[id]', params: { id: String(nextId) } });
    }
  };

  if (!chapter) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={styles.errorText}>Capitulo nao encontrado</Text>
      </View>
    );
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      <View style={[styles.header, { paddingTop: (insets.top || webTopInset) + 8 }]}>
        <Pressable onPress={() => router.back()} style={styles.headerButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle} numberOfLines={1}>Capitulo {chapter.id}</Text>
          <Text style={styles.headerSubtitle} numberOfLines={1}>{chapter.subtitle}</Text>
        </View>
        <Pressable onPress={handleToggleFavorite} style={styles.headerButton}>
          <Ionicons name={isFav ? "heart" : "heart-outline"} size={24} color={isFav ? Colors.danger : Colors.text} />
        </Pressable>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="on-drag"
      >
        <View style={styles.chapterHeader}>
          <LinearGradient
            colors={[Colors.warmCream, Colors.background]}
            style={styles.chapterHeaderBg}
          />
          <View style={styles.chapterBadge}>
            <Text style={styles.chapterBadgeText}>{chapter.id}</Text>
          </View>
          <Text style={styles.chapterMainTitle}>{chapter.title}</Text>
          <Text style={styles.chapterMainSubtitle}>{chapter.subtitle}</Text>
          <View style={styles.versesInfo}>
            <MaterialCommunityIcons name="book-open-variant" size={16} color={Colors.textMuted} />
            <Text style={styles.versesText}>{chapter.verses} versiculos</Text>
          </View>
        </View>

        <AudioPlayer chapterId={chapterId} chapterTitle={chapter.title} />

        <View style={styles.summarySection}>
          <Text style={styles.sectionLabel}>RESUMO</Text>
          <Text style={styles.summaryText}>{chapter.summary}</Text>
        </View>

        <View style={styles.contentSection}>
          <Text style={styles.sectionLabel}>CONTEUDO</Text>
          <View style={styles.contentCard}>
            <Text style={styles.contentText}>{chapter.content}</Text>
          </View>
        </View>

        <View style={styles.navButtons}>
          <Pressable
            style={[styles.navButton, chapterId <= 1 && styles.navButtonDisabled]}
            onPress={() => navigateChapter(-1)}
            disabled={chapterId <= 1}
          >
            <Ionicons name="chevron-back" size={20} color={chapterId <= 1 ? Colors.textMuted : Colors.primary} />
            <Text style={[styles.navButtonText, chapterId <= 1 && styles.navButtonTextDisabled]}>Anterior</Text>
          </Pressable>
          <Pressable
            style={[styles.navButton, chapterId >= chapters.length && styles.navButtonDisabled]}
            onPress={() => navigateChapter(1)}
            disabled={chapterId >= chapters.length}
          >
            <Text style={[styles.navButtonText, chapterId >= chapters.length && styles.navButtonTextDisabled]}>Proximo</Text>
            <Ionicons name="chevron-forward" size={20} color={chapterId >= chapters.length ? Colors.textMuted : Colors.primary} />
          </Pressable>
        </View>

        <View style={styles.commentsSection}>
          <Text style={styles.sectionLabel}>COMENTARIOS</Text>

          <View style={styles.commentForm}>
            <TextInput
              style={styles.commentInput}
              placeholder="Seu nome"
              placeholderTextColor={Colors.textMuted}
              value={authorName}
              onChangeText={setAuthorName}
            />
            <TextInput
              style={[styles.commentInput, styles.commentTextArea]}
              placeholder="Escreva um comentario..."
              placeholderTextColor={Colors.textMuted}
              value={newComment}
              onChangeText={setNewComment}
              multiline
              numberOfLines={3}
            />
            <Pressable
              style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
              onPress={handleSubmitComment}
              disabled={submitting}
            >
              <Feather name="send" size={18} color={Colors.white} />
              <Text style={styles.submitButtonText}>{submitting ? 'A enviar...' : 'Enviar'}</Text>
            </Pressable>
          </View>

          {loadingComments ? (
            <View style={styles.loadingComments}>
              <Text style={styles.loadingText}>A carregar comentarios...</Text>
            </View>
          ) : comments.length === 0 ? (
            <View style={styles.noComments}>
              <MaterialCommunityIcons name="comment-outline" size={32} color={Colors.textMuted} />
              <Text style={styles.noCommentsText}>Sem comentarios ainda</Text>
            </View>
          ) : (
            <View style={styles.commentsList}>
              {comments.map((comment) => (
                <View key={comment.id} style={styles.commentCard}>
                  <View style={styles.commentHeader}>
                    <View style={styles.commentAvatar}>
                      <Text style={styles.commentAvatarText}>{comment.author.charAt(0).toUpperCase()}</Text>
                    </View>
                    <View style={styles.commentMeta}>
                      <Text style={styles.commentAuthor}>{comment.author}</Text>
                      <Text style={styles.commentDate}>{formatDate(comment.createdAt)}</Text>
                    </View>
                  </View>
                  <Text style={styles.commentText}>{comment.text}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingBottom: 12,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  headerButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  headerTitle: {
    fontSize: 17,
    fontFamily: 'PlayfairDisplay_700Bold',
    color: Colors.text,
  },
  headerSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: Colors.textSecondary,
  },
  scrollView: {
    flex: 1,
  },
  chapterHeader: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
    position: 'relative',
  },
  chapterHeaderBg: {
    ...StyleSheet.absoluteFillObject,
  },
  chapterBadge: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: Colors.gold,
    shadowColor: '#8B6914',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  chapterBadgeText: {
    fontSize: 28,
    fontFamily: 'PlayfairDisplay_700Bold',
    color: Colors.primary,
  },
  chapterMainTitle: {
    fontSize: 24,
    fontFamily: 'PlayfairDisplay_700Bold',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  chapterMainSubtitle: {
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    color: Colors.softBrown,
    textAlign: 'center',
    marginBottom: 12,
  },
  versesInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  versesText: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: Colors.textMuted,
  },
  summarySection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sectionLabel: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.accent,
    letterSpacing: 2,
    marginBottom: 10,
  },
  summaryText: {
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  contentSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  contentCard: {
    backgroundColor: Colors.warmCream,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.goldLight,
  },
  contentText: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: Colors.text,
    lineHeight: 28,
  },
  navButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.card,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    shadowColor: '#8B6914',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  navButtonDisabled: {
    opacity: 0.4,
  },
  navButtonText: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: Colors.primary,
  },
  navButtonTextDisabled: {
    color: Colors.textMuted,
  },
  commentsSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  commentForm: {
    gap: 10,
    marginBottom: 20,
  },
  commentInput: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  commentTextArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.white,
  },
  loadingComments: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: Colors.textMuted,
  },
  noComments: {
    alignItems: 'center',
    paddingVertical: 30,
    gap: 8,
  },
  noCommentsText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: Colors.textMuted,
  },
  commentsList: {
    gap: 12,
  },
  commentCard: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    shadowColor: '#8B6914',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: Colors.warmCream,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: Colors.goldLight,
  },
  commentAvatarText: {
    fontSize: 15,
    fontFamily: 'PlayfairDisplay_700Bold',
    color: Colors.primary,
  },
  commentMeta: {
    flex: 1,
  },
  commentAuthor: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.text,
  },
  commentDate: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    color: Colors.textMuted,
  },
  commentText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: Colors.textMuted,
  },
});
