<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'

// 响应式数据
const canvasRef = ref<HTMLCanvasElement>()
const statusRef = ref<HTMLDivElement>()
const isWorking = ref(false)
const mainFPS = ref(0)
const workerTime = ref(0)
const dataSize = ref(0)

// 渲染参数
const params = ref({
  模糊强度: 5,
  颜色偏移: 0.01,
  噪点强度: 0.1,
  发光阈值: 0.7,
  渲染模式: '正常',
})

// Worker 和渲染相关变量
let worker: Worker | null = null
let canvas: HTMLCanvasElement | null = null
let ctx: CanvasRenderingContext2D | null = null
let offscreenCanvas: HTMLCanvasElement | null = null
let offscreenCtx: CanvasRenderingContext2D | null = null
let animationId: number | null = null
let lastFrameTime = performance.now()
let frameCount = 0

// Worker 代码
const workerCode = `
  function applyBlur(imageData, blurRadius) {
    if (blurRadius <= 0) return imageData;

    const width = imageData.width;
    const height = imageData.height;
    const data = imageData.data;
    const output = new ImageData(width, height);
    const outputData = output.data;

    const kernelSize = Math.ceil(blurRadius) * 2 + 1;
    const kernel = [];
    let sum = 0;

    for (let i = 0; i < kernelSize; i++) {
      const x = i - Math.floor(kernelSize / 2);
      const value = Math.exp(-(x * x) / (2 * blurRadius * blurRadius));
      kernel.push(value);
      sum += value;
    }

    for (let i = 0; i < kernelSize; i++) {
      kernel[i] /= sum;
    }

    const tempData = new Uint8ClampedArray(data);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let r = 0, g = 0, b = 0, a = 0;

        for (let i = 0; i < kernelSize; i++) {
          const kernelX = x + i - Math.floor(kernelSize / 2);
          if (kernelX >= 0 && kernelX < width) {
            const idx = (y * width + kernelX) * 4;
            r += data[idx] * kernel[i];
            g += data[idx + 1] * kernel[i];
            b += data[idx + 2] * kernel[i];
            a += data[idx + 3] * kernel[i];
          }
        }

        const idx = (y * width + x) * 4;
        tempData[idx] = r;
        tempData[idx + 1] = g;
        tempData[idx + 2] = b;
        tempData[idx + 3] = a;
      }
    }

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let r = 0, g = 0, b = 0, a = 0;

        for (let i = 0; i < kernelSize; i++) {
          const kernelY = y + i - Math.floor(kernelSize / 2);
          if (kernelY >= 0 && kernelY < height) {
            const idx = (kernelY * width + x) * 4;
            r += tempData[idx] * kernel[i];
            g += tempData[idx + 1] * kernel[i];
            b += tempData[idx + 2] * kernel[i];
            a += tempData[idx + 3] * kernel[i];
          }
        }

        const idx = (y * width + x) * 4;
        outputData[idx] = r;
        outputData[idx + 1] = g;
        outputData[idx + 2] = b;
        outputData[idx + 3] = a;
      }
    }

    return output;
  }

  function applyColorShift(imageData, shiftAmount) {
    const width = imageData.width;
    const height = imageData.height;
    const data = imageData.data;
    const output = new ImageData(width, height);
    const outputData = output.data;

    const shiftX = Math.floor(shiftAmount * 10);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;

        const redX = Math.min(width - 1, Math.max(0, x + shiftX));
        const redIdx = (y * width + redX) * 4;

        const blueX = Math.min(width - 1, Math.max(0, x - shiftX));
        const blueIdx = (y * width + blueX) * 4;

        outputData[idx] = data[redIdx];
        outputData[idx + 1] = data[idx + 1];
        outputData[idx + 2] = data[blueIdx + 2];
        outputData[idx + 3] = data[idx + 3];
      }
    }

    return output;
  }

  function applyNoise(imageData, noiseIntensity) {
    const data = imageData.data;
    const output = new ImageData(
      new Uint8ClampedArray(data),
      imageData.width,
      imageData.height
    );
    const outputData = output.data;

    for (let i = 0; i < outputData.length; i += 4) {
      const noise = (Math.random() - 0.5) * 255 * noiseIntensity;

      outputData[i] = Math.min(255, Math.max(0, outputData[i] + noise));
      outputData[i + 1] = Math.min(255, Math.max(0, outputData[i + 1] + noise));
      outputData[i + 2] = Math.min(255, Math.max(0, outputData[i + 2] + noise));
    }

    return output;
  }

  function applyGlow(imageData, threshold) {
    const width = imageData.width;
    const height = imageData.height;
    const data = imageData.data;
    const output = new ImageData(width, height);
    const outputData = output.data;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      const brightness = (r + g + b) / 3 / 255;

      if (brightness > threshold) {
        const intensity = (brightness - threshold) / (1 - threshold);
        outputData[i] = Math.min(255, r + 100 * intensity);
        outputData[i + 1] = Math.min(255, g + 100 * intensity);
        outputData[i + 2] = Math.min(255, b + 100 * intensity);
        outputData[i + 3] = data[i + 3];
      } else {
        outputData[i] = r * 0.5;
        outputData[i + 1] = g * 0.5;
        outputData[i + 2] = b * 0.5;
        outputData[i + 3] = data[i + 3];
      }
    }

    return output;
  }

  function applyEdgeDetection(imageData) {
    const width = imageData.width;
    const height = imageData.height;
    const data = imageData.data;
    const output = new ImageData(width, height);
    const outputData = output.data;

    const kernelX = [
      [-1, 0, 1],
      [-2, 0, 2],
      [-1, 0, 1]
    ];

    const kernelY = [
      [-1, -2, -1],
      [0, 0, 0],
      [1, 2, 1]
    ];

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        let gradientX = 0;
        let gradientY = 0;

        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            const pixelIndex = ((y + ky) * width + (x + kx)) * 4;
            const gray = (data[pixelIndex] + data[pixelIndex + 1] + data[pixelIndex + 2]) / 3;

            gradientX += gray * kernelX[ky + 1][kx + 1];
            gradientY += gray * kernelY[ky + 1][kx + 1];
          }
        }

        const magnitude = Math.min(255, Math.sqrt(gradientX * gradientX + gradientY * gradientY));

        const idx = (y * width + x) * 4;
        outputData[idx] = magnitude;
        outputData[idx + 1] = magnitude;
        outputData[idx + 2] = magnitude;
        outputData[idx + 3] = 255;
      }
    }

    return output;
  }

  function applyMosaic(imageData) {
    const width = imageData.width;
    const height = imageData.height;
    const data = imageData.data;
    const output = new ImageData(width, height);
    const outputData = output.data;

    const blockSize = 10;

    for (let y = 0; y < height; y += blockSize) {
      for (let x = 0; x < width; x += blockSize) {
        let r = 0, g = 0, b = 0, count = 0;

        for (let by = 0; by < blockSize && y + by < height; by++) {
          for (let bx = 0; bx < blockSize && x + bx < width; bx++) {
            const idx = ((y + by) * width + (x + bx)) * 4;
            r += data[idx];
            g += data[idx + 1];
            b += data[idx + 2];
            count++;
          }
        }

        r = Math.floor(r / count);
        g = Math.floor(g / count);
        b = Math.floor(b / count);

        for (let by = 0; by < blockSize && y + by < height; by++) {
          for (let bx = 0; bx < blockSize && x + bx < width; bx++) {
            const idx = ((y + by) * width + (x + bx)) * 4;
            outputData[idx] = r;
            outputData[idx + 1] = g;
            outputData[idx + 2] = b;
            outputData[idx + 3] = 255;
          }
        }
      }
    }

    return output;
  }

  self.onmessage = function(e) {
    const startTime = performance.now();
    const { imageData, effects } = e.data;
    let processedImageData = imageData;

    if (effects.渲染模式 === '边缘检测') {
      processedImageData = applyEdgeDetection(imageData);
    } else if (effects.渲染模式 === '马赛克') {
      processedImageData = applyMosaic(imageData);
    } else {
      if (effects.模糊强度 > 0) {
        processedImageData = applyBlur(processedImageData, effects.模糊强度);
      }

      if (effects.颜色偏移 > 0) {
        processedImageData = applyColorShift(processedImageData, effects.颜色偏移);
      }

      if (effects.噪点强度 > 0) {
        processedImageData = applyNoise(processedImageData, effects.噪点强度);
      }

      if (effects.发光阈值 > 0) {
        processedImageData = applyGlow(processedImageData, effects.发光阈值);
      }
    }

    const endTime = performance.now();
    const processingTime = endTime - startTime;

    self.postMessage({
      imageData: processedImageData,
      processingTime: processingTime,
      dataSize: imageData.data.length / 1024
    });
  };
`

