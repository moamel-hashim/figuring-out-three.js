const scene = new THREE.Scene();

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({color: 'red'})
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

//size
const size = {
  width: 800,
  height: 600
}


//camera

const camera = new THREE.PerspectiveCamera(75, size.width / size.height)
camera.position.z = 3;
camera.position.x = -1;
camera.position.y = -1;
scene.add(camera)

//render
const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
})

renderer.setSize(size.width, size.height);

renderer.render(scene, camera)