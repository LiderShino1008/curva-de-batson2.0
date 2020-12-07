// Global variables for charts
var chart;
var line;

am4core.ready(function() {
  // Themes begin
  am4core.useTheme(am4themes_animated);
  // Themes end
  
  // *** LINEDIV ***
  // Grafico para mostrar el porcentaje de crecimiento poblacional
  line = am4core.create("linediv", am4charts.XYChart);
  line.data = [{
    "poblacion": "Inicial",
    "personas": (9500000/9500000)
  }, {
    "poblacion": "Natural",
    "personas": (9625000/9500000)
  }, {
    "poblacion": "Absoluto",
    "personas": (9600478/9500000)
  }];
  var categoria_line = line.xAxes.push(new am4charts.CategoryAxis());
  categoria_line.dataFields.category = "poblacion";
  categoria_line.renderer.grid.template.location = 0;
  categoria_line.renderer.minGridDistance = 30;    
  categoria_line.renderer.labels.template.adapter.add("dy", function(dy, target) {
    if (target.dataItem && target.dataItem.index & 2 == 2) {
      return dy + 25;
    }
    return dy;
  });    
  var valueAxis_line = line.yAxes.push(new am4charts.ValueAxis());
  series = line.series.push(new am4charts.ColumnSeries());
  series.dataFields.valueY = "personas";
  series.dataFields.categoryX = "poblacion";
  series.name = "personas";
  series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";
  series.columns.template.fillOpacity = .8;
  var plantillaColumna_line = series.columns.template;
  plantillaColumna_line.strokeWidth = 2;
  plantillaColumna_line.strokeOpacity = 1;

  // *** CHARTDIV ***
  // Grafico de crecimiento poblacional a traves del tiempo
  // Themes begin
  am4core.useTheme(am4themes_material);
  // Themes end

  // Create chart instance
  chart = am4core.create("chartdiv", am4charts.XYChart);

  // Increase contrast by taking evey second color
  chart.colors.step = 2;

  // Add data
  chart.data = [
    {date: '2020', crecimientoNatural: 9500000, crecimientoAbsoluto: 9500000},
    {date: '2021', crecimientoNatural: 9520000, crecimientoAbsoluto: 9515321},
    {date: '2022', crecimientoNatural: 9576140, crecimientoAbsoluto: 9552100},
    {date: '2023', crecimientoNatural: 9596788, crecimientoAbsoluto: 9558798},
    {date: '2024', crecimientoNatural: 9610000, crecimientoAbsoluto: 9571000},
    {date: '2025', crecimientoNatural: 9612354, crecimientoAbsoluto: 9582100},
    {date: '2026', crecimientoNatural: 9625000, crecimientoAbsoluto: 9600478}
  ];

  // Create axes
  var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
  dateAxis.renderer.minGridDistance = 50;

  // Create series
  function createAxisAndSeries(field, name, opposite, bullet) {
    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    if(chart.yAxes.indexOf(valueAxis) != 0){
      valueAxis.syncWithAxis = chart.yAxes.getIndex(0);
    }
    
    var series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.valueY = field;
    series.dataFields.dateX = "date";
    series.strokeWidth = 2;
    series.yAxis = valueAxis;
    series.name = name;
    series.tooltipText = "{name}: [bold]{valueY}[/]";
    series.tensionX = 0.8;
    series.showOnInit = true;
    
    var interfaceColors = new am4core.InterfaceColorSet();
    
    switch(bullet) {
      case "triangle":
        var bullet = series.bullets.push(new am4charts.Bullet());
        bullet.width = 12;
        bullet.height = 12;
        bullet.horizontalCenter = "middle";
        bullet.verticalCenter = "middle";
        
        var triangle = bullet.createChild(am4core.Triangle);
        triangle.stroke = interfaceColors.getFor("background");
        triangle.strokeWidth = 2;
        triangle.direction = "top";
        triangle.width = 12;
        triangle.height = 12;
        break;
      default:
        var bullet = series.bullets.push(new am4charts.CircleBullet());
        bullet.circle.stroke = interfaceColors.getFor("background");
        bullet.circle.strokeWidth = 2;
        break;
    }
    
    valueAxis.renderer.line.strokeOpacity = 1;
    valueAxis.renderer.line.strokeWidth = 2;
    valueAxis.renderer.line.stroke = series.stroke;
    valueAxis.renderer.labels.template.fill = series.stroke;
    valueAxis.renderer.opposite = opposite;
  }

  createAxisAndSeries("crecimientoNatural", "Crecimiento Natural", false, "circle");
  createAxisAndSeries("crecimientoAbsoluto", "Crecimiento Absoluto", true, "triangle");

  // Add legend
  chart.legend = new am4charts.Legend();

  // Add cursor
  chart.cursor = new am4charts.XYCursor();

}); // end am4core.ready()