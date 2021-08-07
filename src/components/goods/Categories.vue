<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片内容 -->
    <el-card class="box-card">
      <!-- 添加分类按钮 -->
      <el-row>
        <el-button type="primary" @click="showAddCateDialog"
          >添加分类</el-button
        >
      </el-row>
      <!-- 创建表格 -->
      <!-- <el-table stripe style="width: 100%" border :data="cateList">
        <el-table-column label="#" type="index"> </el-table-column>
        <el-table-column prop="cat_name" label="分类名称" width="180">
        </el-table-column>
        <el-table-column prop="name" label="是否有效" width="180">
        </el-table-column>
        <el-table-column prop="address" label="排序" width="180">
        </el-table-column>
        <el-table-column prop="address" label="操作"> </el-table-column>
      </el-table> -->
      <tree-table
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        :show-index="true"
        index-text="#"
        border
        :show-row-hover="false"
        class="treeTable"
      >
        <!-- 是否有效 -->
        <template slot="isok" scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color: lightgreen;"
          ></i>
          <i
            class="el-icon-error"
            v-if="scope.row.cat_deleted === true"
            style="color: lightgreen;"
          ></i>
        </template>
        <!-- 排序 -->
        <template slot="order" scope="scope">
          <el-tag v-if="scope.row.cat_level === 0" size="mini">一级</el-tag>
          <el-tag v-if="scope.row.cat_level === 1" type="success" size="mini"
            >二级</el-tag
          >
          <el-tag v-if="scope.row.cat_level === 2" type="warning" size="mini"
            >三级</el-tag
          >
        </template>
        <!-- 操作 -->
        <template slot="opt" scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="editorCategoriesCon(scope.row.cat_id)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="closeCategoriesCon(scope.row.cat_id)"
            >删除</el-button
          >
        </template>
      </tree-table>

      <!-- 分页栏 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="querInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加分类的对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogClose"
    >
      <!-- 添加分类的表单 -->
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称:" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类:">
          <!-- options指定数据源 -->
          <el-cascader
            v-model="cascaderProps"
            :options="parentCateList"
            :props="{
              expandTrigger: 'hover',
              value: 'cat_id',
              label: 'cat_name',
              children: 'children',
              checkStrictly: 'true'
            }"
            @change="parentCateChanged"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑分类的对话框 -->
    <el-dialog title="编辑分类" :visible.sync="editorDialogVisible" width="50%">
      <el-form
        :model="editorCateForm"
        :rules="editorCateRules"
        ref="editorCateFormRef"
        label-width="100px"
      >
        <el-form-item label="编辑分类" prop="cat_name">
          <el-input v-model="editorCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editorDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editorCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 查询商品分类条件
      querInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 所有商品分类内容
      cateList: [],
      // 总数据条数
      total: 0,
      // 控制添加分类对话框的显示与隐藏
      addCateDialogVisible: false,
      // 控制编辑分类对话框的显示与隐藏
      editorDialogVisible: false,
      // 添加分类表单数据对象 用来对接后台数据用
      addCateForm: {
        // 将要添加的分类的名称
        cat_name: '',
        // 父级分类的id
        cat_pid: 0,
        // 分类的等级，默认添加的时一级分类
        cat_level: 0
      },
      // 添加编辑分类表单数据对象
      editorCateForm: {},
      // 添加分类表单的验证规则对象
      addCateFormRules: {
        cat_name: [{ required: true, message: '请输入用户名', trigger: 'blur' }]
      },
      // 编辑分类表单的验证规则对象
      editorCateRules: {
        cat_name: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ]
      },
      // 父级分类的列表
      parentCateList: [],
      // 指定级联选择器的配置对象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 为table指定列的定义
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          // 表示将当前列定义为模板列
          type: 'template',
          // 表示当前这一列使用模板名称
          template: 'isok'
        },
        {
          label: '排序',
          // 表示将当前列定义为模板列
          type: 'template',
          // 表示当前这一列使用模板名称
          template: 'order'
        },
        {
          label: '操作',
          // 表示将当前列定义为模板列
          type: 'template',
          // 表示当前这一列使用模板名称
          template: 'opt'
        }
      ]
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
        return this.$message.error('获取商品分类数据列表失败')
      }
      console.log(res.data.result)
      // 把数据列表，赋值给catelist
      this.cateList = res.data.result
      // 为总数居条数赋值
      this.total = res.data.total
    },
    // 监听pagesize改变的事件
    handleSizeChange(newSize) {
      this.querInfo.pagesize = newSize
      this.getAllGoodscategories()
    },
    // 监听pagenum改变的事件
    handleCurrentChange(newPage) {
      this.querInfo.pagenum = newPage
      this.getAllGoodscategories()
    },
    // 点击按钮展示添加分类的对话框
    showAddCateDialog() {
      // 获取父级分类 的数据列表
      this.getParentCateList()
      // 展示对话框
      this.addCateDialogVisible = true
    },
    // 获取父级分类 的数据列表
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取父级数据分类失败')
      }
      // console.log(res.data)
      this.parentCateList = res.data
    },
    // 选择项发生变化触发
    parentCateChanged() {
      console.log(this.cascaderProps)
      // 如果 cascaderProps 数组中的 length 大于0，证明选中的父级分类
      // 反之， 就说明没有选中任何父级分类
      if (this.cascaderProps.length > 0) {
        // 父级分类的id
        this.addCateForm.cat_pid = this.cascaderProps[
          this.cascaderProps.length - 1
        ]
        // 为当前分类的等级赋值
        this.addCateForm.cat_level = this.cascaderProps.length
      } else {
        // 父级分类的id
        this.addCateForm.cat_pid = 0
        // 为当前分类的等级赋值
        this.addCateForm.cat_level = 0
      }
    },
    // 点击按钮添加新的分类
    addCate() {
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          'categories',
          this.addCateForm
        )
        if (res.meta.status !== 201) {
          return this.$message.error('添加分类失败')
        }
        this.$message.success('添加分类成功')
        // 刷新数据列表
        this.getAllGoodscategories()
        // 隐藏对话框
        this.addCateDialogVisible = false
      })
    },
    // 添加关闭 添加分类 重置属性
    addCateDialogClose() {
      this.$refs.addCateFormRef.resetFields()
      // 清空级联选择器内容
      this.cascaderProps = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    },
    // 点击编辑按钮展示对黄框内容
    async editorCategoriesCon(id) {
      this.editorDialogVisible = true
      // 查询分类名称
      const { data: res } = await this.$http.get('categories/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('查询分类内容失败')
      }
      this.$message.success('成功获取查询分类内容')
      this.editorCateForm = res.data
    },
    // 点击编辑确定按钮进行内容与验证以及更新到列表中
    editorCate(id) {
      // 表单与验证
      this.$refs.editorCateFormRef.validate(async valid => {
        // 验证成功返回true，失败返回false
        if (!valid) {
          return
        }
        // 访问后端，修改分类名称
        const { data: res } = await this.$http.put(
          'categories/' + this.editorCateForm.cat_id,
          {
            cat_name: this.editorCateForm.cat_name
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('编辑分类内容失败')
        }
        this.$message.success('成功编辑分类内容')
        // 更新界面
        this.getAllGoodscategories()
        this.editorDialogVisible = false
      })
    },
    // 点击删除按钮，显示对话框
    async closeCategoriesCon(id) {
      const confirmResult = await this
        .$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .catch(err => err)

      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete('categories/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('删除分类数据失败')
      }
      this.$message.success('成功删除分类数据')
      // 更新数据
      this.getAllGoodscategories()
    }
  }
}
</script>

<style lang="less" scoped>
// 也可以放在全局css中 .zk-table
// .treeTable {
//   margin-top: 15px;
// }
</style>
