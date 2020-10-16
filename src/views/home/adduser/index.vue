<template>
  <div class="add">
    <at-card class="card">
      <h4 slot="title">添加用户</h4>
      <div class="card-content">
        <at-input
          class="input"
          v-model="addData.username"
          placeholder="请输入内容"
        >
          <template slot="prepend">
            <span class="input-span">用户名</span>
          </template>
        </at-input>
        <at-input
          class="input"
          v-model="addData.password"
          placeholder="请输入内容"
        >
          <template slot="prepend">
            <span class="input-span">密码</span>
          </template>
        </at-input>
        <p class="content-p">头像</p>
        <el-upload
          action="https://account.api.mcloc.cn/uploadavatar"
          :headers="headers"
          :multiple="false"
          name="avatar"
          list-type="picture-card"
          :auto-upload="true"
          :limit="1"
          :file-list="fileList"
          :on-success="onSuccess"
        >
          <i slot="default" class="el-icon-plus"></i>
          <div slot="file" slot-scope="{ file }">
            <img
              class="el-upload-list__item-thumbnail"
              :src="file.url"
              alt=""
            />
            <span class="el-upload-list__item-actions">
              <span
                class="el-upload-list__item-preview"
                @click="handlePictureCardPreview(file)"
              >
                <i class="el-icon-zoom-in"></i>
              </span>
              <span
                v-if="!disabled"
                class="el-upload-list__item-delete"
                @click="handleRemove(file)"
              >
                <i class="el-icon-delete"></i>
              </span>
            </span>
          </div>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
        <p class="content-p">角色</p>
        <at-select v-model="roles">
          <at-option value="1000">超级管理员</at-option>
          <at-option value="11">会员</at-option>
          <at-option value="10">注册用户</at-option>
        </at-select>
        <p class="content-p">签名</p>
        <at-textarea
          v-model="addData.description"
          min-rows="2"
          max-rows="5"
          placeholder="这里输入内容"
        ></at-textarea>
        <p class="content-p">备注</p>
        <at-textarea
          v-model="addData.other"
          min-rows="2"
          max-rows="5"
          placeholder="这里输入内容"
        ></at-textarea>
        <div class="btn-edit">
          <at-button type="primary" @click="doAdd" hollow>添加</at-button>
        </div>
      </div>
    </at-card>
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
      addData: {},
      roles: 0,
      avatarurl: "",
      headers: {},
      dialogImageUrl: "",
      dialogVisible: false,
      disabled: false,
      fileList: [],
    };
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {},
  // 方法集合
  methods: {
    initData() {
      let uuid = getUuid();
      let token = getToken();
      this.headers = {
        uuid: uuid,
        token: token,
      };
    },
    handleRemove() {
      this.fileList = [];
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    onSuccess(response) {
      this.avatarurl = response.path;
    },
    doAdd() {
      this.doRegister();
    },
    doRegister() {
      this.$http({
        method: "post",
        url: "https://account.api.mcloc.cn/register",
        data: {
          username: this.addData.username,
          password: this.addData.password,
        },
      }).then((res) => {
        if (res.data.code === 20000) {
          this.doLogin();
        }
      });
    },
    doLogin() {
      this.$http({
        method: "post",
        url: "https://account.api.mcloc.cn/login",
        data: {
          username: this.addData.username,
          password: this.addData.password,
        },
      }).then((res) => {
        if (res.data.code === 20000) {
          this.addData.uuid = res.data.data.uuid;
          this.doEdit();
        }
      });
    },
    doEdit() {
      let uuid = getUuid();
      let token = getToken();
      var roles = Number(this.roles);
      this.$http({
        method: "post",
        url: "https://account.api.mcloc.cn/adminedituser",
        data: {
          uuid: uuid,
          edituuid: this.addData.uuid,
          username: this.addData.username,
          roles: roles,
          avatarurl: this.avatarurl,
          description: this.addData.description,
          other: this.addData.other,
        },
        headers: {
          token: token,
        },
      }).then((res) => {
        if (res.data.code === 20000) {
          this.$Message.success("添加成功");
          this.$router.push({
            name: "UserList",
          });
        } else {
          this.$Message.error(res.data.msg);
        }
      });
    },
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.initData();
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
.card {
  width: 500px;
  margin: 0 auto;

  .card-content {
    padding: 0 30px;

    .input {
      margin-bottom: 20px;
    }

    .input-span {
      width: 60px;
    }

    .content-p {
      margin: 20px 0 10px;
    }

    .btn-edit {
      text-align: center;
      margin: 20px 0 0 0;
    }
  }

  .h4-span {
    font-size: 20px;
  }
}
</style>
