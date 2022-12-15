<template>
  <div class="building">
    <building-tools :queue="queue" :marginLeft="marginButtonsLeft" />
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
  },
  mounted() {},
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
