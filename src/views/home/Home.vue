<template>
  <div class="home">
    <at-modal v-model="unLoginModal">
      <div slot="header" style="text-align: center">
        <span>提示</span>
      </div>
      <div style="text-align: center">
        <p>您确定要退出吗？</p>
      </div>
      <div slot="footer">
        <at-button style="width: 100%" type="error" @click="unLogin"
          >退出登录</at-button
        >
      </div>
    </at-modal>
    <div class="header">
      <h1>小马奔腾 - 账户系统后台管理</h1>
      <at-button
        class="unlogin"
        icon="icon-power"
        type="error"
        @click="beforeUnLogin"
        hollow
        >退出登录</at-button
      >
    </div>
    <div class="main">
      <at-menu mode="inline" :active-name="activeName" inline-collapsed router>
        <at-menu-item name="1" :to="{ name: 'Base' }">
          <i class="icon icon-home"></i>首页
        </at-menu-item>
        <at-menu-item name="2" :to="{ name: 'UserList' }">
          <i class="icon icon-align-left"></i>用户列表
        </at-menu-item>
        <at-menu-item name="3" :to="{ name: 'Adduser' }">
          <i class="icon icon-user-plus"></i>新增用户
        </at-menu-item>
        <at-menu-item name="4" disabled>
          <i class="icon icon-folder"></i>文件管理
        </at-menu-item>
      </at-menu>
      <div class="content">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import { removeUuid, removeToken } from "../../utils/auth";

export default {
  // import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    // 这里存放数据
    return {
      activeName: "1",
      unLoginModal: false,
    };
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {},
  // 方法集合
  methods: {
    beforeUnLogin() {
      this.unLoginModal = true;
    },
    unLogin() {
      removeUuid();
      removeToken();
      this.unLoginModal = false;
      this.$Message.success("已退出登录");
      this.$router.push("/login");
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
<style lang='scss' scoped>
// @import url(); 引入公共css类
.home {
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 60px;
    width: 100%;
    height: 80px;
    line-height: 80px;
    border-bottom: 1px solid #dddddd;
    margin-bottom: 30px;
    box-shadow: 0px 3px 10px #dddddd;

    .unlogin {
      height: 36px;
    }
  }

  .main {
    display: flex;

    .content {
      flex: 1;
      padding: 0 60px;
    }
  }
}
</style>
