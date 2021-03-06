$(function () {
    // 调用getUserInfo()获取用户信息
    getUserInfo()
    var layer = layui.layer
    // 给退出按钮绑定事件
    $('#btnLogout').on('click', function () {
        layer.confirm('确定退出登录?', function (index) {
            //清除本地存储的token
            localStorage.removeItem('value')
            // 跳转到登录页面
            location.href = '/login.html'
            layer.close(index);
        });
    })
})

// 获取用户的基本信息
function getUserInfo() {
    $.ajax({
        url: '/my/userinfo',
        method: 'get',
        //  headers 就是请求头配置对象
        headers: {
            Authorization: localStorage.getItem('value')
        },
        success: function (res) {
            if (res.status !== 0) {
                return layer.msg('获取失败！！！')
            }
            console.log(res)
            // renderAvatar() 函数来渲染头像
            renderAvatar(res.data)
        }
    })
}

function renderAvatar(user) {
    // 获取用户名称
    var name = user.nickname || user.username
    // 设置欢迎的文本
    $("#welcome").html('欢迎&nbsp&nbsp' + name)
    // 按需渲染头像
    if (user.user_pic !== null) {
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    }
    else {
        var first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
        $('.layui-nav-img').hide()
    }
}