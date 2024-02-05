function fallEffect() {
  function map(n, start1, stop1, start2, stop2, withinBounds) {
    const newval = ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
    
    if (!withinBounds) {
        return newval;
      }
      if (start2 < stop2) {
        return constrain(newval, start2, stop2);
      } else {
        return constrain(newval, stop2, start2);
      }
    }
    
    function constrain(n, low, high) {
      console.log(high);
      return Math.max(Math.min(n, high), low);
  }

  function rand(min, max) {
    return Math.round(rand_float(min, max));
  }

  function rand_float(min, max) {
    if (min > max) {
      [min, max] = [max, min];
    }

    return Math.random() * (max - min) + min;
  }

  function loadImages(image) {
    if (!image) {
      return Promise.reject();
    } else if (typeof image === "string") {
      const src = image;
      image = new Image();
      image.src = src;
    } else if (image.length !== undefined) {
      const reflected = [].map.call(image, (img) =>
        loadImages(img).catch((err) => err)
      );

      return Promise.all(reflected).then((results) => {
        const loaded = results.filter((x) => x.naturalWidth);
        if (loaded.length === results.length) {
          return loaded;
        }
        return Promise.reject({
          loaded,
          errored: results.filter((x) => !x.naturalWidth),
        });
      });
    } else if (image.tagName !== "IMG") {
      return Promise.reject();
    }

    const promise = new Promise((resolve, reject) => {
      if (image.naturalWidth) {
        resolve(image);
      } else if (image.complete) {
        reject(image);
      } else {
        image.addEventListener("load", fullfill);
        image.addEventListener("error", fullfill);
      }
      function fullfill() {
        if (image.naturalWidth) {
          resolve(image);
        } else {
          reject(image);
        }
        image.removeEventListener("load", fullfill);
        image.removeEventListener("error", fullfill);
      }
    });
    promise.image = image;
    return promise;
  }

  function direction() {
    return rand(0, 1) === 1 ? 1 : -1;
  }

  function fall(options, ctx) {
    let defaults = {
      maxSize: 30,
      minSize: 4,
      speed: 1,
      fov: 20,
      rotate: 1,
      flip: 0,
      wave: 30,
      gravity: 0,
      images: [],
    };

    let config = Object.assign({}, defaults, options);

    let image = config.images[rand(0, config.images.length - 1)];

    let x, y, z, size;
    let depth,
      yspeed,
      xspeed = 0,
      xTranslateOffset,
      gravity;
    let rotate = 0,
      rotateSpeed;
    let flip = 1,
      flipSpeed;
    let time = 0;

    reset();

    y = rand(-size / 2, ctx.canvas.height + size);

    function reset() {
      x = rand(0, ctx.canvas.width);
      z = rand(0, config.fov);
      depth = map(z, 0, config.fov, 0, 1);
      size = map(
        config.maxSize * depth,
        0,
        config.maxSize,
        config.minSize,
        config.maxSize
      );
      y = -size;
      yspeed = (map(depth, 0, 1, 1, 5) / 10) * config.speed;
      xspeed = rand_float(0, 0.05) * direction();
      rotateSpeed = rand_float(0, 0.1) * direction() * config.rotate;
      flipSpeed = rand_float(0, 0.01) * direction() * config.flip;
      xTranslateOffset = rand_float(0, 1) * direction();
    }

    this.update = function () {
      time += xspeed;
      yspeed += config.gravity;
      y += yspeed;
      x += (Math.sin(time) + xTranslateOffset) * depth;
      rotate += rotateSpeed;
      flip += flipSpeed;

      if (time >= config.wave * depth || time <= -config.wave * depth) {
        xspeed *= -1;
      }

      if (flip <= 0 || flip >= 1) {
        flipSpeed *= -1;
      }

      if (y > ctx.canvas.height) {
        reset();
      }
    };

    this.draw = function () {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate((rotate * Math.PI) / 180);
      ctx.scale(flip, 1);

      ctx.drawImage(image, -size / 2, -size / 2, size, size);
      ctx.restore();
    };
  }

  let images = ["./img/bg/bulb-bg.svg", "./img/bg/question-bg.svg"];

  loadImages(images).then(function (images) {
    let icon = [];
    let count = 100;
    let options = {
      maxSize: 32,
      minSize: 16,
      speed: 1,
      fov: 100,
      rotate: 10,
      flip: 0,
      wave: 30,
      gravity: 0,
      images: images,
    };

    let canvas = document.querySelector(".bg");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let ctx = canvas.getContext("2d");

    document.body.insertAdjacentElement("afterbegin", canvas);

    for (let i = 0; i < count; i++) {
      let imageId = rand(0, images.lenght);
      icon.push(new fall(options, ctx));
    }

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function update() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      icon.forEach(function (fall) {
        fall.update();
        fall.draw();
      });

      window.requestAnimationFrame(() => update());
    }

    update();
    window.addEventListener("resize", () => resize());
  });
}

export default fallEffect;
