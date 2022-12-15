<template>
  <div class="building">
    <building-tools />
  </div>
</template>

<script>
import config from "@/config";
import BuildingTools from "@/components/BuildingTools.vue";

export default {
  name: "App",
  components: {
    BuildingTools,
  },
  data() {
    return {
      floors: config.floors,
      elevators: config.elevators,
      queue: [],
    };
  },
  methods: {},
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
