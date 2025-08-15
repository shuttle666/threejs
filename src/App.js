import * as THREE from 'three'
import Stats from 'three/examples/jsm/libs/stats.module.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export default class App {
  
  // 存储实例
  static #instance = undefined
  // 根节点DOM
  #rootDom = undefined

  // 渲染器
  #renderer = undefined
  get renderer() {
    return this.#renderer
  }
  
  // 场景
  #scene = undefined
  get scene() {
    return this.#scene
  }

  // 摄像
  #camera = undefined
  get camera() {
    return this.#camera
  }

  //摄像机控制器
  #control = undefined
  get control() {
    return this.#control
  }

  // 背景颜色
  #backgroundColor = undefined
  // resize事件
  #resizeHandler = undefined

  #stats = new Stats()

  // 创建根节点DOM
  #createRootDom = () => document.querySelector('#app')
  // 创建渲染器
  #createRenderer = () => new THREE.WebGLRenderer({ antialias: true })
  // 创建场景
  #createScene = () => new THREE.Scene()
  // 创建摄像机
  #createCamera = () => new THREE.PerspectiveCamera(
    75,
    this.#getWindowAspectRatio(),
    0.1,
    1000
  )

  // 创建相机控制器
  #createCameraControls = () => new OrbitControls(this.#camera, this.#renderer.domElement)

  // 获取窗口宽高比
  #getWindowAspectRatio = () => window.innerWidth / window.innerHeight
  // 设置像素比
  #rendererSetPixelRatio = () => this.#renderer.setPixelRatio(window.devicePixelRatio)
  // 设置渲染器大小
  #rendererSetSize = () => this.#renderer.setSize(window.innerWidth, window.innerHeight)
  // 添加渲染器到DOM
  #rendererDomAppend = () => this.#rootDom?.appendChild(this.#renderer.domElement)
  // 设置摄像机位置
  #cameraSetPosition = () => this.#camera.position.set(0, 0.3, 0.8)

  #sceneSetBackground = (color) => {
    this.#scene.background = color ?
      new THREE.Color(color) :
      new THREE.Color(0x000000)
    this.#backgroundColor = this.#scene.background.getStyle()
  }
  get backgroundColor() {
    return this.#backgroundColor
  }
  set backgroundColor(color) {
    this.#sceneSetBackground(color)
  }

  #controlAddKeyControl = () => {
    this.#control.listenToKeyEvents(window)
    // 控制相机移动
    this.#control.keys = {
      LEFT: 'ArrowLeft', //left arrow
      UP: 'ArrowUp', // up arrow
      RIGHT: 'ArrowRight', // right arrow
      BOTTOM: 'ArrowDown' // down arrow
    }
  }

  #statsSetting = () => {
  this.#stats.showPanel(0)  // 0: FPS, 1: MS, 2: MB, 3+: CUSTOM
  document.body.appendChild(this.#stats.dom)
  }

  // 窗口大小改变时更新渲染器
  #rendererResizeUpdate = () => {
    // 更新渲染器大小
    this.#rendererSetSize()
  }

  // 窗口大小改变时更新摄像机
  #cameraResizeUpdate = () => {
    // 更新摄像机宽高比
    this.#camera.aspect = this.#getWindowAspectRatio()
    // 更新摄像机投影矩阵
    this.#camera.updateProjectionMatrix()
  }

  // 创建关键资源
  #create = () => {
    this.#rootDom = this.#createRootDom()
    this.#renderer = this.#createRenderer()
    this.#scene = this.#createScene()
    this.#camera = this.#createCamera()
    this.#control = this.#createCameraControls()
  }

  // 在 #setting 方法中添加
  #setting = () => {
    this.#rendererSetPixelRatio() // 设置像素比
    this.#rendererSetSize() // 设置渲染器大小
    this.#rendererDomAppend() // 添加渲染器到DOM
    this.#cameraSetPosition() // 设置摄像机位置
    this.#sceneSetBackground(0x50316e) // 设置场景背景
    
    // 设置控制器默认属性
    this.#control.autoRotate = true
    this.#control.autoRotateSpeed = 150
    this.#control.enableDamping = true
    this.#control.dampingFactor = 0.1
    
    // 设置加入键盘控制
    this.#controlAddKeyControl()
    this.#statsSetting()
  }

  #update = () => {
    this.#resizeHandler = () => {
      // 窗口大小改变时更新渲染器
      this.#rendererResizeUpdate()
      // 窗口大小改变时更新摄像机
      this.#cameraResizeUpdate()
    }
    window.addEventListener('resize', this.#resizeHandler)
    // window.addEventListener('keydown', (event) => {
    //   console.log(event)
    // })
  }

  #animate = () => {
    this.#stats.begin()  // 开始统计

    requestAnimationFrame(this.#animate)
    this.#render()

    this.#stats.end()  // 结束统计
  }

  #render = () => {
    this.#control.update()
    this.#renderer.render(this.#scene, this.#camera)
  }

  #init = () => {
    // console.log('App init');
    // 创建关键资源
    this.#create()
    // 设置关键信息
    this.#setting()
    // 更新关键事件
    this.#update()
    // 加载动画渲染
    this.#animate()
  }

  // 判断是否是单例
  #isSignalInstance = () => {
    if (App.#instance) {
      // 已经存在一个实例,不能再创建了
      return false
    }
    App.#instance = this
    return true
  }

  constructor() {
    // 单例模式
    if (!this.#isSignalInstance()) return App.#instance

    this.#init()
  }
}