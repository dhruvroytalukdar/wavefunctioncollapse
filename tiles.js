class Tile {
  constructor(img, socket) {
    this.image = img;
    this.sockets = socket;
  }

  rotate(num) {
    const w = this.image.width;
    const h = this.image.height;
    const newImg = createGraphics(w, h);
    newImg.imageMode(CENTER);
    newImg.translate(w / 2, h / 2);
    newImg.rotate(HALF_PI * num);
    newImg.image(this.image, 0, 0);

    const newEdges = [];
    const len = this.sockets.length;
    for (let i = 0; i < len; i++) {
      newEdges[i] = this.sockets[(i - num + len) % len];
    }
    return new Tile(newImg, newEdges);
  }
}
