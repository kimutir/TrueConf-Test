<template>
  <div
    class="elevator"
    :style="{ height: elevHeight + 'px' }"
    ref="elevator"
  >
    <elevator-info
      :waiting="waiting"
      :active="active"
      :currentFloor="currentFloor"
      :nextFloor="nextFloor"
      :queue="queue"
    />
  </div>
</template>

<script>
import config from "@/config";
import ElevatorInfo from "@/components/elements/elevator/ElevatorInfo.vue";

export default {
  props: {
    queue: Array,
    number: Number,
  },
  components: {
    ElevatorInfo,
  },
  data() {
    return {
      currentFloor: 1,
      nextFloor: null,
      elevHeight: window.innerHeight / config.floors,
      active: false,
      waiting: false,
      finishTime: 0,
      // требуемая скорость
      speed: window.innerHeight / config.floors / 1000,
    };
  },
  methods: {
    movementAnimation(floor, startFloor) {
      return new Promise((res) => {
        const start = performance.now();

        // с какой позиции начинается анимация
        const lastPosition = localStorage.currentPosotion
          ? JSON.parse(localStorage.currentPosotion)
          : (config.floors - startFloor) * this.elevHeight;

        const animate = (time) => {
          // длительность анимации
          const duraction = time - start;
          const currentPosotion = this.$refs.elevator.offsetTop;
          // направление движения (реверсивно)
          const direction = floor - startFloor < 0 ? -1 : 1;

          this.$refs.elevator.style.top = `${
            lastPosition - direction * duraction * this.speed
          }px`;

          // запоминаем позицию лифта
          // localStorage.currentPosotion = currentPosotion;

          // вызываем анимацию пока не доедет до нужного этажа
          if (
            currentPosotion * direction >
            (config.floors - floor) * this.elevHeight * direction
          ) {
            requestAnimationFrame(animate);
          } else {
            this.$refs.elevator.style.top = `${
              (config.floors - floor) * this.elevHeight
            }px`;
            // запоминаем уточненную позицию, когда лифт доехал
            // localStorage.currentPosotion =
            //   (config.floors - floor) * this.elevHeight;
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

      this.nextFloor = queue[0];

      const startFloor = this.currentFloor;
      const endFloor = queue[0];

      this.movementAnimation(endFloor, startFloor).then(() => {
        // лифт на новом этаже
        this.currentFloor = queue[0];
        queue.shift();
        // localStorage.currentFloor = this.currentFloor;

        // удаляем его из стека и запоминаем

        // localStorage.queue = JSON.stringify(this.queue);

        // остановка 3 секунды и продолжение
        this.waiting = true;
        // if (queue.length === 0) {
        //   this.finishTime = 3;
        // }
        setTimeout(() => {
          this.waiting = false;
          console.log("waiting:", this.waiting);
          // вызываем рекурсивно, пока в стеке есть этажи
          return this.move(queue);
        }, 3000);
      });
    },

    computeFinishTime() {
      //
      if (this.queue.length === 0 && this.waiting) {
        this.finishTime = 3;
        const intervalId = setInterval(() => {
          this.finishTime = this.finishTime - 1;
        }, 1000);
        setTimeout(() => {
          console.log("очистился");
          clearInterval(intervalId);
        }, 3000);
        return;
      }

      // если стек пустой
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
      console.log("finish in:", value);
      this.$emit("finishTime", this.number, value);
    },
  },
  mounted() {
    // инициализируем этаж
    this.currentFloor = localStorage.currentFloor
      ? JSON.parse(localStorage.currentFloor)
      : 1;

    // инициализируем положение лифта
    if (localStorage.currentPosotion) {
      this.$refs.elevator.style.top =
        JSON.parse(localStorage.currentPosotion) + "px";
    } else {
      this.$refs.elevator.style.top =
        (config.floors - 1) * this.elevHeight + "px";
    }
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
