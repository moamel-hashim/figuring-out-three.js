import App from "../app";
import Environment from "./Environment";
import Floor from "./Floor";
import Fox from "./Fox";

export default class World {
  constructor() {
    this.app = new App()
    this.scene = new this.app.scene
    this.resources = this.app.resources

    //setup
    this.resources.on('ready', () => {
      this.floor = new Floor()
      this.fox = new Fox()
      this.environment = new Environment()
    })

  }

  update() {
    if(this.fox) {
      this.fox.update
    }
  }
}
