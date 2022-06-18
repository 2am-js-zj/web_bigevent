$(function () {
    var form = layui.form
    var layer = layui.layer

    form.verify({
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        newpwd: function (value) {
            if (value === $('[name=oldPwd]').val()) return '老密码和新密码不能相同！'
        },
        same: function (value) {
            if (value !== $('[name=newPwd]').val())
                return '两次输入的密码不一致！'

        }
    })


    $('.layui-form').on('submit', function (e) {
        var layer = layui.layer
        console.log($(this).serialize())
        e.preventDefault()
        $.ajax({
            method: 'post',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function (res) {
                console.log(res)
                if (res.status !== 0) {
                    return layer.msg('修改密码失败！')
                }
                layer.msg('修改密码成功！')
                $('.layui-form')[0].reset()
            }

        })
    })
})