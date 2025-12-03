<template>
  <div class="comment-thread">
    <div v-if="loading && comments.length === 0" class="text-center py-4">
      <v-progress-circular indeterminate color="primary" size="32"></v-progress-circular>
    </div>

    <div v-else-if="comments.length === 0 && !loading" class="text-center py-4">
      <v-icon size="48" color="grey-lighten-1">mdi-comment-outline</v-icon>
      <p class="text-body-2 text-grey mt-2">No hay comentarios aún</p>
    </div>

    <div v-else>
      <CommentItem
        v-for="comment in comments"
        :key="comment.id_comentario"
        :comment="comment"
        :tipo-entidad="tipoEntidad"
        :id-entidad="idEntidad"
        :current-user-id="currentUserId"
        @reply="handleReply"
        @edit="handleEdit"
        @delete="handleDelete"
      />
    </div>

    <!-- Formulario para nuevo comentario o respuesta -->
    <CommentForm
      v-if="showForm"
      :parent-id="replyingTo"
      :editing-comment="editingComment"
      :tipo-entidad="tipoEntidad"
      :id-entidad="idEntidad"
      @submit="handleSubmit"
      @cancel="handleCancel"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useCommentStore } from '../stores/commentStore';
import { useAuthStore } from '@/features/auth/stores/authStore';
import CommentItem from './CommentItem.vue';
import CommentForm from './CommentForm.vue';

const props = defineProps({
  tipoEntidad: {
    type: String,
    required: true,
    validator: (value) => ['tarea', 'proyecto', 'fase'].includes(value),
  },
  idEntidad: {
    type: Number,
    required: true,
  },
  autoLoad: {
    type: Boolean,
    default: true,
  },
  showForm: {
    type: Boolean,
    default: true,
  },
});

const commentStore = useCommentStore();
const authStore = useAuthStore();

const loading = computed(() => commentStore.loading);
const comments = computed(() => commentStore.getComments(props.tipoEntidad, props.idEntidad));
const currentUserId = computed(() => authStore.userId);

const replyingTo = ref(null);
const editingComment = ref(null);

onMounted(() => {
  if (props.autoLoad) {
    loadComments();
  }
});

watch(() => [props.tipoEntidad, props.idEntidad], () => {
  if (props.autoLoad) {
    loadComments();
  }
});

async function loadComments() {
  await commentStore.fetchComments(props.tipoEntidad, props.idEntidad);
}

function handleReply(commentId) {
  replyingTo.value = commentId;
  editingComment.value = null;
}

function handleEdit(comment) {
  editingComment.value = comment;
  replyingTo.value = null;
}

function handleDelete(commentId) {
  commentStore.deleteComment(commentId);
}

async function handleSubmit(commentData) {
  if (editingComment.value) {
    await commentStore.updateComment(editingComment.value.id_comentario, commentData);
    editingComment.value = null;
  } else {
    await commentStore.createComment({
      ...commentData,
      tipo_entidad: props.tipoEntidad,
      id_entidad: props.idEntidad,
      id_comentario_padre: replyingTo.value || null,
    });
    replyingTo.value = null;
  }
}

function handleCancel() {
  replyingTo.value = null;
  editingComment.value = null;
}

defineExpose({
  loadComments,
  refresh: loadComments,
});
</script>

<style scoped>
.comment-thread {
  width: 100%;
}
</style>

