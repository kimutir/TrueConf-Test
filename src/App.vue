<template>
  <div class="building">
    <building-tools
      :queue="queue"
      :marginLeft="marginButtonsLeft"
      :onAddFloor="onAddFloor"
    />
    <building-shafts
      :queue="queue"
      @shaftsHtml="computeButtonsMargin"
    />
  </div>
</template>

<script>
import config from "@/config";
import BuildingTools from "@/components/BuildingTools.vue";
import BuildingShafts from "@/components/BuildingShafts.vue";

export default {
  name: "App",
  components: {
    BuildingTools,
    BuildingShafts,
  },
  data() {
    return {
      floors: config.floors,
      elevators: config.elevators,
      queue: [],
      marginButtonsLeft: 0,
    };
  },
  methods: {
    // вычисления маржина для кнопок
    computeButtonsMargin(shaftsHtml) {
      this.marginButtonsLeft = shaftsHtml.offsetWidth;
    },
    // добавляем этаж в очередь
    onAddFloor(nextFloor) {
      if (
        (nextFloor === this.currentFloor && this.waiting) ||
        this.queue.includes(nextFloor) ||
        (nextFloor === this.currentFloor && !this.active)
      )
        return;

      // добавлем этаж в стек и запонимаем
      this.queue.push(nextFloor);
      localStorage.queue = JSON.stringify(this.queue);
    },
  },
  mounted() {
    // инициализация стека
    this.queue = localStorage.queue
      ? JSON.parse(localStorage.queue)
      : [];
  },
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
#app {
  width: 100vw;
  height: 100vh;
  background-color: rgb(180, 149, 109);
}
.building {
  height: 100%;
  width: 100%;
}
</style>
