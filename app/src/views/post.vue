<template>
  <div class="post" v-if="post === null">
    no such post exist
  </div>
  <div class="post" v-else>
    <h2>{{ post.title }}</h2>
    <img :src="post.image_url" alt="post image" class="post-image"
      v-if="post.image_url && post.image_url !== null">
    
    <PostInfo :author="post.author" :score="post.score" :tags="post.tags" :date="post.date"></PostInfo>
    
    <div ref="postcontent" class="post-description"></div>
  </div>
</template>

<script>
import PostInfo from '@/components/posts/post-info.vue';
import MarkdownIt from 'markdown-it';

export default {
  components: { PostInfo },
  data: () => ({
    post: null,
    md: new MarkdownIt()
  }),
  async created() {
    const postId = Number(this.$route.params.id);

    // first search into the store, in case the post is already loaded
    for (const post of this.$store.state.posts) {
      if (post.id === postId) {
        return this.setPost(post);
      }
    }

    // query the api
    const response = await fetch(`/api/posts/${postId}`);
    const { post } = await response.json();

    this.setPost(post);
  },
  methods: {
    setPost(post = null) {
      this.post = post;
      this.setPostContent();
    },

    setPostContent() {
      if (!this.$refs.postcontent) {
        return setTimeout(() => this.setPostContent(), 25);
      }

      this.$refs.postcontent.innerHTML = this.md.render(this.post.content);
    }
  }
}
</script>

<style lang="scss" scoped>
.post {
  padding: 3em;

  img {
    max-width: 100%;
  }

  .post-description {
    white-space: pre-wrap;
    word-wrap: break-word;

    blockquote {
      background: var(--light-grey);
      padding-left: 1em;
    }
    
    code {
      background: var(--light-grey);
      padding: 1em;
      border-radius: 2px;
    }
  }
}
</style>
