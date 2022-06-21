$(function () {
    layer = layui.layer
    form = layui.form

    // 为添加按钮 弄一个弹出层

    var indexAdd = null;
    $('#addbtn').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类'
            , content: $('#dialog-add').html()
        })
    })

    // 获取文章列表
    initArtCateList()


    // 添加按钮 用代理的方式为form-add绑定添加事件
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault()
        var data = $(this).serialize()
        $.ajax({
            method: 'post',
            url: '/my/article/addcates',
            data,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message)
                layer.close(indexAdd)
                // 添加完成后 重新渲染列表
                initArtCateList()
            }
        })
    })


    // 编辑按钮
    var index2 = null;
    $('body').on('click', '.write', function () {
        index2 = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类'
            , content: $('#dialog-write').html()
        })

        // 加载当前编辑按钮的名称和别名
        var id = $(this).attr('data-Id')
        $.ajax({
            method: 'get',
            url: '/my/article/cates/' + id,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取失败')
                }
                // console.log(res.data)
                // 快速赋值表单
                form.val('form-edit', res.data)
            }
        })

        // 确认修改
        $('body').on('submit', '#form-edit', function (e) {
            e.preventDefault()
            $.ajax({
                method: 'post',
                url: '/my/article/updatecate',
                data: $(this).serialize(),
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    console.log(res)
                    layer.msg(res.message)
                    layer.close(index2)
                    initArtCateList()
                }
            })
        })

    })


    // 给删除按钮绑定事件
    $('tbody').on('click', '.del', function () {
        var id = $(this).attr('data-id')
        layer.confirm('确定删除?', { icon: 3, title: '提示' }, function (index) {
            //do something

            console.log(id)
            $.ajax({
                method: 'get',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    layer.msg(res.message)
                    layer.close(index);
                    initArtCateList()
                }
            })

        });

    })



})
function initArtCateList() {
    $.ajax({
        method: 'get',
        url: '/my/article/cates',
        success: function (res) {
            if (res.status !== 0) {
                return layer.msg('获取文章分类失败！')
            }
            // layer.msg('获取文章分类成功')
            // 用模板字符串渲染文章列表
            var htmlStr = template('tpl-table', res)
            $('tbody').html(htmlStr)
        }
    })
}