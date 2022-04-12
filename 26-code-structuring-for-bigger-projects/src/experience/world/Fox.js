import App from "../app";
import * as THREE from 'three'
import Time from "../utils/time";

export default class Fox {
  constructor() {
    this.app = new App()
    this.scene = this.app.scene
    this.resources = this.app.resources
    this.debug = this.app.debug

    //debug
    if(this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder('fox')
    }

    //setup
    this.resource = this.resources.item.foxModel
    this.setModel()
    this.setAnimation()
  }

  setModel() {
    this.model = this.resource.scene
    this.model.scale.set(0.02, 0.02, 0.02)
    this.scene.add(this.model)

    this.model.traverse((child) => {
      if(child instanceof THREE.Mesh) {
        child.castShadow = true
      }
    })
  }

  setAnimation() {
    this.animation = {}
    this.animation.mixer = new THREE.AnimationMixer(this.model)
    this.animation.actions = {}
    this.animation.actions.idle = this.animation.mixer.clipAction(this.resource.animation[0])
    this.animation.actions.walking = this.animation.mixer.clipAction(this.resource.animation[1])
    this.animation.actions.running = this.animation.mixer.clipAction(this.resource.animation[2])

    this.animation.actions.current = this.animation.actions.running
    this.animation.actions.current.play()

    this.animation.play = (name) => {
      const newAction = this.animation.actions[name]
      const oldAction = this.animation.actions.current

      newAction.reset()
      newAction.play()
      newAction.crossFadeFrom(oldAction, 1)

      this.animation.actions.current = newAction
    }

    //debug
    if(this.debug.active) {
      const debugObject = {
        playIdle: () => { this.animation.play('idle') },
        playWalking: () => { this.animation.play('walking') },
        playRunning: () => { this.animation.play('running') }
      }
      this.debugFolder.add(debugObject, 'playIdle')
      this.debugFolder.add(debugObject, 'playWalking')
      this.debugFolder.add(debugObject, 'PlayRunning')
    }
  }

  update() {
    this.animation.mixer.update(this.time.delta * 0.001)
  }
}
