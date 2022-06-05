<template>
  <div id="app">
    <v-app>
      <v-app-bar app color="pink">
        <v-app-bar-nav-icon
          color="white"
          @click.stop="drawer = !drawer"
        ></v-app-bar-nav-icon>
      </v-app-bar>
      <v-navigation-drawer v-model="drawer" fixed bottom primary light>
        <v-list-item class="side-nav" link :to="'/'" @click="drawer = false">
          <v-list-item-avatar>
            <v-icon>mdi-calendar</v-icon>
          </v-list-item-avatar>
          <v-list-item-content class="text-truncate">
            Events
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item link :to="'/users'" @click="drawer = false">
          <v-list-item-avatar>
            <v-icon>mdi-account-outline</v-icon>
          </v-list-item-avatar>
          <v-list-item-content class="text-truncate">
            Users
          </v-list-item-content>
        </v-list-item>
      </v-navigation-drawer>
      <v-main>
        <v-container fluid>
          <v-row class="fill-height">
            <v-col>
              <transition name="fade">
                <router-view></router-view>
              </transition>
            </v-col>
          </v-row>
        </v-container>
      </v-main>
    </v-app>
  </div>
</template>

<script>
export default {
  name: "App",
  components: {},
  data: () => ({
    drawer: false,
  }),
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.side-nav {
  margin-top: 100px;
}
</style>
