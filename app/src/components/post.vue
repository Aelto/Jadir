<template>
  <div class="post"
    :class="{ nsfw: is_nsfw() }">

    <div class="post-thumbnail"
      :style="`animation-delay: ${index * 0.15}s; background-image: url(${image_url || '/static/typewriter.jpg'})`"></div>

    <div class="post-text">
      <router-link class="post-title"
        :to="post_url">{{ title }}</router-link>

      <PostInfo :author="author" :score="author" :tags="tags" :date="date" />
    </div>

  </div>
</template>

<script>
import PostInfo from './post-info.vue'

export default {
  components: {
    PostInfo
  },
  props: [
    'date',
    'score',
    'author',
    'tags',
    'image_url',
    'title',
    'id',
    'index'
  ],
  computed: {
    post_url() {
      return `/post/${this.id}`;
    }
  },
  methods: {
    is_nsfw() {
      return this.tags.includes('nsfw');
    }
  }
}
</script>

<style lang="scss" scoped>
.post {
  display: flex;

  .post-thumbnail {
    background-size: cover;
    background-position: center;
    width: 74px;
    height: 74px;
    border-radius: 6px;
    cursor: pointer;
    margin-right: 1em;
  }

  &.nsfw {
    .post-thumbnail {
      filter: blur(3px);
    }
  }
}
</style>
