
var subwayData = {
    "1号线": ["苹果园","古城","雍和宫"],
    "2号线": ["西直门","积水潭","雍和宫","安定门"],
    "4号线": ["鼓楼大街","安定门","八角游乐园"],
    "5号线": ["八角","八角游乐园","西直门"],
    "10号线": ["刘家窑","西直门","崇文门"],
    "13号线": ["卓刀泉","崇文门","古城"],
    "15号线": ["中关村","西二旗","圆明园"],
    "八通线": ["林园路","圆明园","传媒大学"],
    "昌平线": ["沙河","传媒大学","四惠东"],
    "亦庄线": ["八宝山","四惠东","江滩"],
    "大兴线": ["中关村","江滩","古城"]
};

// length between two points
var edgesDate = [["苹果园","古城",2], ["古城","雍和宫",1],["西直门","积水潭",2],["积水潭","雍和宫",4],["雍和宫","安定门",2],["鼓楼大街","安定门",7],["安定门","八角游乐园",2],["八角","八角游乐园",2],["八角游乐园","西直门",4],["刘家窑","西直门",2],["西直门","崇文门",5],["卓刀泉","崇文门",2],["崇文门","古城",8],["中关村","西二旗",2],["西二旗","圆明园",2],["林园路","圆明园",2],["圆明园","传媒大学",4],["沙河","传媒大学",2],["传媒大学","四惠东",2],["八宝山","四惠东",2],["四惠东","江滩",5],["中关村","江滩",2],["江滩","古城",7]];


var $jq = jQuery.noConflict();

function init () {
	initSubwayBox();
	initSubwayClick();
	initDijkstra();
	initCalcFare();
}

//获取当前线路
function getSubwayLineHtml(){
	var htmls = [];
	i = -1;
	className = ["op-subway-one", "op-subway-two", "op-subway-four", "op-subway-five", "op-subway-six", "op-subway-seven", "op-subway-eight", "op-subway-nine", "op-subway-ten", "op-subway-thirteen", "op-subway-fourteen", "op-subway-fifteen", "op-subway-batong", "op-subway-changpin", "op-subway-yizhuan", "op-subway-fangsan", "op-subway-jichang"];
	for (var lineName in subwayData)
	i++,
		htmls.push("<li><span class="+className[i]+"></span>"+lineName+"</li>");
    return htmls.join("");
}

function getSubwayStationHtml (lineName) {
	for(var stations = subwayData[lineName],htmls = [], i=0; i < stations.length; i++) htmls.push("<li>"+stations[i]+"</li>");
		return htmls.join("");
}	

function tryActiveButton(){
	var start = $jq(".op-subway-box-start .op-subway-station em").text();
	var end = $jq(".op-subway-box-end .op-subway-station em").text();
	if ("选择车站" != start && "选择车站" != end) {
		$jq(".op-subway-calc-false").addClass("op-subway-calc-fare").removeClass("op-subway-calc-false");
	}
}

//初始化下拉菜单
function initSubwayBox () {
	var lineHtml = getSubwayLineHtml();
	$jq(".op-subway-line .op-subway-ul").html(lineHtml);
	$jq(".op-subway-line .op-subway-ul").on("click", "li",
	function(){
		var lineName = $jq(this).text();
		$jq(this).parent().parent().parent().find(".op-subway-line em").css({
			padding:"0px 5px 0px 20px"
		}),
			$jq(this).parent().parent().parent().find(".op-subway-station").css({
				background:"#fff"						
			}),
			$jq(this).parent().parent().parent().find(".op-subway-station em").css({
				color:"#333"
			});

		var stationHtml = getSubwayStationHtml(lineName),
			$box = $jq(this).parent().parent().parent();
		$box.find(".op-subway-ulk").html(stationHtml);
		var fisrtStation = subwayData[lineName][0];
		$box.find(".op-subway-station em").text(fisrtStation),
			tryActiveButton()
	})
}

function initSubwayClick(){
	$jq(".op-subway-line,.op-subway-station").on("click",
		function(event){
			if(event.stopPropagation(),$jq(".op-subway-ts").hide(),$jq(".op-subway-box ul").hide(),
				$jq(this).find("ul").children().length) {$jq(this).find("ul").show();}

			$jq(document).on("click",
			function(){
				$jq(".op-subway-box ul").hide()
			})
		})
	$jq(".op-subway-ul, .op-subway-ulk").on("click","li",
		function(event){
			event.stopPropagation(),
				$jq(this).parent().parent().find("em").html($jq(this).html()),
				$jq(this).parent().parent().find("ul").hide();
		})
}

function initCalcFare(){
	$jq(".op-subway-main").on("click",".op-subway-calc-fare",
		function(){
			var start = $jq(".op-subway-box-start .op-subway-station em").html();
			var end = $jq(".op-subway-box-end .op-subway-station em").html();
			if(start == end) {return $jq(".op-subway-ts").html("起点和终点不可重合哦！").show();}
			$jq(".op-subway-tab,.op-subway-footer").show(),
				$jq($jq(".op-subway-tab li")).show();
			var distance = Dijkstra.shortestPath(start,end);
			var	fare = caleFare(distance);
			$jq(".op-subway-content2 .op-subway-text .op-subway-fareinfo").html(getText(distance,fare));
		})
}

function caleFare(distance){
	if(distance <= 6) return 3;
	if(distance <= 12) return 4;
	if(distance <= 32) return 4 + Math.ceil((distance-12)/10);
	else return 6+Math.ceil((distance-32)/20);
}

// return a num with one number after '.', e.g. "123.4"
function format(distance){
	console.log();
	var s = distance + "",
		index = s.indexOf(".");
	if(index >= 0) if(s.length > index+2) s = substr(0, index+2);
	return s;
}

function getText(distance, fare){
	var increase = caleMonthFare(fare);
	if(distance = format(distance)) {
		$jq(".op-subway-bord").css({height:"300px"});
		return '<p class="op-subway-span">单程<em class="op-subway-increase">'+distance+'</em>公里，票价<em class="op-subway-increase op-subway-money">'+fare+'</em>元。<br>每年成本将增加<em class="op-subway-increase op-subway-money">'+increase+'</em>元!</p>';
	}
}

function caleMonthFare(fare){
	var addtext = 2*(fare-2)*22*12;
	return addtext;
}

function initDijkstra(){
	Dijkstra.addEdges(edgesDate);
}

init();