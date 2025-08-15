import {GUI} from 'dat.gui'
import App from '@/App'
import * as THREE from 'three'

export default class Panel {

  #app = undefined
  #scene = undefined
  #camera = undefined
  #renderer = undefined
  #control = undefined

  #loader = undefined
  #model = undefined

  #gui = new GUI()

  #axesHelper = undefined
  #gridHelper = undefined
  #cameraHelper = undefined
  #box3Helper = undefined

  showInfo = () => {
    console.log("app",this.#app)
    console.log("loader",this.#loader)
    console.log("model",this.#model)
    console.log("scene",this.#scene)
    console.log("camera",this.#camera)
    console.log("renderer",this.#renderer)
    console.log("control",this.#control)
  }

  // 创建坐标轴辅助器
  #createAxesHelper = () => {
    this.#axesHelper = new THREE.AxesHelper(50) // 50是轴的长度
    this.#scene.add(this.#axesHelper)
    this.#axesHelper.visible = false // 默认隐藏
  }

  // 创建网格辅助器
  #createGridHelper = () => {
    this.#gridHelper = new THREE.GridHelper(200, 20) // 200是网格大小，20是分割数
    this.#scene.add(this.#gridHelper)
    this.#gridHelper.visible = false // 默认隐藏
  }

  // 创建相机辅助器
  #createCameraHelper = () => {
    // 创建一个新的相机用于辅助显示
    const helperCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    helperCamera.position.copy(this.#camera.position)
    this.#cameraHelper = new THREE.CameraHelper(helperCamera)
    this.#scene.add(this.#cameraHelper)
    this.#cameraHelper.visible = false // 默认隐藏
  }

  // 创建包围盒辅助器
  #createBox3Helper = () => {
    if (this.#model) {
      const box = new THREE.Box3().setFromObject(this.#model)
      this.#box3Helper = new THREE.Box3Helper(box, 0xffff00) // 黄色包围盒
      this.#scene.add(this.#box3Helper)
      this.#box3Helper.visible = false // 默认隐藏
    }
  }

  // 更新包围盒辅助器
  #updateBox3Helper = () => {
    if (this.#model && this.#box3Helper) {
      this.#scene.remove(this.#box3Helper)
      const box = new THREE.Box3().setFromObject(this.#model)
      this.#box3Helper = new THREE.Box3Helper(box, 0xffff00)
      this.#scene.add(this.#box3Helper)
      this.#box3Helper.visible = false
    }
  }

  #panelAdd = () => {
    const cameraFolder = this.#gui.addFolder('CAMERA')
    cameraFolder.open()
    const cameraPositionX = cameraFolder.add(this.#camera.position, 'x').name('positionX').listen()
    const cameraPositionY = cameraFolder.add(this.#camera.position, 'y').name('positionY').listen()
    const cameraPositionZ = cameraFolder.add(this.#camera.position, 'z').name('positionZ').listen()

    const controlFolder = this.#gui.addFolder('CONTROL')
    controlFolder.open()
    controlFolder.add(this.#control, 'autoRotate').name('Auto Rotate').listen()
    controlFolder.add(this.#control, 'autoRotateSpeed', 1, 200, 10).name('Rotate Speed').listen()
    
    // 重置相机位置
    const resetControls = {
      resetPosition: () => {
        this.#camera.position.set(0, 0.45, 0.8)
        this.#control.target.set(0, 0, 0)
        this.#control.update()
      }
    }
    controlFolder.add(resetControls, 'resetPosition').name('Reset Position')
    // 背景颜色控制
    controlFolder.addColor(this.#app, 'backgroundColor').name('Background')

    // 添加Helper控制文件夹
    const helperFolder = this.#gui.addFolder('HELPERS')
    helperFolder.open()
    
    // 坐标轴辅助器控制
    const axesControls = {
      showAxes: false
    }
    helperFolder.add(axesControls, 'showAxes').name('Show Axes').onChange((value) => {
      if (this.#axesHelper) {
        this.#axesHelper.visible = value
      }
    })

    // 网格辅助器控制
    const gridControls = {
      showGrid: false
    }
    helperFolder.add(gridControls, 'showGrid').name('Show Grid').onChange((value) => {
      if (this.#gridHelper) {
        this.#gridHelper.visible = value
      }
    })

    // 相机辅助器控制
    const cameraHelperControls = {
      showCameraHelper: false
    }
    helperFolder.add(cameraHelperControls, 'showCameraHelper').name('Camera Helper').onChange((value) => {
      if (this.#cameraHelper) {
        this.#cameraHelper.visible = value
      }
    })

    // 包围盒辅助器控制
    const box3Controls = {
      showBoundingBox: false
    }
    helperFolder.add(box3Controls, 'showBoundingBox').name('Bounding Box').onChange((value) => {
      if (this.#box3Helper) {
        this.#box3Helper.visible = value
      }
    })
  }

  constructor(app = new App(), loader) {
    this.#app = app
    this.#loader = loader
    this.#model = loader.model

    this.#scene = app.scene
    this.#camera = app.camera
    this.#renderer = app.renderer
    this.#control = app.control

    // 创建所有辅助器
    this.#createAxesHelper()
    this.#createGridHelper()
    this.#createCameraHelper()
    this.#createBox3Helper()

    this.#panelAdd()
  }
}
