<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="" />
      </div>
      <!-- 登录表单区域 -->
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px" class="login_form">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" prefix-icon="iconfont icon-3702mima" type="password"></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLofinForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 这是登录表单的数据绑定对象
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 这是表单的验证规则对象
      loginFormRules: {
        // 验证用户名是否合法
        username: [
          { required: true, message: '请输入登录名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        // 验证password是否合法
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 点击重置按钮,重置登录表单
    resetLofinForm () {
      // console.log(this)
      // Element 的 Form Methods
      this.$refs.loginFormRef.resetFields()
    },
    // 登录之前的预验证，验证表单的数据是否合法
    login () {
      this.$refs.loginFormRef.validate(async valid => {
        // console.log(valid)
        if (!valid) return
        // const result = await this.$http.post('login', this.loginForm)
        // 解构出result中的data内容
        //   1.     用promise、async、await获取登录信息
        // const { data: res } = await this.$http.post('login', this.loginForm)
        // // console.log(res)
        // if (res.meta.status !== 200) return this.$Message.error('登录失败!')
        // this.$Message.success('登录成功!')
        //   2.     通过then一个回调函数获取登录信息
        this.$http.post('login', this.loginForm).then((result) => {
          // console.log(res.data)
          const res = result.data
          if (res.meta.status !== 200) return this.$Message.error('登录失败!')
          this.$Message.success('登录成功!')
          /*
            1.将登录成功之后的 token 保存到客户端的 sessionStorage 中
              1.1 项目中除了登陆之外的其它 api 接口，必须在登录之后才能访问
              1.2 token 值应在当前网站打开期间生效， 所以将 token 保存在 sessionStorage 中
            2.通过编程式导航跳转到后台页面，路由地址是 /home
           */
          console.log(res)
          window.sessionStorage.setItem('token', res.data.token)
          this.$router.push('/home')
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  background: #2b4b6b;
  height: 100%;
  // 居中方法三：
  // display: flex;
  // justify-content: center;
  // align-items: center;
  .login_box {
    width: 450px;
    height: 300px;
    background: #fff;
    border-radius: 3px;
    // 居中方法一：
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    // 居中方法二：
    // position: absolute;
    // top: 0;
    // bottom: 0;
    // left: 0;
    // right: 0;
    // margin: auto;
    .avatar_box {
      height: 130px;
      width: 130px;
      border: 1px solid #eee;
      border-radius: 50%;
      padding: 10px;
      box-shadow: 0 0 10px #ddd;
      position: absolute;
      left: 50%;
      // 第二个-50%是相对于height: 130px;的50%
      transform: translate(-50%, -50%);
      background: #fff;
      img {
        height: 100%;
        width: 100%;
        border-radius: 50%;
        background: #eee;
      }
    }
    .login_form {
      position: absolute;
      bottom: 0;
      width: 100%;
      padding: 0 20px;
      box-sizing: border-box;
    .btns {
      display: flex;
      justify-content: flex-end;
    }
    }
  }
}
</style>
