//时间表达式对象
preset = {
    "preset0001": "{{year}}-{{month}}-{{day}} {{hour}}:{{minute}}:{{second}}.{{milliseconds}}",
    "preset0002": "{{year}}年 {{month}}月 {{day}}日 {{hour}}时 {{minute}}分 {{second}}秒 {{milliseconds}}毫秒"
};
/**
 * 截取字符串位置a到位置b之间的字符
 * @param posa 位置a {number}
 * @param posb 位置b {number}
 * @returns result 截取后的字符传 {string}
 */
String.prototype.intercept = (function(posa = 0, posb = 0) {
    result = "";
    for (var k = posa; k <= posb; k++) {
        result += this[k];
    };
    return result;
});
/**
 * 提取字符串中字符之前/之后的字符
 * @param character 字符 {string}
 * @param area 区域 {string}
 * @returns string 字符串 {string}
 */
String.prototype.areaIntercept = (function (character = "", area = "before") {
    if (area == "before") {
        return this.intercept(0, this.indexOf(character) - 1);
    } else if (area == "after") {
        return this.intercept(this.indexOf(character) + 1, this.length - 1);
    };
});
/**
 * 创建Mapping对象
 * @param date 时间对象 {Date}
 * @returns map 映射对象 {Mapping}
 */
function mapping(date = new Date(), version = "system") {
    if (version == "UTC") {
        return {
            year: repair(date.getUTCFullYear(), 2, "0"),
            month: repair(date.getUTCMonth() + 1, 2, "0"),
            week: repair(date.getUTCDay(), 2, "0"),
            day: repair(date.getUTCDate(), 2, "0"),
            hour: repair(date.getUTCHours(), 2, "0"),
            minute: repair(date.getUTCMinutes(), 2, "0"),
            second: repair(date.getUTCSeconds(), 2, "0"),
            milliseconds: repair(date.getUTCMilliseconds(), 3, "0", "behind")
        };
    } else if (version == "system") {
        return {
            year: repair(date.getFullYear(), 2, "0"),
            month: repair(date.getMonth() + 1, 2, "0"),
            week: repair(date.getDay(), 2, "0"),
            day: repair(date.getDate(), 2, "0"),
            hour: repair(date.getHours(), 2, "0"),
            minute: repair(date.getMinutes(), 2, "0"),
            second: repair(date.getSeconds(), 2, "0"),
            milliseconds: repair(date.getMilliseconds(), 3, "0", "behind")
        };
    }
};
/**
 * 对于不满足指定长度的数字进行修补
 * @param string 传入字符 {string}
 * @param length 指定长度 {number}
 * @param character 指定字符 {string}
 * @param direction 从前插入/从后插入 {string}
 * @returns string 处理后的字符串 {string}
 */
function repair(string, length, character = "0", direction = "front") {
    string = string.toString();
    while (string.length < length) {
        if (direction == "front") {
            string = character + string;
        } else if (direction == "behind") {
            string += character;
        };
    };
    return string;
};
/**
 * 格式化时间
 * @param expression 内容表达式 {string}
 * @param offest 是否计算时间偏移量带来的影响 {boolean}
 * @return result 返回内容 {any}
 */
function getTime(expression = "", offest = true) {
    date = new Date();
    map = mapping(date);
    expression = preset[expression] || expression;
    list = expression.match(/\{\{[^\}]{1,}\}\}/g) || [];
    for (let k = 0; k < list.length; k++) {
        temp = list[k];
        expression = expression.replace(temp, map[temp.replaceAll(/\{|\}/g, "")].toString() || "Empty");
    };
    return expression;
};
/**
 * 随机生成字符串
 * @param format 生成随机的格式 {string}
 * @parse random 用到的随机字符 {string}
 * @param express 表达随机的字符 {string}
 * @returns string 生成的随机字符串 {string}
 */
function generate(format = "??????????", random = "0123456789abcdef", express = "?") {
    while (format.indexOf(express) != -1) {
        format = format.replace(express, random[parseInt(Math.random() * random.length)]);
    };
    return format;
};
/**
 * 解析插值表达式
 * @param string 传入表达式 {string}
 * @param mapping 值映射 {object}
 * @param discriminant 插值表达式的判别式 {object}
 * @param boundary 判别式的非差值参数 {object}
 * @returns result 结果 {string}
 */
