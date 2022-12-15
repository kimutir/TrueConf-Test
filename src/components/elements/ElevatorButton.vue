<template>
  <div class="el-button">
    <div class="el-button__value">{{ value }}</div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Number,
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
