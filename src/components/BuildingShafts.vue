<template>
  <div class="building-shafts shafts" ref="shafts">
    <div class="shafts__item" v-for="elNum in elevators">
      <elevator :queue="queue" :number="elNum" />
    </div>
  </div>
</template>

<script>
import config from "@/config";
import Elevator from "@/components/elements/elevator/Elevator.vue";

export default {
  props: {
    queue: Array,
  },
  components: {
    Elevator,
  },
  data() {
    return {
      elevators: config.elevators,
    };
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
