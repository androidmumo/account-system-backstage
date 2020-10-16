<template>
  <div class="base">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>概况</span>
      </div>
      <h3>
        用户总量：<span class="usernum">{{ userData.length }}</span>
      </h3>
    </el-card>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import { getUuid, getToken } from "../../../utils/auth";

export default {
  // import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    // 这里存放数据
    return {
      userData: [],
    };
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {},
  // 方法集合
  methods: {
    getAllUser() {
      let uuid = getUuid();
      let token = getToken();
      this.$http({
        // `method`是请求的方法
        method: "post",
        // `url`是请求的接口地址
        url: "https://account.api.mcloc.cn/getalluser",
        // URL参数 必须是一个纯对象或者 URL参数对象
        data: {
          uuid: uuid,
        },
        headers: {
          token: token,
        },
      }).then((res) => {
        if (res.data.code === 20000) {
          // console.log(res.data.data);
          this.userData = res.data.data;
        } else {
          // console.log(res.data);
          this.$Message.error("您没有查看权限!");
        }
      });
    },
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.getAllUser();
  },
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
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}

.box-card {
  width: 480px;
  margin: 0 auto;
}

.usernum {
  font-size: 32px;
}
</style>
