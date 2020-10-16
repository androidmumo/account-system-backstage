<template>
  <div class="userlist">
    <at-modal v-model="delModal">
      <div slot="header" style="text-align: center">
        <span>提示</span>
      </div>
      <div style="text-align: center">
        <p>您确定要删除此账号吗？（操作不可恢复！）</p>
      </div>
      <div slot="footer">
        <at-button
          @click="
            () => {
              this.delModal = false;
            }
          "
          hollow
          >取消</at-button
        >
        <at-button type="error" @click="adminDelUser(delModal)"
          >确认删除</at-button
        >
      </div>
    </at-modal>
    <at-table
      :columns="columns"
      :data="tableData | formatData"
      pagination
      :page-size="pageSize"
    ></at-table>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import { getUuid, getToken } from "../../../utils/auth";
import dayjs from "dayjs";

export default {
  // import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    // 这里存放数据
    return {
      columns: [
        {
          title: "用户名",
          key: "username",
          sortType: "normal",
        },
        {
          title: "密码",
          key: "password",
        },
        {
          title: "头像",
          render: (h, params) => {
            return h("div", [
              h("img", {
                domProps: {
                  src: params.item.avatarurl,
                  width: 50,
                  height: 50,
                },
              }),
            ]);
          },
        },
        {
          title: "角色",
          key: "roles",
        },
        {
          title: "签名",
          key: "description",
        },
        {
          title: "备注",
          key: "other",
        },
        {
          title: "注册时间",
          key: "registertime",
          sortType: "normal",
        },
        {
          title: "最后更新时间",
          key: "updatatime",
          sortType: "normal",
        },
        {
          title: "操作",
          render: (h, params) => {
            return h("div", [
              h(
                "AtButton",
                {
                  props: {
                    icon: "icon-edit-1",
                    size: "small",
                    hollow: true,
                  },
                  style: {
                    marginRight: "8px",
                  },
                  on: {
                    click: () => {
                      this.toEditUser(params.item.uuid);
                    },
                  },
                },
                "编辑"
              ),
              h(
                "AtButton",
                {
                  props: {
                    icon: "icon-user-x",
                    type: "error",
                    size: "small",
                    hollow: true,
                  },
                  on: {
                    click: () => {
                      this.delAlert(params.item.uuid);
                    },
                  },
                },
                "删除"
              ),
            ]);
          },
        },
      ],
      tableData: [],
      srcTableData: [],
      pageSize: 10,
      delModal: false,
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
          this.tableData = res.data.data;
          //深拷贝，让tableData和srcTableData指向不一样堆的地址
          this.srcTableData = JSON.parse(JSON.stringify(res.data.data));
        } else {
          // console.log(res.data);
          this.$Message.error("您没有查看权限!");
        }
      });
    },
    delAlert(deluuid) {
      this.delModal = deluuid;
    },
    adminDelUser(deluuid) {
      let uuid = getUuid();
      let token = getToken();
      this.$http({
        // `method`是请求的方法
        method: "post",
        // `url`是请求的接口地址
        url: "https://account.api.mcloc.cn/admindeluser",
        // URL参数 必须是一个纯对象或者 URL参数对象
        data: {
          uuid: uuid,
          deluuid: deluuid,
        },
        headers: {
          token: token,
        },
      }).then((res) => {
        if (res.data.code === 20000) {
          this.$Message.success(res.data.msg);
          this.getAllUser();
        } else {
          this.$Message.error(res.data.msg);
        }
      });
      this.delModal = false;
    },
    toEditUser(edituuid) {
      let edititem = {};
      for (var j = 0, len = this.srcTableData.length; j < len; j++) {
        if (this.srcTableData[j].uuid == edituuid) {
          edititem = this.srcTableData[j];
        }
      }
      this.$router.push({ name: "Edit", params: { edititem: edititem } });
    },
  },
  // 过滤器
  filters: {
    formatData: function (value) {
      value.forEach((item) => {
        if (item.roles == 1000) {
          item.roles = "超级管理员";
        }
        if (item.roles == 11) {
          item.roles = "会员";
        }
        if (item.roles == 10) {
          item.roles = "注册用户";
        }
        item.registertime = dayjs(item.registertime).format(
          "YYYY-MM-DD HH:mm:ss"
        );
        if (item.updatatime == "0000-00-00 00:00:00") {
          item.updatatime = item.registertime;
        } else {
          item.updatatime = dayjs(item.updatatime).format(
            "YYYY-MM-DD HH:mm:ss"
          );
        }
      });
      return value;
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
.userlist {
  width: 100%;
}
</style>
