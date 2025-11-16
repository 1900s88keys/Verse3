<script setup lang="ts">
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { ref, onMounted, onUnmounted } from 'vue'

const stats = ref([
  { title: '总用户数', value: '1,234', change: '+12.5%', color: '#1890ff' },
  { title: '活跃项目', value: '56', change: '+8.2%', color: '#52c41a' },
  { title: '完成率', value: '89.3%', change: '+2.1%', color: '#faad14' },
  { title: '响应时间', value: '1.2s', change: '-15.3%', color: '#f5222d' },
])

// Three.js 相关变量
let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let controls: OrbitControls
let animationId: number
const statCubes: THREE.Mesh[] = []
let particles: THREE.Points

const initThreeJS = () => {
  const container = document.getElementById('threejs-container')
  if (!container) return

  // 创建场景
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x0a0a0a)
  scene.fog = new THREE.Fog(0x0a0a0a, 10, 50)

  // 创建相机
  camera = new THREE.PerspectiveCamera(
    75,
    container.clientWidth / container.clientHeight,
    0.1,
    1000,
  )
  camera.position.set(0, 5, 15)

  // 创建渲染器
  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(container.clientWidth, container.clientHeight)
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  container.appendChild(renderer.domElement)

  // 创建控制器
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.05
  controls.maxDistance = 30
  controls.minDistance = 5

  // 添加灯光
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
  scene.add(ambientLight)

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
  directionalLight.position.set(10, 10, 5)
  directionalLight.castShadow = true
  directionalLight.shadow.camera.near = 0.1
  directionalLight.shadow.camera.far = 50
  directionalLight.shadow.camera.left = -10
  directionalLight.shadow.camera.right = 10
  directionalLight.shadow.camera.top = 10
  directionalLight.shadow.camera.bottom = -10
  scene.add(directionalLight)

  // 创建统计数据立方体
  createStatCubes()

  // 创建粒子背景
  createParticles()

  // 创建网格地面
  createGridFloor()
}

const createStatCubes = () => {
  const geometry = new THREE.BoxGeometry(2, 2, 2)

  stats.value.forEach((stat, index) => {
    const material = new THREE.MeshPhongMaterial({
      color: stat.color,
      emissive: stat.color,
      emissiveIntensity: 0.2,
      shininess: 100,
    })

    const cube = new THREE.Mesh(geometry, material)
    cube.position.x = (index - 1.5) * 4
    cube.position.y = Math.sin(index) * 2 + 3
    cube.castShadow = true
    cube.receiveShadow = true

    // 添加用户数据
    cube.userData = { stat, index }

    scene.add(cube)
    statCubes.push(cube)
  })
}

const createParticles = () => {
  const particlesGeometry = new THREE.BufferGeometry()
  const particlesCount = 1000

  const positions = new Float32Array(particlesCount * 3)
  const colors = new Float32Array(particlesCount * 3)

  for (let i = 0; i < particlesCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 50
    positions[i + 1] = (Math.random() - 0.5) * 50
    positions[i + 2] = (Math.random() - 0.5) * 50

    const color = new THREE.Color()
    color.setHSL(Math.random(), 0.7, 0.5)
    colors[i] = color.r
    colors[i + 1] = color.g
    colors[i + 2] = color.b
  }

  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.1,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
  })

  particles = new THREE.Points(particlesGeometry, particlesMaterial)
  scene.add(particles)
}

const createGridFloor = () => {
  const gridHelper = new THREE.GridHelper(30, 30, 0x444444, 0x222222)
  gridHelper.position.y = -2
  scene.add(gridHelper)
}

const animate = () => {
  animationId = requestAnimationFrame(animate)

  // 旋转立方体
  statCubes.forEach((cube, index) => {
    cube.rotation.x += 0.01
    cube.rotation.y += 0.01
    cube.position.y = Math.sin(Date.now() * 0.001 + index) * 2 + 3
  })

  // 旋转粒子
  particles.rotation.y += 0.0005
  particles.rotation.x += 0.0002

  // 更新控制器
  controls.update()

  // 渲染场景
  renderer.render(scene, camera)
}

const handleResize = () => {
  const container = document.getElementById('threejs-container')
  if (!container) return

  camera.aspect = container.clientWidth / container.clientHeight
  camera.updateProjectionMatrix()
  renderer.setSize(container.clientWidth, container.clientHeight)
}

onMounted(() => {
  initThreeJS()
  animate()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  window.removeEventListener('resize', handleResize)

  // 清理 Three.js 资源
  if (renderer) {
    renderer.dispose()
  }
  if (controls) {
    controls.dispose()
  }
})
</script>

