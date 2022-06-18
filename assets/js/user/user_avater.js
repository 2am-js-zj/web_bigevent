
$(function () {
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)




    var layer = layui.layer
    $('#upload').click(function () {
        $('#file').click()
    })
    $('#file').change(function (e) {

        // 获取用户选择的文件
        var filelist = e.target.files
        console.log(filelist)
        if (filelist.lenght === 0) {
            return layer.msg('请选择照片')
        }
        var file = e.target.files[0]
        var newImgURL = URL.createObjectURL(file)
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域

    })

    // 为上传图片到服务器的按钮绑定事件
    $('#upload2').click(function () {
        // 拿到用户裁剪之后的图像
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
        // 调用接口,把裁剪之后的图像上传到服务器
        $.ajax({
            method: 'post',
            url: '/my/update/avatar',
            data: { avatar: dataURL },
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新头像失败!')
                }
                console.log(res)
                layer.msg(res.message)
                window.parent.getUserInfo()
            }
        })
    })

})