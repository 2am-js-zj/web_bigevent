$(function () {

    var layer = layui.layer
    var form = layui.form
    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)
        var y = dt.getFullYear()
        var m = zero(dt.getMonth() + 1)
        var d = zero(dt.getDay())
        var h = zero(dt.getHours())
        var min = zero(dt.getMinutes())
        var s = zero(dt.getSeconds())
        return `${y}-${m}-${d}  ${h}:${min}:${s}`

        function zero(z) {
            return z < 10 ? '0' + z : z
        }
    }

    // 定义查询参数
    var q = {
        pagenum: 1,//页码值
        pagesize: 2,//每页显示多少条数据
        cate_id: '',//文章分类的 Id
        state: ''//文章的状态，可选值有：已发布、草稿


    }
    // 初始化表格
    initTable()
    // 初始化菜单下拉框
    initselect()

    // 获取下拉框列表的方法
    function initselect() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message)
                // 用模板字符串去渲染可选项
                var htmlStr = template('tpl-select', res)
                $('[name=cate_id]').html(htmlStr)
                form.render()
            }
        })
    }



    // 获取文章数据列表的方法
    function initTable() {
        $.ajax({
            method: 'get',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取失败！')
                }

                // 使用模板引擎来渲染数据
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)

                // 调用渲染分页的方法
                renderPage(res.total)
            }
        })
    }

    // 为筛选表单添加监听事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        // 为查询参数对象q中对应的属性赋值
        q.cate_id = cate_id
        q.state = state
        // 根据最新的筛选条件重新渲染表格的数据
        initTable()
    })


    // 定义渲染分页的方法
    // 表格渲染完成之后出现
    function renderPage(total) {
        console.log(total)
        // 分页区域
        layui.use('laypage', function () {
            var laypage = layui.laypage;
            //执行一个laypage实例
            laypage.render({
                elem: 'pageBox', //分页容器的ID，不用加 # 号
                count: total,//数据总数，从服务端得到
                limit: q.pagesize,//每一页展示的条数
                curr: q.pagenum,//设置默认选中的页数

                // 配置显示参数
                layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
                limits: [1, 2, 3, 5],

                // 分页发生切换的时候,触发jump回调函数

                // 触发jump回调有两种:
                // 1.点击页码的时候会触发jump回调
                // 2.只要调用了laypage.render()这个方法就会触发jump回调
                jump: function (obj, first) {
                    //obj包含了当前分页的所有参数，比如：
                    // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                    q.pagenum = obj.curr
                    q.pagesize = obj.limit


                    // first
                    // 若是调用2 则值为true initTable() 方法否则会触发死循环

                    // 若是方法1调用 即点击页码更换页数 则需要调用inittable()方法
                    if (!first) {
                        // 根据最新的页码 获取最新的数据
                        initTable()
                    }


                    // console.log(obj.limit); //得到每页显示的条数

                    //首次不执行
                    if (!first) {
                        //do something
                    }
                }
            });
        });
    }

    // 通过代理的形式为删除按钮绑定删除事件
    $('tbody').on('click', '.btn-delete', function (e) {
        var id = $(this).attr('data-id')
        // 获取删除按钮的个数
        var len = $('.btn-delete').length
        // 询问是否要删除
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            // 使用ajax来删除对应数据
            $.ajax({
                method: 'get',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    console.log(res)
                    if (res.status !== 0) {
                        layer.msg(res.message)
                    }

                    // 当数据删除完成后,
                    // 需要判断当前这一页当中是否还有剩余的数据 
                    // 如果没有剩余的数据, 则让页码值 - 1 在重新调用
                    if (len === 1) {
                        q.pagenum = q.pagenum - 1
                    }
                    initTable()
                }
            })

            layer.close(index);
        });
    })
})



