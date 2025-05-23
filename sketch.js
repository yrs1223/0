let facemesh;
let video;
let predictions = [];
const points = [
  409, 270, 269, 267, 0, 37, 39, 40, 185, 61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291,
  76, 77, 90, 180, 85, 16, 315, 404, 320, 307, 306, 408, 304, 303, 302, 11, 72, 73, 74, 184
];

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO, () => {
    console.log("Camera initialized");
  });
  video.size(640, 480);
  video.hide(); // 隱藏相機畫面，使用 p5 的畫布顯示

  facemesh = ml5.facemesh(video, modelReady);
  facemesh.on("predict", results => {
    predictions = results;
  });
}

function modelReady() {
  console.log("Facemesh model loaded!");
}

function draw() {
  background(220);
  image(video, 0, 0, width, height); // 顯示相機畫面

  stroke(255, 0, 0); // 紅色線條
  strokeWeight(15); // 線條粗細
  noFill();

  if (predictions.length > 0) {
    const keypoints = predictions[0].scaledMesh;

    // 使用 line() 指令逐點連接
    for (let i = 0; i < points.length - 1; i++) {
      const indexA = points[i];
      const indexB = points[i + 1];
      const [xA, yA] = keypoints[indexA];
      const [xB, yB] = keypoints[indexB];
      line(xA, yA, xB, yB);
    }

    // 將最後一點與第一點連接，形成封閉形狀
    const firstIndex = points[0];
    const lastIndex = points[points.length - 1];
    const [xFirst, yFirst] = keypoints[firstIndex];
    const [xLast, yLast] = keypoints[lastIndex];
    line(xLast, yLast, xFirst, yFirst);
  }
}
