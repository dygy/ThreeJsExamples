
let lastMessage;
let spam=false;
// event emmited when connected

let time;
let todo;
let stop;
let stopSize;
let DEGTORAD;
let temp;

const boxSize={
    x:0,
    y:0,
    z:0
};
const cubeSize={
    xyz:0,
    height:0
};
let cubeGeometry;
let cubeMaterial;
let cube;
let boxWinGeometry;
let boxWinMaterial;
let boxWin;
let goal;
let boxWinSize;
let boxWinHeight;
camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.02, 40 );
camera.position.set( 0, 2, - 2 );
scene = new THREE.Scene();
camera.lookAt( scene.position );

loadWorld();
function loadWorld() {
    time = 0;
    todo = '';
    stop = 0.30;
    stopSize = 1;
    DEGTORAD = 0.053;
    temp = new THREE.Vector3();
    boxSize.x=5;
    boxSize.y=1;
    boxSize.z=5;
    cubeSize.xyz=0.2;
    cubeSize.height=0.1;
    boxWinHeight = 0.1;
    init();
    animate();
}
function init() {
    cubeGeometry = new THREE.BoxBufferGeometry();
    cubeMaterial = new THREE.MeshNormalMaterial();
    cube = new THREE.Mesh( cubeGeometry, cubeMaterial );
    cube.scale.multiplyScalar(cubeSize.xyz);
    cube.position.set(0,cubeSize.height,0);
    goal = new THREE.Object3D();
    cube.add(goal);
    scene.add( cube );
    goal.position.set(0, 4, -4);

    const gridHelper = new THREE.GridHelper(4,10);
    scene.add(gridHelper);
    let boxGeometry = new THREE.BoxBufferGeometry();
    let boxMaterial = new THREE.MeshNormalMaterial();
    let box = new THREE.Mesh(boxGeometry, boxMaterial);
    box.scale.set(boxSize.x, boxSize.y, boxSize.z);
    box.receiveShadow  = true;
    box.position.set(0,-0.7,0);
    box.rotation.set(0,0,0);
    // add the plane to the scene
    scene.add(box);

    createWin();
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

}
function createWin(){
    boxWinSize = Math.ceil((Math.random()*5));
    if (boxWinSize === 0){ boxWinSize=1;}
    let toClalc = boxWinSize;
    while (toClalc >0.1){
        boxWinHeight= boxWinHeight+0.05;
        toClalc= toClalc-0.1
    }
    boxWinGeometry = new THREE.BoxBufferGeometry();
    boxWinMaterial = new THREE.MeshNormalMaterial();
    boxWin         = new THREE.Mesh(boxWinGeometry, boxWinMaterial);
    boxWin.receiveShadow  = true;
    boxWin.material.transparent = true;
    boxWin.material.opacity = 0.7;
    boxWin.scale.multiplyScalar(boxWinSize);
    boxWin.position.x = Math.abs(Math.random()*boxSize.x/2);
    boxWin.position.z = Math.abs(Math.random()*boxSize.z/2);
    boxWin.position.y = boxWinHeight;
    boxWin.rotation.set(0,0,0);
    // add the plane to the scene
    scene.add(boxWin);
}

document.addEventListener("keydown", event => {

    let code = event.keyCode;
    if (code === 84) bigger();
    if (code === 89) smaller();
    if (code === 87)moveW();
    if (code === 68) moveD();
    if (code === 65)moveA();
    if (code === 83) moveS();
    if (code === 81) moveE();
    if (code === 69) moveQ();
    if (code === 88) moveX();
    if (code === 90) moveZ();
});

function moveW() {todo='UP';}
function moveA() {todo='LEFT';}
function moveD() {todo='RIGHT';}
function moveS() {todo='DOWN';}
function moveE() {todo='UPRIGHT';}
function moveQ() {todo='UPLEFT';}
function moveZ() {todo='DOWNLEFT';}
function moveX() {todo='DOWNRIGHT';}
function smaller() {todo='SMALLER';}
function bigger() {todo='BIGGER';}
function antiSpam(message) {
    if (message !== lastMessage ){
        lastMessage=message;
    }
}

