<template>

  <div class='post-info'>
    <div>submitted by <a href="#">@{{ author }}</a>,</div>
    <div class="points"><b>{{ score }}</b> points</div>
    <div>
      in
      <a class="tag" v-for="(tag, index) in tags.split(' ')" href="#"
        :key="index">{{ tag }} </a>
    </div>
  </div>

</template>

<script>
export default {
  props: ['author', 'score', 'tags'],
  methods: {}
}
</script>

<style scoped>
.post-info {
  display: block;
  font-size: 75%;
  opacity: .8;
  margin-bottom: 1.2rem;
}
.post-info div {
  display: inline-block;
}
</style>