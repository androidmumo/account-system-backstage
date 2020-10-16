<template>
  <div class="edit">
    <at-card class="card">
      <h4 slot="title">
        修改用户 <span class="h4-span">{{ srcEditData.username }}</span> 的信息
      </h4>
      <div class="card-content">
        <at-input
          class="input"
          v-model="editData.username"
          placeholder="请输入内容"
        >
          <template slot="prepend">
            <span class="input-span">用户名</span>
          </template>
        </at-input>
        <at-input
          class="input"
          v-model="editData.password"
          placeholder="请输入内容"
        >
          <template slot="prepend">
            <span class="input-span">密码</span>
          </template>
        </at-input>
        <p class="content-p">修改头像</p>
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
          v-model="editData.description"
          min-rows="2"
          max-rows="5"
          placeholder="这里输入内容"
        ></at-textarea>
        <p class="content-p">备注</p>
        <at-textarea
          v-model="editData.other"
          min-rows="2"
          max-rows="5"
          placeholder="这里输入内容"
        ></at-textarea>
        <div class="btn-edit">
          <at-button type="primary" @click="doEdit" hollow>提交修改</at-button>
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
      srcEditData: {},
      editData: {},
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
      this.srcEditData = this.$route.params.edititem;
      this.editData = JSON.parse(JSON.stringify(this.$route.params.edititem));
      this.roles = this.$route.params.edititem.roles.toString();
      this.avatarurl = this.$route.params.edititem.avatarurl;
      this.dialogImageUrl = this.$route.params.edititem.avatarurl;
      this.fileList = [
        {
          name: "avatar",
          url: this.$route.params.edititem.avatarurl,
        },
      ];
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
    doEdit() {
      let uuid = getUuid();
      let token = getToken();
      var roles = Number(this.roles);
      this.$http({
        method: "post",
        url: "https://account.api.mcloc.cn/adminedituser",
        data: {
          uuid: uuid,
          edituuid: this.editData.uuid,
          username: this.editData.username,
          roles: roles,
          avatarurl: this.avatarurl,
          description: this.editData.description,
          other: this.editData.other,
        },
        headers: {
          token: token,
        },
      }).then((res) => {
        if (res.data.code === 20000) {
          this.$Message.success(res.data.msg);
          this.$router.push({
            name: "UserList",
          });
        } else {
          this.$Message.error(res.data.msg);
        }
      });
    },
  },
  // 过滤器
  filters: {
    toNum: function (value) {
      return Number(value);
    },
    toStr: function (value) {
      return value.toString();
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
