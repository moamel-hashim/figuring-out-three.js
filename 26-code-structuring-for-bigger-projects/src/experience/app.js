import Sizes from "./utils/Sizes"
import Time from "./utils/time"
import * as THREE from 'three'
import Camera from "./Camera"
import Renderer from './Renderer.js'
import World from './world/World'
import Resources from './utils/Resources.js'
import sources from './sources'
import Debug from './utils/Debug'

console.log(Renderer)

let instance = null

export default class App {
  constructor(canvas) {
    if(instance) {
      return instance
    }

    instance = this
    // global access
    window.app = this
    //options
    this.canvas = canvas
    //setup
    this.debug = new Debug()
    this.sizes = new Sizes()
    this.time = new Time()
    this.scene = new THREE.Scene()
    this.resources = new Resources(sources)
    this.camera = new Camera()
    this.renderer = new Renderer()
    this.world = new World()

    //sizes
    this.sizes.on('resize', () => {
      this.resize()
    })
    //time tick event
    this.time.on('tick', () => {
      this.update()
    })
  }
  resize() {
    this.camera.resize()
    this.renderer.resize()
  }

  update() {
    this.camera.update()
    this.world.update()
    this.renderer.update()
  }

  destroy() {
    this.sizes.off('resize')
    this.time.off('tick')

    this.scene.traverse((child) => {
      if(child instanceof THREE.Mesh) {
        child.geometry.dispose()

        for(const key in child.material) {

          const value = child.material[key]

          if(value && typeof value.dispose === 'function') {
            value.dispose()
          }
        }
      }
    })

    this.camera.controls.dispose()
    this.renderer.instance.dispose()

    if(this.debug.active) {
      this.debug.ui.destroy()
    }
  }
}
