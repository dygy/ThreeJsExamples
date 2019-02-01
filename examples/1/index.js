$(function () {
    const stats = initStats();

    // create a scene, that will hold all our elements such as objects, cameras and lights.
    const scene = new THREE.Scene();

    // create a camera, which defines where we're looking at.
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

    // create a render and set the size
    const renderer = new THREE.WebGLRenderer();

    renderer.setClearColor( 0xeeeeee, 0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;

    // create the ground plane
    let planeGeometry = new THREE.PlaneGeometry(60, 20, 0, 0);
    let planeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});
    let plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow  = true;

    // rotate and position the plane
    plane.rotation.x=-0.5*Math.PI;
    plane.position.x=15;
    plane.position.y=0;
    plane.position.z=0;

    // add the plane to the scene
    scene.add(plane);
    // create a cube
    let cubeGeometry = new THREE.CubeGeometry(4, 4, 4);
    let cubeMaterial = new THREE.MeshLambertMaterial({color: 0xfff000});
    let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.castShadow = true;

    // position the cube
    cube.position.x=-4;
    cube.position.y=3;
    cube.position.z=0;

    // add the cube to the scene
    scene.add(cube);

    let sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
    let sphereMaterial = new THREE.MeshLambertMaterial({color: 0x7777ff});
    let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

    // position the sphere
    sphere.position.x=20;
    sphere.position.y=0;
    sphere.position.z=2;
    sphere.castShadow=true;

    // add the sphere to the scene
    scene.add(sphere);

    // position and point the camera to the center of the scene
    camera.position.x = -30;
    camera.position.y = 40;
    camera.position.z = 30;
    camera.lookAt(scene.position);

    // add subtle ambient lighting
    let ambientLight = new THREE.AmbientLight(0x0c0c0c);
    scene.add(ambientLight);

    // add spotlight for the shadows
    let spotLight = new THREE.SpotLight( 0xffffff );
    spotLight.position.set( -40, 60, -10 );
    spotLight.castShadow = true;
    scene.add( spotLight );

    // add the output of the renderer to the html element
    $("#WebGL-output").append(renderer.domElement);

    // call the render function
    let step=0;

    const controls = new function() {
        this.rotationSpeed = 0.02;
        this.bouncingSpeed = 0.03;
    };

    const gui = new dat.GUI();
    gui.add(controls, 'rotationSpeed',0,0.5);
    gui.add(controls, 'bouncingSpeed',0,0.5);

    render();
    function render() {
        stats.update();
        // rotate the cube around its axes
        cube.rotation.x += controls.rotationSpeed;
        cube.rotation.y += controls.rotationSpeed;
        cube.rotation.z += controls.rotationSpeed;

        // bounce the sphere up and down
        step+=controls.bouncingSpeed;
        sphere.position.x = 20+( 10*(Math.cos(step)));
        sphere.position.y = 2 +( 10*Math.abs(Math.sin(step)));

        // render using requestAnimationFrame
        requestAnimationFrame(render);
        renderer.render(scene, camera);
    }

    function initStats() {

        const stats = new Stats();

        stats.setMode(0); // 0: fps, 1: ms

        // Align top-left
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0px';
        stats.domElement.style.top = '0px';

        $("#Stats-output").append( stats.domElement );

        return stats;
    }
});
