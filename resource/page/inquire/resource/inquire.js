/**
 * 根据关键词及设置从数据中查询出匹配内容
 * @param keyword 关键词 {string}
 * @param data 数据 {array}
 * @param correlation 相关度 {number}
 * @param column 去匹配哪一列的数据 {number}
 * @param sort 是否对输出的数据排序 {boolean}
 * @returns result 匹配内容 {array}
 */
function inquire(keyword = "", data = [], correlation = 5, column = 1, sort = true) {
    result = [];
    for (let k = 0; k < data.length; k++) {
        temp = data[k];
        degree = similar(keyword || " ", temp.split(" ")[column] || "");
        if (!isNaN(temp.length) && degree >= correlation) {
            result.push({
                item: temp,
                similar: degree
            });
        };
    };
    //使用魔改之后的冒泡排序进行排序
    function bubbleSort(arr) {
        let max = arr.length - 1;
        for (let j = 0; j < max; j++) {
            let done = true;
            for (let i = 0; i < max - j; i++) {
                if (arr[i]["similar"] < arr[i + 1]["similar"]) {
                    let temp = arr[i];
                    arr[i] = arr[i + 1];
                    arr[i + 1] = temp;
                    done = false;
                };
            };
            if (done) {
                break;
            };
        };
        return arr;
    };
    if (sort) {
        result = ((array) => {
            for (let i = 0; i < array.length; i++) {
                array[i]["similar"] = array[i]["similar"].toFixed(3) + "%";
            };
            return array;
        })(bubbleSort(result));
    };
    return result;
};
/**
 * 将匹配内容渲染在表格上
 * @param content 匹配内容 {array}
 * @param tbodyelement 表格的tbody对象 {HTMLElement}
 * @param match 是否显示匹配度一栏 {boolean}
 * @returns tbodyelement 表格的tbody对象 {HTMLElement}
 */
function renderContent(content = [], tbodyelement = document.createElement("tbody"), match = true) {
    tbodyelement.innerHTML = "";
    existencetwo = false;
    if (content.length == 0) {
        trelement = document.createElement("tr");
        tdelement = document.createElement("td");
        tdelement.setAttribute("colspan", "99");
        tdelement.id = "center";
        tdelement.innerHTML = "没有匹配项目";
        trelement.appendChild(tdelement);
        tbodyelement.appendChild(trelement);
        return tbodyelement;
    };
    for (let k = 0; k < content.length; k++) {
        temp = content[k];
        if (temp["item"].split(" ").length >= 2) {
            existencetwo = true;
        };
    };
    document.getElementById("hidable").style.display = match ? "table-cell" : "none";
    for (let k = 0; k < content.length; k++) {
        temp = content[k];
        itemdata = temp["item"];
        trelement = document.createElement("tr");
        tdelement = document.createElement("td");
        tdelement.innerHTML = itemdata.areaIntercept(" ", "before");
        trelement.appendChild(tdelement);
        if (existencetwo) {
            tdelement = document.createElement("td");
            tdelement.innerHTML = itemdata.areaIntercept(" ", "after") || "[Empty]";
            trelement.appendChild(tdelement);
        };
        if (match) {
            tdelement = document.createElement("td");
            tdelement.innerHTML = temp["similar"];
            trelement.appendChild(tdelement);
        };
        tbodyelement.appendChild(trelement);
    };
    return tbodyelement;
};
/**
 * 在页面渲染完成之后执行的代码
 */
let InquireScheduledExecution = setInterval(function() {
    let status = document.readyState;
    if (status == "complete") {
        if (localStorage && !localStorage.getItem("tip0")) {
            layer.confirm({
                title: "开发者の小提示",
                message: "在此页面中你可以做到以下操作：<br>1. 双击空白处可以隐藏除表格以外的所有元素。<br>2. 点击表格中的文字可复制。<br>3. 你可以在“搜索相关”下拉菜单中设置一些关于搜索的项目的设置。<br>4. 你可以在“数据组相关”下拉菜单中选择搜索的数据组。",
                callback: {
                    close: "localStorage.setItem(\"tip0\", \"true\");{{CLOSE}}"
                }
            });
        };
        /**
         * 检测到用户双击背景时隐藏除表格以外的所有元素
         */
        hidingelement = document.getElementById("hiding")
        document.addEventListener("dblclick", () => {
            if (hidingelement.style.display != "none") {
                hidingelement.style.display = "none";
            } else {
                hidingelement.style.display = "inherit";
            };
        });
        document.addEventListener("click", (event) => {
            if (event.target.tagName == "TD") {
                ele = event.target;
                writeClipboard(ele.innerHTML);
            };
        });
        //在页面加载完成之后列出所有项目
        res = inquire("", listdata, 0, 1);
        renderContent(res, document.getElementById("tbody"), false)
        clearInterval(InquireScheduledExecution);
    };
}, 100);
