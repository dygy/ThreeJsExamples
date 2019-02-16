let shoot=false;
let firstTime=true;
let donTSpam=false;

const ws = new WebSocket('ws://localhost:40512');
let lastMessage;

// event emmited when connected


    ws.onopen = () =>{
        console.log('websocket is connected ...');
        // sending a send event to websocket server
        antiSpam('CONNECT')
    };
document.addEventListener("keydown", event => {

    let code = event.keyCode;
    if (code === 32) controls.strike();
    if (code === 9) controls.create_new_target();
});


    function antiSpam(message) {
        if (message !== lastMessage ){
            lastMessage=message;
            ws.send(message)
        }
    }
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
    let  cubeArrayX=[];
    let  cubeArrayZ=[];
    let cubeGeometry = new THREE.BoxGeometry(4.75, 2, 4.75);
    let cubeMaterial = new THREE.MeshLambertMaterial({color: 0x0b953fc});
    for (let j = 0 ; j < (planeGeometry.height/5) ; j++) {
        for (let i = 0 ; i < planeGeometry.width/5 ; i++) {
            let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
            cube.position.z=-((planeGeometry.height)/2)+2+(j*5);
            cube.position.x=-((planeGeometry.width)/2)+2+(i*5);
            cube.position.y=2;
            scene.add(cube);
            cubeArrayX.push(cube.position.x);
            cubeArrayZ.push(cube.position.z);
        }
    }

    let lookAtGeom = new THREE.SphereGeometry(2);

    let lookAtMesh = new THREE.Mesh(lookAtGeom, new THREE.MeshLambertMaterial({color: 0xff0000}));
    lookAtMesh.material.transparent = true;
    lookAtMesh.material.opacity = 0.3;
    scene.add(lookAtMesh);


    let directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
    directionalLight.position.set( -20, 40, 60 );
    scene.add(directionalLight);

    let gunGeometry = new THREE.BoxGeometry(0.5, 0.5, 4);
    let gunMaterial = new THREE.MeshLambertMaterial({color: Math.random() * 0xffffff});
    let gun = new THREE.Mesh(gunGeometry, gunMaterial);
    gun.position.set(110,9.3,0.0);
    gun.castShadow = false;
//    gun.rotateX(0.67);
    scene.add(gun);
    let win;
    function createWin(){
   let randomNum = Math.round(Math.random()*cubeArrayX.length);
        let winGeometry = new THREE.BoxGeometry(4.5, 20,4.5);
        let winMaterial = new THREE.MeshLambertMaterial({color: Math.random() * 0xffffff});
        win = new THREE.Mesh(winGeometry, winMaterial);
        win.position.set(cubeArrayX[randomNum],10 ,cubeArrayZ[randomNum]);
//    gun.rotateX(0.67);
        scene.add(win);
    }
    createWin();
    // add subtle ambient lighting
    let ambientLight = new THREE.AmbientLight(0x292929);
    scene.add(ambientLight);

    // add the output of the renderer to the html element
document.body.appendChild( renderer.domElement );

    // call the render function
    let step=0;
    let controls = new function () {
        this.create_new_target = function () {
            scene.remove(win);
          createWin()
        };
        this.strike = function () {
            shoot = !shoot;

            if (!shoot) {
                camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
                camera.position.x = 120;
                camera.position.y = 60;
                camera.position.z = 180;
                camera.lookAt(scene.position);
            } else {
                camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.02, 300 );
                camera.position.set( 110, 10,  0 );
                camera.lookAt( scene.position );
 }
        };
    };


    // make sure that for the first time, the
    // camera is looking at the scene
    //   camera.lookAt(scene.position);
    let cos=0;
    let fly=0 ;
    let z=0;
    render();
    let play = confirm('Do you want to start a game?');
    if (play){
        alert('To shoot press SPACE, to chose new target press TAB');
        controls.strike();
    }

    function render( ) {

        // render using requestAnimationFrame
        step+=0.02;


        if (!shoot) {

            if (firstTime) {
            firstTime=false
            }
            else {
                lookAtMesh.material.opacity=0.3;
                fly += 0.01;
                if (fly < 2.0) {
                    if (z < cos) {
                        z += 0.0025;
                    }
                    if (z > cos) {
                        z -= 0.0025;
                    }
                    camera.lookAt(new THREE.Vector3(110 - fly * 100, 10, z * 400));
                    lookAtMesh.position = new THREE.Vector3(110 - fly * 100, 10, z * 400);
                    if (Math.abs(lookAtMesh.position.x-win.position.x)<6 && Math.abs(lookAtMesh.position.z-win.position.z)<6){
                      if (!donTSpam) {
                          alert('Nice shoot! Keep it on!');
                          donTSpam=true;
                          scene.remove(win);
                          createWin()
                      }
                    }
                }
            }
        if (lookAtMesh.position.x===-89.00000000000014){
            controls.strike()
        }
        } else {
            lookAtMesh.material.opacity=0.0;
            firstTime=false;
            z=0;
            fly=0;
            cos = ((Math.cos(step)));
            camera.lookAt(new THREE.Vector3(0,0,cos*350));
            gun.lookAt(new THREE.Vector3(0,0,cos*350));
            gun.rotateZ(0.7);
       }

        requestAnimationFrame(render);
        renderer.render(scene, camera);
    }
ws.onmessage = response => {
    let message =response.data;
    if (message===('STRIKE'))          controls.strike();
    else if (message==='NEW_TARGET')       controls.create_new_target();
    console.log('Server sends you a " '+ response.data +' " command');
};

