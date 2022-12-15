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
      elevHeight: window.innerHeight / config.floors,
      active: false,
      waiting: false,
      // требуемая скорость
      speed: window.innerHeight / config.floors / 1000,
    };
  },
  methods: {
    movementAnimation(floor) {
      return new Promise((res) => {
        const start = performance.now();

        // с какой позиции начинается анимация
        const lastPosition = localStorage.currentPosotion
          ? JSON.parse(localStorage.currentPosotion)
          : (config.floors - this.currentFloor) * this.elevHeight;

        const animate = (time) => {
          // длительность анимации
          const duraction = time - start;
          const currentPosotion = this.$refs.elevator.offsetTop;
          // направление движения (реверсивно)
          const direction = floor - this.currentFloor < 0 ? -1 : 1;

          this.$refs.elevator.style.top = `${
            lastPosition - direction * duraction * this.speed
          }px`;

          // запоминаем позицию лифта
          localStorage.currentPosotion = currentPosotion;

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
            localStorage.currentPosotion =
              (config.floors - floor) * this.elevHeight;
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

      this.movementAnimation(queue[0]).then(() => {
        // лифт на новом этаже
        this.currentFloor = queue[0];
        localStorage.currentFloor = this.currentFloor;

        // удаляем его из стека и запоминаем
        queue.shift();
        localStorage.queue = JSON.stringify(this.queue);

        // остановка 3 секунды и продолжение
        this.waiting = true;
        setTimeout(() => {
          this.waiting = false;
          // вызываем рекурсивно, пока в стеке есть этажи
          return this.move(queue);
        }, 3000);
      });
    },
  },
  watch: {
    // наблюдаем за изменением стека
    queue: {
      handler(value) {
        if (!this.active && this.queue.length) {
          this.active = true;
          this.move(value);
        }
      },
      deep: true,
    },
  },
  mounted() {
    // текущий этаж
    this.currentFloor = localStorage.currentFloor
      ? JSON.parse(localStorage.currentFloor)
      : 1;

    // тукущее положение лифта
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
