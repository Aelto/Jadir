<template>
  <div class='time-diff'>{{ getHoursDifference() }}</div>
</template>

<script>
export default {
  props: ['before', 'after'],
  methods: {
    getHoursDifference() {
      const minutes = Math.floor((this.after - this.before) / (1000 * 60))

      if (!minutes) {
        return `a few seconds ago`
      }

      if (minutes < 60) {
        return `${minutes} minutes ago`
      }

      else {
        const hours = Math.floor(minutes / 60)

        if (hours < 24) {
          return `${hours} hour${hours > 1 ? 's' : ''} ago`
        }

        else {
          const days = Math.floor(hours / 24)

          return `${days} day${days > 1 ? 's' : ''} ago`
        }
      }

      return 'unkown time diff'
    }
  }  
}
</script>

<style scoped>

</style>