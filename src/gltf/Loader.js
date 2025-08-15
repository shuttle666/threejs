import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three'
import * as UTILS from '@/Utils'
import Panel from '@/gui/Panel';

export default class Loader {
  // 存储渲染器
  #renderer = undefined
  // 存储场景
  #scene = undefined
  // 存储摄像机
  #camera = undefined
  // 存储实例
  #app = undefined
  // 存储模型路径
  #modelPath = undefined
  // 环境光
  #envLight = undefined
  // gltf模型
  #gltf = undefined
  // model模型
  #model = undefined
  get model() {
    return this.#model
  }
  // 加载器
  #loader = new GLTFLoader()
  get loader() {
    return this.#loader
  }

  #panel = undefined
  get panel() {
    return this.#panel
  }

  // 初始化
  #init = () => {
    // 渲染器编码
    this.#rendererEncoder()
    // 场景添加光源
    this.#sceneAddLight()
  }

  //渲染器编解码
  #rendererEncoder = () => {
    this.#renderer.outputEncoding = THREE.sRGBEncoding
    this.#renderer.gammaOutput = true
  }

  // 设置环境光强度
  #setEnvLightLevel = (level) => {
    if (UTILS.isNumber(level)) {
      this.#envLight.intensity = level
    }
  }

  // 场景添加光源
  #sceneAddLight = () => {
    this.#envLight = new THREE.AmbientLight(0x404040)
    this.#scene.add(this.#envLight)
    this.#setEnvLightLevel(3)
  }

  // 加载gltf模型
  #loadGltf = async () => {
    return await this.#loader.loadAsync(this.#modelPath)
  }

  // 加载模型
  #load = async () => {
    this.#gltf = await this.#loadGltf()
    this.#model = this.#gltf.scene
    this.#scene.add(this.#model)

    this.#panel = new Panel(this.#app, this)
  }

  constructor(app, modelPath) {
    this.#app = app
    this.#renderer = app.renderer
    this.#scene = app.scene
    this.#camera = app.camera
    this.#modelPath = modelPath

    // this.#loadModel(modelPath)
    this.#init()
    this.#load()
  }
}