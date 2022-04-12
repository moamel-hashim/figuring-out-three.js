import EventEmitter from "./EventEmitter";
import  {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'

export default class Resources extends EventEmitter {
  constructor(sources) {
    super()
    //options
    this.sources = sources

    //setup
    this.item = {}
    this.toLoad = this.sources.length
    this.load = 0

    this.setLoaders()
    this.startLoading()
  }

  setLoaders() {
    this.loader = {}
    this.loader.gltfLoader = new GLTFLoader()
    this.loader.textureLoader = new THREE.TextureLoader()
    this.loader.cubeTextureLoader = new THREE.CubeTextureLoader()
  }

  startLoading() {
    for(const source of this.sources) {
      if(source.type === 'gltfModel') {
        this.loader.gltfLoader.load(source.path, (file) => {
          this.sourcesLoaded(source, file)
        })
      } else if (source.type === 'texture') {
        this.loader.textureLoader.load(source.path, (file) => {
          this.sourcesLoaded(source, file)
        })
      } else if (source.type === 'cubeTexture') {
        this.loader.CubeTextureLoader.load(source.path, (file) => {
          this.sourcesLoaded(source, file)
        })
    }
  }

  sourceLoaded(source, file) {
    this.items[source.name] = file
    this.loaded++
    if (this.loaded === this.toLoad) {
      this.trigger('ready')
    }
  }
}
