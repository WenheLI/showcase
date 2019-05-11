
const placegroundScenePipelineModule = () => {
    const modelFiles = ['models/van.glb', 'models/tree.glb']                             
    const startScale = new THREE.Vector3(0.0001, 0.0001, 0.0001) 
    const endScale = new THREE.Vector3(0.002, 0.002, 0.002)    
    const animationMillis = 750                                 
  
    const raycaster = new THREE.Raycaster()
    const tapPosition = new THREE.Vector2()
    const loader = new THREE.GLTFLoader() 
  
    let surface  
  
   
    const initXrScene = ({ scene, camera }) => {
      console.log('initXrScene')
      surface = new THREE.Mesh(
        new THREE.PlaneGeometry( 100, 100, 1, 1 ),
        new THREE.MeshBasicMaterial({
          color: 0xffff00,
          transparent: true,
          opacity: 0.0,
          side: THREE.DoubleSide
        })
      )
  
      surface.rotateX(-Math.PI / 2)
      surface.position.set(0, 0, 0)
      scene.add(surface)
  
      scene.add(new THREE.AmbientLight( 0x404040, 5 ))  
  

      camera.position.set(0, 3, 0)
    }
  
    const animateIn = (model, pointX, pointZ, yDegrees) => {
      console.log(`animateIn: ${pointX}, ${pointZ}, ${yDegrees}`)
      const scale = Object.assign({}, startScale)
      model.scene.rotation.set(0.0, yDegrees, 0.0)
      model.scene.position.set(pointX, 0.0, pointZ)
      model.scene.scale.set(scale.x, scale.y, scale.z)
      XR.Threejs.xrScene().scene.add(model.scene)
  
      new TWEEN.Tween(scale)
        .to(endScale, animationMillis)
        .easing(TWEEN.Easing.Elastic.Out) 
        .onUpdate(() => { model.scene.scale.set(scale.x, scale.y, scale.z) })
        .start()
    }
  
   
    const placeObject = (pointX, pointZ) => {
      console.log(`placing at ${pointX}, ${pointZ}`)
      loader.load(
        modelFiles[parseInt(modelFiles.length* Math.random())],                                                            
        (gltf) => { animateIn(gltf, pointX, pointZ, Math.random() * 360) },   
        (xhr) => {console.log(`${(xhr.loaded / xhr.total * 100 )}% loaded`)},  
        (error) => {console.log('An error happened')}                          
      )
    }
  
    const placeObjectTouchHandler = (e) => {
      console.log('placeObjectTouchHandler')

      if (e.touches.length == 2) {
        XR.XrController.recenter()
      }
  
      if (e.touches.length > 2) {
        return
      }
  
      const {scene, camera} = XR.Threejs.xrScene()
  
      tapPosition.x = (e.touches[0].clientX / window.innerWidth) * 2 - 1
      tapPosition.y = - (e.touches[0].clientY / window.innerHeight) * 2 + 1
  
      raycaster.setFromCamera(tapPosition, camera)
  
      const intersects = raycaster.intersectObject(surface)
      if (intersects.length == 1 && intersects[0].object == surface) {
        placeObject(intersects[0].point.x, intersects[0].point.z)
      }
    }
  
    return {
      name: 'placeground',
  
   
      onStart: ({canvas, canvasWidth, canvasHeight}) => {
        const {scene, camera} = XR.Threejs.xrScene() 
  
        initXrScene({ scene, camera }) 
  
        canvas.addEventListener('touchstart', placeObjectTouchHandler, true)  
  
        animate()
        function animate(time) {
          requestAnimationFrame(animate)
          TWEEN.update(time)
        }
  
        XR.XrController.updateCameraProjectionMatrix({
          origin: camera.position,
          facing: camera.quaternion,
        })
      },
    }
  }
  
  const onxrloaded = () => {
    XR.addCameraPipelineModules([  
      XR.GlTextureRenderer.pipelineModule(),      
      XR.Threejs.pipelineModule(),                 
      XR.XrController.pipelineModule(),           
      XRExtras.AlmostThere.pipelineModule(),       
      XRExtras.FullWindowCanvas.pipelineModule(),  
      XRExtras.Loading.pipelineModule(),           
      XRExtras.RuntimeError.pipelineModule(),      
      placegroundScenePipelineModule(),
    ])
  
    XR.run({canvas: document.getElementById('camerafeed')})
  }
  
  const load = () => { XRExtras.Loading.showLoading({onxrloaded}) }
  window.onload = () => { window.XRExtras ? load() : window.addEventListener('xrextrasloaded', load) }