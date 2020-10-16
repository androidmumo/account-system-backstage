<template>
  <div class="login">
    <at-card style="width: 300px" :bordered="false" class="card">
      <h4 slot="title" class="title">登录</h4>
      <div>
        <at-input
          class="input"
          v-model="inputValue1"
          placeholder="用户名"
          status=""
          icon=""
        ></at-input>
        <at-input
          type="password"
          v-model="inputValue2"
          placeholder="密码"
          status=""
          icon=""
        ></at-input>
      </div>
      <div class="btn">
        <at-button type="primary" @click="doLogin">登录</at-button>
      </div>
    </at-card>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import { getToken, setToken, setUuid } from "../utils/auth";

export default {
  // import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    // 这里存放数据
    return {
      inputValue1: "",
      inputValue2: "",
    };
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {},
  beforeRouteEnter(to, from, next) {
    if (!getToken()) {
      next();
    } else {
      next("/");
    }
  },
  // 方法集合
  methods: {
    doLogin() {
      this.$http({
        // `method`是请求的方法
        method: "post",
        // `url`是请求的接口地址
        url: "https://account.api.mcloc.cn/login",
        // URL参数 必须是一个纯对象或者 URL参数对象
        data: {
          username: this.inputValue1,
          password: this.inputValue2,
        },
      }).then((res) => {
        if (res.data.code === 20000) {
          setToken(res.data.data.token);
          setUuid(res.data.data.uuid);
          this.$Message.success(res.data.msg);
          this.$router.push({
            path: `/home`,
          });
        }
        if (res.data.code === 40001) {
          this.$Message.error(res.data.msg);
        }
      });
    },
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {},
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
  beforeCreate() {}, // 生命周期 - 创建之前
  beforeMount() {}, // 生命周期 - 挂载之前
  beforeUpdate() {}, // 生命周期 - 更新之前
  updated() {}, // 生命周期 - 更新之后
  // beforeDestroy () {}, // 生命周期 - 销毁之前(vue2)
  beforeUnmount() {}, // 生命周期 - 销毁之前(vue3)
  // destroyed () {}, // 生命周期 - 销毁完成(vue2)
  unmounted() {}, // 生命周期 - 销毁完成(vue3)
  activated() {}, // 如果页面有keep-alive缓存功能，这个函数会触发
};
</script>
<style lang="scss" scoped>
// @import url(); 引入公共css类
.login {
  height: 100%;
  width: 100%;
  background-image: url(https://bing.mcloc.cn/api);
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;

  .card {
    height: 260px;

    .input {
      margin: 10px 0 20px;
    }

    .btn {
      text-align: center;
      margin: 30px 0 0;
    }
  }
}
</style>