// 初始化函数
const initCanvas = () => {
  if (!canvasRef.value) return

  canvas = canvasRef.value
  ctx = canvas.getContext('2d')
  if (!ctx) return

  canvas.width = canvas.offsetWidth
  canvas.height = canvas.offsetHeight

  offscreenCanvas = document.createElement('canvas')
  offscreenCtx = offscreenCanvas.getContext('2d')
  if (!offscreenCtx) return

  offscreenCanvas.width = canvas.width
  offscreenCanvas.height = canvas.height

  initWorker()
}

const initWorker = () => {
  const blob = new Blob([workerCode], { type: 'application/javascript' })
  worker = new Worker(URL.createObjectURL(blob))

  worker.onmessage = (e) => {
    const { imageData, processingTime, dataSize: size } = e.data

    if (ctx && imageData) {
      ctx.putImageData(imageData, 0, 0)
    }

    workerTime.value = Math.round(processingTime)
    dataSize.value = Math.round(size)
    isWorking.value = false

    if (statusRef.value) {
      statusRef.value.classList.remove('working')
    }
  }
}

const drawScene = () => {
  if (!offscreenCtx || !offscreenCanvas) return

  const width = offscreenCanvas.width
  const height = offscreenCanvas.height

  offscreenCtx.fillStyle = '#0a0a2a'
  offscreenCtx.fillRect(0, 0, width, height)

  const time = Date.now() * 0.001
  const centerX = width / 2
  const centerY = height / 2
  const maxRadius = Math.min(width, height) * 0.4

  for (let i = 0; i < 8; i++) {
    const angle = time + (i * Math.PI) / 4
    const radius = maxRadius * 0.7
    const x = centerX + Math.cos(angle) * radius
    const y = centerY + Math.sin(angle) * radius

    offscreenCtx.save()
    offscreenCtx.translate(x, y)
    offscreenCtx.rotate(time + i)

    const gradient = offscreenCtx.createLinearGradient(-30, -30, 30, 30)
    gradient.addColorStop(0, `hsl(${i * 45}, 70%, 50%)`)
    gradient.addColorStop(1, `hsl(${i * 45 + 180}, 70%, 30%)`)

    offscreenCtx.fillStyle = gradient
    offscreenCtx.fillRect(-30, -30, 60, 60)
    offscreenCtx.restore()
  }

  for (let i = 0; i < 12; i++) {
    const angle = time * 0.5 + (i * Math.PI) / 6
    const radius = maxRadius * 0.3
    const x = centerX + Math.cos(angle) * radius
    const y = centerY + Math.sin(angle) * radius

    offscreenCtx.beginPath()
    offscreenCtx.arc(x, y, 10, 0, Math.PI * 2)
    offscreenCtx.fillStyle = `hsl(${i * 30}, 80%, 60%)`
    offscreenCtx.fill()
  }

  offscreenCtx.beginPath()
  offscreenCtx.arc(centerX, centerY, maxRadius * 0.2, 0, Math.PI * 2)
  const centerGradient = offscreenCtx.createRadialGradient(
    centerX,
    centerY,
    0,
    centerX,
    centerY,
    maxRadius * 0.2,
  )
  centerGradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)')
  centerGradient.addColorStop(1, 'rgba(255, 255, 255, 0.2)')
  offscreenCtx.fillStyle = centerGradient
  offscreenCtx.fill()
}

