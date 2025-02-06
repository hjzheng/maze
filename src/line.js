function Line(canvas) {
  this.canvas = canvas;
  this.points = [];


  this.isDrawing = false; // 标记是否正在绘制
  this.lastX = 0; // 上一次鼠标位置的 x 坐标
  this.lastY = 0; // 上一次鼠标位置的 y 坐标

  this.canvas.addEventListener('mousedown', (e) => {
    this.isDrawing = true;
    this.lastX = e.offsetX;
    this.lastY = e.offsetY;
    this.points.push({ x: this.lastX, y: this.lastY });
  });

  this.canvas.addEventListener('mousemove', (e) => {
    if (this.isDrawing) {
      const currentX = e.offsetX;
      const currentY = e.offsetY;

      this.lastX = currentX;
      this.lastY = currentY;

      this.points.push({ x: currentX, y: currentY });
    }
  });

  this.canvas.addEventListener('mouseup', () => {
    this.isDrawing = false;
  });
}

Line.prototype.render = function() {
  const points = this.points;
  const ctx = this.canvas.getContext('2d');
  if (points.length < 1) {
      return;
  }
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.strokeStyle = 'black'; // 设置线条颜色
  ctx.lineWidth = 2; // 设置线条宽度
  ctx.stroke();
}

export default Line;