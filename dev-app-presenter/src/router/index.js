import Vue from "vue";
import Router from "vue-router";
import HelloWorld from "@/components/HelloWorld";
import SessionsList from "@/components/SessionsList";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "HelloWorld",
      component: HelloWorld
    },
    {
      path: "/sessions",
      name: "SessionsList",
      component: SessionsList
    }
  ]
});
