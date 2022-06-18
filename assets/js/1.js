// 每次调用$.ajax/.post/.get 的时候
// 都会先调用一下这个函数
// 在这个函数中可以拿到给ajax提供的配置对象
$.ajaxPrefilter(function (options) {


    // 在发起真正的ajax请求之前，统一拼接请求的根路径
    options.url = 'http://big-event-api-t.itheima.net' + options.url
    console.log(options.url)
    if (options.url.indexOf('/my/updatepwd') !== -1) {
        options.headers = {
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhZG1pbiIsInBhc3N3b3JkIjoiIiwibmlja25hbWUiOiLms6Xlt7Tlt7QiLCJlbWFpbCI6Im5pYmFiYUBpdGNhc3QuY24iLCJ1c2VyX3BpYyI6IiIsImlhdCI6MTU3ODAzNjY4MiwiZXhwIjoxNTc4MDcyNjgyfQ.Mwq7GqCxJPK - EA8LNrtMG04llKdZ33S9KBL3XeuBxuI'
        }
    }
    else if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('value') || ''
        }
    }

    // options.complete = function (res) {
    //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
    //         // 强制清空token
    //         localStorage.removeItem('value')
    //         // 强制跳转到登录页面
    //         location.href = '/login.html'
    //     }
    // }

})