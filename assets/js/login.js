$(function () {
    $('#link_reg').click(function () {
        $('.reg-box').show()
        $('.login').hide()
    })
    $('#link_login').click(function () {
        $('.login').show()
        $('.reg-box').hide()
    })



    // 自定义校验规则
    // 从layui中获取form对象
    var form = layui.form
    // 弹出层
    var layer = layui.layer
    // 通过form.verify()函数 自定义校验规则
    form.verify({
        // 自定义了一个叫做pwd的校验规则
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        // 校验两次密码是否一致的规则
        repwd: function (value) {
            // 通过形参拿到的是确认密码框中的内容，
            // 还需要拿到密码框的内容，
            // 并且判断
            // 若判断不一致 则return一个提示消息即可
            var pwd = $('.reg-box [name=password]').val()
            if (pwd !== value) {
                return '两次密码不一致！！！'
            }
        }
    })

    // 监听注册表单的事件

    $('#form_reg').on('submit', (e) => {
        e.preventDefault()
        var data = {
            username: $('#form_reg [name=username]').val(), password: $('#form_reg [name=password]').val()
        }
        $.ajax({
            method: 'post',
            url: 'http://big-event-api-t.itheima.net/api/reguser',
            data,
            success: function (res) {
                if (res.status !== 0) {
                    // return console.log(res.message + '注册失败')
                    return layer.msg(res.message)
                }
                layer.msg('注册成功！请登录！')
                $('#link_login').click()
            }
        })

        // $.post('http://big-event-api-t.itheima.net/api/reguser', {
        //     username: $('#form_reg [name=username]').val(), password: $('#form_reg [name=password]').val(), function(res) {
        //         if (res.status !== 0) {
        //             return console.log(res.message + '注册失败')
        //         }
        //         console.log('注册成功')
        //     })

    })

    //监听登录表单的事件
    $('#form_login').on('submit', (e) => {
        e.preventDefault()
        var data = {
            username: $('#form_login [name=username]').val(), password: $('#form_login [name=password]').val()
        }
        $.ajax({
            method: 'post',
            url: '/api/login',
            // 快速获取表单的数据
            data,// $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('登录失败')
                }
                layer.msg('登录成功！')
                console.log(res.token)
                // 登录成功之后将登录成功的token字符串 保存到本地存储中
                localStorage.setItem('value', res.token)
                // 跳转到后台主页
                location.href = '/index.html'
            }
        })
    })

})