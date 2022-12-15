<template>
  <div class="building__tools">
    <div
      v-for="floor in floors"
      class="building__floor"
      :style="{ height: computedHeight + 'px' }"
      :key="floor"
    >
      <elevator-button
        :value="floor"
        :marginLeft="marginLeft"
        :queue="queue"
        :onAddFloor="onAddFloor"
      />
    </div>
  </div>
</template>

<script>
import config from "@/config";
import ElevatorButton from "@/components/elements/ElevatorButton.vue";

export default {
  components: {
    ElevatorButton,
  },
  props: {
    queue: Array,
    marginLeft: Number,
    onAddFloor: {
      type: Function,
      default: () => {
        console.log("ni");
      },
    },
  },
  data() {
    return {
      floors: config.floors,
      computedHeight: window.innerHeight / config.floors,
    };
  },
};
</script>

<style scoped>
.building__tools {
  height: 100%;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column-reverse;
}
.building__floor {
  display: flex;
  align-items: center;
  border-bottom: 2px solid grey;
}
</style>
