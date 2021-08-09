<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 内容卡片 -->
    <el-card class="box-card">
      <el-alert
        title="注意：只允许为第三级分类设置相关参数！"
        type="warning"
        show-icon
        :closable="false"
      >
      </el-alert>
      <!-- 表单查询 -->
      <el-row class="cat_option">
        <el-col>
          <span>选择商品分类: </span>
          <!-- 选择商品分类的级联选择框 -->
          <el-cascader
            v-model="cateListProps"
            :options="cateList"
            :props="{
              expandTrigger: 'hover',
              value: 'cat_id',
              label: 'cat_name',
              children: 'children'
            }"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- tabs标签页面 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 添加动态参数的面板 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addDialogVisible = true"
            >添加参数</el-button
          >
          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template v-slot:default="scope">
                <!-- 循环渲染tag标签 -->
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClose(i, scope.row)"
                  >{{ item }}</el-tag
                >
                <!-- 输入文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!-- 添加的按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template v-slot:default="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scope.row.cat_id, scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeDialog(scope.row.cat_id, scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 添加静态属性的面板 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addDialogVisible = true"
            >添加属性</el-button
          >
          <!-- 静态属性表格 -->
          <el-table :data="onlyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template v-slot:default="scope">
                <!-- 循环渲染tag标签 -->
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClose(i, scope.row)"
                  >{{ item }}</el-tag
                >
                <!-- 输入文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!-- 添加的按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column
              label="属性名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template v-slot:default="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scope.row.cat_id, scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeDialog(scope.row.cat_id, scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 动态、静态添加属性对话框 -->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <!-- 添加参数对话框 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input> </el-form-item
      ></el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 动态、静态编辑属性对话框 -->
    <el-dialog
      :title="'修改' + titleText"
      :visible.sync="editorDialogVisible"
      width="50%"
      @close="editorDialogClosed"
    >
      <!-- 编辑参数对话框 -->
      <el-form
        :model="editorForm"
        :rules="editorFormRules"
        ref="editorFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editorForm.attr_name"></el-input> </el-form-item
      ></el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editorDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editorParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 商品分类参数
      querInfo: {},
      // 获取到的商品分类数据
      cateList: [],
      //
      cateListProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 被激活的页签名称
      activeName: 'many',
      // 动态参数数据
      manyTableData: [],
      // 静态属性数据
      onlyTableData: [],
      // 动态、静态 添加 属性对话框默认关闭
      addDialogVisible: false,
      // 动态、静态 编辑 属性对话框默认关闭
      editorDialogVisible: false,
      // 添加参数的表单数据对象
      addForm: {
        attr_name: ''
      },
      // 编辑参数的表单数据对象
      editorForm: {},

      // // 控制按钮与文本框的切换显示
      // inputVisible: false,
      // // 文本框输入的内容
      // inputValue: '',
      // 添加表单的验证规则对象
      addFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      },
      // 编辑表单的验证规则对象
      editorFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    // 获取所有商品分类内容
    this.getAllGoodscategories()
  },
  methods: {
    // 获取所有商品分类内容
    async getAllGoodscategories() {
      const { data: res } = await this.$http.get('categories', {
        params: this.querInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品数据失败')
      }
      this.cateList = res.data
      // console.log(this.cateList)
    },
    // 级联选择框选中项变化，会触发这个函数
    async handleChange() {
      // console.log(this.cateListProps)
      this.getParamsData()
    },
    // tabs页签点击事件的处理函数
    handleTabClick() {
      // console.log(this.activeName)
      this.getParamsData()
    },
    // 获取参数的列表数据
    async getParamsData() {
      // 判断是否为三级id
      if(this.cateListProps.length !== 3){
        this.manyTableData = [],
        this.onlyTableData = []
      }
      // 根据所选分类的id，和当前所处的面板，获取对应的参数
      const {
        data: res
      } = await this.$http.get(
        `categories/${this.cateListProps[2]}/attributes`,
        { params: { sel: this.activeName } }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数列表失败')
      }
      // console.log(this.cateListProps.length)

      // 获取到的所选内容
      // console.log(res.data)
      // 对获取内容进行forEach循环，通过 空格 分割attr_vals内容,并将得到的数组保存到attr_vals中
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        // 控制文本框的显示与隐藏
        item.inputVisible = false
        // 文本框中输入的值
        item.inputValue = ''
      })
      // console.log(res.data)

      if (res.data[0] !== undefined) {
        this.addId = res.data[0].attr_id
      }

      if (this.activeName === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
    },
    // 监听添加对话框的关闭事件
    addDialogClosed() {
      // 清除表单内遗留的内容
      this.$refs.addFormRef.resetFields()
    },
    // 监听编辑对话框的关闭事件
    editorDialogClosed() {
      // 清除表单内遗留的内容
      this.$refs.editorFormRef.resetFields()
    },
    // 点击按钮，添加动态参数 或 静态属性
    addParams() {
      // 预验证
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          `categories/${this.cateListProps[2]}/attributes`,
          {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName
          }
        )
        if (res.meta.status !== 201) {
          return this.$message.error('添加参数失败')
        }
        this.$message.success('添加参数成功')
        this.getParamsData()
        this.addDialogVisible = false
      })
    },
    // 点击编辑确认按钮 编辑 动态参数 或 静态属性
    editorParams() {
      // 做预校验
      this.$refs.editorFormRef.validate(async valid => {
        if (!valid) return
        //
        const { data: res } = await this.$http.put(
          `categories/${this.editorForm.cat_id}/attributes/${this.editorForm.attr_id}`,
          {
            attr_name: this.editorForm.attr_name,
            attr_sel: this.editorForm.attr_sel,
            attr_vals: this.editorForm.attr_vals
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('编辑数据失败')
        }
        this.$message.success('成功')
        this.editorDialogVisible = false
        // 更新列表
        this.getParamsData()
      })
    },
    // 点击按钮 展示修改对话框
    async showEditDialog(cat_id, attr_id) {
      this.editorDialogVisible = true
      // 根据 ID 查询参数
      const { data: res } = await this.$http.get(
        `categories/${cat_id}/attributes/${attr_id}`,
        {
          params: {
            attr_sel: this.activeName
          }
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数内容失败')
      }
      this.$message.success('获取参数内容成功')
      this.editorForm = res.data
    },
    // 点击删除按钮，删除所选属性
    async removeDialog(cat_id, attr_id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)

      if (confirmResult !== 'confirm') {
        return this.$message.warning('已取消删除')
      }
      const { data: res } = await this.$http.delete(
        `categories/${cat_id}/attributes/${attr_id}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error('删除数据失败')
      }
      this.$message.success('成功删除')
      this.getParamsData()
    },
    // 文本框市区了焦点 、按下 Enter 触发的函数
    async handleInputConfirm(row) {
      // trim对空格掐头去尾 判断输入内容是否合法
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      // 如果没有return 说明输入的内容需要做后续处理
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      
      this.saveAttrVals(row)
      
    },
    // 点击按钮展示文本输入框
    showInput(row) {
      row.inputVisible = true
      // 让文本框自动获得焦点
      // $nextTick 方法的作用，就是当页面上元素被重新渲染之后，才会指定回调函数中的代码
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 点击删除数据的vals
    handleClose(i, row) {
      row.attr_vals.splice(i, 1)
      this.saveAttrVals(row)
    },
    // 抽离编辑提交参数 内容
    async saveAttrVals(row) {
      // 发起请求，保存到后端
      const { data: res } = await this.$http.put(`categories/${row.cat_id}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel, 
        attr_vals: row.attr_vals.join(' ')
      })

      if( res.meta.status !== 200 ) {
        return this.$message.error('修改参数项失败')
      }
      this.$message.success('修改参数项成功')
    },
  },
  computed: {
    // 如果按钮需要被禁用，则返回true，否则返回flase
    isBtnDisabled() {
      if (this.cateListProps.length !== 3) {
        return true
      }
      return false
    },
    // 切换添加属性对话框名称激素只能属性
    titleText() {
      if (this.activeName === 'many') {
        return '动态参数'
      }
      return '静态属性'
    }
  }
}
</script>

<style lang="less" scoped>
.cat_option {
  margin: 15px 0;
}
.el-tag {
  margin-right: 10px;
}
.input-new-tag {
  width: 120px;
}
</style>
