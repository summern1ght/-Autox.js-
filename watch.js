// 是否预设过观演人
var isPreset = true;
// 票数量 只有未预设情况下会用这个数量 需要保证已经添加了不少于这个数量的观演人
var count = 2;
// 提醒音乐路径
var musicPath = "/storage/emulated/0/xiami/audios/Bonjour & Goodnight_Posheric.mp3";
auto.waitFor();
app.launchApp("大麦");
openConsole();
console.setPosition(450, 0);

sleep(1000);
while (true) {
    watch();
}

function watch() {
    console.log("开始监控");
    // 获取场次控件父控件
    var layoutPerformView = id("layout_perform_view").findOne();
    // 获取所有场次控件
    var UIPreformList = layoutPerformView.find(id("ll_perform_item"));
    console.log("获取到的日期控件个数：" + UIPreformList.length);
    // 保存每个场次控件的中心坐标
    var UIPreformClickPosList = new Array();
    for (var i = 0; i < UIPreformList.length; i++) {
        var UIPreform = UIPreformList[i];
        var rectUIDate = UIPreform.bounds();
        var clickPosX = rectUIDate.centerX();
        var clickPosY = rectUIDate.centerY();
        var clickPos = {
            x: clickPosX,
            y: clickPosY
        }
        UIPreformClickPosList[i] = clickPos;
    }
    //console.log(UIPreformClickPosList);

    // 循环点击所有场次控件
    var i = 0;
    while (true) {
        i = i % UIPreformClickPosList.length;
        console.log("第" + i + "个控件点击结果: " + click(UIPreformClickPosList[i].x, UIPreformClickPosList[i].y)); 
        sleep(1000);
        // 获取价位控件父控件
        var layoutPrice = id("layout_price").findOne();
        // 获取所有价位控件
        var UIPriceList = layoutPrice.find(id("ll_perform_item"));
        console.log("获取到的价位控件个数：" + UIPriceList.length);
        // 循环判断每个价位控件是否包含“缺货登记”
        for (var j = 0; j < UIPriceList.length; j ++){
            var UIPrice = UIPriceList[j];
            var temp = UIPrice.find(text("缺货登记"));
            if (temp.length > 0) {
                console.log("第" + j + "个价位 缺货");
                continue;
            }
            console.log("第" + j + "个价位 有货！");
            console.log("冲啊！！！");
            UIPrice.parent().click();
            id("btn_buy").findOne().click();
            print("点确定");
            var btnSubmit = text("提交订单").findOne(8000);
            if (!btnSubmit) {
                console.log("没找到提交按钮");
                var popWindow = id("damai_theme_dialog_layout").findOne(8000);
                if (popWindow) {
                    console.log("发现弹窗控件");
                    console.log("第一次返回操作：" + back()); 
                    return;
                }
            }
            if (!isPreset) {
                for(var k = 0; k < count; k ++)
                {
                    id("checkbox").className("android.widget.CheckBox").clickable(true).checkable(true).checked(false).findOne().click();
                }
                print("选择观演人");
            }
            text("提交订单").findOne().click();
            print("提交订单");
            var popWindow = id("damai_theme_dialog_layout").findOne(8000);
            if (popWindow) {
                console.log("发现弹窗控件");
                console.log("第一次返回操作：" + back()); 
                sleep(800);
                console.log("第二次返回操作：" + back()); 
                return;
            }
            print("over!  ^_^");
            alarm();
            exit();
        }
        i ++;
    }
}

function alarm() {
    //播放音乐
    media.playMusic(musicPath);
    //让音乐播放完
    sleep(3 * 60 * 1000);
}
