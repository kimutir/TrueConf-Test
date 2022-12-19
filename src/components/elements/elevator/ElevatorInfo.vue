<template>
  <div class="elevator__info info">
    <div class="info__direction" :class="findDirection" />
    <div class="info__floor">
      {{ waiting || !this.queue[0] ? currentFloor : this.queue[0] }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    currentFloor: Number,
    queue: Array,
    active: Boolean,
    waiting: Boolean,
  },
  computed: {
    // определения класса стрелки
    findDirection() {
      if (this.waiting) return "direction__waiting";
      if (!this.active) return "direction__none";
      if (this.active && this.queue[0] > this.currentFloor)
        return "direction__up";
      if (this.active && this.queue[0] < this.currentFloor)
        return "direction__down";
    },
  },
};
</script>

<style scoped>
.elevator__info {
  width: 30%;
  height: 10%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  margin-top: 10%;
}
.info__direction {
  width: 10px;
  height: 10px;
}

.info__floor {
  font-size: 23px;
}

.direction__up {
  border-top: 3px solid #000;
  border-right: 3px solid #000;
  transform: rotate(-45deg);
}
.direction__down {
  border-top: 3px solid #000;
  border-right: 3px solid #000;
  transform: rotate(135deg);
}
.direction__waiting {
  background-color: #000;
  border-radius: 50%;
  animation-name: blinker;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
  animation-duration: 1.5s;
}

.direction__none {
  background-color: #000;
  border-radius: 50%;
}

@keyframes blinker {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
