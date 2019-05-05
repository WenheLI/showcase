let scene, camera, renderer, clock, deltaTime, totalTime;

let arToolkitSource, artoolkitContext;

let mirrorMarker, fireMarker;

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
    let loader = new THREE.TextureLoader();

    let texture = loader.load('../shader9/donut.jpg', render);

    let material1 = new THREE.MeshBasicMaterial({
        map: texture,
    });

    let mirror = new THREE.Mesh(cube, makeReflectionMaterial());
    mirror.name = 'mirror';
    mirrorMarker.add(mirror);

    fireMarker = new THREE.Group();
    fireMarker.name = 'fireMarker';
    scene.add(fireMarker);

    let fireMakerController = new THREEx.ArMarkerControls(artoolkitContext, fireMarker, {
        type: 'pattern',
        patternUrl: 'data/patterns/fire_pattern.patt'
    });

    let fire = new THREE.Mesh(cube, material1);
    fire.name = 'fire';
    fireMarker.add(fire);



};

let update = () => {
    if (arToolkitSource.ready) {
        artoolkitContext.update(arToolkitSource.domElement);
        scene.getObjectByName('mirror').rotation.x += Math.PI/100;
        
    }
};

let render = () => {
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