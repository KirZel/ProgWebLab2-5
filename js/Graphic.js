const marginX = 50;
const marginY = 50;
const height = 400;
const width = 800;

let svg = d3.select("svg")
    .attr("height", height)
    .attr("width", width);


function createArrGraph(data, key, keyY) {

  groupObj = d3.group(data, d => d[key]);
  let arrGraph =[];
  if (keyY == 'YNum') {
    for(let entry of groupObj) {
        let num = d3.count(entry[1].map(d => d['Номер ИМО судна']));
        arrGraph.push({labelX : entry[0], values : num});
      } 
  } else {
    for(let entry of groupObj) {
      let Suma = d3.sum(entry[1].map(d => d[keyY]));
      arrGraph.push({labelX : entry[0], values : Suma});
    }
  }
  arrGraph.sort((a, b) => new Date(DateChangeForm(a.labelX)) - new Date(DateChangeForm(b.labelX)));
  return arrGraph;
 }

function drawGraph(data) {
  // значения по оси ОХ
  const keyX = data.hor.value;
 
  const keyY = data.ver.value;
 
  // создаем массив для построения графика
  const arrGraph = createArrGraph(portData, keyX, keyY);
  console.log(arrGraph);
  svg.selectAll('*').remove();
 
  // создаем шкалы преобразования и выводим оси
  const [scX, scY] = createAxis(arrGraph);
 
  // рисуем графики

  createChart(arrGraph, scX, scY, "red");
}

function createAxis(data) {
  // В зависимости от выбранных пользователем данных по оси OY
  // находим интервал значений для этой оси

  let min = d3.min(data.map(d => d.values));
  let max = d3.max(data.map(d => d.values));

  // Функция для интерполяции значений на оси X
  let scaleX = d3.scaleBand()
      .domain(data.map(d => d.labelX))
      .range([0, width - 2 * marginX]);

  // Функция для интерполяции значений на оси Y
  let scaleY = d3.scaleLinear()
      .domain([min * 0.85, max * 1.1]) // Добавляем небольшой отступ от минимального и максимального значений
      .range([height - 2 * marginY, 0]);

  // Создание осей
  let axisX = d3.axisBottom(scaleX); // Горизонтальная ось
  let axisY = d3.axisLeft(scaleY); // Вертикальная ось

  // Отрисовка осей на SVG-элементе
  svg.append("g")
      .attr("transform", `translate(${marginX}, ${height - marginY})`)
      .call(axisX)
      .selectAll("text") // Подписи на оси - наклонные
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", d => "rotate(-45)");

  svg.append("g")
      .attr("transform", `translate(${marginX}, ${marginY})`)
      .call(axisY);

  return [scaleX, scaleY];
}
 
/*function createChart(data, scaleX, scaleY, color) {
  const r = 4
  // чтобы точки не накладывались, сдвинем их по вертикали
  svg.selectAll(".dot")
  .data(data)
  .enter()
  .append("circle")
  .attr("r", r)
  .attr("cx", d => scaleX(d.labelX) + scaleX.bandwidth() / 2)
  .attr("cy", d => scaleY(d.values))
  .attr("transform", `translate(${marginX}, ${marginY})`)
  .style("fill", color)
 }*/
 
 function createChart(data, scaleX, scaleY, color) {
  const r = 4; // Радиус точек

  // Чтобы точки не накладывались, сдвинем их по вертикали

  // Функция построения линии
  const line = d3.line()
    .x(d => scaleX(d.labelX) + scaleX.bandwidth() / 2)
    .y(d => scaleY(d.values));

  // Добавляем круги (точки) и линии на SVG-элемент
  svg.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", color)
    .attr("stroke-width", 2)
    .attr("d", line)
    .attr("transform", `translate(${marginX}, ${marginY})`);

  svg.selectAll(".dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("r", r)
    .attr("cx", d => scaleX(d.labelX) + scaleX.bandwidth() / 2)
    .attr("cy", d => scaleY(d.values))
    .attr("transform", `translate(${marginX}, ${marginY})`)
    .style("fill", color);

 }