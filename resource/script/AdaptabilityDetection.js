/**
 * 在页面渲染完成之后执行的代码
 */
let AdaptabilityDetectionScheduledExecution = setInterval(function() {
    let status = document.readyState;
    if (status == "complete") {
        /**
         * 对于一些具有不可替代性API或不完全兼容的设备不存在现象的用户给出提示
         */
        //设置具有不可替代性API的列表
        irreplaceability = ["Blob", "localStorage", "navigator.clipboard.readText", "navigator.clipboard.writeText", "navigator.serviceWorker"];
        for (let k = 0; k < irreplaceability.length; k++) {
            block = irreplaceability[k].split(".");
            obj = window[block[0]];
            for (let i = 1; i < block.length; i++) {
               try {
                   obj = obj[block[i]];
               } catch (e) {
                   obj = undefined;
                   break;
               };
            };
            if (!obj) {
                if (irreplaceability[k] == "navigator") {
                    return;
                };
                layer.confirm({
                    title: "致命错误",
                    message: "我们无法调用" + irreplaceability[k] + "对象，您可以尝试：<br>1. 关闭隐私模式。<br>2. 对浏览器申请开启对网站此API的使用权。<br>3. 更换一个支持此API的浏览器。",
                });
            };
        };
        ua = navigator.userAgent.toLowerCase();
        UserAgentData = "<br>您的浏览器的UserAgent为：" + ua;
        if (window.screen.availWidth > 768 || document.body.clientWidth > 768) {
            layer.confirm({
                title: "适配性提示",
                message: "您使用的设备可能为非移动端设备，我们并没有完全对非移动端设备做好界面适配，请尽量使用移动端设备(屏幕宽度建议小于786px的)来访问此网站。" + UserAgentData
            });
        };
        if (/msie/i.test(ua) && !/opera/.test(ua)) {
            layer.confirm({
                title: "适配性提示",
                message: "您正在使用IE浏览器访问此页面，因为此网站用到了某些IE浏览器不支持或不兼容或不完全的API，建议您使用Chrome、Edge、FireFox等浏览器访问此网站。" + UserAgentData
            });
        };
        if (!!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
            layer.confirm({
                title: "适配性提示",
                message: "您正在使用iOS设备访问此界面，因为此网站用到了某些iOS设备不支持或不兼容或不完全的API，建议您使用Android等设备来访问此网站。" + UserAgentData
            });
        };
        LessOccupancy = {
            "Windows Phone": /Windows\s+Phone|w7|w8/i,
            "Windows 2000": /Windows\s+2000/i,
            "Windows Vista": /Windows\s+Vista/i
        };
        LessOccupancyKeys = Object.keys(LessOccupancy);
        for (let i = 0; i < LessOccupancyKeys.length; i++) {
            if (!!ua.match(LessOccupancy[LessOccupancyKeys[i]])) {
                layer.confirm({
                    title: "您的设备与众不同",
                    message: "您正在使用" + LessOccupancyKeys[i] + "访问此网站" + UserAgentData
                });
            };
        };
        BuiltInBrowser = [
            {
                "微信内置浏览器": ua.match(/MicroMessenger/i) == "micromessenger"
            },
            {
                "新浪微博内置浏览器": ua.match(/WeiBo/i) == "weibo"
            },
            {
                "QQ内置浏览器": ua.match(/QQ/i) == "qq"
            },
            {
                "BiliBili内置浏览器": ua.match(/bilibili/i) == "bilibili"
            }
        ];
        for (let k = 0; k < BuiltInBrowser.length; k++) {
            temp = BuiltInBrowser[k];
            if (temp[Object.keys(temp)[0]]) {
                layer.confirm({
                    title: "您被困在了第三方的世界中",
                    message: "您正在使用" + Object.keys(temp)[0] + "访问此网站！" + UserAgentData
                });
            };
        };
        clearInterval(AdaptabilityDetectionScheduledExecution);
    };
}, 100);