function insertvalue(string = "", mapping = {}, discriminant = /\{\{[^\n]{0,}\}\}/, boundary = /\{\{|\}\}/g) {
    unit = string.match(discriminant) || [];
    for (let k = 0; k < unit.length; k++) {
        temp = unit[k];
        unitkey = temp.replace(boundary, "");
        string = string.replace(temp, mapping[unitkey] || "Empty");
    };
    return string;
};
/**
 * 批量替换
 * @param replacesetting 替换设置 {object}
 * @param originalstring 原始字符串 {string}
 * @returns result 结果 {string}
 */
function batchreplace(replacesetting = {}, originalstring = "") {
    keyslist = Object.keys(replacesetting);
    for (let k = 0; k < keyslist.length; k++) {
        if (replacesetting[keyslist[k]]["mode"] == "only") {
            replacesetting = replacesetting.replace(replacesetting[keyslist[k]]["passivestring"], replacesetting[keyslist[k]]["initiativestring"]);
        } else {
            replacesetting = replacesetting.replaceAll(replacesetting[keyslist[k]]["passivestring"], replacesetting[keyslist[k]]["initiativestring"]);
        };
    };
    return replacesetting;
};
/**
 * 获取外部数据
 * @param setting 请求设置 {object}
 * @param callback 回调函数 {function}
 */
function request(setting = {}, callback = new Function("")) {
    xhr = new XMLHttpRequest();
    xhr.open("GET", setting.url, setting.async);
    xhr.send();
    xhr.addEventListener("readystatechange", () => {
        if (xhr.readyState === 4) {
            if (xhr.status == 200) {
                callback(xhr);
            } else {
                layer.confirm({
                    title: "访问受阻",
                    message: "无法访问资源“" + setting.url + "”，可能其不存在或权限不足无法访问。"
                });
            };
        };
    });
};
/**
 * 将文字写入剪切板
 * @param string 文字 {string}
 */
function writeClipboard(string = "") {
    navigator.clipboard.writeText(string).then(() => {
        layer.confirm({
            title: "操作成功",
            message: "成功在您的剪切板中写入了新的项目“" + string + "”。"
        });
    }).catch(err => {
        layer.confirm({
            title: "操作失败",
            message: "我们在您的剪切板中写入项目“" + string + "”时调用navigator.clipboard.writeText对象返回异常，可能为无权限写入。<br>异常：" + err
        });
    });
};
/**
 * 读取用户剪切板并返回
 * @param callback 回调函数 {function}
 * @return string 字符串 {string}
 */
function readClipboard(callback = ((text) => {console.log(text)})) {
    navigator.clipboard.readText().then((string) => {
        layer.confirm({
            title: "操作成功",
            message: "我们成功了读取了您的剪切板项目“" + string + "”。"
        });
        callback(string);
    }).catch(err => {
        layer.confirm({
            title: "操作失败",
            message: "我们在读取您的剪切板时调用navigator.clipboard.readText对象返回异常，可能为无权限读取。<br>异常：" + err
        });
    });
};
/**
 * 获取两个字符串的相似度
 * @param s 第一个字符串 {string}
 * @param t 第二个字符串 {string}
 * @returns similarity 相似度 {number}
 */
function similar(s = "", t = "") {
    //这段计算两个字符串的相似度(从第一个字符串到另一个字符串所需改变字符串的数量)是使用的莱文斯坦距离
    if (!s.length) return t.length;
    if (!t.length) return s.length;
    maxlength = Math.max(s.length, t.length);
    arr = [];
    for (i = 0; i <= t.length; i++) {
        arr[i] = [i]
        for (j = 1; j <= s.length; j++) {
            arr[i][j] = i === 0 ? j : Math.min(arr[i - 1][j] + 1, arr[i][j - 1] + 1, arr[i - 1][j - 1] + (s[j - 1] === t[i - 1] ? 0 : 1));
        };
    };
    //这段是我自己写的
    return (maxlength - arr[t.length][s.length]) / maxlength * 100;
};
/**
 * 在页面渲染完成之后执行的代码
 */
let IndexScheduledExecution = setInterval(function() {
    let status = document.readyState;
    if (status == "complete") {
        if (localStorage && !localStorage.getItem("tip1")) {
            layer.confirm({
                title: "一些问题",
                message: "若您发现此页面出现了一些小问题，请先尝试清理浏览器缓存，看看问题是否仍然存在在然后决定再决定是否提交问题。<br>他们一般出现在页面多次自发性刷新后。<br>或者点击<button onclick='location.href = `/ETeyondLitle/resource/page/debug.html`'>按钮</button>前往debug界面。",
                callback: {
                    close: "localStorage.setItem(\"tip1\", \"true\");{{CLOSE}}"
                }
            });
        };
        clearInterval(IndexScheduledExecution);
    };
}, 100);
