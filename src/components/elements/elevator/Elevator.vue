<template>
  <div
    class="elevator"
    :style="{ height: elevHeight + 'px' }"
    ref="elevator"
  ></div>
</template>

<script>
import config from "@/config";

export default {
  props: {},
  data() {
    return {
      currentFloor: 1,
      elevHeight: window.innerHeight / config.floors,
    };
  },
};
</script>

<style scoped>
.elevator {
  position: absolute;
  background-color: rgb(122, 122, 193);
  width: 100%;
  display: flex;
  justify-content: center;
}
</style>
