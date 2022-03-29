import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI({width: 400})

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * galaxy
 */
const params = {
    count: 100000,
    size: 0.01,
    radius: 5,
    branches: 3,
    spin: 1,
    randomness: 0.2,
    randomnessPower: 3,
    insideColor: '#ff6030',
    outsideColor: '#1b3984'
}

let geometry = null
let material = null
let points = null

const generateGalaxy = () => {
    if(points !== null) {
        geometry.dispose()
        material.dispose()
        scene.remove(points)
    }
     geometry = new THREE.BufferGeometry()

    const positions = new Float32Array(params.count * 3)
    const colors = new Float32Array(params.count * 3)

    const colorsInside = new THREE.Color(params.insideColor)
    const colorsOutside = new THREE.Color(params.outsideColor)


    for(let i = 0; i < params.count; i++) {
        const i3 = i * 3
        //positon
        const radius = Math.random() * params.radius
        const spinAngel = radius * params.spin
        const branchAngel = (i % params.branches) / params.branches * Math.PI * 2

        const randomX = Math.pow(Math.random(), params.randomnessPower) * (Math.random() < 0.5 ? 1 : -1)
        const randomY = Math.pow(Math.random(), params.randomnessPower) * (Math.random() < 0.5 ? 1 : -1)
        const randomZ = Math.pow(Math.random(), params.randomnessPower) * (Math.random() < 0.5 ? 1 : -1)

        positions[i3] = Math.cos(branchAngel + spinAngel) * radius + randomX
        positions[i3 + 1] = 0 + randomY
        positions[i3 + 2] = Math.sin(branchAngel + spinAngel) * radius + randomZ
        // color
        const mixedColor = colorsInside.clone()
        mixedColor.lerp(colorsOutside, radius / params.radius)
        colors[i3] = mixedColor.r
        colors[i3 + 1] = mixedColor.g
        colors[i3 + 2] = mixedColor.b
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    //material
        material = new THREE.PointsMaterial({
        size: params.size,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true
    })
    //points
     points = new THREE.Points(geometry, material)
    scene.add(points)
}

generateGalaxy()

gui.add(params, 'count').min(100).max(1000000).step(100).onFinishChange(generateGalaxy)
gui.add(params, 'size').min(0.001).max(0.1).step(0.001).onFinishChange(generateGalaxy)
gui.add(params, 'radius').min(0.01).max(20).step(0.01).onFinishChange(generateGalaxy)
gui.add(params, 'branches').min(2).max(20).step(1).onFinishChange(generateGalaxy)
gui.add(params, 'branches').min(2).max(20).step(1).onFinishChange(generateGalaxy)
gui.add(params, 'spin').min(-5).max(5).step(0.001).onFinishChange(generateGalaxy)
gui.add(params, 'randomness').min(0).max(2).step(0.001).onFinishChange(generateGalaxy)
gui.add(params, 'randomnessPower').min(1).max(10).step(0.001).onFinishChange(generateGalaxy)
gui.addColor(params, 'insideColor').onFinishChange(generateGalaxy)
gui.addColor(params, 'outsideColor').onFinishChange(generateGalaxy)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 3
camera.position.y = 3
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
