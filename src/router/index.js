import Vue from "vue";
import VueRouter from "vue-router";
import { getToken } from "../utils/auth";

const originalPush = VueRouter.prototype.push;

VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};

Vue.use(VueRouter);

const router = new VueRouter({
  // mode: 'history',
  routes: [
    {
      path: "/",
      redirect: "/home",
    },
    {
      path: "/login",
      name: "Login",
      component: () => import("../views/Login.vue"), //懒加载
    },
    // {
    //     path: '/register',
    //     name: 'Register',
    //     component: () => import("../views/Register.vue"), //懒加载
    // },
    {
      path: "/home",
      name: "Home",
      redirect: "/home/base",
      component: () => import("../views/home/Home.vue"), //懒加载
      children: [
        {
          path: "userlist",
          name: "UserList",
          component: () => import("../views/home/userlist/index.vue"),
        },
        {
          path: "base",
          name: "Base",
          component: () => import("../views/home/base/index.vue"),
        },
        {
          path: "/edit",
          name: "Edit",
          component: () => import("../views/home/edit/index.vue"), //懒加载
        },
        {
          path: "adduser",
          name: "Adduser",
          component: () => import("../views/home/adduser/index.vue"),
        },
      ],
      beforeEnter(to, from, next) {
        if (getToken()) {
          next();
        } else {
          // alert("您还没有登陆呢！")
          next("/login");
        }
      },
    },
  ],
  linkActiveClass: "active", //指定活动状态类名
});

export default router;
