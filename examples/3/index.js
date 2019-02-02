$(function () {

    const stats = initStats();

    // create a scene, that will hold all our elements such as objects, cameras and lights.
    const scene = new THREE.Scene();

    // create a camera, which defines where we're looking at.
    let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.x = 120;
    camera.position.y = 60;
    camera.position.z = 180;

    // create a render and set the size
    let renderer = new THREE.WebGLRenderer();

    renderer.setClearColor(0xEEEEEE, 1.0);
    renderer.setSize(window.innerWidth, window.innerHeight);

    // create the ground plane
    let planeGeometry = new THREE.PlaneGeometry(180, 180);
    let planeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});
    let plane = new THREE.Mesh(planeGeometry, planeMaterial);


    // rotate and position the plane
    plane.rotation.x=-0.5*Math.PI;
    plane.position.x=0;
    plane.position.y=0;
    plane.position.z=0;

    // add the plane to the scene
    scene.add(plane);

    let cubeGeometry = new THREE.CubeGeometry(4, 4, 4);
    let cubeMaterial = new THREE.MeshLambertMaterial({color: 0x0b953fc});
    for (let j = 0 ; j < (planeGeometry.height/5) ; j++) {
        for (let i = 0 ; i < planeGeometry.width/5 ; i++) {
            let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

            cube.position.z=-((planeGeometry.height)/2)+2+(j*5);
            cube.position.x=-((planeGeometry.width)/2)+2+(i*5);
            cube.position.y=2;

            scene.add(cube);
        }
    }

    let lookAtGeom = new THREE.SphereGeometry(2);

    let lookAtMesh = new THREE.Mesh(lookAtGeom, new THREE.MeshLambertMaterial({color: 0xff0000}));
    lookAtMesh.material.transparent = true;
    lookAtMesh.material.opacity = 0.0;
    scene.add(lookAtMesh);


    let directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
    directionalLight.position.set( -20, 40, 60 );
    scene.add(directionalLight);



    // add subtle ambient lighting
    let ambientLight = new THREE.AmbientLight(0x292929);
    scene.add(ambientLight);

    // add the output of the renderer to the html element
    $("#WebGL-output").append(renderer.domElement);

    // call the render function
    let step=0;
    let controls = new function () {
        this.perspective = "Perspective";
        this.switchCamera = function () {
            if (camera instanceof THREE.PerspectiveCamera) {
                camera = new THREE.OrthographicCamera(window.innerWidth / -16, window.innerWidth / 16, window.innerHeight / 16, window.innerHeight / -16, -200, 500);
                camera.position.x = 2;
                camera.position.y = 1;
                camera.position.z = 3;
                camera.lookAt(scene.position);
                this.perspective = "Orthographic";
            } else {
                camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
                camera.position.x = 120;
                camera.position.y = 60;
                camera.position.z = 180;

                camera.lookAt(scene.position);
                this.perspective = "Perspective";
            }
        };
    };

    const gui = new dat.GUI();
    gui.add(controls, 'switchCamera');
    gui.add(controls, 'perspective').listen();

    // make sure that for the first time, the
    // camera is looking at the scene
    //   camera.lookAt(scene.position);
    render();




    function render() {

        stats.update();
        // render using requestAnimationFrame
        step+=0.02;
        if (camera instanceof THREE.PerspectiveCamera) {
            let x = 10+( 100*(Math.sin(step)));
            camera.lookAt(new THREE.Vector3(x,10,0));
            lookAtMesh.position=new THREE.Vector3(x,10,0);
        } else {
            let x = ((Math.cos(step)));
            camera.lookAt(new THREE.Vector3(x,0,0));
            lookAtMesh.position=new THREE.Vector3(x,10,0);
        }

//        .position.x = 20+( 10*(Math.cos(step)));
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