<template>
  <div
    class="elevator"
    :style="{ height: elevHeight + 'px' }"
    ref="elevator"
  >
    <elevator-info
      :waiting="waiting"
      :active="active"
      :current-floor="currentFloor"
      :prev-floor="prevFloor"
      :queue="queue"
    />
  </div>
</template>

<script>
import config from "@/config";
import ElevatorInfo from "@/components/elements/elevator/ElevatorInfo.vue";
import remember from "@/utils/remember";
import fromLocalStorage from "@/utils/fromLocalStorage";

export default {
  props: {
    queue: Array,
    initialPosition: Number,
    initialFloor: Number,
    number: Number,
    elevHeight: Number,
  },
  components: {
    ElevatorInfo,
  },
  data() {
    return {
      currentFloor: 1,
      prevFloor: null,
      active: false,
      waiting: false,
      finishTime: 0,
      // требуемая скорость
      speed: window.innerHeight / config.floors / 1000,
    };
  },
  methods: {
    movementAnimation(endFloor, startFloor) {
      return new Promise((res) => {
        const start = performance.now();

        // с какой позиции начинается анимация
        const storageQueues = fromLocalStorage("queues");
        const lastPosition = storageQueues[this.number]
          .currentPosition
          ? storageQueues[this.number].currentPosition
          : (config.floors - startFloor) * this.elevHeight;

        const animate = (time) => {
          // длительность анимации
          const duraction = time - start;
          const currentPosition = this.$refs.elevator.offsetTop;
          // направление движения
          const direction = endFloor - startFloor < 0 ? -1 : 1;

          this.$refs.elevator.style.top = `${
            lastPosition - direction * duraction * this.speed
          }px`;

          // запоминаем позицию лифта
          remember({
            key: "queues",
            param: "currentPosition",
            value: currentPosition,
            num: this.number,
          });

          // вызываем анимацию пока не доедет до нужного этажа
          if (
            currentPosition * direction >
            (config.floors - endFloor) * this.elevHeight * direction
          ) {
            requestAnimationFrame(animate);
          } else {
            this.$refs.elevator.style.top = `${
              (config.floors - endFloor) * this.elevHeight
            }px`;
            // запоминаем уточненную позицию, когда лифт доехал
            remember({
              key: "queues",
              param: "currentPosition",
              value: (config.floors - endFloor) * this.elevHeight,
              num: this.number,
            });
            cancelAnimationFrame(animate);
            res();
          }
        };

        requestAnimationFrame(animate);
      });
    },

    move(queue) {
      // если стек пустой, заканчиваем движение
      if (!queue.length) {
        this.active = false;
        return;
      }
      // начальный и конечный этажи
      const startFloor = this.currentFloor;
      const endFloor = queue[0];
      this.prevFloor = this.currentFloor;
      this.currentFloor = null;

      this.movementAnimation(endFloor, startFloor).then(() => {
        // лифт на новом этаже, удаляем его из очереди
        this.currentFloor = queue[0];
        queue.shift();

        // запоминаем текущий этаж
        remember({
          key: "queues",
          param: "currentFloor",
          value: this.currentFloor,
          num: this.number,
        });

        // остановка 3 секунды и продолжение
        this.waiting = true;
        setTimeout(() => {
          this.waiting = false;
          // вызываем рекурсивно, пока в стеке есть этажи
          return this.move(queue);
        }, 3000);
      });
    },
    // вычисляем оставшееся время работы лифта
    computeFinishTime() {
      // лифт в режиме ожидания
      if (this.queue.length === 0 && this.waiting) {
        this.finishTime = 3;
        const intervalId = setInterval(() => {
          this.finishTime = this.finishTime - 1;
        }, 1000);
        setTimeout(() => {
          clearInterval(intervalId);
        }, 3000);
        return;
      }
      // лифт готов к работе
      if (this.queue.length === 0 && !this.waiting) {
        this.finishTime = 0;
        return;
      }
      // если в стеке больше одного вызова
      if (this.queue.length > 0) {
        const result = this.queue.reduce((acc, item, index) => {
          if (index === 0) {
            return acc + Math.abs(this.currentFloor - item) + 3;
          } else {
            return acc + Math.abs(item - this.queue[index - 1]) + 3;
          }
        }, 0);
        this.finishTime = result;
      }
    },
  },
  watch: {
    queue: {
      handler(value) {
        this.computeFinishTime();
        remember({
          key: "queues",
          param: "queue",
          value,
          num: this.number,
        });
        // передаем текущий и обрабатываемый этажи
        this.$emit(
          "elevFloors",
          this.number,
          value[0] || this.currentFloor,
          this.currentFloor
        );
        // включаем анимацию движения
        if (!this.active && this.queue.length) {
          this.active = true;
          this.move(value);
        }
      },
      deep: true,
    },
    finishTime(value) {
      // передаем оставшееся время работы лифта
      this.$emit("finishTime", this.number, value);
    },
    initialPosition(value) {
      this.$refs.elevator.style.top = value + "px";
    },
    initialFloor(value) {
      this.currentFloor = value;
    },
  },
  mounted() {},
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
