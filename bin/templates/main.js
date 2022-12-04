{{^hasVue}}
// insert your code
{{/hasVue}}
{{#hasVue}}
const { createApp } = Vue

const app = createApp({
  data () {
    return {
      message: 'Hello Vue!'
    }
  },
  methods: {
  
  }
}).mount('#app')
{{/hasVue}}
