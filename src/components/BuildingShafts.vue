<template>
  <div class="building-shafts shafts" ref="shafts">
    <div class="shafts__item" v-for="el in queues" :key="el.number">
      <elevator
        :queue="el.queue"
        :initial-floor="el.currentFloor"
        :initial-position="el.currentPosition"
        :number="el.number"
        :elev-height="computedHeight"
        @elev-floors="elevFloors"
        @finish-time="computedFinishTime"
      />
    </div>
  </div>
</template>

<script>
import Elevator from "@/components/elements/elevator/Elevator.vue";

export default {
  props: {
    queues: Array,
    computedHeight: Number,
  },
  components: {
    Elevator,
  },
  data() {
    return {};
  },
  methods: {
    elevFloors(number, inProgressFloor, currentFloor) {
      this.$emit("elevFloors", number, inProgressFloor, currentFloor);
    },
    computedFinishTime(number, time) {
      this.$emit("finishTime", number, time);
    },
  },
  mounted() {
    // передаем элемент, чтобы узнать отспут для кнопок
    this.$emit("shaftsHtml", this.$refs.shafts);
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
