// Saman Tofighian
import GUI from "lil-gui";
import * as three from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
const Sc = new three.Scene();
let parameters = {
  frame: "#000",
  daste: "#000",
  glass: "#000",
};
let gui = new GUI({
  title: "sunglasses Changes",
  background: "#fff",
});
gui.hide();
gui.close();
window.addEventListener("load", () => {
  setTimeout(() => {
    gui.show();
  }, 2000);
});
const draco = new DRACOLoader();
draco.setDecoderPath("/draco/");
const gltf = new GLTFLoader();
gltf.setDRACOLoader(draco);
let model = null;
gltf.load("/models/sunglasses.glb", (sunglasses) => {
  model = sunglasses.scene;
  Sc.add(model);
  let s = 3;
  model.scale.set(s, s, s);
  model.rotation.y = Math.PI / 2;
  console.log(model);

  gui
    .addColor(parameters, "frame")
    .onChange(() => {
      model.children[0].children[0].children[0].children[0].children[0].material.color.set(
        parameters.frame
      );
    })
    .name("frame color : ");

  gui
    .addColor(parameters, "daste")
    .onChange(() => {
      model.children[0].children[0].children[0].children[1].children[1].material.color.set(
        parameters.daste
      );
    })
    .name("daste color : ");

  gui
    .addColor(parameters, "glass")
    .onChange(() => {
      model.children[0].children[0].children[0].children[3].children[0].material.color.set(
        parameters.glass
      );
    })
    .name("glass color : ");
});
let cnt = 5000;
let docs = new three.BufferGeometry();
let docPosition = new Float32Array(cnt * 3);
for (let i = 0; i < cnt; i++) {
  let i3 = i * 3;
  docPosition[i3 + 0] = (Math.random() - 0.5) * 40;
  docPosition[i3 + 1] = (Math.random() - 0.5) * 40;
  docPosition[i3 + 2] = (Math.random() - 0.5) * 40;
}
docs.setAttribute("position", new three.BufferAttribute(docPosition, 3));
const star = new three.TextureLoader();
const str = star.load("/2.png");
str.colorSpace = three.SRGBColorSpace;
str.magFilter = three.NearestFilter;
const docsMaterial = new three.PointsMaterial({
  size: 0.3,
  sizeAttenuation: true,
  transparent: true,
  alphaMap: str,
  depthWrite: false,
});
const docsPoints = new three.Points(docs, docsMaterial);
Sc.add(docsPoints);
const size = {
  width: innerWidth,
  height: innerHeight,
};
const camera = new three.PerspectiveCamera(75, size.width / size.height);
camera.position.set(0, 0, 3.4);
Sc.add(camera);
const aml = new three.AmbientLight("#fff", 1);
const hemi = new three.HemisphereLight("#fff", 2);
hemi.position.set(2, 2, 2);
Sc.add(aml, hemi);
const canvas = document.getElementById("web");
const renderer = new three.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true,
});
renderer.setSize(size.width, size.height);
renderer.toneMapping = three.ACESFilmicToneMapping;
renderer.toneMappingExposure = 2;
const orbit = new OrbitControls(camera, canvas);
orbit.enableDamping = true;
orbit.minDistance = 3;
orbit.maxDistance = 4;
const clock = new three.Clock();
const animation = () => {
  orbit.update();
  const elapsed = clock.getElapsedTime();
  renderer.render(Sc, camera);
  requestAnimationFrame(animation);
  if (model) {
    model.rotation.y = elapsed / 5;
  }
};
animation();
window.addEventListener("resize", () => {
  size.width = window.innerWidth;
  size.height = window.innerHeight;
  camera.aspect = size.width / size.height;
  camera.updateProjectionMatrix();
  renderer.setSize(size.width, size.height);
});
// Saman Tofighian
