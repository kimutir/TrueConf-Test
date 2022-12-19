<template>
  <div
    class="el-button"
    :class="{ active: queue.includes(value) }"
    :style="{ marginLeft: marginLeft + 'px' }"
    @click.stop="$emit('addFloor', value)"
  >
    <div class="el-button__value">{{ value }}</div>
  </div>
</template>

<script>
export default {
  props: {
    marginLeft: Number,
    value: Number,
    queue: Array,
    // onAddFloor: Function,
  },
  data() {
    return {};
  },
  methods: {},
  watch: {
    queue: {
      handler(value) {
        // console.log(value);
      },
      deep: true,
    },
  },
};
</script>

<style scoped>
.el-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgb(121, 152, 163);
  border: 2px solid grey;
  cursor: pointer;
}
.el-button__value {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.active {
  border: 2px solid red;
}
</style>
