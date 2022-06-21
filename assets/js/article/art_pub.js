$(function () {
    layer = layui.layer
    form = layui.form
    initCate()
    initEditor()



    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)


    // 为选择文件绑定事件
    $('.layui-btn-danger').on('click', function () {
        $('#coverFile').click()
    })

    //为上传文件按钮绑定change事件
    $('#coverFile').on('change', function (e) {
        // 获取文件的列表
        var files = e.target.files
        if (files.length === 0) {
            return
        }
        console.log(files)
        //根据选择的文件，创建一个对应的 URL 地址：
        var newImgURL = URL.createObjectURL(files[0])
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    $('#art-pub').on('submit', function (e) {
        e.preventDefault()

        var art_state = '已发布'
        console.log($(this)[0])
        // 基于Formdata表单，快速创建一个Formdata对象
        var fd = new FormData($(this)[0])

        // 将文章状态加入到表单中
        fd.append('state', art_state)

        // 将裁剪后的图片，输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob)

                publishNew(fd)
            })

        function publishNew(fd) {
            $.ajax({
                method: 'post',
                url: '/my/article/add',
                data: fd,
                // 若是提交formdata格式的数据，
                // 必须提交以下两个配置项
                contentType: false,
                processData: false,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    console.log(res.message)
                    layer.msg(res.message)
                    // 发布文章成功后，跳转到文章列表页面
                    location.href = '/article/art_list.html'
                }
            })
        }

    })


    function initCate() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                console.log(res);
                layer.msg(res.message)
                var htmlStr = template('tpl-cates', res)
                $('select').html(htmlStr)
                form.render()
            }
        })
    }


    function img() {
    }

})