function animate() {
    console.log(cubeSize.xyz+' '+' '+ cube.position.x+' '+ cube.position.z+' '+boxWinSize+' '+ boxWin.position.x+' '+ boxWin.position.z);
    if (Math.abs(cube.position.x)>boxSize.x/2||
        Math.abs(cube.position.z)>boxSize.z/2) {todo='FALL';}
    if (cubeSize.xyz===boxWinSize && ((Math.abs(cube.position.x-boxWin.position.x)<0.100 && Math.abs(cube.position.z-boxWin.position.z)<0.100 )||(Math.abs(cube.position.x-boxWin.position.z)<0.100)&& Math.abs(cube.position.z-boxWin.position.x)<0.100)){
        if (!spam) {
            alert('You won!');
            spam=true;
            location.reload();
        }
    }
    requestAnimationFrame(animate);
    if (todo === 'SMALLER') {
        time += 0.01;
        if (time < stopSize) {
            if (cubeSize.xyz > 0.1) {
                cubeSize.xyz = Math.round((cubeSize.xyz - 0.1) * 10) / 10;
                cube.scale.set(cubeSize.xyz, cubeSize.xyz, cubeSize.xyz);
                cubeSize.height = cubeSize.height - 0.05;
                cube.position.y = cubeSize.height;
            }
        }
        todo = '';
        time = 0;
    }

    else if (todo === 'BIGGER') {
        time += 0.01;
        if (time < stopSize) {
            if (cubeSize.xyz < boxSize.x) {
                cubeSize.xyz = Math.round((cubeSize.xyz + 0.1) * 10) / 10;
                cube.scale.set(cubeSize.xyz, cubeSize.xyz, cubeSize.xyz);
                cubeSize.height = cubeSize.height + 0.05;
                cube.position.y = cubeSize.height;
            }
        }
        todo = '';
        time = 0;
    }
    else if (todo === 'UP') {
        time += 0.01;
        cube.translateZ(0.01);
        if (time > stop) {
            todo = '';
            time = 0;
            cube.translateZ(0.00);
        }
    }
    else if (todo === 'LEFT') {
        time += 0.01;
        cube.rotateY(DEGTORAD);
        if (time > stop) {
            todo = '';
            time = 0;
        }
    }
    else if (todo === 'DOWN') {
        time += 0.01;
        cube.translateZ(-0.01);
        if (time > stop) {
            todo = '';
            time = 0;
            cube.translateZ(0.00);
        }
    }
    else if (todo === 'RIGHT') {
        time += 0.01;
        cube.rotateY(-DEGTORAD);
        if (time > stop) {
            todo = '';
            time = 0;
        }
    }
    else if (todo === 'DOWNRIGHT') {
        time += 0.01;
        cube.rotateY(DEGTORAD);
        cube.translateZ(-0.01);
        if (time > stop) {
            todo = '';
            time = 0;
        }
    }
    else if (todo === 'DOWNLEFT') {
        time += 0.01;
        cube.rotateY(-DEGTORAD);
        cube.translateZ(-0.01);
        if (time > stop) {
            todo = '';
            time = 0;
        }
    }
    else if (todo === 'UPLEFT') {
        time += 0.01;
        cube.rotateY(-DEGTORAD);
        cube.translateZ(0.01);
        if (time > stop) {
            todo = '';
            time = 0;

        }
    }
    else if (todo === 'UPRIGHT') {
        time += 0.01;
        cube.rotateY(DEGTORAD);
        cube.translateZ(0.01);
        if (time > stop) {
            todo = '';
            time = 0;
        }
    }
    else if (todo === 'FALL') {
        time += 0.01;
        cube.rotateY(DEGTORAD);
        cube.translateY(-0.1);
        if (time > stop) {
            todo = '';
            time = 0;
        }
        antiSpam('FALL');
        setTimeout(() => {
            location.reload();
        }, 3000);

    }


    temp.setFromMatrixPosition(goal.matrixWorld);
    camera.position.lerp(temp, 0.2);
    camera.lookAt(cube.position);
    renderer.render(scene, camera);

}

