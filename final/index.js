let scene, camera, renderer, clock, deltaTime, totalTime;

let arToolkitSource, artoolkitContext;

let mirrorMarker;

let materials = {};
let controllers = {};

let mouse = new THREE.Vector2();
let raycaster = new THREE.Raycaster();

window.addEventListener('mousemove', (e) => {
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}, false);

let makeMarker = (markerName) => {
    let marker = new THREE.Group();
    marker.name = markerName+'Marker';
    scene.add(marker);

    let fireMakerController = new THREEx.ArMarkerControls(artoolkitContext, marker, {
        type: 'pattern',
        patternUrl: `data/patterns/${markerName}.patt`
    });

    controllers[markerName] = fireMakerController;

    console.log(markerName)

    let mtlLoader = new THREE.MTLLoader();

    mtlLoader.load(`data/model/${markerName}/${markerName}.mtl`, (material) => {
        material.preload();
        let objLoader = new THREE.OBJLoader();
        objLoader.setMaterials(material);
        objLoader.load(`data/model/${markerName}/${markerName}.obj`,(obj) => {
            obj.name = markerName;
            if (markerName === 'cat') obj.scale.set(.003, .003, .003);
            else obj.scale.set(.03, .03, .03);
            marker.add(obj);
        });
    });
}

let makeReflectionMaterial = () => {
    let videoTexture = new THREE.VideoTexture(arToolkitSource.domElement);
    videoTexture.minFilter = THREE.LinearFilter;

    let refractMaterial = new THREE.ShaderMaterial({
        uniforms: {
            texture: {value: videoTexture},
            refractionRatio: {value: .75},
            distance: {value: 1.0},
            opacity: {value: .8},
            tint: {value: new THREE.Vector3(.8, .8, .8)}
        },
        vertexShader: document.getElementById( 'vertexShader' ).textContent,
		fragmentShader: document.getElementById( 'fragmentShader' ).textContent,
		transparent: true
    });

    return refractMaterial;
}

let initalize = () => {
    scene = new THREE.Scene();

    let ambientLight = new THREE.AmbientLight(0xcccccc, 1.0);
    scene.add(ambientLight);

    camera = new THREE.Camera();
    scene.add(camera);

    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });

    renderer.setClearColor(new THREE.Color('lightgrey'), 0);
    renderer.setSize(640, 480);
    renderer.domElement.style.position = 'absolute'
    renderer.domElement.style.top = '0px'
    renderer.domElement.style.left = '0px'
    document.body.appendChild(renderer.domElement);

    clock = new THREE.Clock();
    deltaTime = 0;
    totalTime = 0;

    // AR toolkit
    arToolkitSource = new THREEx.ArToolkitSource({
        sourceType: 'webcam',
    });

    let onResize = () => {
        arToolkitSource.onResizeElement();
        arToolkitSource.copyElementSizeTo(renderer.domElement);
        if (artoolkitContext.arController !== null) {
            arToolkitSource.copyElementSizeTo(artoolkitContext.arController.canvas);
        }
    };

    arToolkitSource.init(function onReady() {
        onResize();
    });

    window.addEventListener('resize', () => {
        onResize();
    });

    // arContext
    artoolkitContext = new THREEx.ArToolkitContext({
        cameraParametersUrl: 'data/camera_para.dat',
        detectionMode: 'mono'
    });

    artoolkitContext.init(function onCompleted() {
        camera.projectionMatrix.copy(artoolkitContext.getProjectionMatrix());
    });

    //maker controller
    mirrorMarker = new THREE.Group();
    mirrorMarker.name = 'mirrorMarker';
    scene.add(mirrorMarker);

    let mirrorMarkerController = new THREEx.ArMarkerControls(artoolkitContext, mirrorMarker, {
        type: 'pattern',
        patternUrl: 'data/patterns/hiro.patt'
    });

    let cube = new THREE.BoxBufferGeometry(1, 1, 1);


    let mirror = new THREE.Mesh(cube, makeReflectionMaterial());
    mirror.name = 'mirror';
    mirrorMarker.add(mirror);

    //fire 
    makeMarker('fire');
    //woods
    makeMarker('woods');
    //water
    makeMarker('water');
    //cat
    makeMarker('cat');
};

let speedX = .01;
let speedY = .01;

let update = () => {
    if (arToolkitSource.ready) {
        artoolkitContext.update(arToolkitSource.domElement);

        scene.getObjectByName('mirror').rotation.x += Math.PI/100;
        scene.getObjectByName('fire').rotation.y += Math.PI/100;

        if (Object.keys(materials).length === 0) {
            materials['fire'] = scene.getObjectByName('fire').children[0].material;
            materials['woods'] = scene.getObjectByName('woods').children[0].material;
        }

        let cat = scene.getObjectByName('cat');

        if (cat.position.length() > 4) cat.position.set(0, 0, 0);
        else {
            cat.position.x += speedX;
            cat.position.y += speedY;
        }

        let fireMarker = scene.getObjectByName('fireMarker');
        let woodsMarker = scene.getObjectByName('woodsMarker');

        if (fireMarker.position.length() !== 0 && woodsMarker.position.length() !== 0) {
            let woods = scene.getObjectByName('woods');

            if (fireMarker.position.distanceTo(woodsMarker.position) <= 1.5) {
                woods.traverse((c) => {
                    if (c instanceof THREE.Mesh) c.material = materials['fire'];          
                });
            } else {
                woods.traverse((c) => {
                    if (c instanceof THREE.Mesh) c.material = materials['woods'];            
                });
            }
        }        
    }
};
console.log(ARjs)
let render = () => {
    raycaster.setFromCamera(camera.position, mouse);
    let intersects = raycaster.intersectObjects(scene.children);
    console.log(intersects)
    renderer.render(scene, camera);
};

let animate = () => {
    requestAnimationFrame(animate);
    deltaTime = clock.getDelta();
    totalTime += deltaTime;
    update();
    render();
};

initalize();
animate();