const render = () => {
  drawScene()

  if (offscreenCanvas && offscreenCtx && worker) {
    const imageData = offscreenCtx.getImageData(0, 0, offscreenCanvas.width, offscreenCanvas.height)

    isWorking.value = true
    if (statusRef.value) {
      statusRef.value.classList.add('working')
    }

    worker.postMessage({
      imageData: imageData,
      effects: {
        模糊强度: params.value.模糊强度,
        颜色偏移: params.value.颜色偏移,
        噪点强度: params.value.噪点强度,
        发光阈值: params.value.发光阈值,
        渲染模式: params.value.渲染模式,
      },
    })
  }

  frameCount++
  const currentTime = performance.now()
  const deltaTime = currentTime - lastFrameTime

  if (deltaTime >= 1000) {
    mainFPS.value = Math.round((frameCount * 1000) / deltaTime)
    frameCount = 0
    lastFrameTime = currentTime
  }

  animationId = requestAnimationFrame(render)
}

const updateFPS = () => {
  frameCount++
  const currentTime = performance.now()
  const deltaTime = currentTime - lastFrameTime

  if (deltaTime >= 1000) {
    mainFPS.value = Math.round((frameCount * 1000) / deltaTime)
    frameCount = 0
    lastFrameTime = currentTime
  }

  requestAnimationFrame(updateFPS)
}

