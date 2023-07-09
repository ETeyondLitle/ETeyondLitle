/**
 * 获取PopUpWindow元素
 * @returns element PopUpWindow元素 {element}
 */
function getPopUpWindow() {
    if (document.getElementById("PopUpWindow") == undefined) {
        //没有获取到PopUpWindow元素则创建一个PopUpWindow元素
        div = document.createElement("div");
        div.id = "PopUpWindow";
        //将div东西加到body对象的最前面
        document.body.insertAdjacentElement("afterbegin", div);
    };
    return document.getElementById("PopUpWindow");
};
/**
 * 解析出设置
 * @param original 原始的设置 {object}
 * @returns fresh 新鲜的设置 {object}
 */
function analysis(original = {}) {
    console.log(original)
    title = typeof original.title == "string" ? original.title : "标题";
    message = typeof original.message == "string" ? original.message : "内容";
    language = typeof original.language == "object" ? original.language : {};
    call = typeof original.callback == "object" ? original.callback :  {};
    button = {
        yes: typeof language.yes == "string" ? original.yes : "是",
        no: typeof language.no == "string" ? original.no : "否",
        close: typeof language.close == "string" ? original.close : "关闭",
    };
    callback = {
        yes: (typeof call.yes == "string" || typeof call.yes == "function") ? call.yes : "{{CLOSE}}",
        no: (typeof call.no == "string" || typeof call.no == "function") ? call.no : "{{CLOSE}}",
        close: (typeof call.close == "string" || typeof call.close == "function") ? call.close : "{{CLOSE}}",
    };
    return {
        title: title,
        message: message,
        language: {
            button: button
        },
        callback: callback
    };
};
/**
 * 获取弹窗组件的ID
 * @returns object 弹窗组件的ID {object}
 */
function getUnitID() {
    return {
        //对话框的ID
        overall: generate(),
        //盒子的ID
        box: generate(),
        //标题栏的ID
        title: generate(),
        //信息框的ID
        message: generate(),
        //按钮的ID
        button: {
            //按钮栏的ID
            frame: generate(),
            //关闭键的ID
            close: generate(),
            //确认键的ID
            yes: generate(),
            //否定键的ID
            no: generate()
        }
    };
};
/**
 * 在用户的屏幕上弹出弹窗
 */
layer = (function () {
    /**
     * 只能确认的对话框
     * @parse setting 此弹窗的设置 {object}
     */
    function confirm(setting) {
        //获取PopUpWindow元素
        PopUpWindow = getPopUpWindow();
        //获取弹窗组件的ID
        id = getUnitID();
        //获取解析后的数据
        setting = analysis(setting);
        raw = `<div type="alert" id="${id.overall}">
            <div type="mark">
                <div type="box" id="${id.box}">
                    <div type="title" id="${id.title}">
                        ${setting.title}
                    </div>
                    <div type="message" id="${id.message}">
                        ${setting.message}
                    </div>
                    <div type="button" id="${id.button.frame}">
                        <button type="close" id="${id.button.close}">${setting.language.button.close}</button>
                    </div>
                </div>
            </div>
        </div>`;
        PopUpWindow.innerHTML += raw;
        document.getElementById(id.button.close).setAttribute("onclick", insertvalue(callback.close, {
            CLOSE: 'document.getElementById("' + id.overall + '").remove()'
        }));
        return {
            id: id,
            setting: setting,
            element: document.getElementById(id.overall)
        };
    };
    /**
     * 可以选择的对话框
     * @parse setting 此弹窗的设置 {object}
     */
    function choose(setting) {
        //获取PopUpWindow元素
        PopUpWindow = getPopUpWindow();
        //获取弹窗组件的ID
        id = getUnitID();
        //获取解析后的数据
        setting = analysis(setting);
        raw = `<div type="alert" id="${id.overall}">
            <div type="mark">
                <div type="box" id="${id.box}">
                    <div type="title" id="${id.title}">
                        ${setting.title}
                    </div>
                    <div type="message" id="${id.message}">
                        ${setting.message}
                    </div>
                    <div type="button" id="${id.button.frame}">
                        <button type="yes" id="${id.button.yes}">${setting.language.button.yes}</button>
                        <button type="no" id="${id.button.no}">${setting.language.button.no}</button>
                    </div>
                </div>
            </div>
        </div>`;
        PopUpWindow.innerHTML += raw;
        document.getElementById(id.button.yes).setAttribute("onclick", insertvalue(callback.close, {
            CLOSE: 'document.getElementById("' + id.overall + '").remove()'
        }));
        document.getElementById(id.button.no).setAttribute("onclick", insertvalue(callback.close, {
            CLOSE: 'document.getElementById("' + id.overall + '").remove()'
        }));
        return {
            id: id,
            setting: setting,
            element: document.getElementById(id.overall)
        };
    };
    return {
        confirm: confirm,
        choose: choose
    };
})();
