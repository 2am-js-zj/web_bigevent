// 每次调用$.ajax/.post/.get 的时候
// 都会先调用一下这个函数
// 在这个函数中可以拿到给ajax提供的配置对象
$.ajaxPrefilter(function (options) {


    // 在发起真正的ajax请求之前，统一拼接请求的根路径
    options.url = 'http://big-event-api-t.itheima.net' + options.url
    console.log(options.url)
})