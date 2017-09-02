<template>
  <div class="home">
    
  <div class='post' v-for="post in posts">
    <h5>{{ post }}</h5>
    <div>
      <div>by Aelto</div>
      <div>{{ Math.floor(Math.random() * 360) }} comments </div>
    </div>
  </div>



  </div>
</template>

<script>

const contentData = {
  posts: []
}

export default {
  props: ['global'],
  data: () => contentData
}

</script>

<style scoped>

.home .post {
  margin: 1em 20vw;

  border-bottom: solid 1px rgba(20, 20, 20, 0.2);
  padding-bottom: 1em;
}

.home .post div div {
  display: inline-block;
}

.home .post div div {
  margin-right: 1em;
}

</style>