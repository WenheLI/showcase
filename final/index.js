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




    let ddsLoader = new THREE.DDSLoader();

    let map1 = ddsLoader.load( 'data/compressed/disturb_dxt1_nomip.dds' );
    map1.minFilter = map1.magFilter = THREE.LinearFilter;
    map1.anisotropy = 4;

    let map2 = ddsLoader.load( 'data/compressed/disturb_dxt1_mip.dds' );
    map2.anisotropy = 4;

    let map3 = ddsLoader.load( 'data/compressed/hepatica_dxt3_mip.dds' );
    map3.anisotropy = 4;

    let fireTexture = ddsLoader.load( 'data/compressed/explosion_dxt5_mip.dds' );
    fireTexture.anisotropy = 4; //fire

    let map5 = ddsLoader.load( 'data/compressed/disturb_argb_nomip.dds' );
    map5.minFilter = map5.magFilter = THREE.LinearFilter;
    map5.anisotropy = 4;

    let map6 = ddsLoader.load( 'data/compressed/disturb_argb_mip.dds' ); //stone
    map6.anisotropy = 4;


    var cubemap3 = ddsLoader.load( 'data/compressed/Mountains_argb_nomip.dds', ( texture ) => {
        texture.magFilter = THREE.LinearFilter;
        texture.minFilter = THREE.LinearFilter;
        texture.mapping = THREE.CubeReflectionMapping;
        material6.needsUpdate = true;
    } ); //steel

    let fireMaterial = new THREE.MeshBasicMaterial( { map: fireTexture, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthTest: false, transparent: true });

    let fire = new THREE.Mesh(cube, fireMaterial);
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