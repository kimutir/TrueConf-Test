<template>
  <div class="building">
    <building-tools
      :queue="totalQueue"
      :marginLeft="marginButtonsLeft"
      :computed-height="computedHeight"
      @add-floor="onAddFloor"
    />

    <building-shafts
      :queues="queues"
      :computed-height="computedHeight"
      @shaftsHtml="computeButtonsMargin"
      @finish-time="computedFinishTime"
      @elev-floors="elevFloors"
      @cur-floor="changedCurFloor"
    />
  </div>
</template>

<script>
import config from "@/config";
import fromLocalStorage from "@/utils/fromLocalStorage";
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
      queues: this.createQueues(config.elevators),
      totalQueue: [],
      marginButtonsLeft: 0,
      computedHeight: window.innerHeight / config.floors,
    };
  },
  methods: {
    changedCurFloor(number, value) {
      this.queues[number].currentFloor = value;
    },
    computedFinishTime(number, time) {
      // устанавливаем оставшееся время работы лифта
      this.queues[number].finishTime = time;
    },
    elevFloors(number, inProgressFloor, currentFloor) {
      // следующий этаж или
      // его текущий этаж, если лифт в покое
      this.queues[number].floor = inProgressFloor;

      // убираем из очереди этаж, на который пришел лифт
      this.totalQueue = this.totalQueue.filter((i) => {
        return i !== currentFloor;
      });

      // запоминаем стек этажей
      localStorage.totalQueue = JSON.stringify(this.totalQueue);
    },
    // вычисление маржина для кнопок
    computeButtonsMargin(shaftsHtml) {
      this.marginButtonsLeft = shaftsHtml.offsetWidth;
    },
    // добавляем этаж в очередь
    onAddFloor(nextFloor) {
      const floorsInProgress = this.queues.map((i) => i.floor);
      const floorsCurrent = this.queues.map((i) => i.currentFloor);
      // проверка на дублирование этажа в стеке
      if (
        this.totalQueue.includes(nextFloor) ||
        floorsInProgress.includes(nextFloor) ||
        floorsCurrent.includes(nextFloor)
      ) {
        return;
      } else {
        this.totalQueue.push(nextFloor);
        localStorage.totalQueue = JSON.stringify(this.totalQueue);
      }

      // выбираем какой лифт вызвать
      const sortedQueues = [...this.queues];
      sortedQueues.sort((a, b) => a.finishTime - b.finishTime);
      let closest = sortedQueues[0];

      for (const a of sortedQueues) {
        if (a.finishTime === closest.finishTime) {
          if (a.queue.length && closest.queue.length) {
            const lastA = a.queue[a.queue.length - 1];
            const lastClosest =
              closest.queue[closest.queue.length - 1];

            if (
              Math.abs(lastA - nextFloor) <
              Math.abs(lastClosest - nextFloor)
            ) {
              closest = a;
            }
          } else {
            if (
              Math.abs(a.floor - nextFloor) <
              Math.abs(closest.floor - nextFloor)
            ) {
              closest = a;
            }
          }
        } else {
          break;
        }
      }
      this.queues[closest.number].queue.push(nextFloor);
    },
    // создание стека
    createQueues(amount) {
      const result = [];
      for (let i = 0; i < amount; i++) {
        result.push({
          number: i,
          queue: [],
          finishTime: 0,
          floor: 1,
          currentFloor: 1,
          currentPosition: (config.floors - 1) * this.computedHeight,
        });
      }
      return result;
    },
  },
  mounted() {
    // сверяем конфигурацию приложения
    const storageSettings = fromLocalStorage("settings");
    // если количество лифтов и этажей равны предыдущим значениям,
    // то берем данные из localStorage
    if (
      storageSettings &&
      storageSettings.elevators === config.elevators &&
      storageSettings.floors === config.floors
    ) {
      this.queues = fromLocalStorage("queues");
      this.totalQueue = fromLocalStorage("totalQueue");
    } else {
      const settings = {
        elevators: config.elevators,
        floors: config.floors,
      };
      const queues = this.createQueues(config.elevators);
      this.queues = queues;
      localStorage.settings = JSON.stringify(settings);
      localStorage.queues = JSON.stringify(queues);
      localStorage.totalQueue = JSON.stringify([]);
    }
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
