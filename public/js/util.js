function createRandomData(n, range, rand) {
  if (range == null) range = [0, 100];
  if (rand == null) rand = 1 / 20;

  var num = range[0] + Math.floor(Math.random() * (range[1] - range[0]));
  var num2 = range[0] + Math.floor(Math.random() * (range[1] - range[0]));
  var num3 = num;
  var d = new Date("2013-01-01");
  var data = [];
  var rgen = d3.randomNormal(0, (range[1] - range[0]) * rand);
  for (var i = 0; i < n; i++) {
    data.push({
      date: d,
      n: num,
    });
    d = new Date(d.getTime() + 1000 * 60 * 60 * 24);
    num = num + rgen();
  }
  return data;
}
