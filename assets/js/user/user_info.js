$(function () {

    // 自定义的验证规则
    var form = layui.form
    var layer = layui.layer


    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称长度必须要在1-6个字符之间'
            }
        }
    })
    initUserInfo()

    // 为重置按钮绑定事件
    $('#btnReset').on('click', function (e) {
        e.preventDefault()
        initUserInfo()
    })

    // 监听表单的提交
    $('.layui-form').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'post',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败！')
                }
                layer.msg('更新用户信息成功！！')
                // 调用父页面的方法
                window.parent.getUserInfo()
            }
        })
    })
})

// 初始化用户信息
function initUserInfo() {
    var form = layui.form
    $.ajax({
        url: '/my/userinfo',
        method: 'get',
        success: function (res) {
            if (res.status !== 0) {
                return layer.msg('获取用户信息失败')
            }
            data = res.data
            // console.log(data.username)

            // 调用form.val()快速为表单赋值
            form.val('form_userinfo', data)
        }
    })
}
