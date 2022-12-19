<template>
  <div class="building-shafts shafts" ref="shafts">
    <div class="shafts__item" v-for="elNum in elevators" :key="elNum">
      <elevator
        :queue="queues[elNum - 1].queue"
        :number="elNum - 1"
        @elev-floors="elevFloors"
        @finish-time="computedFinishTime"
      />
    </div>
  </div>
</template>

<script>
import config from "@/config";
import Elevator from "@/components/elements/elevator/Elevator.vue";

export default {
  props: {
    queues: Array,
  },
  components: {
    Elevator,
  },
  data() {
    return {
      elevators: config.elevators,
    };
  },
  methods: {
    elevFloors(number, actualFloor, currentFloor) {
      this.$emit("elevFloors", number, actualFloor, currentFloor);
    },
    computedFinishTime(number, value) {
      this.$emit("finishTime", number, value);
    },
  },
  mounted() {
    // передаем элемент, чтобы узнать отспут для кнопок
    this.$emit("shaftsHtml", this.$refs.shafts);
  },
  watch: {
    queues: {
      handler(value) {
        // console.log("watch from shafts", value);
        // console.log("queues from shafts", value);
      },
      deep: true,
    },
  },
};
</script>

<style scoped>
.building-shafts {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
}

.shafts__item {
  position: relative;
  height: 100vh;
  width: 150px;
  border-left: 2px solid rgb(72, 69, 69);
  border-right: 2px solid rgb(72, 69, 69);
  margin: 0 15px;
}
</style>