onMounted(() => {
  initCanvas()
  render()
  updateFPS()

  // 监听参数变化，确保GUI控制生效
  watch(
    params,
    () => {
      // 参数变化时强制重新渲染
      if (worker && offscreenCanvas && offscreenCtx) {
        const imageData = offscreenCtx.getImageData(
          0,
          0,
          offscreenCanvas.width,
          offscreenCanvas.height,
        )

        isWorking.value = true
        if (statusRef.value) {
          statusRef.value.classList.add('working')
        }

        worker.postMessage({
          imageData: imageData,
          effects: {
            模糊强度: params.value.模糊强度,
            颜色偏移: params.value.颜色偏移,
            噪点强度: params.value.噪点强度,
            发光阈值: params.value.发光阈值,
            渲染模式: params.value.渲染模式,
          },
        })
      }
    },
    { deep: true },
  )
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  if (worker) {
    worker.terminate()
  }
  const workerWithBlob = worker as Worker & { blobURL?: string }
  if (workerWithBlob.blobURL) {
    URL.revokeObjectURL(workerWithBlob.blobURL)
  }
})
</script>

<template>
  <div class="layout-demo">
    <div class="container">
      <header>
        <h1>GUI与离屏渲染 + Web Workers</h1>
        <p class="subtitle">
          此示例展示了如何使用Web
          Workers在后台线程处理离屏渲染效果，通过GUI实时调整参数，保持UI流畅响应。
        </p>
      </header>

      <div class="content">
        <div class="canvas-container">
          <canvas ref="canvasRef" id="renderCanvas"></canvas>
          <div class="info-panel">
            <h3>实时渲染效果</h3>
            <p>
              此Canvas显示经过Web
              Workers处理的离屏渲染结果。所有图像处理计算都在Worker线程中执行，不会阻塞主线程。
            </p>
            <div ref="statusRef" class="status" :class="{ working: isWorking }">
              <div class="status-indicator"></div>
              <span>{{ isWorking ? 'Worker线程工作中...' : 'Worker线程空闲' }}</span>
            </div>
            <div class="performance">
              <div>
                主线程FPS: <span id="mainFPS">{{ mainFPS }}</span>
              </div>
              <div>
                Worker处理时间: <span id="workerTime">{{ workerTime }}</span
                >ms
              </div>
              <div>
                数据传输大小: <span id="dataSize">{{ dataSize }}</span
                >KB
              </div>
            </div>
          </div>
        </div>

        <div class="gui-container">
          <h3>渲染参数控制</h3>
          <div class="controls">
            <div class="control-group">
              <label>模糊强度: {{ params.模糊强度 }}</label>
              <input v-model.number="params.模糊强度" type="range" min="0" max="20" step="1" />
            </div>

            <div class="control-group">
              <label>颜色偏移: {{ params.颜色偏移.toFixed(3) }}</label>
              <input
                v-model.number="params.颜色偏移"
                type="range"
                min="0"
                max="0.05"
                step="0.001"
              />
            </div>

            <div class="control-group">
              <label>噪点强度: {{ params.噪点强度.toFixed(2) }}</label>
              <input v-model.number="params.噪点强度" type="range" min="0" max="0.5" step="0.01" />
            </div>

            <div class="control-group">
              <label>发光阈值: {{ params.发光阈值.toFixed(2) }}</label>
              <input v-model.number="params.发光阈值" type="range" min="0" max="1" step="0.05" />
            </div>

            <div class="control-group">
              <label>渲染模式:</label>
              <select v-model="params.渲染模式">
                <option value="正常">正常</option>
                <option value="边缘检测">边缘检测</option>
                <option value="马赛克">马赛克</option>
              </select>
            </div>
          </div>

          <div class="info-panel">
            <h3>Web Workers 优势</h3>
            <ul>
              <li>避免UI卡顿 - 复杂计算在后台执行</li>
              <li>充分利用多核CPU</li>
              <li>主线程专注于渲染和用户交互</li>
              <li>支持大规模图像处理</li>
            </ul>
          </div>

          <div class="code-block">
            <pre>
