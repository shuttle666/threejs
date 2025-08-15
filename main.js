import './style.css'
import App from './src/App'
import Loader from './src/gltf/Loader'

// 3D scene initialization
const app = new App()

// GLTFLoader
const modelPath = 'gltf/oiiaioooooiai_cat/scene.gltf'
const loader = new Loader(app, modelPath)

// loader()
