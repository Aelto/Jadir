<template>

  <div class="comment">
    <div>{{ content }}</div>
    <div class='author-wrapper'>
      <div class="date">{{ creation_date_ago }} by</div>
      <a class='author' href='#'>@{{ author }}</a>
    </div>

    
  </div>

</template>

<script>
import postInfo from '../posts/post-info.vue'
export default {
  props: ['content', 'author', 'creationdate'],
  computed: {
    creation_date_ago() {
      const diff = Date.now() - new Date(this.creationdate)
      const hours = Math.ceil(diff / (1000 * 3600))
      if (hours >= 24) {
        return Math.floor(hours / 24) + ' days ago'
      } else {
        return hours + ' hours ago'
      }
    }
  }
}
</script>

<style scoped>
.comment {
  margin-bottom: 1em;
  /* box-shadow: -7px 0 6px -10px; */
  padding: 1em 0.5em;
  /* box-shadow: -6px 0 8px -6px rgba(20, 20, 20, 0.2), 0 0 1px 0 rgba(20, 20, 20, 0.1); */
  /* background: white; */
  animation: fade-in-right cubic-bezier(0.785, 0.135, 0.15, 0.86) 0.1s forwards;
}

.comment .author-wrapper {
  display: flex;
  align-items: center;
  padding-bottom: 1em;
}

.comment .author-wrapper .author {
  display: flex;
}

.comment .author-wrapper .profile-pic {
  background-size: cover;
  background-position: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  box-shadow: 0 0 12px rgba(20, 20, 20, 0.3);
  cursor: pointer;
  margin-right: 1em;
  animation: pop cubic-bezier(0.6, 0.2, 0.45, 1.2) 0.3s forwards;
}

.comment .author-wrapper .date {
  font-size: .8em;
  padding-right: .2em;
}
</style>