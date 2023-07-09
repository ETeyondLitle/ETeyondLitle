/**
 * 在页面渲染完成之后执行的代码
 */
let ApplyScheduledExecution = setInterval(function() {
    let status = document.readyState;
    if (status == "complete") {
        tipsElement = document.getElementById("tips");
        tips = insertvalue("如果您对此教程有一些异议，或认为此教程有一些不严谨的地方，可以通过 391281067@qq.com 或 ETeyondLitle@yeah.net 联系作者<br>教程最后更新时间: {{time}}", {
            time: getTime("preset0001")
        });
        if (localStorage && !localStorage.getItem("tip2")) {
            layer.confirm({
                title: "开发者の小提示",
                message: "在此页面中你可以做到以下操作：<br>1. 点击命令条目时查询会自动复制命令到剪切板。<br>2. 您可以更直观的看到命令方块的摆放方向。<br>3. 暂未填写。",
                callback: {
                    close: "localStorage.setItem(\"tip2\", \"true\");{{CLOSE}}"
                }
            });
        };
        //点击命令条目自动复制内容
        document.addEventListener("click", (event) => {
            if (event.target.tagName == "DIV" && event.target.id == "command") {
                 writeClipboard(event.target.innerHTML);
            };
        })
        tipsElement.innerHTML = tips;
        clearInterval(ApplyScheduledExecution);
    };
}, 100);