<template>
  <div class="home-page">
    <!-- 3D 场景容器 -->
    <div id="threejs-container" class="threejs-container"></div>

    <!-- 控制提示 -->
    <div class="controls-hint">
      <p>🖱️ 拖拽旋转视角 | 🎯 滚轮缩放 | 📱 触摸手势控制</p>
    </div>
  </div>
</template>

<style scoped>
.home-page {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: #0a0a0a;
}

/* 3D 容器 */
.threejs-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

/* 统计数据覆盖层 */
.stats-overlay {
  position: absolute;
  top: 20px;
  left: 20px;
  display: flex;
  gap: 20px;
  z-index: 10;
  flex-wrap: wrap;
  max-width: 800px;
}

.stat-item {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 20px;
  min-width: 180px;
  color: white;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.stat-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--stat-color);
  box-shadow: 0 0 10px var(--stat-color);
}

.stat-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  background: rgba(255, 255, 255, 0.15);
}

.stat-title {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: white;
  margin-bottom: 8px;
  text-shadow: 0 0 10px var(--stat-color);
}

.stat-change {
  font-size: 12px;
  font-weight: 500;
}

.stat-change.positive {
  color: #52c41a;
}

.stat-change.negative {
  color: #ff4d4f;
}

/* 活动面板 */
.activity-panel {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 320px;
  max-height: calc(100vh - 40px);
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 24px;
  z-index: 10;
  overflow-y: auto;
  color: white;
}

.activity-panel h2 {
  font-size: 18px;
  font-weight: 600;
  color: white;
  margin-bottom: 16px;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}

.activity-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.2s ease;
}

.activity-item:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateX(5px);
}

.activity-info {
  flex: 1;
}

.activity-user {
  font-weight: 500;
  color: white;
  margin-bottom: 4px;
}

.activity-action {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
}

.activity-time {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
}

/* 快速操作 */
.quick-actions h3 {
  font-size: 16px;
  font-weight: 600;
  color: white;
  margin-bottom: 12px;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.action-button {
  padding: 12px 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
  text-align: left;
  color: white;
  backdrop-filter: blur(10px);
}

.action-button:hover {
  border-color: var(--stat-color);
  background: rgba(255, 255, 255, 0.1);
  transform: translateX(3px);
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.1);
}

.action-button.primary {
  background: linear-gradient(135deg, #1890ff, #40a9ff);
  border-color: #1890ff;
  color: white;
  box-shadow: 0 4px 15px rgba(24, 144, 255, 0.3);
}

.action-button.primary:hover {
  background: linear-gradient(135deg, #40a9ff, #69c0ff);
  box-shadow: 0 6px 20px rgba(24, 144, 255, 0.4);
}

/* 控制提示 */
.controls-hint {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 8px 16px;
  z-index: 10;
  color: rgba(255, 255, 255, 0.8);
  font-size: 12px;
  text-align: center;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .stats-overlay {
    flex-direction: column;
    gap: 12px;
    max-width: 200px;
  }

  .stat-item {
    min-width: 160px;
    padding: 16px;
  }

  .activity-panel {
    width: 280px;
    right: 10px;
    top: 10px;
  }
}

@media (max-width: 768px) {
  .stats-overlay {
    position: relative;
    top: auto;
    left: auto;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    padding: 10px;
    background: rgba(0, 0, 0, 0.8);
  }

  .stat-item {
    min-width: 140px;
    padding: 12px;
  }

  .activity-panel {
    position: relative;
    top: auto;
    right: auto;
    width: 100%;
    max-height: none;
    border-radius: 0;
    margin-top: 20px;
  }

  .controls-hint {
    display: none;
  }

  .home-page {
    height: auto;
    min-height: 100vh;
  }

  .threejs-container {
    height: 60vh;
  }
}

/* 滚动条样式 */
.activity-panel::-webkit-scrollbar {
  width: 6px;
}

.activity-panel::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 3px;
}

.activity-panel::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

.activity-panel::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* 动画效果 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.stat-item {
  animation: fadeIn 0.6s ease-out forwards;
}

.stat-item:nth-child(1) {
  animation-delay: 0.1s;
}
.stat-item:nth-child(2) {
  animation-delay: 0.2s;
}
.stat-item:nth-child(3) {
  animation-delay: 0.3s;
}
.stat-item:nth-child(4) {
  animation-delay: 0.4s;
}

.activity-panel {
  animation: fadeIn 0.8s ease-out 0.5s forwards;
  opacity: 0;
}

.controls-hint {
  animation: fadeIn 1s ease-out 1s forwards;
  opacity: 0;
}
</style>