// 创建Web Worker
const worker = new Worker('image-processor.js');

// 发送图像数据到Worker
worker.postMessage({
  imageData: imageData,
  effects: params
});

// 接收处理结果
worker.onmessage = function(e) {
  const processedImageData = e.data;
  ctx.putImageData(processedImageData, 0, 0);
};</pre
            >
          </div>
        </div>
      </div>

      <div class="comparison">
        <div class="comparison-item">
          <h3>传统方式</h3>
          <p>图像处理在主线程执行，UI可能会卡顿，尤其是在处理大图像或复杂效果时。</p>
        </div>
        <div class="comparison-item">
          <h3>Web Workers方式</h3>
          <p>图像处理在Worker线程执行，UI保持流畅响应，用户体验更好。</p>
        </div>
      </div>

      <footer>
        <p>GUI与离屏渲染结合Web Workers示例 | 使用Vue 3和Canvas 2D实现</p>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.layout-demo {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #1a2a6c, #b21f1f, #fdbb2d);
  color: white;
  min-height: 100vh;
  padding: 20px;
  line-height: 1.6;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
}

header {
  text-align: center;
  margin-bottom: 30px;
  padding: 20px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 15px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

h1 {
  font-size: 2.8rem;
  margin-bottom: 10px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
  max-width: 800px;
  margin: 0 auto;
}

.content {
  display: flex;
  flex-wrap: wrap;
  gap: 25px;
  margin-bottom: 30px;
}

.canvas-container {
  flex: 1;
  min-width: 300px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

.gui-container {
  flex: 0 0 320px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

canvas {
  width: 100%;
  height: 400px;
  border-radius: 10px;
  background: #000;
  display: block;
}

.info-panel {
  margin-top: 20px;
  padding: 15px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
}

.info-panel h3 {
  margin-bottom: 10px;
  color: #fdbb2d;
}

.status {
  display: flex;
  align-items: center;
  margin-top: 10px;
  padding: 8px 12px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 5px;
}

.status-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 10px;
  background: #4caf50;
  box-shadow: 0 0 8px #4caf50;
}

.status.working .status-indicator {
  background: #ff9800;
  box-shadow: 0 0 8px #ff9800;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}

.code-block {
  background: #1e1e1e;
  padding: 15px;
  border-radius: 10px;
  overflow-x: auto;
  margin-top: 15px;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  border-left: 4px solid #fdbb2d;
}

.code-block pre {
  margin: 0;
  white-space: pre-wrap;
}

.performance {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
  font-size: 0.9rem;
}

.performance div {
  background: rgba(0, 0, 0, 0.3);
  padding: 8px 12px;
  border-radius: 5px;
  flex: 1;
  margin: 0 5px;
  text-align: center;
}

.comparison {
  display: flex;
  gap: 20px;
  margin-top: 30px;
}

.comparison-item {
  flex: 1;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  padding: 15px;
  text-align: center;
}

.comparison-item h3 {
  margin-bottom: 10px;
  color: #fdbb2d;
}

footer {
  text-align: center;
  margin-top: 40px;
  padding: 20px;
  font-size: 0.9rem;
  opacity: 0.8;
}

/* GUI Controls */
.controls {
  margin-bottom: 20px;
}

.control-group {
  margin-bottom: 15px;
}

.control-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #fdbb2d;
}

.control-group input[type='range'] {
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
  outline: none;
  appearance: none;
  -webkit-appearance: none;
}

.control-group input[type='range']::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  background: #fdbb2d;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 0 10px rgba(253, 187, 45, 0.5);
}

.control-group input[type='range']::-moz-range-thumb {
  width: 18px;
  height: 18px;
  background: #fdbb2d;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 0 10px rgba(253, 187, 45, 0.5);
}

.control-group select {
  width: 100%;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 5px;
  color: white;
  font-size: 14px;
  outline: none;
}

.control-group select:focus {
  border-color: #fdbb2d;
  box-shadow: 0 0 5px rgba(253, 187, 45, 0.3);
}

.control-group select option {
  background: #1a2a6c;
  color: white;
}

@media (max-width: 768px) {
  .content {
    flex-direction: column;
  }

  .gui-container {
    flex: 1;
  }

  .comparison {
    flex-direction: column;
  }

  h1 {
    font-size: 2.2rem;
  }

  .subtitle {
    font-size: 1rem;
  }
}
</style>
