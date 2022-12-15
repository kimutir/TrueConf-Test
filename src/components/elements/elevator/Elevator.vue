<template>
  <div
    class="elevator"
    :style="{ height: elevHeight + 'px' }"
    ref="elevator"
  >
    <elevator-info :currentFloor="currentFloor" />
  </div>
</template>

<script>
import config from "@/config";
import ElevatorInfo from "@/components/elements/elevator/ElevatorInfo.vue";

export default {
  props: {},
  components: {
    ElevatorInfo,
  },
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
