<template>
  <div>
    <div v-for="(item, index) in value" :key="index">
      <ctc-question :value="item" @input="addItem" @click:delete="removeItem(item)"></ctc-question>
    </div>
  </div>
</template>

<script>
export default {
  props: ['value'],
  created() {
    if (!this.value) {
      this.$emit('input', [])
    }
  },
  methods: {
    addItem() {
      if (this.inputValue) {
        const list = this.value
        list.push(this.inputValue)
        this.inputValue = ''
        this.$emit('input', list)
      }
    },
    removeItem(item) {
      const list = this.value
      const index = this.value.indexOf(item)
      list.splice(index, 1)
      console.log(list)
      this.$emit('input', list)
    }
  }
}
</script>