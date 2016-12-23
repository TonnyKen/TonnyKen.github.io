
        var scatterWidth = 1110;
        var scatterHeight = 650;
        var scatterMargin = {top:20, left:150, right:170, bottom:40};
        var scatterInnerHeight = scatterHeight - scatterMargin.top - scatterMargin.bottom;
        var scatterInnerWidth = scatterWidth - scatterMargin.left - scatterMargin.right;


        var containerOuterWidth = 950;
        var violinHeight = 160;
        var containerOuterHeight = violinHeight*710;
        var containerMargin = {top: 10, right: 40, bottom: 150, left: 60};
        var containerWidth = containerOuterWidth - containerMargin.left - containerMargin.right;
        var containerHeight = containerOuterHeight - containerMargin.top - containerMargin.bottom;

        var contextHeight = 50;
        var contextWidth = containerWidth * .5;


        var data = [];
        var chart = d3.select("#scatterplot")
                    .attr("width", scatterWidth)
                    .attr("height", scatterHeight)
                    .append("g")
                    .attr("transform", "translate(" + scatterMargin.left + "," + scatterMargin.top + ")");


        var button = d3.select('#button').append("svg")
                    .attr("width", 1076)
                    .attr("height",100)
                    .attr("transform","translate(60,0)");

        var svg2 = d3.select('#brush').append("svg")
                    .attr("width", 1076)
                    .attr("height",100)
                    .attr("transform","translate(60,0)");

        var svg = d3.select("#violin-container").append("svg")
                    .attr("width", containerWidth + containerMargin.left + containerMargin.right)
                    .attr("height", (containerHeight + containerMargin.top + containerMargin.bottom));

        function createScatterChart(data,result){
            var address = [];
            var charts = [];
            var maxDataPoint = 0;

            data.sort(function(a,b){return d3.ascending(a.FromAverage,b.FromAverage)});
            data.forEach(function(d) {
                address.push(d["To_address"]);
                maxDataPoint = d3.max([maxDataPoint,d3.max([d3.max(d.valueFrom),d3.max(d.valueTo)])]);
            }
            );

            var fromasc = button.append("g").append("rect")
            .attr("x", 90)
            .attr("y", 0)
            .attr("height", 80)
            .attr("width", 900/4)
            .attr("fill","#CB1414")
            .attr("opacity",0.8)
            .on("click",showListFromAsc);

            var fromdesc = button.append("g").append("rect")
            .attr("x", 90+900/4)
            .attr("y", 0)
            .attr("height", 80)
            .attr("width", 900/4)
            .attr("fill","#08324C")
            .attr("opacity",0.8)
            .on("click",showListToAsc);

            var toasc = button.append("g").append("rect")
            .attr("x", 90+900/2)
            .attr("y", 0)
            .attr("height", 80)
            .attr("width", 900/4)
            .attr("fill","#CB1414")
            .attr("opacity",0.8)
            .on("click",showListFromDesc);

            var todesc = button.append("g").append("rect")
            .attr("x", 90 + 900*3/4)
            .attr("y", 0)
            .attr("height", 80)
            .attr("width", 900/4)
            .attr("fill","#08324C")
            .attr("opacity",0.8)
            .on("click",showListToDesc);

            var textfa = button.append("text")
                    .attr("class","instructions")
                    .attr("x", 100)
                    .attr("y",45)
                    .text('Average Receive Time ASC');

            var textfd = button.append("text")
                    .attr("class","instructions")
                    .attr("x", 100 + 900/4)
                    .attr("y",45)
                    .text('Average Reply Time ASC');

            var textta = button.append("text")
                    .attr("class","instructions")
                    .attr("x", 95 + 900/2)
                    .attr("y",45)
                    .text('Average Receive Time DESC');

            var texttd = button.append("text")
                    .attr("class","instructions")
                    .attr("x", 100 + 900*3/4)
                    .attr("y",45)
                    .text('Average Reply Time DESC');

            var textcomment = button.append("text")
                    .attr("class","instructions")
                    .attr("transform", "translate(470,100)")
                    .text('Click to sort the data');

            var addressCount = address.length;

            for(var i = 0; i < addressCount; i++){
                charts.push(new Chart({
                                  data: data[i],
                                  id: i,
                                  name: data[i].address,
                                  width: containerWidth,
                                  height: violinHeight,
                                  maxDataPoint: maxDataPoint,
                                  svg: svg,
                                  margin: containerMargin,
                                  showBottomAxis: true
                                }));
            }


            var contextXScale = d3.scale.linear()
                                .range([0,contextWidth])
                                .domain([0,addressCount]);

            var contextAxis = d3.svg.axis()
                                  .scale(contextXScale)
                                  .tickSize(contextHeight)
                                  .tickPadding(-10)
                                  .orient("bottom");

            var contextArea = d3.svg.area()
                                  .interpolate("monotone")
                                  .x(function(d) { return contextXScale(d); })
                                  .y0(contextHeight)
                                  .y1(0);

            var brush = d3.svg.brush()
                                .x(contextXScale)
                                .on("brush", onBrush);

            var context = svg2.append("g")
                                .attr("class","context")
                                .attr("transform", "translate(" + (containerMargin.left + 1076 * .25) + "," + (containerMargin.top ) + ")");

            context.append("g")
                   .attr("class", "x axis top")
                   .attr("transform", "translate(0,0)")
                   .call(contextAxis);

            context.append("g")
                            .attr("class", "x brush")
                            .call(brush)
                            .selectAll("rect")
                              .attr("y", 0)
                              .attr("height", contextHeight);

            context.append("text")
                    .attr("class","instructions")
                    .attr("transform", "translate(40," + (contextHeight + 20) + ")")
                    .text('Click and drag above to zoom / pan the data');

            function showListFromAsc(){
                d3.selectAll("#violin-container > *").remove();
                data.sort(function(a,b){return d3.ascending(a.FromAverage,b.FromAverage)})
                var svg = d3.select("#violin-container").append("svg").attr("width", containerWidth + containerMargin.left + containerMargin.right)
                    .attr("height", violinHeight*710 - containerMargin.top - containerMargin.bottom);
                charts = [];
                for(var i = 0 ; i <= addressCount ; i++){
                        charts.push(new Chart({
                                  data: data[i],
                                  id: i,
                                  name: data[i].address,
                                  width: containerWidth,
                                  height: violinHeight,
                                  maxDataPoint: 1,
                                  svg: svg,
                                  margin: containerMargin,
                                  showBottomAxis: true
                                }));
                }
            }
            function showListFromDesc(){
                d3.selectAll("#violin-container > *").remove();
                data.sort(function(a,b){return d3.descending(a.FromAverage,b.FromAverage)})
                var svg = d3.select("#violin-container").append("svg").attr("width", containerWidth + containerMargin.left + containerMargin.right)
                    .attr("height", violinHeight*710 - containerMargin.top - containerMargin.bottom);
                charts = [];
                for(var i = 0 ; i <= addressCount ; i++){
                        charts.push(new Chart({
                                  data: data[i],
                                  id: i,
                                  name: data[i].address,
                                  width: containerWidth,
                                  height: violinHeight,
                                  maxDataPoint: 1,
                                  svg: svg,
                                  margin: containerMargin,
                                  showBottomAxis: true
                                }));
                }
            }
            function showListToAsc(){
                d3.selectAll("#violin-container > *").remove();
                data.sort(function(a,b){return d3.ascending(a.ToAverage,b.ToAverage)})
                var svg = d3.select("#violin-container").append("svg").attr("width", containerWidth + containerMargin.left + containerMargin.right)
                    .attr("height", violinHeight*710 - containerMargin.top - containerMargin.bottom);
                charts = [];
                for(var i = 0 ; i <= addressCount ; i++){
                        charts.push(new Chart({
                                  data: data[i],
                                  id: i,
                                  name: data[i].address,
                                  width: containerWidth,
                                  height: violinHeight,
                                  maxDataPoint: 1,
                                  svg: svg,
                                  margin: containerMargin,
                                  showBottomAxis: true
                                }));
                }
            }
            function showListToDesc(){
                d3.selectAll("#violin-container > *").remove();
                data.sort(function(a,b){return d3.descending(a.ToAverage,b.ToAverage)})
                var svg = d3.select("#violin-container").append("svg").attr("width", containerWidth + containerMargin.left + containerMargin.right)
                    .attr("height", violinHeight*710 - containerMargin.top - containerMargin.bottom);
                charts = [];
                for(var i = 0 ; i <= addressCount ; i++){
                        charts.push(new Chart({
                                  data: data[i],
                                  id: i,
                                  name: data[i].address,
                                  width: containerWidth,
                                  height: violinHeight,
                                  maxDataPoint: 1,
                                  svg: svg,
                                  margin: containerMargin,
                                  showBottomAxis: true
                                }));
                }
            }

              function onBrush(){
                /* this will return a date range to pass into the chart object */
                var b = brush.empty() ? contextXScale.domain() : brush.extent();
                  d3.select("#violin-container > *").remove();
                  var svg = d3.select("#violin-container").append("svg").attr("width", containerWidth + containerMargin.left + containerMargin.right)
                        .attr("height", violinHeight*710 - containerMargin.top - containerMargin.bottom);
                  charts = [];
                for(var i = (b[0]|0); i < b[1]; i++){
                  charts.push(new Chart({
                                      data: data[i],
                                      id: i-(b[0]|0),
                                      name: data[i].address,
                                      width: containerWidth,
                                      height: violinHeight,
                                      maxDataPoint: maxDataPoint,
                                      svg: svg,
                                      margin: containerMargin,
                                      showBottomAxis: true
                                    }));
                }
              }

            }

        function createViolinChart(data,rows) {

            var xScale = d3.scale.linear()
                .range([0,scatterInnerWidth])
                .domain([0, 1.4*d3.max(data, function(d){ return d.FromAverage})] );
            var yScale = d3.scale.linear()
                .range([scatterInnerHeight,0])
                .domain([0, 1.4*d3.max(data, function(d){ return d.ToAverage})] );
            var sScale = d3.scale.linear()
                .range([20,1000])
                .domain(d3.extent(data, function(d){ return d.TotalCount}));
            var cScale = d3.scale.category10();

            var xAxis = d3.svg.axis()
            .tickSize(-scatterInnerHeight)
            .scale(xScale)
            .orient("bottom");

            var yAxis = d3.svg.axis()
            .tickSize(-scatterInnerWidth)
            .scale(yScale)
            .orient("left");

            var tip = d3.tip()
                        .attr("class", "d3-tip")
                        .offset([-10, 0])
                        .html(function(d) {
                        return d.ToAddress + "@gmail.com" + "<br><br>" +"Average Receive Time: " + d.FromAverage + ' mins' + "<br>" + "Average Reply Time: " + d.ToAverage + ' mins' + "<br>" + "Total Amount Of Emails: " + d.TotalCount;
            });

            var zoomBeh = d3.behavior.zoom()
                            .x(xScale)
                            .y(yScale)
                            .scaleExtent([0, 500])
                            .on("zoom", zoom);

            chart.call(zoomBeh);
            chart.call(tip);

            chart.append("rect")
                 .attr("width", scatterInnerWidth)
                 .attr("height", scatterInnerHeight)
                 .attr("fill", "transparent");

            chart.append("g")
                  .classed("x axis", true)
                  .attr("transform", "translate(0," + scatterInnerHeight + ")")
                  .call(xAxis)
                  .append("text")
                  .classed("label", true)
                  .attr("x", scatterInnerWidth)
                  .attr("y", scatterMargin.bottom-10)
                  .style("text-anchor", "end")
                  .text("Average Receive Time / min");

            chart.append("g")
                 .classed("y axis", true)
                 .call(yAxis)
                 .append("text")
                 .classed("label", true)
                 .attr("transform", "rotate(-90)")
                 .attr("y", -60)
                 .attr("dy", ".71em")
                 .style("text-anchor", "end")
                        .text("Average Reply Time / min");

            var objects = chart.append("svg")
                               .classed("objects", true)
                               .attr("width", scatterInnerWidth)
                               .attr("height", scatterInnerHeight);

            objects.append("svg:line")
                   .classed("axisLine hAxisLine", true)
                   .attr("x1", 0)
                   .attr("y1", 0)
                   .attr("x2", scatterInnerWidth)
                   .attr("y2", 0)
                   .attr("transform", "translate(0," + scatterInnerHeight + ")");

            objects.append("svg:line")
                   .classed("axisLine vAxisLine", true)
                   .attr("x1", 0)
                   .attr("y1", 0)
                   .attr("x2", 0)
                   .attr("y2", scatterInnerHeight);

            objects.selectAll(".dot")
                   .data(data)
                   .enter().append("circle")
                   .classed("dot", true)
                   .attr("r", function (d) { return Math.sqrt(sScale(d.TotalCount)/Math.PI) })
                   .attr("transform", transform)
                   .style("fill", "#000000")//function(d,i) { return color(i) }
                   .on("mouseover", tip.show)
                   .on("mouseout", tip.hide)
                   .on("click", function(d, i) {renderElement(d.ToAddress)});

            function renderElement(address) {
                d3.selectAll("#violin-container > *").remove();

                var svg = d3.select("#violin-container").append("svg").attr("width", containerWidth + containerMargin.left + containerMargin.right)
                    .attr("height", 400 + violinHeight*1 - containerMargin.top - containerMargin.bottom);

                charts = [];
                for(var i = 0 ; i < 709 ; i++){
                    if(rows[i].address === address) {
                        charts.push(new Chart({
                                  data: rows[i],
                                  id: 0,
                                  name: address,
                                  width: containerWidth,
                                  height: violinHeight,
                                  maxDataPoint: 1,
                                  svg: svg,
                                  margin: containerMargin,
                                  showBottomAxis: true
                                }));
                    }
                }
                //console.log(charts);

            }


            function zoom() {
                chart.select(".x.axis").call(xAxis);
                chart.select(".y.axis").call(yAxis);

                chart.selectAll("circle")
                    .attr("transform", transform);
            }

            function transform(d) {
                return "translate(" + xScale(d.FromAverage) + "," + yScale(d.ToAverage) + ")";
            }
       }

       function render(data,rows) {
           var filteredData = data.filter(function(d) {
               return d.FromAverage && d.ToAverage && d.TotalCount;
           });

           filteredData.sort(function(a,b){return d3.ascending(a.ToAddress,b.ToAddress)});
           createViolinChart(filteredData,rows);
       }
       function Chart(options){
          this.chartData = options.data;
          this.width = options.width;
          this.height = options.height;
          this.maxDataPoint = options.maxDataPoint;
          this.svg = options.svg;
          this.id = options.id;
          this.name = options.name;
          this.margin = options.margin;
          this.showBottomAxis = options.showBottomAxis;

          var localName = this.name;

          this.xScale = d3.scale.linear().range([0, this.width-100])
                                .domain([0,600]);

          this.yScale_top = d3.scale.linear()
                                .range([this.height/2,0])
                                .domain([0,d3.max([d3.max(this.chartData.valueFrom),d3.max(this.chartData.valueTo)])]);
          this.yScale_bottom = d3.scale.linear()
                                .range([this.height,this.height/2])
                                .domain([d3.max([d3.max(this.chartData.valueFrom),d3.max(this.chartData.valueTo)]),0]);
          var xS = this.xScale;
          var yS_top = this.yScale_top;
          var yS_bottom = this.yScale_bottom;


          this.area_top = d3.svg.area()
                                .interpolate("basis")
                                .x(function(d,i) { return xS(120*i); })
                                .y0(this.height/2)
                                .y1(function(d) { return yS_top(d); });
          this.area_bottom = d3.svg.area()
                                .interpolate("basis")
                                .x(function(d,i) { return xS(120*i); })
                                .y0(this.height/2)
                                .y1(function(d) { return yS_bottom(d); });

          this.chartContainer = this.svg.append("g")
                                    .attr('class',"area")
                                    .attr("transform", "translate(" + this.margin.left + "," + (this.margin.top + (this.height * this.id) + (10 * this.id)) + ")");

          this.chartContainer.append("path")
                              .data([this.chartData.valueFrom])
                              .attr("class", "chart_from")
                              .attr("clip-path", "url(#clip-" + this.id + ")")
                              .attr("d", this.area_top);
          this.chartContainer.append("path")
                              .data([this.chartData.valueTo])
                              .attr("class", "chart_to")
                              .attr("clip-path", "url(#clip-" + this.id + ")")
                              .attr("d", this.area_bottom);

          this.xAxisTop = d3.svg.axis().scale(this.xScale).orient("bottom");
          this.xAxisBottom = d3.svg.axis().scale(this.xScale).orient("top");

          this.chartContainer.append("g")
              .attr("class", "x axis top")
              .attr("transform", "translate(0," + this.height/2 + ")")
              .call(this.xAxisTop)
              .append("text")
              .classed("label", true)
              .attr("x", this.width-40)
              .attr("y", this.margin.top+5)
              .style("text-anchor", "end")
              .text("Time / min");

          this.yAxis_top = d3.svg.axis().scale(this.yScale_top).orient("left").ticks(5);
          this.yAxis_bottom = d3.svg.axis().scale(this.yScale_bottom).orient("left").ticks(5);

          this.chartContainer.append("g")
                              .attr("class", "y axis")
                              .attr("transform", "translate(-15,0)")
                              .call(this.yAxis_top);
          this.chartContainer.append("g")
                              .attr("class", "y axis")
                              .attr("transform", "translate(-15,0)")
                              .call(this.yAxis_bottom)
                              .append("text")
                              .classed("label", true)
                              .attr("transform", "rotate(-90)")
                              .attr("y", this.margin.left/10)
                              .attr("dy", ".71em")
                              .style("text-anchor", "end")
                              .text("E-mail Quantity");

          this.chartContainer.append("text")
                              .attr("class","email")
                              .attr("transform", "translate(300,40)")
                              .text(this.name + "@gmail.com");

        }
        d3.csv('data/OverallData.csv', function(error,overall_data) {
            d3.csv('data/DetailedData.csv').row(function(d) {
                            return {
                                address : d.To_address,
                                valueFrom : [+d["from<120"],+d["from120~240"],+d["from240~360"],+d["from360~480"],+d["from480~600"],+d["from>=600"]],
                                valueTo : [+d["to<120"],+d["to120~240"],+d["to240~360"],+d["to360~480"],+d["to480~600"],+d["to>=600"]],
                                FromAverage : +d.FromAverage,
                                ToAverage : +d.ToAverage
                            };
            }).get(function(error, detailed_data) {
                createScatterChart(detailed_data,overall_data);
                render(overall_data,detailed_data);
            });

        })
