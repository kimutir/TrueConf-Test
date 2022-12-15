<template>
  <div class="el-button" :style="{ marginLeft: marginLeft + 'px' }">
    <div class="el-button__value">{{ value }}</div>
  </div>
</template>

<script>
export default {
  props: {
    marginLeft: {
      type: Number,
    },
    value: {
      type: Number,
    },
    queue: {
      type: Array,
    },
  },
  data() {
    return {};
  },
  methods: {},
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
</style>
