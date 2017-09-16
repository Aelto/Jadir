const routes = (router, data) => ({
  route: (to) => {
    router.push({ path: to })
  }
})

export default routes