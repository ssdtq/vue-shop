<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 内容卡片 -->
    <el-card>
      <!-- 表单内容 -->
      <el-row :gutter="20">
        <!-- 搜索框 -->
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getGoodsList()"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodsList()"
            ></el-button>
          </el-input>
        </el-col>
        <!-- 添加商品按钮 -->
        <el-col :span="4">
          <el-button type="primary" @click="goAdpage">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 表格内容 -->
      <el-table :data="goodslist" style="width: 100%" stripe border>
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="goods_name" label="商品名称"> </el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="95">
        </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="70">
        </el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="140">
          <template v-slot:default="scope">
            {{ scope.row.add_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column prop="address" label="操作" width="130">
          <template v-slot:default="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeCurrentGoods(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页显示 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 20, 50]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 查询参数对象
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 商品列表
      goodslist: [],
      // 总数据条数
      total: 0
    }
  },
  created() {
    // 获取商品列表数据
    this.getGoodsList()
  },
  methods: {
    // 获取商品列表数据
    async getGoodsList() {
      const { data: res } = await this.$http.get('goods', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品列表失败')
      }
      // console.log(res.data)
      this.$message.success('获取商品列表成功')
      this.goodslist = res.data.goods
      this.total = res.data.total
    },
    // 分页相关的函数
    handleSizeChange(newsize) {
      this.queryInfo.pagesize = newsize
      this.getGoodsList()
    },
    handleCurrentChange(newpage) {
      this.queryInfo.pagenum = newpage
      this.getGoodsList()
    },
    // 点击删除按钮删除所选商品
    async removeCurrentGoods(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该商品, 是否继续?',
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
      // console.log(confirmResult)
      // 对接后端，删除商品信息
      const { data: res } = await this.$http.delete(`goods/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除商品数据失败')
      }
      this.$message.success('成功删除商品数据')
      this.getGoodsList()
    },
    // 点击添加按钮，跳转新的路由页面
    goAdpage() {
      this.$router.push('/goods/add')
    }
  }
}
</script>

<style lang="less" scoped></style>
