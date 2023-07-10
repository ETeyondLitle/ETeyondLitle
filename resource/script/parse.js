/**
 * 对字符串着色
 * @param string 原始字符串 {string}
 * @returns string HTML文本对象 {string}
 */
function TextShader(string = "") {
    string = string.replace(/§{2,}/g, "§");
    result = "";
    Key = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f", "g", "i", "m", "n", "o"];
    List = {
        "0": ["#000000", "span"],
        "1": ["#0000AA", "span"],
        "2": ["#00AA00", "span"],
        "3": ["#00AAAA", "span"],
        "4": ["#AA0000", "span"],
        "5": ["#AA00AA", "span"],
        "6": ["#FFAA00", "span"],
        "7": ["#AAAAAA", "span"],
        "8": ["#555555", "span"],
        "9": ["#5555FF", "span"],
        "a": ["#55FF55", "span"],
        "b": ["#55FFFF", "span"],
        "c": ["#FF5555", "span"],
        "d": ["#FF55FF", "span"],
        "e": ["#FFFF55", "span"],
        "f": ["#FFFFFF", "span"],
        "g": ["#DDD605", "span"],
        "i": ["inherit", "strong"],
        "m": ["inherit", "del"],
        "n": ["inherit", "u"],
        "o": ["inherit", "i"]
    };
};
