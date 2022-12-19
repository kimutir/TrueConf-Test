<template>
  <div class="building">
    <building-tools
      :queue="totalQueue"
      :marginLeft="marginButtonsLeft"
      :onAddFloor="onAddFloor"
    />

    <building-shafts
      :queues="queues"
      @shaftsHtml="computeButtonsMargin"
      @finish-time="computedFinishTime"
      @elev-floors="elevFloors"
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
      queues: this.createQueues(config.elevators),
      totalQueue: [],
      marginButtonsLeft: 0,
    };
  },
  methods: {
    computedFinishTime(number, value) {
      this.queues[number].finishTime = value;
    },
    elevFloors(number, actualFloor, testFloor) {
      this.queues[number].currentFloor = actualFloor;
      this.totalQueue = this.totalQueue.filter(
        (i) => i !== testFloor
      );
    },
    // вычисления маржина для кнопок
    computeButtonsMargin(shaftsHtml) {
      this.marginButtonsLeft = shaftsHtml.offsetWidth;
    },
    // добавляем этаж в очередь
    onAddFloor(nextFloor) {
      const currentFloors = this.queues.map((i) => i.currentFloor);
      console.log("currentFloors:", currentFloors);
      if (
        currentFloors.includes(nextFloor) ||
        this.totalQueue.includes(nextFloor)
      ) {
        console.log("уже есть, завершаю");
        return;
      } else {
        console.log("надо добавить");
        this.totalQueue.push(nextFloor);
      }

      const sortedQueues = [...this.queues];
      sortedQueues.sort((a, b) => a.finishTime - b.finishTime);
      let closest = sortedQueues[0];

      for (const a of sortedQueues) {
        if (a.finishTime === closest.finishTime) {
          if (
            Math.abs(a.currentFloor - nextFloor) <
            Math.abs(closest.currentFloor - nextFloor)
          ) {
            closest = a;
          }
        } else {
          break;
        }
      }

      this.queues[closest.number].queue.push(nextFloor);

      // добавлем этаж в стек и запонимаем
      // localStorage.queue = JSON.stringify(this.queue);
    },
    // создание стека
    createQueues(amount) {
      const result = [];
      for (let i = 0; i < amount; i++) {
        result.push({
          number: i,
          queue: [],
          finishTime: 0,
          currentFloor: 1,
        });
      }
      return result;
    },
  },
  mounted() {
    this.queues.forEach((i) => this.totalQueue.push(...i.queue));

    // инициализация стека
    this.queue = localStorage.queue
      ? JSON.parse(localStorage.queue)
      : [];
  },
  watch: {},
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
