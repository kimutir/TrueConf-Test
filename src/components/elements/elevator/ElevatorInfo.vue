<template>
  <div class="elevator__info info">
    <div class="info__direction"></div>
    <div class="info__floor">
      {{ currentFloor }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    currentFloor: Number,
  },
};
</script>

<style scoped>
.elevator__info {
  width: 30%;
  height: 10%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  margin-top: 10%;
}
.info__direction {
  width: 10px;
  height: 10px;
}

.info__floor {
  font-size: 23px;
}
</style>
